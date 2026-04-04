/**
 * Equipment System Integration Test
 * Verifies that purchasing equipment works correctly and populates the store.
 */

import { useGameStore } from '../lib/game-store';
import { EQUIPMENT } from '../lib/marketplace-data';

// Mock localStorage for Zustand persist
const localStorageMock = (function () {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value.toString(); },
        clear: () => { store = {}; },
        removeItem: (key: string) => { delete store[key]; }
    };
})();
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

async function runTest() {
    console.log('--- STARTING EQUIPMENT SYSTEM TEST ---');

    const store = useGameStore.getState();

    // 1. Setup Player
    console.log('Setting up test player...');
    store.signup('testuser', 'test@example.com', 'password123');
    const player = useGameStore.getState().getCurrentPlayer();

    if (!player) {
        console.error('FAIL: Player setup failed');
        return;
    }
    console.log(`Player created with balance: $${player.balance}`);

    // 2. Initial Equipment State
    const initialEquipment = useGameStore.getState().equipment;
    console.log(`Initial equipment count: ${initialEquipment.length}`);
    if (initialEquipment.length !== 0) {
        console.error('FAIL: Initial equipment should be zero for new player');
    } else {
        console.log('PASS: Starting from zero assets');
    }

    // 3. Purchase Equipment
    const testItem = EQUIPMENT.find(e => e.id === 'eq-drone-scout');
    if (!testItem) {
        console.error('FAIL: eq-drone-scout not found in EQUIPMENT data');
        return;
    }

    console.log(`Attempting to purchase: ${testItem.name} for $${testItem.price}`);
    const result = useGameStore.getState().buyEquipment(testItem, testItem.price);

    if (result.success) {
        console.log('PASS: Purchase action successful');
    } else {
        console.error(`FAIL: Purchase failed: ${result.error}`);
    }

    // 4. Verify Store Update
    const updatedStore = useGameStore.getState();
    const updatedPlayer = updatedStore.getCurrentPlayer();
    const updatedEquipment = updatedStore.equipment;

    console.log(`New balance: $${updatedPlayer?.balance}`);
    console.log(`New equipment count: ${updatedEquipment.length}`);

    if (updatedEquipment.length === 1 && updatedEquipment[0].id === testItem.id) {
        console.log('PASS: Equipment added to inventory');
    } else {
        console.error('FAIL: Equipment not in inventory after purchase');
    }

    if (updatedPlayer && updatedPlayer.balance === 50000 - testItem.price) {
        console.log('PASS: Correct balance deduction');
    } else {
        console.error('FAIL: Incorrect balance deduction');
    }

    // 5. Verify Insufficient Funds
    const expensiveItem = EQUIPMENT.find(e => e.price > updatedPlayer!.balance);
    if (expensiveItem) {
        console.log(`Attempting to purchase expensive item: ${expensiveItem.name} ($${expensiveItem.price})`);
        const failResult = useGameStore.getState().buyEquipment(expensiveItem, expensiveItem.price);
        if (!failResult.success) {
            console.log(`PASS: Correctly rejected expensive purchase: ${failResult.error}`);
        } else {
            console.error('FAIL: Should have rejected purchase due to insufficient funds');
        }
    }

    console.log('--- EQUIPMENT SYSTEM TEST COMPLETE ---');
}

runTest().catch(console.error);
