const { ContainerBuilder, TextDisplayBuilder, MessageFlags, SeparatorBuilder } = require('discord.js');

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

        // Create clean inventory display without buttons
        const container = new ContainerBuilder()
            .setAccentColor(0x00AAFF)
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`# Inventory — ${username}\n\n**Gems:** ${gems}`)
            )
            .addSeparatorComponents(separator => separator)
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`## Shards\n${shardList}`)
            )
            .addSeparatorComponents(separator => separator)
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`## Items\n${itemList}`)
            )
            .addSeparatorComponents(separator => separator)
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`## Accessories\n${accessoryList}`)
            )
            .addSeparatorComponents(separator => separator)
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`## Frames\n${frameList}`)
            );

        return { components: [container], flags: MessageFlags.IsComponentsV2 };
    }
}

module.exports = InventoryDisplay;

module.exports = InventoryDisplay;
