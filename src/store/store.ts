import { createStore } from 'redux';
import { portfolioReducer } from './reducer';
import type { PortfolioState } from '../types';

const loadState = (): PortfolioState | undefined => {
  try {
    const serializedState = localStorage.getItem('portfolioState');
    const hasVisited = localStorage.getItem('hasVisited');
    
    if (serializedState && hasVisited) {
      return JSON.parse(serializedState);
    }
    localStorage.setItem('hasVisited', 'true');
    return undefined;
  } catch (err) {
    console.error('Failed to load state from localStorage:', err);
    return undefined;
  }
};

const saveState = (state: PortfolioState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('portfolioState', serializedState);
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
  }
};

export const store = createStore(
  portfolioReducer,
  loadState()
);

store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;