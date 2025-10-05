import type { Token, PriceData, PortfolioState } from '../types';

export const ADD_TOKENS = 'ADD_TOKENS';
export const UPDATE_HOLDINGS = 'UPDATE_HOLDINGS';
export const REMOVE_TOKEN = 'REMOVE_TOKEN';
export const UPDATE_PRICES = 'UPDATE_PRICES';
export const UPDATE_SINGLE_PRICE = 'UPDATE_SINGLE_PRICE';
export const LOAD_STATE = 'LOAD_STATE';
export const SET_REAL_TIME_MODE = 'SET_REAL_TIME_MODE';

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

export const updateSinglePrice = (tokenId: string, price: number) => ({
  type: UPDATE_SINGLE_PRICE as typeof UPDATE_SINGLE_PRICE,
  payload: { tokenId, price },
});

export const loadState = (state: PortfolioState) => ({
  type: LOAD_STATE as typeof LOAD_STATE,
  payload: state,
});

export const setRealTimeMode = (enabled: boolean) => ({
  type: SET_REAL_TIME_MODE as typeof SET_REAL_TIME_MODE,
  payload: enabled,
});