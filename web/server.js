/**
 * @file server/index.js
 * @description Main web server for Nexium RPG with Discord OAuth integration
 */

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Import database models
const { User, Character, UserCharacter } = require('../src/database/models');

const app = express();
const PORT = process.env.PORT || process.env.WEB_PORT || 3001;

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

// Static file serving
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
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
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/dashboard');
    } else {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
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
        res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
    } else {
        res.redirect('/');
    }
});

// Collection page route
app.get('/collection', (req, res) => {
    if (req.isAuthenticated()) {
        res.sendFile(path.join(__dirname, 'public', 'collection.html'));
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
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Start server
const startServer = async () => {
    try {
        // Initialize database connection
        const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgresql://localhost:5432/nexium_rpg', {
            logging: false
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

        // Sync database
        await sequelize.sync();
        console.log('Database synchronized successfully.');

        app.listen(PORT, () => {
            console.log(`🌐 Nexium Web Server running on http://localhost:${PORT}`);
            console.log(`🔗 Discord OAuth: http://localhost:${PORT}/auth/discord`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
