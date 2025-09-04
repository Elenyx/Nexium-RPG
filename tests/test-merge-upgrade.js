const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const { Sequelize } = require('sequelize');
const initializeModels = require('../src/database/models');

describe('CardLevelingService', () => {
    let cardLevelingService;
    let sandbox;
    let sequelize;
    let models;
    let CardLevelingService;

    before(() => {
        sequelize = new Sequelize('sqlite::memory:', { logging: false });
        models = initializeModels(sequelize);
        models.sequelize = sequelize;
        CardLevelingService = proxyquire('../src/services/CardLevelingService', {
            '../database/connection': { models }
        });
        sandbox = sinon.createSandbox();

        sandbox.stub(sequelize, 'transaction').callsFake(async () => ({
            commit: sinon.stub(),
            rollback: sinon.stub()
        }));
    });

    after(async () => {
        await sequelize.close();
    });

    beforeEach(() => {
        cardLevelingService = new CardLevelingService();
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('mergeDuplicateCard', () => {
        it('should not allow merging at max level', async () => {
            sandbox.stub(models.UserCharacter, 'findOne').resolves({
                id: 1,
                customLevel: 100,
                customExp: 0,
                character: {
                    id: 1,
                    attack: 100,
                    defense: 100,
                    speed: 100,
                    health: 100,
                    rarity: 'COMMON'
                }
            });
            const result = await cardLevelingService.mergeDuplicateCard('userId', 'characterId', 1);

            expect(result.success).to.be.false;
            expect(result.error).to.equal('Character is already at max level.');
        });
    });

    describe('addExpToCard', () => {
        it('should not allow adding EXP if insufficient shards', async () => {
            sandbox.stub(models.UserCharacter, 'findOne').resolves({
                id: 1,
                customLevel: 50,
                customExp: 0,
                character: {
                    id: 1,
                    attack: 100,
                    defense: 100,
                    speed: 100,
                    health: 100,
                    rarity: 'COMMON'
                },
                update: sinon.stub().throws(new Error('Insufficient shards'))
            });
            try {
                await cardLevelingService.addExpToCard('userId', 'characterId', 1000);
            } catch (error) {
                expect(error.message).to.equal('Insufficient shards');
            }
        });
    });
});
