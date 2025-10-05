import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import { portfolioReducer } from './portfolioSlice';
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

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  predicate: () => true,
  effect: (_action, listenerApi) => {
    const state = listenerApi.getState() as PortfolioState;
    try {
      localStorage.setItem('portfolioState', JSON.stringify(state));
    } catch (err) {
      console.error('Failed to save state to localStorage:', err);
    }
  },
});

export const store = configureStore({
  reducer: portfolioReducer,
  preloadedState: loadState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
  devTools: import.meta.env.MODE !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;