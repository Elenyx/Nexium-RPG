/**
 * @file web/server.js
 * @description Main web server for Nexium RPG with Discord OAuth integration
 * @note Uses PostgreSQL for session storage (production-ready)
 */

const express = require('express');
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Import database models
const { User, Character, UserCharacter } = require('../src/database/models');

const app = express();
const PORT = process.env.PORT || process.env.WEB_PORT || 3001;

// Define public directory path
const publicPath = path.join(__dirname, 'public');

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:", "https://cdn.myanimelist.net"],
            scriptSrc: ["'self'"],
        },
    },
}));

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'https://nexium-production.up.railway.app',
    credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving with error handling
app.use(express.static(publicPath, {
    fallthrough: true
}));

// Handle static file errors gracefully
app.use((req, res, next) => {
    if (req.path.startsWith('/css/') || req.path.startsWith('/js/') || req.path.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg)$/)) {
        console.warn('Static file not found:', req.path);
        res.status(404).send('File not found');
    } else {
        next();
    }
});

// Session configuration
app.use(session({
    store: new PgSession({
        conString: process.env.DATABASE_URL,
        tableName: 'user_sessions',
        createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET || 'nexium-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// Discord OAuth Strategy
passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL || 'https://nexium-production.up.railway.app/auth/discord/callback',
    scope: ['identify', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Find or create user in database
        const [user, created] = await User.findOrCreate({
            where: { id: profile.id },
            defaults: {
                id: profile.id,
                username: profile.username,
                email: profile.email
            }
        });

        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Health check endpoint for Railway
app.get('/health', (req, res) => {
    const indexPath = path.join(publicPath, 'index.html');
    res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        directory: __dirname,
        cwd: process.cwd(),
        publicPath: publicPath,
        publicExists: fs.existsSync(publicPath),
        indexExists: fs.existsSync(indexPath),
        files: fs.readdirSync(publicPath).filter(f => f.endsWith('.html')),
        services: {
            web: 'running',
            discord: 'unknown' // This will be updated by the bot
        }
    });
});

// Discord bot health check endpoint
app.get('/health/discord', (req, res) => {
    // This endpoint can be called by the Discord bot to update its status
    res.status(200).json({
        status: 'OK',
        message: 'Discord bot health check endpoint ready'
    });
});

// Routes
app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/dashboard');
    } else {
        const indexPath = path.join(publicPath, 'index.html');
        console.log('Serving index.html from:', indexPath);
        if (fs.existsSync(indexPath)) {
            res.sendFile(indexPath);
        } else {
            console.error('Index.html not found at:', indexPath);
            res.status(404).send('Index file not found');
        }
    }
});

// Discord OAuth routes
app.get('/auth/discord', passport.authenticate('discord'));

app.get('/auth/discord/callback',
    passport.authenticate('discord', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/dashboard');
    }
);

app.get('/auth/logout', (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/');
    });
});

// API Routes
app.get('/api/user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            id: req.user.id,
            username: req.user.username,
            avatar: `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png`
        });
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});

app.get('/api/user/collection', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const userCharacters = await UserCharacter.findAll({
            where: { userId: req.user.id },
            include: [{
                model: Character,
                as: 'character'
            }]
        });

        res.json(userCharacters.map(uc => uc.character));
    } catch (error) {
        console.error('Error fetching user collection:', error);
        res.status(500).json({ error: 'Failed to fetch collection' });
    }
});

app.get('/api/characters', async (req, res) => {
    try {
        const characters = await Character.findAll();
        res.json(characters);
    } catch (error) {
        console.error('Error fetching characters:', error);
        res.status(500).json({ error: 'Failed to fetch characters' });
    }
});

// Dashboard route
app.get('/dashboard', (req, res) => {
    if (req.isAuthenticated()) {
        res.sendFile(path.join(publicPath, 'dashboard.html'));
    } else {
        res.redirect('/');
    }
});

// Collection page route
app.get('/collection', (req, res) => {
    if (req.isAuthenticated()) {
        res.sendFile(path.join(publicPath, 'collection.html'));
    } else {
        res.redirect('/');
    }
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// 404 handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(publicPath, '404.html'));
});

// Start server
const startServer = async () => {
    try {
        console.log('Starting Nexium Web Server...');

        // Try to initialize database connection (optional for basic serving)
        try {
            const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgresql://localhost:5432/nexium_rpg', {
                logging: false,
                dialectOptions: {
                    ssl: process.env.NODE_ENV === 'production' ? { require: true, rejectUnauthorized: false } : false
                }
            });

            await sequelize.authenticate();
            console.log('Database connection established successfully.');

            // Initialize models
            const models = require('../src/database/models');
            Object.values(models).forEach(model => {
                if (typeof model === 'function') {
                    model(sequelize);
                }
            });

            // Sync database (create tables if they don't exist)
            await sequelize.sync();
            console.log('Database synchronized successfully.');
        } catch (dbError) {
            console.warn('Database connection failed, but server will start anyway:', dbError.message);
            console.log('Some features may not work without database connection.');
        }

        app.listen(PORT, () => {
            console.log(`🌐 Nexium Web Server running on http://localhost:${PORT}`);
            console.log(`🔗 Discord OAuth: http://localhost:${PORT}/auth/discord`);
            console.log(`📊 Health Check: http://localhost:${PORT}/health`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        // Don't exit process, try to start server anyway
        try {
            app.listen(PORT, () => {
                console.log(`🌐 Nexium Web Server running on http://localhost:${PORT} (limited functionality)`);
            });
        } catch (serverError) {
            console.error('Failed to start server even without database:', serverError);
            process.exit(1);
        }
    }
};

startServer();
