import { createSlice } from '@reduxjs/toolkit';
import type{PayloadAction } from '@reduxjs/toolkit';
import type { PortfolioState, Token, PriceData } from '../types';

const initialState: PortfolioState = {
  tokens: [
    {
      id: 'bitcoin',
      symbol: 'btc',
      name: 'Bitcoin',
      image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
      holdings: 0.5
    },
    {
      id: 'ethereum',
      symbol: 'eth',
      name: 'Ethereum',
      image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
      holdings: 2.5
    },
    {
      id: 'solana',
      symbol: 'sol',
      name: 'Solana',
      image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
      holdings: 10
    },
    {
      id: 'dogecoin',
      symbol: 'doge',
      name: 'Dogecoin',
      image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
      holdings: 1000
    },
    {
      id: 'cardano',
      symbol: 'ada',
      name: 'Cardano',
      image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
      holdings: 500
    }
  ],
  prices: {},
  lastUpdated: null,
  realTimeEnabled: true
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    addTokens: (state, action: PayloadAction<Token[]>) => {
      const newTokens = action.payload.filter(
        t => !state.tokens.find(st => st.id === t.id)
      );
      state.tokens.push(...newTokens);
    },
    
    updateHoldings: (state, action: PayloadAction<{ tokenId: string; holdings: number }>) => {
      const token = state.tokens.find(t => t.id === action.payload.tokenId);
      if (token) {
        token.holdings = action.payload.holdings;
      }
    },
    
    removeToken: (state, action: PayloadAction<string>) => {
      state.tokens = state.tokens.filter(t => t.id !== action.payload);
    },
    
    updatePrices: (state, action: PayloadAction<Record<string, PriceData>>) => {
      Object.keys(action.payload).forEach(tokenId => {
        state.prices[tokenId] = {
          ...action.payload[tokenId],
          previousPrice: state.prices[tokenId]?.price
        };
      });
      state.lastUpdated = Date.now();
    },
    
    updateSinglePrice: (state, action: PayloadAction<{ tokenId: string; price: number }>) => {
      if (state.prices[action.payload.tokenId]) {
        state.prices[action.payload.tokenId].previousPrice = state.prices[action.payload.tokenId].price;
        state.prices[action.payload.tokenId].price = action.payload.price;
      } else {
        state.prices[action.payload.tokenId] = {
          price: action.payload.price,
          change24h: 0,
          sparkline: []
        };
      }
      state.lastUpdated = Date.now();
    },
    
    setRealTimeMode: (state, action: PayloadAction<boolean>) => {
      state.realTimeEnabled = action.payload;
    },
    
    loadState: (_: unknown, action: PayloadAction<PortfolioState>) => {
      return action.payload;
    }
  }
});

export const {
  addTokens,
  updateHoldings,
  removeToken,
  updatePrices,
  updateSinglePrice,
  setRealTimeMode,
  loadState
} = portfolioSlice.actions;

export const portfolioReducer = portfolioSlice.reducer;