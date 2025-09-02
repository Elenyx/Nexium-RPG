# 🌌 Nexium - Anime Multiverse Discord Bot

[![Discord.js](https://img.shields.io/badge/discord.js-14.19.3+-blue.svg)](https://discord.js.org/)
[![Node.js](https://img.shields.io/badge/node.js-18.0.0+-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.0+-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Components V2](https://img.shields.io/badge/Components-V2%20Ready-purple.svg)](https://discord.com/developers/docs/interactions/message-components)

> **Navigate the void between anime dimensions and forge your multiverse legacy**

Nexium is an advanced Discord bot that creates an immersive anime multiverse experience, featuring character collection, dimensional battles, territory conquest, faction warfare, and cross-dimensional events. Built with Discord.js v14 and full Components V2 support.

## ✨ Features

### 🎯 **Core Systems**
- **Dimensional Travel**: Explore multiple anime worlds with unique mechanics
- **Character Collection**: Gacha system with 6 rarity tiers and 500+ characters
- **Energy System**: Regenerating dimensional energy for actions
- **Economy**: Multi-layered currency system with daily rewards
- **Profile System**: Detailed progression tracking and customization

### ⚔️ **Combat & PvP**
- **Turn-based Battles**: Strategic combat with elemental advantages  
- **Team Formation**: Create synergistic squads from your collection
- **PvE Dungeons**: Dimension-specific challenges and boss raids
- **Ranked PvP**: Competitive seasons with rating system
- **Battle Analytics**: Detailed statistics and match history

### 🏰 **Territory & Factions**
- **Land Ownership**: Claim and upgrade territories across dimensions
- **Faction System**: Create or join player organizations
- **Alliance Wars**: Large-scale collaborative battles
- **Resource Management**: Passive income and strategic upgrades
- **Diplomatic Relations**: Complex faction interactions

### 🎮 **Mini-Games & Events**
- **Puzzle Games**: Dimensional riddles and character guessing
- **Trivia Battles**: Anime knowledge competitions
- **Treasure Hunting**: Collaborative exploration events
- **Seasonal Events**: Limited-time cross-dimensional content
- **Achievement System**: 100+ unlockable achievements

### 🛠️ **Advanced Features**
- **Crafting System**: Create weapons and equipment
- **Trading System**: Player-to-player character exchanges
- **Analytics Dashboard**: Comprehensive statistics tracking
- **Multi-language Support**: Localization ready
- **Components V2**: Modern Discord UI with interactive elements

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v15.0 or higher)
- [Redis](https://redis.io/) (v6.0 or higher)
- [Discord Bot Token](https://discord.com/developers/applications)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nexium-bot.git
   cd nexium-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   DISCORD_TOKEN=your_discord_bot_token
   DISCORD_CLIENT_ID=your_bot_client_id
   POSTGRES_URI=postgres://user:password@localhost:5432/nexium
   REDIS_URL=redis://localhost:6379
   NODE_ENV=development
   LOG_LEVEL=info
   ```

4. **Database setup**
   ```bash
   npm run db:migrate
   ```

5. **Deploy slash commands**
   ```bash
   npm run deploy
   ```

6. **Start the bot**
   ```bash
   npm run dev
   ```

## 📖 Commands Guide

### 🌟 **Essential Commands**
| Command | Description | Usage |
|---------|-------------|-------|
| `/profile [user]` | View detailed user profile | `/profile @user` |
| `/daily` | Claim daily dimensional energy | `/daily` |
| `/help [category]` | Get help with commands | `/help economy` |
| `/dimension info` | View current dimension details | `/dimension info` |

### ✨ **Character Commands**
| Command | Description | Usage |
|---------|-------------|-------|
| `/summon [dimension]` | Summon characters from the multiverse | `/summon shonen` |
| `/collection [filter]` | View your character collection | `/collection rarity:legendary` |
| `/team setup` | Configure battle formation | `/team setup` |
| `/trade request <user> <character>` | Initiate character trade | `/trade request @user Naruto` |

### ⚔️ **Battle Commands**
| Command | Description | Usage |
|---------|-------------|-------|
| `/battle challenge <user>` | Challenge another player | `/battle challenge @user` |
| `/dungeon enter [dimension]` | Enter PvE dungeons | `/dungeon enter mecha` |
| `/raid status` | View active server raids | `/raid status` |
| `/leaderboard [type]` | Check rankings | `/leaderboard pvp` |

### 🏰 **Territory & Faction Commands**
| Command | Description | Usage |
|---------|-------------|-------|
| `/territory claim <location>` | Claim dimensional territory | `/territory claim nexus-01` |
| `/faction create <name>` | Create new faction | `/faction create "Dimensional Knights"` |
| `/alliance propose <faction>` | Propose faction alliance | `/alliance propose "Shadow Guild"` |
| `/war declare <target>` | Declare faction war | `/war declare "Rival Faction"` |

### 🎮 **Mini-Game Commands**
| Command | Description | Usage |
|---------|-------------|-------|
| `/game [type]` | Launch mini-games | `/game trivia` |
| `/tournament create [game]` | Organize tournaments | `/tournament create "Character Guessing"` |
| `/explore [dimension]` | Go treasure hunting | `/explore fantasy` |

## 🏗️ Architecture

### **Project Structure**
```
nexium-bot/
├── src/
│   ├── commands/          # Slash commands organized by category
│   ├── components/        # Components V2 (buttons, modals, menus)
│   ├── events/            # Discord.js event handlers
│   ├── handlers/          # Command, event, and component loaders
│   ├── models/            # MongoDB database schemas
│   ├── services/          # Business logic and game mechanics
│   ├── utils/             # Helper functions and utilities
│   ├── config/            # Configuration and constants
│   └── database/          # Migration and seeding scripts
├── tests/                 # Unit and integration tests
├── assets/                # Images, data files, and resources
└── docs/                  # Documentation and guides
```

### **Core Technologies**
- **Discord.js v14**: Modern Discord bot framework with Components V2
- **PostgreSQL**: Flexible document database for complex game data
- **Redis**: High-performance caching and session management
- **Node.js**: JavaScript runtime with ES modules
- **Mongoose**: MongoDB object modeling with validation

### **Design Patterns**
- **Command Pattern**: Modular slash command architecture
- **Service Layer**: Separation of business logic from presentation
- **Event-Driven**: Reactive programming with Discord events
- **MVC Pattern**: Clean separation of concerns
- **Repository Pattern**: Database abstraction layer

## 🔧 Development

### **Available Scripts**
```bash
npm run dev          # Start with hot reload
npm run start        # Production start
npm run test         # Run test suite
npm run deploy       # Deploy slash commands
npm run db:migrate   # Run database migrations
npm run lint         # Code linting
npm run format       # Code formatting
```

### **Adding New Features**

#### **Creating a New Command**
1. Create command file in appropriate category folder
2. Follow the command template structure
3. Add to command handler automatically loads it
4. Test with `/deploy` script

#### **Adding Components V2 Elements**
1. Create component in `src/components/[type]/`
2. Define customId and execute function
3. Component handler automatically registers it
4. Use in commands or other components

#### **Database Models**
1. Define schema in `src/models/`
2. Add indexes for performance
3. Include validation and virtuals
4. Update migration scripts

### **Testing**
```bash
# Unit tests
npm run test:unit

# Integration tests  
npm run test:integration

# Coverage report
npm run test:coverage

# Test specific feature
npm test -- --grep "gacha system"
```

## 🌐 Deployment

### **Production Setup**

#### **Environment Variables**
```env
NODE_ENV=production
DISCORD_TOKEN=your_production_token
POSTGRES_URI=postgres://user:password@localhost:5432/nexium
REDIS_URL=redis://your-redis-server:6379
LOG_LEVEL=warn
```

#### **GitHub Pages CDN**
```bash
# Images are automatically hosted via GitHub Pages
# URL: https://elenyx.github.io/Nexium-RPG/characters/

# Enable GitHub Pages in repository settings:
# - Source: Deploy from a branch
# - Branch: main
# - Folder: / (root directory)
```

#### **Process Management**
```bash
# Using PM2
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### **Scaling Considerations**


## 📊 Performance & Analytics

### **Metrics Tracking**
- **User Engagement**: Daily/monthly active users, retention rates
- **Feature Usage**: Command popularity, system adoption
- **Performance**: Response times, error rates, uptime
- **Economy**: Transaction volumes, currency distribution
- **Battle Analytics**: Win rates, character performance

### **Monitoring Tools**
- **Application Logs**: Structured logging with Winston
- **Database Monitoring**: MongoDB Atlas or self-hosted metrics
- **Discord API**: Rate limiting and quota management
- **Error Tracking**: Automated error reporting and alerts
- **Performance Profiling**: Memory usage and CPU optimization

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Workflow**
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### **Code Standards**


## 📚 Documentation

- [📖 **API Documentation**](docs/API.md) - Complete API reference
- [🎮 **Game Mechanics**](docs/GAME_MECHANICS.md) - Detailed gameplay systems
- [🔧 **Deployment Guide**](docs/DEPLOYMENT.md) - Production deployment
- [🐛 **Troubleshooting**](docs/TROUBLESHOOTING.md) - Common issues and solutions
- [🎨 **Asset Guidelines**](docs/ASSETS.md) - Character and image standards

## 🛡️ Security & Privacy

### **Data Protection**
- **User Privacy**: Minimal data collection, GDPR compliant
- **Secure Storage**: Encrypted sensitive data at rest
- **API Security**: Rate limiting and input validation
- **Access Control**: Role-based permissions system

### **Security Measures**
- **Input Sanitization**: SQL injection and XSS prevention
- **Authentication**: Secure Discord OAuth integration
- **Audit Logging**: Comprehensive action tracking
- **Vulnerability Scanning**: Automated dependency updates

## 🎯 Roadmap

### **Phase 1: Foundation** ✅
- [x] Core bot infrastructure
- [x] Basic character collection
- [x] Profile and economy systems
- [x] Components V2 integration

### **Phase 2: Combat Systems** 🚧
- [ ] Battle engine implementation
- [ ] PvE dungeon system
- [ ] Team formation mechanics
- [ ] Basic PvP functionality

### **Phase 3: Territory & Factions** 📋
- [ ] Land ownership system
- [ ] Faction creation and management
- [ ] Alliance mechanics
- [ ] Territory warfare

### **Phase 4: Advanced Features** 📋
- [ ] Crafting and enhancement
- [ ] Treasure hunting events
- [ ] Cross-dimensional campaigns
- [ ] Advanced analytics dashboard

### **Phase 5: Community Features** 📋
- [ ] Tournament system
- [ ] Seasonal events
- [ ] User-generated content
- [ ] Mobile companion app

## ❓ FAQ

<details>
<summary><strong>How do I get more Dimensional Energy?</strong></summary>

Dimensional Energy regenerates automatically at 1 point per minute (max 100). You can also:
- Claim daily rewards (`/daily`)
- Complete achievements
- Participate in server events
- Purchase energy boosters

</details>

<details>
<summary><strong>What determines character rarity in summons?</strong></summary>

Summon rates are:
- Common: 60%
- Rare: 25% 
- Epic: 10%
- Legendary: 4%
- Mythic: 0.9%
- Dimensional: 0.1%

Premium summons have improved rates for higher rarities.

</details>

<details>
<summary><strong>Can I trade characters with other players?</strong></summary>

Yes! Use `/trade request @user character_name` to initiate trades. Both players must confirm the exchange. Some limitations apply:
- Cannot trade locked characters
- Daily trade limits exist
- Faction restrictions may apply

</details>

<details>
<summary><strong>How do faction wars work?</strong></summary>

Faction wars are server-wide events where factions compete for territory control:
- Declare war with `/war declare`
- Members participate in battles
- Victory grants territory and rewards
- Wars last 7 days with multiple phases

</details>

## 🆘 Support

### **Getting Help**
- **Discord Server**: [Join our community](https://discord.gg/nexium-bot)
- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/nexium-bot/issues)
- **Documentation**: [Comprehensive guides](docs/)
- **Email Support**: support@nexium-bot.com

### **Status & Updates**
- **Status Page**: [Bot uptime and incidents](https://status.nexium-bot.com)
- **Changelog**: [Release notes and updates](CHANGELOG.md)
- **Twitter**: [@NexiumBot](https://twitter.com/nexiumbot) - Latest news

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Discord.js Team**: Excellent framework and documentation
- **Anime Community**: Inspiration and character data
- **Beta Testers**: Early adopters who provided valuable feedback

---

<div align="center">
  <img src="assets/images/nexium-logo.png" alt="Nexium Logo" width="200">
  
  **✨ Built with passion for the anime multiverse ✨**
  
  [Discord](https://discord.gg/nexium) • [Twitter](https://twitter.com/nexiumbot) • [Patreon](https://patreon.com/nexiumbot)
</div>