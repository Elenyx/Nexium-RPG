const { ContainerBuilder, SectionBuilder, TextDisplayBuilder, ButtonBuilder, ButtonStyle, MessageFlags, SeparatorBuilder } = require('discord.js');
const { EMOJIS } = require('../../config/constants');

class InventoryDisplay {
    static createInventoryView(inventoryData, targetUser) {
        // Ensure inventoryData is an object
        const data = inventoryData || {};
        
        // Ensure arrays are actually arrays
        const shards = Array.isArray(data.shards) ? data.shards : [];
        const items = Array.isArray(data.items) ? data.items : [];
        const accessories = Array.isArray(data.accessories) ? data.accessories : [];
        const frames = Array.isArray(data.frames) ? data.frames : [];
        const gems = typeof data.gems === 'number' ? data.gems : 0;

        // Ensure targetUser exists and has username
        const username = targetUser?.username || 'Unknown User';

        const shardList = shards.map(s => `• ${s.name}: ${s.qty}`).join('\n') || 'No shards';
        const itemList = items.map(i => `• ${i.name} x${i.qty}`).join('\n') || 'No items';
        const accessoryList = accessories.map(a => `• ${a.name}${a.equipped ? ' (equipped)' : ''}`).join('\n') || 'No accessories';
        const frameList = frames.map(f => `• ${f.name}${f.equipped ? ' (equipped)' : ''}`).join('\n') || 'No frames';

        // Create sections with content and individual actions
        const inventorySection = new SectionBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`# ${EMOJIS.INVENTORY || '🎒'} Inventory — ${username}\n\n**Gems:** ${gems}`)
            )
            .setButtonAccessory(
                new ButtonBuilder()
                    .setCustomId(`inventory_refresh_${targetUser?.id || 'unknown'}`)
                    .setLabel('Refresh')
                    .setStyle(ButtonStyle.Secondary)
            );

        const shardsSection = new SectionBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`## 🔹 Shards\n${shardList}`)
            )
            .setButtonAccessory(
                new ButtonBuilder()
                    .setCustomId(`inventory_manage_shards_${targetUser?.id || 'unknown'}`)
                    .setLabel('Manage Shards')
                    .setStyle(ButtonStyle.Secondary)
            );

        const itemsSection = new SectionBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`## 🧰 Items\n${itemList}`)
            )
            .setButtonAccessory(
                new ButtonBuilder()
                    .setCustomId(`inventory_use_${targetUser?.id || 'unknown'}`)
                    .setLabel('Use Item')
                    .setStyle(ButtonStyle.Primary)
            );

        const accessoriesSection = new SectionBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`## 💍 Accessories\n${accessoryList}`)
            )
            .setButtonAccessory(
                new ButtonBuilder()
                    .setCustomId(`inventory_equip_${targetUser?.id || 'unknown'}`)
                    .setLabel('Equip')
                    .setStyle(ButtonStyle.Secondary)
            );

        const framesSection = new SectionBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`## 🖼️ Frames\n${frameList}`)
            )
            .setButtonAccessory(
                new ButtonBuilder()
                    .setCustomId(`inventory_sell_${targetUser?.id || 'unknown'}`)
                    .setLabel('Sell')
                    .setStyle(ButtonStyle.Danger)
            );

        const container = new ContainerBuilder()
            .setAccentColor(0x00AAFF)
            .addSectionComponents(inventorySection)
            .addSeparatorComponents(separator => separator)
            .addSectionComponents(shardsSection)
            .addSeparatorComponents(separator => separator)
            .addSectionComponents(itemsSection)
            .addSeparatorComponents(separator => separator)
            .addSectionComponents(accessoriesSection)
            .addSeparatorComponents(separator => separator)
            .addSectionComponents(framesSection);

        return { components: [container], flags: MessageFlags.IsComponentsV2 };
    }
}

module.exports = InventoryDisplay;
