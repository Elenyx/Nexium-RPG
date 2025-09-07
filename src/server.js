const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to Nexium RPG!');
});

// Placeholder for Discord OAuth2 integration
app.get('/auth/discord', (req, res) => {
  res.send('Discord OAuth2 integration coming soon!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
