const { expect } = require('chai');
const sinon = require('sinon');

const ShopButtonHandlers = require('../src/components/buttons/ShopButtonHandlers');
const UserService = require('../src/services/UserService');

describe('ShopButtonHandlers.handleShopInfo', function() {
  let sandbox;
  let clientMock;
  let handler;

  beforeEach(function() {
    sandbox = sinon.createSandbox();

    // Minimal client mock with users.fetch
    clientMock = {
      users: {
        fetch: sandbox.stub().resolves({ id: '999', username: 'MockUser' })
      }
    };

    // Stub userService methods used by handler
    sandbox.stub(UserService.prototype, 'getOrCreateUser').resolves({
      coins: 1234,
      dimensionalEnergy: 50,
      maxEnergy: 100
    });

    handler = new ShopButtonHandlers(clientMock);
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('edits the original reply when called publicly', async function() {
    const interaction = {
      deferUpdate: sinon.stub().resolves(),
      editReply: sinon.stub().resolves()
    };

    await handler.handleShopInfo(interaction, ['999']);

    expect(interaction.deferUpdate.called).to.be.true;
    expect(interaction.editReply.calledOnce).to.be.true;

    const callArg = interaction.editReply.firstCall.args[0];
    expect(callArg).to.have.property('components');
    expect(callArg).to.have.property('flags');
  });

  it('replies ephemerally when requested', async function() {
    const interaction = {
      reply: sinon.stub().resolves()
    };

    await handler.handleShopInfo(interaction, ['ephemeral', '999']);

    expect(interaction.reply.calledOnce).to.be.true;
    const callArg = interaction.reply.firstCall.args[0];
    expect(callArg).to.have.property('components');
    expect(callArg).to.have.property('flags');
  });
});
