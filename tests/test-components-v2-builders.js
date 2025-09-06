const { expect } = require('chai');

const ComponentRegistry = require('../src/components/ComponentRegistry');

describe('Components V2 builders smoke tests', function() {
  it('ProfileDisplay -> builder components produce valid toJSON()', async function() {
    const registry = new ComponentRegistry();
    const profile = {
      level: 5,
      exp: 1234,
      dimensionalEnergy: 20,
      maxEnergy: 100,
      coins: 500,
      shards: 10,
      collectionCount: 3,
      currentDimension: 'nexus_hub',
      dailyStreak: 2,
      lastDaily: null,
      createdAt: new Date()
    };

    const fakeUser = { id: '12345', username: 'TestUser' };
    const display = registry.createProfile(profile, fakeUser);

    expect(display).to.be.an('object');
    expect(display.components).to.be.an('array');

    // Each top-level component should expose toJSON() that returns a serializable object
    display.components.forEach(comp => {
      expect(comp).to.exist;
      expect(typeof comp.toJSON).to.equal('function');
      const json = comp.toJSON();
      expect(json).to.be.an('object');
      expect(json).to.have.property('type');
    });
  });

  it('ShopDisplay -> createShopInterface and createCategoryDisplay produce valid toJSON()', async function() {
    const registry = new ComponentRegistry();
    const categories = registry.getDefaultShopCategories();

    const userData = {
      coins: 1000,
      dimensionalEnergy: 50,
      maxEnergy: 100
    };

    const fakeUser = { id: '54321', username: 'ShopTester' };

    const shopInterface = registry.createShopInterface(categories, userData, fakeUser);
    expect(shopInterface).to.be.an('object');
    expect(shopInterface.components).to.be.an('array');

    shopInterface.components.forEach(comp => {
      expect(comp).to.exist;
      expect(typeof comp.toJSON).to.equal('function');
      const json = comp.toJSON();
      expect(json).to.be.an('object');
      expect(json).to.have.property('type');
    });

    // category display
    const items = registry.getSampleShopItems('consumables');
    const categoryDisplay = registry.createShopCategory('consumables', items, userData, fakeUser, 1);
    expect(categoryDisplay).to.be.an('object');
    expect(categoryDisplay.components).to.be.an('array');

    categoryDisplay.components.forEach(comp => {
      expect(comp).to.exist;
      expect(typeof comp.toJSON).to.equal('function');
      const json = comp.toJSON();
      expect(json).to.be.an('object');
      expect(json).to.have.property('type');
    });
  });

  it('ShopDisplay -> createPurchaseModal produces valid toJSON()', async function() {
    const registry = new ComponentRegistry();
    const userData = { coins: 1000 };
    const item = {
      id: 'health_potion',
      name: 'Health Potion',
      description: 'Restores 50 HP',
      price: 100,
      emoji: '❤️'
    };
    const modal = registry.createPurchaseConfirmation(item, userData, '12345');
    expect(modal).to.be.an('object');
    expect(modal.components).to.be.an('array');

    modal.components.forEach(comp => {
      expect(comp).to.exist;
      expect(typeof comp.toJSON).to.equal('function');
      const json = comp.toJSON();
      expect(json).to.be.an('object');
      expect(json).to.have.property('type');
    });
  });
});
