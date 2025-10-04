import { createStore } from 'redux';
import { portfolioReducer } from './reducer';
import type { PortfolioState } from '../types';

// Load state from localStorage
const loadState = (): PortfolioState | undefined => {
  try {
    const serializedState = localStorage.getItem('portfolioState');
    const hasVisited = localStorage.getItem('hasVisited');
    
    if (serializedState && hasVisited) {
      return JSON.parse(serializedState);
    }
    // First visit - return undefined to use initialState from reducer
    localStorage.setItem('hasVisited', 'true');
    return undefined;
  } catch (err) {
    console.error('Failed to load state from localStorage:', err);
    return undefined;
  }
};

// Save state to localStorage
const saveState = (state: PortfolioState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('portfolioState', serializedState);
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
  }
};

// Create Redux store
export const store = createStore(
  portfolioReducer,
  loadState()
);

// Subscribe to store changes and save to localStorage
store.subscribe(() => {
  saveState(store.getState());
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;