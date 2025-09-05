const { ContainerBuilder, SectionBuilder, TextDisplayBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const { EMOJIS } = require('../../config/constants');

class InventoryDisplay {
    static createInventoryView(inventoryData, targetUser) {
        // Ensure inventoryData is an object
        const data = inventoryData || {};
        
        const shards = data.shards || [];
        const items = data.items || [];
        const accessories = data.accessories || [];
        const frames = data.frames || [];
        const gems = data.gems || 0;

        // Ensure targetUser exists and has username
        const username = targetUser?.username || 'Unknown User';

        const shardList = shards.map(s => `• ${s.name}: ${s.qty}`).join('\n') || 'No shards';
        const itemList = items.map(i => `• ${i.name} x${i.qty}`).join('\n') || 'No items';
        const accessoryList = accessories.map(a => `• ${a.name}${a.equipped ? ' (equipped)' : ''}`).join('\n') || 'No accessories';
        const frameList = frames.map(f => `• ${f.name}${f.equipped ? ' (equipped)' : ''}`).join('\n') || 'No frames';

        // Create text display components safely
        const textDisplays = [
            new TextDisplayBuilder().setContent(`# ${EMOJIS.INVENTORY || '🎒'} Inventory — ${username}\n\n**Gems:** ${gems}\n\n## 🔹 Shards\n${shardList}`),
            new TextDisplayBuilder().setContent(`## 🧰 Items\n${itemList}\n\n## 💍 Accessories\n${accessoryList}`),
            new TextDisplayBuilder().setContent(`## 🖼️ Frames\n${frameList}`)
        ];

        const section = new SectionBuilder()
            .addTextDisplayComponents(...textDisplays);

        const actionRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`inventory_use_${targetUser?.id || 'unknown'}`)
                    .setLabel('Use Item')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`inventory_equip_${targetUser?.id || 'unknown'}`)
                    .setLabel('Equip')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`inventory_sell_${targetUser?.id || 'unknown'}`)
                    .setLabel('Sell')
                    .setStyle(ButtonStyle.Danger)
            );

        const container = new ContainerBuilder()
            .setAccentColor(0x00AAFF)
            .addSectionComponents(section)
            .addActionRowComponents(actionRow);

        return { components: [container], flags: MessageFlags.IsComponentsV2 };
    }
}

module.exports = InventoryDisplay;
