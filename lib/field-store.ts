import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Field, FIELDS } from './mock-data';

interface FieldStore {
    fields: Field[];
    setFields: (fields: Field[]) => void;
    addField: (field: Field) => void;
    updateField: (id: string, updates: Partial<Field>) => void;
    deleteField: (id: string) => void;
}

/**
 * Field Store with Persistence
 * Manages the list of agricultural fields across the application.
 * Persists user-added fields to localStorage to handle page refreshes.
 */
export const useFieldStore = create<FieldStore>()(
    persist(
        (set) => ({
            fields: FIELDS,
            setFields: (fields) => set({ fields }),
            addField: (field) => set((state) => ({ fields: [field, ...state.fields] })),
            updateField: (id, updates) => set((state) => ({
                fields: state.fields.map((f) => f.id === id ? { ...f, ...updates } : f)
            })),
            deleteField: (id) => set((state) => ({
                fields: state.fields.filter((f) => f.id !== id)
            })),
        }),
        {
            name: 'agri-os-field-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
