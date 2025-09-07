const path = require('path');
const DB_PATH = process.env.WEB_DB_PATH || path.join(__dirname, '..', 'database', 'web.db');

let dbImpl = null;

// Try to use better-sqlite3 for a fast native DB; if it isn't available (Windows build tools),
// fall back to a pure-JS JSON file using lowdb so the server still runs.
function useSqlite() {
  const Database = require('better-sqlite3');
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.prepare(
    `CREATE TABLE IF NOT EXISTS tokens (
      user_id TEXT PRIMARY KEY,
      access_token TEXT,
      refresh_token TEXT,
      scope TEXT,
      expires_in INTEGER,
      created_at INTEGER
    )`
  ).run();

  return {
    upsertToken: ({ user_id, access_token, refresh_token, scope, expires_in }) => {
      const now = Math.floor(Date.now() / 1000);
      const stmt = db.prepare(
        `INSERT INTO tokens (user_id, access_token, refresh_token, scope, expires_in, created_at)
         VALUES (@user_id, @access_token, @refresh_token, @scope, @expires_in, @created_at)
         ON CONFLICT(user_id) DO UPDATE SET
           access_token=excluded.access_token,
           refresh_token=excluded.refresh_token,
           scope=excluded.scope,
           expires_in=excluded.expires_in,
           created_at=excluded.created_at;
        `
      );
      return stmt.run({ user_id, access_token, refresh_token, scope, expires_in, created_at: now });
    },
    getTokenByUserId: (user_id) => db.prepare('SELECT * FROM tokens WHERE user_id = ?').get(user_id),
  };
}

async function useLowdb() {
  const { Low } = require('lowdb');
  const { JSONFile } = require('lowdb/node');
  const jsonPath = DB_PATH.endsWith('.db') ? DB_PATH.replace(/\.db$/, '.json') : DB_PATH + '.json';
  const adapter = new JSONFile(jsonPath);
  const low = new Low(adapter, { tokens: {} });
  await low.read();
  low.data = low.data || { tokens: {} };

  return {
    upsertToken: async ({ user_id, access_token, refresh_token, scope, expires_in }) => {
      const now = Math.floor(Date.now() / 1000);
      low.data.tokens[user_id] = { user_id, access_token, refresh_token, scope, expires_in, created_at: now };
      await low.write();
      return low.data.tokens[user_id];
    },
    getTokenByUserId: async (user_id) => {
      await low.read();
      return low.data.tokens[user_id] || null;
    },
  };
}

exports.init = async () => {
  try {
    // prefer sqlite
    dbImpl = useSqlite();
    console.log('web/db: using better-sqlite3 for token storage');
  } catch (err) {
    console.warn('web/db: better-sqlite3 unavailable, falling back to lowdb JSON storage:', err.message);
    dbImpl = await useLowdb();
  }
};

exports.upsertToken = async (obj) => {
  return dbImpl.upsertToken(obj);
};

exports.getTokenByUserId = async (user_id) => {
  return dbImpl.getTokenByUserId(user_id);
};
