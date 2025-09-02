#!/usr/bin/env node

/**
 * @file setup-web.js
 * @description Setup script for Nexium web integration
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function setupWebIntegration() {
    console.log('🌐 Nexium Web Integration Setup');
    console.log('================================\n');

    // Check if .env exists
    const envPath = path.join(__dirname, '.env');
    let envContent = '';

    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
        console.log('✅ Found existing .env file');
    } else {
        console.log('❌ No .env file found. Please create one first with your Discord bot configuration.');
        console.log('   You can copy .env.example to .env and fill in your values.');
        process.exit(1);
    }

    console.log('\n📋 Discord OAuth Setup Required:');
    console.log('1. Go to https://discord.com/developers/applications');
    console.log('2. Select your bot application');
    console.log('3. Go to "OAuth2" → "General"');
    console.log('4. Add this redirect URI: http://localhost:3001/auth/discord/callback');
    console.log('5. Copy the Client ID and Client Secret below\n');

    const clientId = await question('Enter your Discord Client ID: ');
    const clientSecret = await question('Enter your Discord Client Secret: ');
    const sessionSecret = await question('Enter a session secret (or press Enter for auto-generated): ');

    // Update .env file
    let updatedEnv = envContent;

    // Add or update Discord OAuth variables
    const oauthVars = {
        'DISCORD_CLIENT_ID': clientId,
        'DISCORD_CLIENT_SECRET': clientSecret,
        'DISCORD_CALLBACK_URL': 'http://localhost:3001/auth/discord/callback',
        'WEB_PORT': '3001',
        'SESSION_SECRET': sessionSecret || generateSecret(),
        'FRONTEND_URL': 'http://localhost:3000'
    };

    for (const [key, value] of Object.entries(oauthVars)) {
        if (updatedEnv.includes(`${key}=`)) {
            // Update existing
            updatedEnv = updatedEnv.replace(new RegExp(`${key}=.*`), `${key}=${value}`);
        } else {
            // Add new
            updatedEnv += `\n${key}=${value}`;
        }
    }

    fs.writeFileSync(envPath, updatedEnv);
    console.log('\n✅ Updated .env file with web integration variables');

    console.log('\n🚀 Next Steps:');
    console.log('1. Run: npm run seed-characters');
    console.log('2. Run: npm run web-dev');
    console.log('3. Visit: http://localhost:3001');
    console.log('4. Click "Login with Discord" to test the integration');

    console.log('\n📚 Available URLs:');
    console.log('• Main Site: http://localhost:3001');
    console.log('• Characters: http://localhost:3001/characters');
    console.log('• Dashboard: http://localhost:3001/dashboard (requires login)');
    console.log('• Collection: http://localhost:3001/collection (requires login)');

    rl.close();
}

function generateSecret() {
    return require('crypto').randomBytes(32).toString('hex');
}

setupWebIntegration().catch(console.error);
