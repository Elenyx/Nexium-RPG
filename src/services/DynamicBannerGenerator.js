/**
 * @file DynamicBannerGenerator.js
 * @description Generates dynamic welcome banners and other visual content using Canvas and ImageKit
 * @author Nexium Bot Development Team
 */

const { createCanvas, loadImage, registerFont } = require('canvas');
const ImageKit = require('imagekit');
const path = require('path');
const fs = require('fs');

class DynamicBannerGenerator {
    constructor() {
        // Initialize ImageKit if credentials are available
        if (process.env.IMAGEKIT_PUBLIC_KEY && process.env.IMAGEKIT_PRIVATE_KEY) {
            this.imagekit = new ImageKit({
                publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
                privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
                urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/nexium/'
            });
            this.imagekitAvailable = true;
            console.log('✅ ImageKit initialized successfully');
        } else {
            console.warn('⚠️ ImageKit credentials not found. Images will be generated but not uploaded to CDN.');
            this.imagekitAvailable = false;
        }

        // Canvas settings
        this.bannerWidth = 800;
        this.bannerHeight = 300;

        // Register fonts if available
        this.registerFonts();

        // Color scheme matching the bot's theme
        this.colors = {
            primary: '#7C3AED',
            secondary: '#A855F7',
            accent: '#C084FC',
            text: '#FFFFFF',
            textSecondary: '#E9D5FF',
            background: 'linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)'
        };
    }

    /**
     * Register custom fonts for the canvas
     */
    registerFonts() {
        try {
            const fontPath = path.join(__dirname, '..', '..', 'assets', 'fonts');
            if (fs.existsSync(fontPath)) {
                const fontFiles = fs.readdirSync(fontPath).filter(file =>
                    file.endsWith('.ttf') || file.endsWith('.otf')
                );
                fontFiles.forEach(fontFile => {
                    const fontName = path.parse(fontFile).name;
                    registerFont(path.join(fontPath, fontFile), { family: fontName });
                });
                console.log(`✅ Registered ${fontFiles.length} custom fonts`);
            }
        } catch (error) {
            console.warn('⚠️ Font registration failed:', error.message);
        }
    }

    /**
     * Create a welcome banner for a new user
     * @param {Object} userOrMember - Discord user or GuildMember object
     * @param {Object} serverStats - Server statistics
     * @param {Object} options - Additional options
     * @returns {Promise<string|Buffer>} ImageKit URL or Buffer depending on options.returnBuffer
     */
    async createWelcomeBanner(userOrMember, serverStats = {}, options = {}) {
        try {
            // Handle both user and member objects
            const user = userOrMember.user || userOrMember;
            const displayName = userOrMember.displayName || user.displayName || user.username;

            console.log(`🎨 Generating welcome banner for ${displayName}`);

            // Create canvas
            const canvas = createCanvas(this.bannerWidth, this.bannerHeight);
            const ctx = canvas.getContext('2d');

            // Draw background gradient
            this.drawBackground(ctx);

            // Add decorative elements
            this.drawDecorativeElements(ctx);

            // Add user avatar
            await this.addUserAvatar(ctx, user);

            // Add welcome text
            this.addWelcomeText(ctx, user, displayName);

            // Add server statistics
            this.addServerStats(ctx, serverStats);

            // Add footer
            this.addFooter(ctx, options);

            // Convert to buffer
            const buffer = canvas.toBuffer('image/png');

            // Return buffer if requested, otherwise upload to ImageKit
            if (options.returnBuffer) {
                console.log(`✅ Welcome banner buffer created for ${displayName}`);
                return buffer;
            }

            // Upload to ImageKit and return URL
            const imageUrl = await this.uploadToImageKit(buffer, `welcome-${user.id}-${Date.now()}.png`);
            console.log(`✅ Welcome banner created: ${imageUrl}`);
            return imageUrl;

        } catch (error) {
            console.error('❌ Error creating welcome banner:', error);
            throw new Error('Failed to generate welcome banner');
        }
    }

    /**
     * Draw the background gradient
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    drawBackground(ctx) {
        const gradient = ctx.createLinearGradient(0, 0, this.bannerWidth, this.bannerHeight);
        gradient.addColorStop(0, '#7C3AED');
        gradient.addColorStop(0.5, '#3B82F6');
        gradient.addColorStop(1, '#1E40AF');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.bannerWidth, this.bannerHeight);

        // Add subtle pattern overlay
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        for (let i = 0; i < this.bannerWidth; i += 50) {
            for (let j = 0; j < this.bannerHeight; j += 50) {
                if ((i + j) % 100 === 0) {
                    ctx.beginPath();
                    ctx.arc(i, j, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
    }

    /**
     * Draw decorative elements
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    drawDecorativeElements(ctx) {
        // Add corner decorations
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 3;

        // Top-left corner
        ctx.beginPath();
        ctx.moveTo(20, 20);
        ctx.lineTo(60, 20);
        ctx.lineTo(20, 60);
        ctx.closePath();
        ctx.stroke();

        // Bottom-right corner
        ctx.beginPath();
        ctx.moveTo(this.bannerWidth - 20, this.bannerHeight - 20);
        ctx.lineTo(this.bannerWidth - 60, this.bannerHeight - 20);
        ctx.lineTo(this.bannerWidth - 20, this.bannerHeight - 60);
        ctx.closePath();
        ctx.stroke();
    }

    /**
     * Add user avatar to the banner
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Object} user - Discord user object
     */
    async addUserAvatar(ctx, user) {
        try {
            const avatarSize = 120;
            const avatarX = 80;
            const avatarY = this.bannerHeight / 2 - avatarSize / 2;

            // Create circular avatar
            ctx.save();
            ctx.beginPath();
            ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();

            // Load and draw avatar
            let avatarUrl = user.displayAvatarURL({ size: 256, dynamic: true });
            if (avatarUrl) {
                const avatarImage = await loadImage(avatarUrl);
                ctx.drawImage(avatarImage, avatarX, avatarY, avatarSize, avatarSize);
            } else {
                // Fallback: draw default avatar circle
                ctx.fillStyle = this.colors.secondary;
                ctx.fill();
                ctx.fillStyle = this.colors.text;
                ctx.font = 'bold 60px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(user.username.charAt(0).toUpperCase(),
                    avatarX + avatarSize / 2, avatarY + avatarSize / 2 + 20);
            }

            // Add avatar border
            ctx.restore();
            ctx.strokeStyle = this.colors.accent;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2 + 2, 0, Math.PI * 2);
            ctx.stroke();

        } catch (error) {
            console.warn('⚠️ Failed to load user avatar:', error.message);
            // Draw fallback avatar
            this.drawFallbackAvatar(ctx, user, 80, this.bannerHeight / 2 - 60, 120);
        }
    }

    /**
     * Draw fallback avatar when image loading fails
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Object} user - Discord user object
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} size - Avatar size
     */
    drawFallbackAvatar(ctx, user, x, y, size) {
        ctx.fillStyle = this.colors.secondary;
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = this.colors.text;
        ctx.font = `bold ${size * 0.5}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(user.username.charAt(0).toUpperCase(),
            x + size / 2, y + size / 2 + size * 0.2);
    }

    /**
     * Add welcome text to the banner
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Object} user - Discord user object
     * @param {string} displayName - Display name to use
     */
    addWelcomeText(ctx, user, displayName = null) {
        const textX = 220;
        const textY = 80;

        // Use displayName if provided, otherwise fall back to username
        const nameToShow = displayName || user.username || user.displayName || 'New Traveler';

        // Main welcome text
        ctx.fillStyle = this.colors.text;
        ctx.font = 'bold 42px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Welcome to Nexium!', textX, textY);

        // User name
        ctx.fillStyle = this.colors.accent;
        ctx.font = 'bold 32px Arial';
        ctx.fillText(nameToShow, textX, textY + 50);

        // Subtitle
        ctx.fillStyle = this.colors.textSecondary;
        ctx.font = '24px Arial';
        ctx.fillText('Your dimensional adventure begins!', textX, textY + 90);
    }

    /**
     * Add server statistics to the banner
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Object} serverStats - Server statistics
     */
    addServerStats(ctx, serverStats) {
        const statsX = 220;
        const statsY = 180;

        ctx.fillStyle = this.colors.text;
        ctx.font = 'bold 18px Arial';
        ctx.fillText('Server Statistics:', statsX, statsY);

        ctx.font = '16px Arial';
        ctx.fillStyle = this.colors.textSecondary;

        const stats = [
            `👥 Members: ${serverStats.members || 'N/A'}`,
            `🎴 Characters: ${serverStats.characters || '57+'}`,
            `⚔️ Battles: ${serverStats.battles || 'Active'}`,
            `💎 Economy: ${serverStats.economy || 'Thriving'}`
        ];

        stats.forEach((stat, index) => {
            ctx.fillText(stat, statsX, statsY + 30 + (index * 25));
        });
    }

    /**
     * Add footer to the banner
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Object} options - Additional options
     */
    addFooter(ctx, options) {
        const footerY = this.bannerHeight - 30;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Use /help to explore all available commands', this.bannerWidth / 2, footerY);

        if (options.timestamp) {
            ctx.font = '12px Arial';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fillText(`Generated on ${new Date().toLocaleDateString()}`, this.bannerWidth / 2, footerY + 20);
        }
    }

    /**
     * Upload image buffer to ImageKit or return data URL if not available
     * @param {Buffer} buffer - Image buffer
     * @param {string} fileName - File name for upload
     * @returns {Promise<string>} ImageKit URL or data URL
     */
    async uploadToImageKit(buffer, fileName) {
        if (!this.imagekitAvailable) {
            // Return data URL for local testing
            const base64 = buffer.toString('base64');
            const dataUrl = `data:image/png;base64,${base64}`;
            console.log('📁 ImageKit not available, returning data URL for local use');
            return dataUrl;
        }

        try {
            const uploadResult = await this.imagekit.upload({
                file: buffer,
                fileName: fileName,
                folder: '/banners/welcome',
                useUniqueFileName: false,
                // ImageKit optimization options
                options: {
                    quality: 85,
                    progressive: true
                }
            });

            return uploadResult.url;
        } catch (error) {
            console.error('❌ ImageKit upload failed:', error);
            // Fallback to data URL
            const base64 = buffer.toString('base64');
            const dataUrl = `data:image/png;base64,${base64}`;
            console.warn('⚠️ Upload failed, returning data URL as fallback');
            return dataUrl;
        }
    }

    /**
     * Create a custom banner with user-defined content
     * @param {Object} config - Banner configuration
     * @returns {Promise<string>} ImageKit URL
     */
    async createCustomBanner(config) {
        try {
            const canvas = createCanvas(this.bannerWidth, this.bannerHeight);
            const ctx = canvas.getContext('2d');

            // Use custom background if provided
            if (config.backgroundColor) {
                ctx.fillStyle = config.backgroundColor;
                ctx.fillRect(0, 0, this.bannerWidth, this.bannerHeight);
            } else {
                this.drawBackground(ctx);
            }

            // Add custom text
            if (config.title) {
                ctx.fillStyle = this.colors.text;
                ctx.font = 'bold 36px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(config.title, this.bannerWidth / 2, 100);
            }

            if (config.subtitle) {
                ctx.fillStyle = this.colors.textSecondary;
                ctx.font = '24px Arial';
                ctx.fillText(config.subtitle, this.bannerWidth / 2, 140);
            }

            // Upload and return
            const buffer = canvas.toBuffer('image/png');
            const fileName = `custom-${Date.now()}.png`;
            return await this.uploadToImageKit(buffer, fileName);

        } catch (error) {
            console.error('❌ Error creating custom banner:', error);
            throw new Error('Failed to generate custom banner');
        }
    }
}

module.exports = DynamicBannerGenerator;
