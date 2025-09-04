---
applyTo: '**/*.js'
---

## Discord.js Components V2 — Copilot Guide

### Key Setup

* **Always** include the message flag `MessageFlags.IsComponentsV2` when sending messages using Components V2.
* You **cannot** use `content`, `embeds`, `poll`, or `stickers` in V2 messages.
* Max of **40 total components** (including nested ones); text across all TextDisplay components is limited to **4,000 characters**.
* All files must be referenced via components (e.g. Thumbnail, MediaGallery, File) not attachments alone.

---

### Component Types, Builder Classes & Examples

#### 1. **Text Display**

* **Purpose**: Markdown-formatted text that replaces `content`.
* **Builder**: `TextDisplayBuilder`
* **Example**:

  ```js
  const { TextDisplayBuilder, MessageFlags } = require('discord.js');

  const exampleTextDisplay = new TextDisplayBuilder()
    .setContent('This is a Text Display component using **markdown**.');

  await channel.send({
    components: [exampleTextDisplay],
    flags: MessageFlags.IsComponentsV2,
  });
  ```

---

#### 2. **Section**

* **Purpose**: Up to three TextDisplay components with optional accessory (button or thumbnail).
* **Builder**: `SectionBuilder`
* **Example**:

  ```js
  const { SectionBuilder, ButtonStyle, MessageFlags } = require('discord.js');

  const exampleSection = new SectionBuilder()
    .addTextDisplayComponents(
      td => td.setContent('Line 1 of section.'),
      td => td.setContent('Line 2 of section.'),
      td => td.setContent('Line 3 of section.')
    )
    .setButtonAccessory(
      button => button
        .setCustomId('exampleButton')
        .setLabel('Click me')
        .setStyle(ButtonStyle.Primary),
    );

  await channel.send({
    components: [exampleSection],
    flags: MessageFlags.IsComponentsV2,
  });
  ```

---

#### 3. **Thumbnail**

* **Purpose**: Image accessory inside a section, can act like an embed thumbnail.
* **Builder**: `ThumbnailBuilder`, used inside `SectionBuilder`
* **Example**:

  ```js
  const { AttachmentBuilder, SectionBuilder, MessageFlags } = require('discord.js');

  const file = new AttachmentBuilder('./assets/image.png');
  const exampleSection = new SectionBuilder()
    .addTextDisplayComponents(td => td.setContent('Text above thumbnail.'))
    .setThumbnailAccessory(
      thumbnail => thumbnail
        .setDescription('Alt text')
        .setURL('attachment://image.png'),
    );

  await channel.send({
    components: [exampleSection],
    files: [file],
    flags: MessageFlags.IsComponentsV2,
  });
  ```

---

#### 4. **Media Gallery**

* **Purpose**: Grid display of up to 10 media items (images/files), each with optional alt text and spoiler marking.
* **Builder**: `MediaGalleryBuilder` + `MediaGalleryItemBuilder`
* **Example**:

  ```js
  const { AttachmentBuilder, MediaGalleryBuilder, MessageFlags } = require('discord.js');

  const file = new AttachmentBuilder('./assets/image.png');
  const exampleGallery = new MediaGalleryBuilder()
    .addItems(
      mg => mg
        .setDescription('Local image')
        .setURL('attachment://image.png'),
      mg => mg
        .setDescription('External image')
        .setURL('https://i.imgur.com/AfFp7pu.png')
        .setSpoiler(true)
    );

  await channel.send({
    components: [exampleGallery],
    files: [file],
    flags: MessageFlags.IsComponentsV2,
  });
  ```

---

#### 5. **File Component**

* **Purpose**: Embed a file directly as a component (e.g. PDFs, docs).
* **Builder**: `FileBuilder`
* **Example**:

  ```js
  const { AttachmentBuilder, FileBuilder, MessageFlags } = require('discord.js');

  const file = new AttachmentBuilder('./assets/guide.pdf');
  const exampleFile = new FileBuilder()
    .setURL('attachment://guide.pdf');

  await channel.send({
    components: [exampleFile],
    files: [file],
    flags: MessageFlags.IsComponentsV2,
  });
  ```

---

#### 6. **Separator**

* **Purpose**: Vertical spacing and optional divider between components.
* **Builder**: `SeparatorBuilder`
* **Example**:

  ```js
  const { TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize, MessageFlags } = require('discord.js');

  const td = new TextDisplayBuilder().setContent('Above separator.');
  const sep = new SeparatorBuilder()
    .setDivider(false)
    .setSpacing(SeparatorSpacingSize.Large);

  await channel.send({
    components: [td, sep, td],
    flags: MessageFlags.IsComponentsV2,
  });
  ```

---

#### 7. **Container**

* **Purpose**: A bordered box grouping components with optional accent color and spoiler effect.
* **Builder**: `ContainerBuilder`
* **Example**:

  ```js
  const { ContainerBuilder, UserSelectMenuBuilder, ButtonStyle, MessageFlags } = require('discord.js');

  const exampleContainer = new ContainerBuilder()
    .setAccentColor(0x0099FF)
    .addTextDisplayComponents(td => td.setContent('Inside container text.'))
    .addActionRowComponents(ar =>
      ar.setComponents(
        new UserSelectMenuBuilder()
          .setCustomId('exampleSelect')
          .setPlaceholder('Select users'),
      )
    )
    .addSeparatorComponents(() => {})
    .addSectionComponents(section =>
      section
        .addTextDisplayComponents(
          td => td.setContent('Section text inside container.'),
          td => td.setContent('Accessory alert!')
        )
        .setButtonAccessory(
          btn => btn
            .setCustomId('exampleButton')
            .setLabel('Container Button')
            .setStyle(ButtonStyle.Primary),
        )
    );

  await channel.send({
    components: [exampleContainer],
    flags: MessageFlags.IsComponentsV2,
  });
  ```

---

### Summary Table

| Component Type | Builder               | Purpose                                           |
| -------------- | --------------------- | ------------------------------------------------- |
| Text Display   | `TextDisplayBuilder`  | Markdown text component replacing message content |
| Section        | `SectionBuilder`      | Text group with thumbnail or button accessory     |
| Thumbnail      | via `SectionBuilder`  | Image accessory inside a section                  |
| Media Gallery  | `MediaGalleryBuilder` | Grid of media items (images/files)                |
| File           | `FileBuilder`         | Display uploaded file in message                  |
| Separator      | `SeparatorBuilder`    | Adds vertical spacing/divider                     |
| Container      | `ContainerBuilder`    | Bordered grouping, accent color, child components |

---

## Slash Commands Setup (Discord.js — Copilot Guide)

Start by defining your slash commands using `SlashCommandBuilder`, register them with Discord, and handle them via interaction events.

### Define & Register Commands

```js
// commands/util/ping.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  async execute(interaction) {
    await interaction.reply('Pong!');
  },
};
```

Register commands (via a deploy script):

```js
const { REST, Routes } = require('discord.js');
const commands = [ /* .toJSON() outputs of your SlashCommandBuilder commands */ ];
const rest = new REST({ version: '10' }).setToken('YOUR_TOKEN');

(async () => {
  await rest.put(Routes.applicationGuildCommands('YOUR_CLIENT_ID'), { body: commands });
})();
```

### Handle Incoming Slash Interactions

```js
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  await command.execute(interaction);
});
```

## Component Interaction Handling

### Responding to Component Interactions

```js
client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;
  const button = client.buttons.get(interaction.customId);
  if (!button) return;
  await button.execute(interaction);
});

All button clicks, select menus, etc., trigger `interactionCreate`. You can respond using `reply()`, `deferReply()`, `update()`, or `deferUpdate()` depending on the context:

* **`update()`** — edits the message containing the component
* **`deferUpdate()`** — acknowledges the interaction without editing
* All responses must happen within **3 seconds** or Discord will treat it as failed

### Awaiting a Single Component Interaction

Use `awaitMessageComponent()` for workflows like confirmation buttons:

```js
const response = await interaction.reply({
  content: 'Are you sure?',
  components: [row],
  withResponse: true,
});

try {
  const confirmation = await response.resource.message.awaitMessageComponent({
    filter: i => i.user.id === interaction.user.id,
    time: 60_000,
  });

  if (confirmation.customId === 'confirm') {
    await interaction.guild.members.ban(target);
    await confirmation.update({ content: 'User banned.', components: [] });
  } else {
    await confirmation.update({ content: 'Cancelled.', components: [] });
  }
} catch {
  await interaction.editReply({
    content: 'Confirmation timeout, cancelling.',
    components: [],
  });
}

```

### Collect Multiple Component Interactions

Use an `InteractionCollector` when expecting multiple inputs (like multi-step menus):

```js
const collector = message.createMessageComponentCollector({
  componentType: ComponentType.Button,
  time: 15_000,
});

collector.on('collect', async i => {
  if (i.user.id !== interaction.user.id) {
    return i.reply({ content: "Not for you!", flags: MessageFlags.Ephemeral });
  }

```

Use filters to isolate component interactions per message:

```js
const filter = i => i.message.id === message.id && i.user.id === interaction.user.id;
const collector = message.createMessageComponentCollector({ filter, time: 60_000 });
```

Note: Always use `await interaction.fetchReply()` instead of relying on `interaction.reply()` return value—this ensures you get the message object to attach the collector correctly.

---

## Collector Patterns: Multi-Step Workflows

For flows like cascading select menus:

```js
const firstResponse = await interaction.reply({ content: 'Choose a category...', components: [categoryMenu], withResponse: true });

const result1 = await firstResponse.resource.message.awaitMessageComponent({
  filter: i => i.user.id === interaction.user.id,
  time: 60_000,
});

await result1.deferUpdate();

await interaction.editReply({
  content: 'Now choose a role...',
  components: [roleMenu],
  flags: MessageFlags.Ephemeral,
  withResponse: true,
});

const result2 = await firstResponse.resource.message.awaitMessageComponent({
  filter: i => i.user.id === interaction.user.id,
  time: 60_000,
});

await result2.deferUpdate();
// handle final selection...
```

---

## Quick Reference Table

| Stage                 | Method/Pattern                       | Purpose                                 |
| --------------------- | ------------------------------------ | --------------------------------------- |
| Slash Command Setup   | `SlashCommandBuilder`, deploy script | Define & register commands              |
| Handling Commands     | `interactionCreate`, `.execute()`    | Trigger logic from slash commands       |
| Single Interaction    | `awaitMessageComponent()`            | Wait for a user to click/select         |
| Multiple Interactions | `createMessageComponentCollector()`  | Collect numerous component interactions |
| Workflow Continuation | Sequential `awaitMessageComponent()` | Multi-step UI flows                     |

---

## 1.  Ephemeral UX Deep-Dive

**Is `ephemeral` deprecated?** Yes—it’s officially deprecated.
Use **`flags: MessageFlags.Ephemeral`** instead of `{ ephemeral: true }` in `InteractionReplyOptions`
You’ll get a runtime warning if you're still using `ephemeral: true`—and note it’s likely to disappear in Discord.js v15 .

Also: **Ephemeral messages cannot be deleted** via API once sent, but you *can* edit them.

---

## 2.  Modal Integration (Discord.js)

### Setting Up a Modal

```js
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

const modal = new ModalBuilder()
  .setCustomId('feedbackModal')
  .setTitle('Your Feedback')
  .addComponents(
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId('feedbackInput')
        .setLabel('How can we improve?')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
    )
  );

await interaction.showModal(modal);
```

### Handling Modal Submission

```js
client.on('interactionCreate', async interaction => {
  if (!interaction.isModalSubmit()) return;
  if (interaction.customId !== 'feedbackModal') return;

  const feedback = interaction.fields.getTextInputValue('feedbackInput');
  await interaction.reply({ content: `Got it, thanks! You said: "${feedback}"`, flags: MessageFlags.Ephemeral });
});
```

*Note*: You **cannot delete the prior ephemeral message** before showing a modal—Discord's flow doesn't allow it; attempt leads to "Interaction Failed".

---

## 3.  Slash-Based Audio Triggers

While Discord.js doesn’t have a built-in “audio trigger” system for slash commands, you can **build one easily** using slash commands + `@discordjs/voice`. Here’s a sketch:

```js
const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a short sound clip'),

  async execute(interaction) {
    if (!interaction.member.voice.channel) {
      return interaction.reply({ content: 'Join a voice channel first!', flags: MessageFlags.Ephemeral });
    }

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const channel = interaction.member.voice.channel;
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    const resource = createAudioResource('path/to/sound.mp3');
    const player = createAudioPlayer();
    connection.subscribe(player);
    player.play(resource);

    player.on('idle', () => connection.destroy());
    await interaction.editReply('Playing sound!');
  },
};
```

---

## Summary Table

| Feature               | Deprecated? | Recommended Action                           |
| --------------------- | ----------- | -------------------------------------------- |
| `ephemeral: true`     | Yes         | Use `flags: MessageFlags.Ephemeral`          |
| Delete ephemeral msg  | Yes         | Not possible—edit only                       |
| Modal support         | No          | Use `ModalBuilder`, handle `isModalSubmit()` |
| Slash-triggered audio | N/A         | Build with slash + `@discordjs/voice`        |

---

## TL;DR

* **Ephemeral flag**: switch to `flags: MessageFlags.Ephemeral`—`ephemeral` boolean is deprecated.
* **Modal flows**: send a modal, gather input, reply ephemerally. Can’t delete earlier ephemeral messages.
* **Audio triggers**: slash command -> join voice -> play clip -> reply.

# Reference
