module.exports = {
  // This module is registered in client.buttons as 'shop_info_ephemeral'
  async execute(interaction, params) {
    // params may include userId after the prefix
    // Delegate to the ShopButtonHandlers implementation for consistent behavior
    const ShopButtonHandlers = require('./ShopButtonHandlers');
    const client = interaction.client || (interaction.message && interaction.message.client) || { users: { fetch: () => ({ id: params[0] }) } };
    const handler = new ShopButtonHandlers(client);
    // call with ephemeral flag
    await handler.handleShopInfo(interaction, ['ephemeral', params[0]]);
  }
};
