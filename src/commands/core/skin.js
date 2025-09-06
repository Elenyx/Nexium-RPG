const { SlashCommandBuilder, EmbedBuilder, MessageFlags, AttachmentBuilder } = require('discord.js');
const { models } = require('../../database/connection');
const { COLORS, EMOJIS, VALID_FRAME_IDS, FRAMES } = require('../../config/constants');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skin')
        .setDescription('Change the frame of a character card')
        .addStringOption(option =>
            option.setName('character_id')
                .setDescription('ID of the character to change frame')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('frame_id')
                .setDescription('ID of the frame to apply')
                .setRequired(true)
                .addChoices(
                    // Default and rarity frames (always available)
                    { name: 'Default Frame', value: 'default' },
                    { name: 'Common Frame', value: 'common' },
                    { name: 'Rare Frame', value: 'rare' },
                    { name: 'Epic Frame', value: 'epic' },
                    { name: 'Legendary Frame', value: 'legendary' },
                    { name: 'Mythic Frame', value: 'mythic' },
                    { name: 'Dimensional Frame', value: 'dimensional' },
                    // Shop frames
                    { name: '🔥 Fire Frame', value: 'shop_fire' },
                    { name: '🧊 Ice Frame', value: 'shop_ice' },
                    { name: '🌿 Nature Frame', value: 'shop_nature' },
                    { name: '🔮 Arcane Frame', value: 'shop_arcane' },
                    { name: '🤖 Futuristic Frame', value: 'shop_futuristic' },
                    { name: '🏛️ Ancient Ruins Frame', value: 'shop_ancient_ruins' },
                    // Premium shop frames
                    { name: '⭐ Celestial Frame', value: 'premium_celestial' },
                    { name: '🌑 Shadow Frame', value: 'premium_shadow' },
                    { name: '⚙️ Mechanical Frame', value: 'premium_mechanical' },
                    { name: '🌊 Oceanic Frame', value: 'premium_oceanic' },
                    // Special frames (require unlock)
                    { name: '🎉 Golden Anniversary Frame', value: 'golden_anniversary' },
                    { name: '🎄 Christmas Festive Frame', value: 'christmas_festive' },
                    { name: '👻 Halloween Spooky Frame', value: 'halloween_spooky' },
                    { name: '💝 Valentine\'s Romantic Frame', value: 'valentines_romantic' },
                    { name: '🏖️ Summer Vacation Frame', value: 'summer_vacation' },
                    { name: '🎊 New Year Celebration Frame', value: 'new_year_celebration' },
                    { name: '🏆 Community Champion Frame', value: 'community_champion' },
                    { name: '⭐ Early Supporter Frame', value: 'early_supporter' }
                )),

    async execute(interaction) {
        const characterId = interaction.options.getString('character_id');
        const frameId = interaction.options.getString('frame_id');
        const userId = interaction.user.id;

        try {
            await interaction.deferReply();

            // Check if database is available
            if (!models) {
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Database Unavailable`)
                    .setDescription('The database is not configured. Please check your environment variables.');

                return await interaction.editReply({ embeds: [embed] });
            }

            // Find the character in the database
            const character = await models.Character.findByPk(characterId);

            if (!character) {
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Character Not Found`)
                    .setDescription(`No character found with ID \`${characterId}\`.\nUse \`/collection\` to see available characters and their IDs.`);

                return await interaction.editReply({ embeds: [embed] });
            }

            // Check if user owns this character
            const userCharacter = await models.UserCharacter.findOne({
                where: { userId, characterId }
            });

            if (!userCharacter) {
                // Log the attempt for security monitoring
                console.warn(`[SECURITY] User ${userId} (${interaction.user.username}) attempted to change frame for unowned character ${characterId}`);

                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Character Not Owned`)
                    .setDescription(`You don't own the character \`${character.name}\` (${characterId}).\nUse \`/pull\` to get new characters or \`/collection\` to see your owned characters.`);

                return await interaction.editReply({ embeds: [embed] });
            }

            // Double-check ownership by ensuring the record belongs to the current user
            if (userCharacter.userId !== userId) {
                console.error(`[SECURITY] Ownership validation failed for user ${userId} on character ${characterId}`);
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Access Denied`)
                    .setDescription('You do not have permission to modify this character.');

                return await interaction.editReply({ embeds: [embed] });
            }

            // Validate frame ID
            if (!VALID_FRAME_IDS.includes(frameId)) {
                const availableFrames = VALID_FRAME_IDS.map(id => `\`${id}\``).join(', ');
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Invalid Frame ID`)
                    .setDescription(`\`${frameId}\` is not a valid frame ID.\n\n**Available Frames:**\n${availableFrames}`);

                return await interaction.editReply({ embeds: [embed] });
            }

            // Get frame details for validation
            const selectedFrame = FRAMES[frameId.toUpperCase()] || FRAMES[Object.keys(FRAMES).find(key => FRAMES[key].id === frameId)];

            // Check if frame requires unlock (special frames)
            if (selectedFrame && ['event', 'seasonal', 'achievement', 'special'].includes(selectedFrame.obtainable)) {
                // Check if user has unlocked this special frame
                const userProfile = await models.UserProfile.findOne({
                    where: { userId }
                });

                const unlockedFrames = userProfile?.unlockedFrames || [];
                if (!unlockedFrames.includes(frameId)) {
                    const embed = new EmbedBuilder()
                        .setColor(COLORS.ERROR)
                        .setTitle(`${EMOJIS.ERROR} Frame Not Unlocked`)
                        .setDescription(`You haven't unlocked the **${selectedFrame.name}** yet!\n\nSpecial frames can be obtained through:\n• Events\n• Seasonal activities\n• Achievements\n• Special promotions\n\nContact an administrator if you believe this is an error.`);

                    return await interaction.editReply({ embeds: [embed] });
                }
            }

            // Update the frame in database
            const previousFrameId = userCharacter.frameId;
            await userCharacter.update({ frameId });

            // Verify the update was successful
            await userCharacter.reload();
            if (userCharacter.frameId !== frameId) {
                console.error(`[ERROR] Frame update failed for user ${userId}, character ${characterId}`);
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Update Failed`)
                    .setDescription('Failed to update the character frame. Please try again.');

                return await interaction.editReply({ embeds: [embed] });
            }

            // Log successful frame change
            console.log(`[SKIN] User ${userId} changed frame for character ${characterId} from '${previousFrameId || 'default'}' to '${frameId}'`);

            // Generate comparison image
            const CharacterCardRenderer = require('../../services/CharacterCardRenderer');
            const cardRenderer = new CharacterCardRenderer();
            let comparisonImage = null;

            try {
                const comparisonImageData = await cardRenderer.generateFrameComparison(character, previousFrameId, frameId);
                if (comparisonImageData && comparisonImageData.startsWith('data:image')) {
                    // Convert base64 to buffer for Discord attachment
                    const base64Data = comparisonImageData.split(',')[1];
                    const imageBuffer = Buffer.from(base64Data, 'base64');
                    comparisonImage = new AttachmentBuilder(imageBuffer, { name: 'frame-comparison.png' });
                }
            } catch (error) {
                console.warn('Failed to generate frame comparison image:', error);
            }

            // Success response
            const embed = new EmbedBuilder()
                .setColor(COLORS.SUCCESS)
                .setTitle(`${EMOJIS.SUCCESS} Frame Changed`)
                .setDescription(`Successfully changed the frame for **${character.name}** (${characterId}) to **${selectedFrame.name}**.`)
                .addFields(
                    { name: 'Character', value: character.name, inline: true },
                    { name: 'Previous Frame', value: previousFrameId ? getFrameName(previousFrameId) : 'Default', inline: true },
                    { name: 'New Frame', value: `${selectedFrame.name} (${frameId})`, inline: true },
                    { name: 'Frame Description', value: selectedFrame.description, inline: false }
                )
                .setFooter({ text: 'Frame changes will be visible when viewing character cards' });

            const response = { embeds: [embed] };
            if (comparisonImage) {
                response.files = [comparisonImage];
                embed.setImage('attachment://frame-comparison.png');
            }

            await interaction.editReply(response);

        } catch (error) {
            console.error('Error in skin command:', error);

            const embed = new EmbedBuilder()
                .setColor(COLORS.ERROR)
                .setTitle(`${EMOJIS.ERROR} Command Failed`)
                .setDescription('An error occurred while processing your request. Please try again later.');

            if (interaction.deferred) {
                await interaction.editReply({ embeds: [embed] });
            } else {
                await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
            }
        }
    },
};

/**
 * Get frame name from frame ID
 * @param {string} frameId - Frame ID
 * @returns {string} Frame name
 */
function getFrameName(frameId) {
    const { frames } = require('../config/frames');
    const frameData = Object.values(frames).find(f => f.id === frameId);
    return frameData ? frameData.name : frameId;
}
