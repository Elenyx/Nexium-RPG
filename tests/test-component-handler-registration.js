const { expect } = require('chai');
const sinon = require('sinon');
const ComponentHandler = require('../src/handlers/componentHandler');
const path = require('path');

describe('ComponentHandler registration', function() {
  it('registers client button handlers including shop_info_ephemeral', async function() {
    const fakeClient = {
      buttons: new (require('discord.js')).Collection()
    };

    const handler = new ComponentHandler(fakeClient);
    // Run the loader (it will read files relative to project)
    await handler.loadButtonHandlers();

    expect(fakeClient.buttons.has('shop_info_ephemeral')).to.be.true;
  });
});
