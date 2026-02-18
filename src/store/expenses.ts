import AsyncStorage from '@react-native-async-storage/async-storage';
import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';

export type Expense = {
  id: string;
  amount: number;        // в копейках/центах лучше, но пока ок number
  category: string;
  note?: string;
  createdAt: number;     // Date.now()
};

type State = {
  expenses: Expense[];
  addExpense: (p: {amount: number; category: string; note?: string}) => void;
  removeExpense: (id: string) => void;
  clear: () => void;
};

const genId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const useExpenses = create<State>()(
  persist(
    (set) => ({
      expenses: [],
      addExpense: ({amount, category, note}) =>
        set((s) => ({
          expenses: [
            {id: genId(), amount, category, note, createdAt: Date.now()},
            ...s.expenses,
          ],
        })),
      removeExpense: (id) =>
        set((s) => ({expenses: s.expenses.filter((e) => e.id !== id)})),
      clear: () => set({expenses: []}),
    }),
    {
      name: 'expenses-v1',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
