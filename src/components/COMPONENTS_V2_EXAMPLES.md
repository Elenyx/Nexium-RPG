Components V2 Usage Examples
===========================

Keep these snippets as canonical examples of how to build and send Components V2 messages.

Text Display
-----------
```js
const { TextDisplayBuilder, MessageFlags } = require('discord.js');

const exampleTextDisplay = new TextDisplayBuilder()
  .setContent('This text is inside a Text Display component! You can use **any __markdown__** available inside this component too.');

await channel.send({
  components: [exampleTextDisplay],
  flags: MessageFlags.IsComponentsV2,
});
```

Section with Button
-------------------
```js
const { SectionBuilder, ButtonStyle, MessageFlags } = require('discord.js');

const exampleSection = new SectionBuilder()
  .addTextDisplayComponents(
    textDisplay => textDisplay
      .setContent('This text is inside a Text Display component!'),
    textDisplay => textDisplay
      .setContent('Using a section, you may only use up to three Text Display components.'),
    textDisplay => textDisplay
      .setContent('And you can place one button or one thumbnail component next to it!'),
  )
  .setButtonAccessory(
    button => button
      .setCustomId('exampleButton')
      .setLabel('Button inside a Section')
      .setStyle(ButtonStyle.Primary),
  );

await channel.send({
  components: [exampleSection],
  flags: MessageFlags.IsComponentsV2,
});
```

Container with an action row
----------------------------
```js
const { ContainerBuilder, UserSelectMenuBuilder, ButtonStyle, MessageFlags } = require('discord.js');

const exampleContainer = new ContainerBuilder()
  .setAccentColor(0x0099FF)
  .addTextDisplayComponents(
    textDisplay => textDisplay
      .setContent('This text is inside a Text Display component!'),
  )
  .addActionRowComponents(
    actionRow => actionRow
      .setComponents(
        new UserSelectMenuBuilder()
          .setCustomId('exampleSelect')
          .setPlaceholder('Select users'),
      ),
  )
  .addSeparatorComponents(
    separator => separator,
  );

await channel.send({
  components: [exampleContainer],
  flags: MessageFlags.IsComponentsV2,
});
```

Notes / Caveats
---------------
- You cannot set `content`, `embeds`, `stickers`, or `poll` when using Components V2. If you need to edit a message and keep V2 components, set those fields explicitly to `null` when calling `edit()`.
- Messages can have up to 40 components total.
- Total text across all Text Display components must not exceed 4000 characters.
