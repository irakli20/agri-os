// @ts-nocheck
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Field, FIELDS } from './mock-data';
import { getPlayerFields } from './game-field-bridge';

interface FieldStore {
    fields: Field[];
    gameFields: Field[];
    setFields: (fields: Field[]) => void;
    addField: (field: Field, isGameMode?: boolean) => void;
    updateField: (id: string, updates: Partial<Field>) => void;
    deleteField: (id: string) => void;
    syncGameFields: (ownedFieldIds: string[], rentedFieldIds: string[]) => void;
    getActiveFields: (isGameMode: boolean) => Field[];
}

/**
 * Field Store with Persistence
 * Manages the list of agricultural fields across the application.
 * 
 * Game-aware: when game mode is ON, `getActiveFields(true)` returns
 * only the player's purchased/rented fields. When OFF, returns the
 * standard demo fields.
 */
export const useFieldStore = create<FieldStore>()(
    persist(
        (set, get) => ({
            fields: FIELDS,
            gameFields: [],
            setFields: (fields) => set({ fields }),
            addField: (field, isGameMode) => set((state) => {
                const nextFields = [field, ...state.fields];
                const nextGameFields = isGameMode ? [field, ...state.gameFields] : state.gameFields;
                return { fields: nextFields, gameFields: nextGameFields };
            }),
            updateField: (id, updates) => set((state) => ({
                fields: state.fields.map((f) => f.id === id ? { ...f, ...updates } : f),
                gameFields: state.gameFields.map((f) => f.id === id ? { ...f, ...updates } : f),
            })),
            deleteField: (id) => set((state) => ({
                fields: state.fields.filter((f) => f.id !== id),
                gameFields: state.gameFields.filter((f) => f.id !== id),
            })),
            syncGameFields: (ownedFieldIds, rentedFieldIds) => {
                const converted = getPlayerFields(ownedFieldIds, rentedFieldIds);
                set((state) => {
                    const existingById = new Map(state.gameFields.map((field) => [field.id, field]));

                    // Fields from marketplace conversion
                    const marketplaceFields = converted.map((field) => {
                        const existing = existingById.get(field.id);
                        return existing ? { ...field, ...existing } : field;
                    });

                    // Preserve custom fields (those not prefixed with 'game-' from marketplace)
                    const customFields = state.gameFields.filter(f => !f.id.startsWith('game-'));

                    // Merge: marketplace fields + existing custom fields
                    return { gameFields: [...marketplaceFields, ...customFields] };
                });
            },
            getActiveFields: (isGameMode) => {
                const state = get();
                return isGameMode ? state.gameFields : state.fields;
            },
        }),
        {
            name: 'agri-os-field-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
