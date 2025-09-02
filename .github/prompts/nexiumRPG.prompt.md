---
mode: agent
---

## 🎯 Purpose

This file defines structured prompts for **GitHub Copilot (Agent Mode)** to help maintain, extend, and debug the Nexium Bot project. Each prompt includes:

* **Task Definition**: What needs to be achieved.
* **Constraints**: Rules and limitations to follow.
* **Success Criteria**: What makes the task complete and acceptable.

---

## 🔧 General Development

### 1. Add a New Command

**Task**: Implement a new slash command (e.g., `/balance`) that integrates with the existing economy system.
**Constraints**:

* Must follow the project’s `src/commands/core` structure.
* Use `UserService` and Sequelize models.
* Include error handling and ephemeral fallback messages.
  **Success Criteria**:
* `/balance` retrieves and displays user’s coin balance.
* Command is registered and functional in Discord.
* Logs errors without crashing the bot.

---

### 2. Fix a Bug

**Task**: Investigate and fix a bug where **energy regeneration** does not update correctly.
**Constraints**:

* Check `energy regeneration` logic inside `cron` or cooldown utilities.
* Ensure DB writes don’t block async interactions.
  **Success Criteria**:
* Energy regenerates at correct intervals (1 per 5 minutes).
* Profile command reflects updated energy.
* No unhandled promise rejections in logs.

---

### 3. Optimize Performance

**Task**: Improve database query performance for frequently used commands (`/profile`, `/daily`).
**Constraints**:

* Use Sequelize best practices.
* Add indexes only if beneficial.
* Avoid unnecessary queries in the command handlers.
  **Success Criteria**:
* Reduced response latency (<500ms typical).
* Fewer duplicate queries in logs.
* Queries scale well with >1,000 users.

---

## 🎨 Feature Expansion

### 4. Implement Shop System

**Task**: Add `/shop view` and `/shop buy [item]` commands.
**Constraints**:

* Use new `ShopService.js` under `src/services`.
* Items must be seeded in `src/database/seeds/initial_data.sql`.
* Deduct coins, validate balance, update inventory.
  **Success Criteria**:
* Users can list shop items.
* Successful purchase updates DB and confirms via embed.
* Edge cases (not enough coins, invalid item) handled gracefully.

---

### 5. Add Gacha Summon Command

**Task**: Implement `/summon single` and `/summon multi`.
**Constraints**:

* Follow rarity distribution from `config/constants.js`.
* Use `CharacterService`.
* Store character ownership in DB.
  **Success Criteria**:
* Summons respect probabilities & pity system.
* Characters are added to user inventory.
* Embeds display results with emojis and rarity colors.

---

## 🛠 Maintenance

### 6. Refactor Handlers

**Task**: Refactor `ButtonHandler.js`, `ModalHandler.js`, `SelectMenuHandler.js` to reduce duplicate logic.
**Constraints**:

* Preserve existing customId routing.
* Keep logging and error boundaries intact.
  **Success Criteria**:
* Shared logic extracted into utility.
* Handlers are shorter, easier to maintain.
* No change in user-facing behavior.

---

### 7. Deployment Checks

**Task**: Ensure Railway deployment builds and runs without errors.
**Constraints**:

* Validate `Dockerfile` and `railway.json`.
* Verify `.env.example` completeness.
  **Success Criteria**:
* `railway up` deploys successfully.
* Bot comes online and responds to `/ping`.
* Logs show healthy DB connection.

---

## ✅ Success Definition (Project-Wide)

* Bot responds within **1s typical latency**.
* Errors are logged with context but don’t crash execution.
* Features follow **Components V2** standards (buttons, modals, menus).
* Database schema is migration-friendly and seedable.
* Code matches **existing structure & style** (handlers, services, utils).

---
