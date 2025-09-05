const { ContainerBuilder, SectionBuilder, TextDisplayBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const { EMOJIS } = require('../../config/constants');

class InventoryDisplay {
    static createInventoryView(inventoryData, targetUser) {
        const shards = inventoryData.shards || [];
        const items = inventoryData.items || [];
        const accessories = inventoryData.accessories || [];
        const frames = inventoryData.frames || [];
        const gems = inventoryData.gems || 0;

        const shardList = shards.map(s => `• ${s.name}: ${s.qty}`).join('\n') || 'No shards';
        const itemList = items.map(i => `• ${i.name} x${i.qty}`).join('\n') || 'No items';
        const accessoryList = accessories.map(a => `• ${a.name}${a.equipped ? ' (equipped)' : ''}`).join('\n') || 'No accessories';
        const frameList = frames.map(f => `• ${f.name}${f.equipped ? ' (equipped)' : ''}`).join('\n') || 'No frames';

        const section = new SectionBuilder()
            .addTextDisplayComponents(
                td => td.setContent(`# ${EMOJIS.INVENTORY || '🎒'} Inventory — ${targetUser.username}\n\n**Gems:** ${gems}\n\n## 🔹 Shards\n${shardList}`),
                td => td.setContent(`## 🧰 Items\n${itemList}`),
                td => td.setContent(`## 💍 Accessories\n${accessoryList}`),
                td => td.setContent(`## 🖼️ Frames\n${frameList}`)
            );

        const actionRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`inventory_use_${targetUser.id}`)
                    .setLabel('Use Item')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`inventory_equip_${targetUser.id}`)
                    .setLabel('Equip')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`inventory_sell_${targetUser.id}`)
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
