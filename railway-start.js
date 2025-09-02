#!/usr/bin/env node

/**
 * @file railway-start.js
 * @description Railway startup script to run both Discord bot and web server
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚂 Starting Nexium Railway Deployment...');
console.log('=====================================\n');

// Check environment variables
console.log('🔍 Checking environment variables...');
console.log('DISCORD_TOKEN:', process.env.DISCORD_TOKEN ? '✅ Set' : '❌ Missing');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Missing');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('PORT:', process.env.PORT || 'Not set');
console.log('WEB_PORT:', process.env.WEB_PORT || 'Not set');
console.log('');

// Function to start a process
function startProcess(name, command, args = [], cwd = null) {
    console.log(`🚀 Starting ${name}...`);

    const options = {
        stdio: 'inherit',
        shell: true
    };

    if (cwd) {
        options.cwd = cwd;
    }

    const child = spawn(command, args, options);

    child.on('error', (error) => {
        console.error(`❌ Error starting ${name}:`, error);
    });

    child.on('exit', (code, signal) => {
        console.log(`⚠️  ${name} exited with code ${code}`);
        if (signal) {
            console.log(`   Signal: ${signal}`);
        }
    });

    return child;
}

// Start the Discord bot
const botProcess = startProcess('Discord Bot', 'node', ['src/index.js']);

// Start the web server (from web directory)
const webProcess = startProcess('Web Server', 'node', ['server.js'], path.join(__dirname, 'web'));

// Handle shutdown gracefully
process.on('SIGINT', () => {
    console.log('\n🛑 Received SIGINT, shutting down...');
    botProcess.kill('SIGINT');
    webProcess.kill('SIGINT');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM, shutting down...');
    botProcess.kill('SIGTERM');
    webProcess.kill('SIGTERM');
    process.exit(0);
});

console.log('\n✅ Both services started successfully!');
console.log('📊 Monitor the logs above for any issues.');
console.log('🎮 Discord bot should be online shortly.');
console.log('🌐 Web server should be available at your Railway URL.\n');

// Monitor process health
setInterval(() => {
    if (botProcess.killed) {
        console.log('❌ Discord Bot process has stopped unexpectedly!');
        console.log('🔄 Attempting to restart Discord Bot...');
        startProcess('Discord Bot (Restart)', 'node', ['src/index.js']);
    }

    if (webProcess.killed) {
        console.log('❌ Web Server process has stopped unexpectedly!');
        console.log('🔄 Attempting to restart Web Server...');
        startProcess('Web Server (Restart)', 'node', ['server.js'], path.join(__dirname, 'web'));
    }
}, 10000); // Check every 10 seconds
