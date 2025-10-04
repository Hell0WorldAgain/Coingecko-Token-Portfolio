import type { Token, PriceData, PortfolioState } from '../types';

// Action Types
export const ADD_TOKENS = 'ADD_TOKENS';
export const UPDATE_HOLDINGS = 'UPDATE_HOLDINGS';
export const REMOVE_TOKEN = 'REMOVE_TOKEN';
export const UPDATE_PRICES = 'UPDATE_PRICES';
export const LOAD_STATE = 'LOAD_STATE';

// Action Creators
export const addTokens = (tokens: Token[]) => ({
  type: ADD_TOKENS as typeof ADD_TOKENS,
  payload: tokens,
});

export const updateHoldings = (tokenId: string, holdings: number) => ({
  type: UPDATE_HOLDINGS as typeof UPDATE_HOLDINGS,
  payload: { tokenId, holdings },
});

export const removeToken = (tokenId: string) => ({
  type: REMOVE_TOKEN as typeof REMOVE_TOKEN,
  payload: tokenId,
});

export const updatePrices = (prices: Record<string, PriceData>) => ({
  type: UPDATE_PRICES as typeof UPDATE_PRICES,
  payload: prices,
});

export const loadState = (state: PortfolioState) => ({
  type: LOAD_STATE as typeof LOAD_STATE,
  payload: state,
});