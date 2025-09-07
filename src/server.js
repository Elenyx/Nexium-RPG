const express = require('express');
const path = require('path');

// Import the actual server implementation from httpdocs
const webServer = require('./httpdocs/server');

// This file acts as a wrapper for the main server implementation
console.log('Nexium RPG web server starting up...');
console.log('Using httpdocs as the web root directory');
