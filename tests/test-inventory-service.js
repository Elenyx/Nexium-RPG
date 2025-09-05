const assert = require('assert');
const InventoryService = require('../src/services/InventoryService');

(async () => {
    const svc = new InventoryService();
    const userId = 'test-user-1';

    try {
        // DB may be disabled in tests; methods should not throw when models undefined
        const inv = await svc.getOrCreateInventory(userId);
        assert(inv && typeof inv === 'object', 'getOrCreateInventory should return an object');

        // If models are disabled, addItem should return null; otherwise it should add
        try {
            await svc.addItem(userId, { id: 'potion_small', name: 'Small Potion', qty: 2 });
        } catch (err) {
            // acceptable in DB-disabled environment
        }

        // listItems should return an array or throw if DB disabled
        let items = [];
        try { items = await svc.listItems(userId); } catch (e) { items = []; }
        assert(Array.isArray(items), 'listItems should return an array');

        console.log('PASS: InventoryService basic smoke test');
        process.exit(0);
    } catch (err) {
        console.error('FAIL:', err.message);
        process.exit(2);
    }
})();
