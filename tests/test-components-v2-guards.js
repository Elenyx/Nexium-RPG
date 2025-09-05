const assert = require('assert');
const { MessageFlags } = require('discord.js');
const ComponentRegistry = require('../src/components/ComponentRegistry');

(async () => {
  const registry = new ComponentRegistry();

  // Minimal mock user data
  const mockUserData = {
    id: '123',
    level: 5,
    exp: 4500,
    dimensionalEnergy: 30,
    maxEnergy: 100,
    coins: 1500,
    shards: 10,
    collectionCount: 3,
    currentDimension: 'nexus_hub',
    dailyStreak: 2,
    lastDaily: null,
    createdAt: Date.now()
  };

  const mockTargetUser = { id: '123', username: 'Tester' };

  const profile = registry.createProfile(mockUserData, mockTargetUser);
  const detailed = registry.createDetailedStats(mockUserData, mockTargetUser);

  try {
    assert(profile && profile.flags === MessageFlags.IsComponentsV2, 'Profile display must include MessageFlags.IsComponentsV2');
    assert(detailed && detailed.flags === MessageFlags.IsComponentsV2, 'Detailed stats display must include MessageFlags.IsComponentsV2');
    console.log('PASS: Components V2 guard tests');
    process.exit(0);
  } catch (err) {
    console.error('FAIL:', err.message);
    process.exit(2);
  }
})();
