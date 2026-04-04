
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
import { useFieldStore } from '../lib/field-store';
import { MARKETPLACE_FIELDS } from '../lib/marketplace-data';

console.log('--- STARTING FIELD SYNC TEST ---');

// 1. Setup Game Store with a purchased field
const testFieldId = MARKETPLACE_FIELDS[0].id; // e.g. 'mkt-1'
const player = {
    id: 'p1',
    username: 'test',
    email: 'test@test.com',
    passwordHash: 'hash',
    balance: 10000,
    xp: 0,
    level: 1,
    reputation: 0,
    ownedFieldIds: [testFieldId], // User owns this field
    rentedFieldIds: [],
    createdAt: ''
};

useGameStore.setState({
    players: [player],
    currentPlayerId: 'p1'
});

console.log('GameStore configured. Owned Fields:', player.ownedFieldIds);

// 2. Check Initial FieldStore (Game Fields should be empty or default)
const initialFieldStore = useFieldStore.getState();
console.log('Initial Game Fields count:', initialFieldStore.gameFields.length);

if (initialFieldStore.gameFields.length > 0) {
    if (initialFieldStore.gameFields.some(f => f.id === `game-${testFieldId}`)) {
        console.warn('WARN: Game fields already populated. Clearing for test.');
        useFieldStore.setState({ gameFields: [] });
    }
}

// 3. Simulate AppShell Synchronization
const sync = useFieldStore.getState().syncGameFields;
console.log('Executing syncGameFields...');
sync(player.ownedFieldIds, player.rentedFieldIds);

// 4. Verify FieldStore Update
const finalFieldStore = useFieldStore.getState();
const syncedField = finalFieldStore.gameFields.find(f => f.id === `game-${testFieldId}`);

console.log('Final Game Fields count:', finalFieldStore.gameFields.length);

if (syncedField) {
    console.log('PASS: Field found in FieldStore:', syncedField.name);
    console.log('PASS: ID matches expected format:', syncedField.id);
} else {
    console.error('FAIL: Field NOT found in FieldStore after sync');
    process.exit(1);
}

// 5. Verify AppShell-like logic (selector)
const currentPlayer = useGameStore.getState().getCurrentPlayer();
if (currentPlayer?.ownedFieldIds.includes(testFieldId)) {
    console.log('PASS: GameStore player still owns field');
}

console.log('--- SYNC TEST COMPLETE ---');
