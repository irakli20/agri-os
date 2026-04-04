
// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value.toString(); },
        removeItem: (key: string) => { delete store[key]; },
        clear: () => { store = {}; }
    };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

import { useGameStore } from '../lib/game-store';
import { applyOperation } from '../lib/game-logic/field-simulation';
import { Field } from '../lib/mock-data';

console.log('--- STARTING GAME LOGIC SMOKE TEST ---');

// 1. Test Initial State
const store = useGameStore.getState();
console.log('Initial Game Time:', store.gameTime);
if (store.gameTime.week !== 1 || store.gameTime.year !== 1) {
    console.error('FAIL: Initial time is incorrect');
} else {
    console.log('PASS: Initial time correct');
}

// 2. Test Advance Time
useGameStore.getState().advanceTime();
const timeAfter = useGameStore.getState().gameTime;
console.log('Time after 1 week:', timeAfter);
if (timeAfter.week !== 2) {
    console.error('FAIL: Time did not advance correctly');
} else {
    console.log('PASS: Time advancement correct');
}

// 3. Test Field Logic - Plowing
const mockField: Field = {
    id: 'f1', name: 'Test Field', acres: 10, crop: 'Unplanted',
    plantingDate: '2025-01-01', ndviScore: 0.5, healthStatus: 'good',
    coordinates: [], lastFlightDate: '2025-01-01',
    soilStatus: 'compacted', cropStage: 'none', farmingStage: 'fallow'
};

const scoutResult = applyOperation(mockField, 'op-scout');
const soilTestResult = scoutResult.field ? applyOperation(scoutResult.field, 'op-soil-test') : { success: false };
const plowResult = soilTestResult.field ? applyOperation(soilTestResult.field, 'op-plow') : { success: false };
console.log('Plowing Result:', plowResult.success ? 'Success' : 'Fail');

if (plowResult.success && plowResult.field?.soilStatus === 'plowed') {
    console.log('PASS: Plowing updated soil status');
} else {
    console.error('FAIL: Plowing did not update status', plowResult);
}

// 4. Test Hiring/Rental
// Mock player login
useGameStore.setState({
    players: [{
        id: 'p1', username: 'test', email: 'test@test.com', passwordHash: 'hash',
        balance: 10000, xp: 0, level: 1, reputation: 0, ownedFieldIds: [], rentedFieldIds: [], createdAt: ''
    }],
    currentPlayerId: 'p1'
});

const hireResult = useGameStore.getState().addRental({
    id: 'r1', serviceId: 'serv-plow', name: 'Plowing', expiresAtWeek: 5
}, 1000);

console.log('Hiring Result:', hireResult.success ? 'Success' : 'Fail');
const playerAfter = useGameStore.getState().players[0];
console.log('Balance after hiring:', playerAfter.balance);

if (playerAfter.balance === 9000) {
    console.log('PASS: Balance deducted correctly');
} else {
    console.error('FAIL: Balance deduction incorrect');
}

console.log('--- SMOKE TEST COMPLETE ---');
