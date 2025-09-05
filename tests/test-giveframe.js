/**
 * Test script for giveframe admin command
 * @file test-giveframe.js
 * @description Tests the admin giveframe command functionality
 */

const { Client, GatewayIntentBits } = require('discord.js');

// Mock Discord client for testing
const mockClient = new Client({ intents: [GatewayIntentBits.Guilds] });

// Mock interaction for testing
function createMockInteraction(userId, targetUserId, characterId, frameId) {
    return {
        user: { id: userId, username: 'admin' },
        member: {
            permissions: {
                has: (perm) => perm === 8 // Administrator permission
            }
        },
        options: {
            getUser: (name) => name === 'user' ? { id: targetUserId, username: 'targetuser' } : null,
            getString: (name) => {
                if (name === 'character_id') return characterId;
                if (name === 'frame_id') return frameId;
                return null;
            }
        },
        deferReply: async () => {},
        editReply: async (data) => {
            console.log('Mock reply:', data.embeds[0].title, '-', data.embeds[0].description);
            return data;
        },
        reply: async (data) => {
            console.log('Mock reply:', data.embeds[0].title, '-', data.embeds[0].description);
            return data;
        },
        deferred: true
    };
}

async function testGiveFrameCommand() {
    console.log('🎨 Testing Give Frame Admin Command...\n');

    try {
        // Test data
        const adminUserId = '123456789';
        const targetUserId = '987654321';
        const characterId = 'NC001';
        const frameId = 'basic_gold';

        // Mock the giveframe command
        const giveFrameCommand = require('../src/commands/admin/giveframe.js');

        console.log('📋 Test Case: Admin gives frame to user');

        // Mock database responses
        const mockUserCharacter = {
            userId: targetUserId,
            characterId: characterId,
            frameId: null,
            update: async (data) => {
                console.log(`✅ Database update called with: ${JSON.stringify(data)}`);
                return { ...mockUserCharacter, ...data };
            },
            reload: async () => {
                console.log('✅ Database reload called');
            }
        };

        // Temporarily mock the models
        const originalModels = global.models;
        global.models = {
            Character: {
                findByPk: async (id) => ({
                    id,
                    name: 'Naruto Uzumaki',
                    anime: 'Naruto',
                    rarity: 'COMMON'
                })
            },
            UserCharacter: {
                findOne: async ({ where }) => {
                    if (where.userId === targetUserId && where.characterId === characterId) {
                        return mockUserCharacter;
                    }
                    return null; // User doesn't own this character
                }
            }
        };

        const interaction = createMockInteraction(adminUserId, targetUserId, characterId, frameId);
        await giveFrameCommand.execute(interaction);

        // Restore original models
        global.models = originalModels;

        console.log('\n✅ Give frame command test completed!');
        console.log('🎯 Admin can now assign frames to users for testing');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error(error.stack);
    }
}

// Run the test
testGiveFrameCommand().catch(console.error);
