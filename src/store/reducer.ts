import type { PortfolioState, PortfolioAction } from '../types';
import * as actionTypes from './actions';

export const initialState: PortfolioState = {
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

export const portfolioReducer = (
  state: PortfolioState = initialState,
  action: PortfolioAction
): PortfolioState => {
  switch (action.type) {
    case actionTypes.ADD_TOKENS:
      const newTokens = action.payload.filter(
        (t: any) => !state.tokens.find(st => st.id === t.id)
      );
      return {
        ...state,
        tokens: [...state.tokens, ...newTokens]
      };

    case actionTypes.UPDATE_HOLDINGS:
      return {
        ...state,
        tokens: state.tokens.map(t =>
          t.id === action.payload.tokenId
            ? { ...t, holdings: action.payload.holdings }
            : t
        )
      };

    case actionTypes.REMOVE_TOKEN:
      return {
        ...state,
        tokens: state.tokens.filter(t => t.id !== action.payload)
      };

    case actionTypes.UPDATE_PRICES:
      const updatedPrices: Record<string, any> = {};
      Object.keys(action.payload).forEach(tokenId => {
        updatedPrices[tokenId] = {
          ...action.payload[tokenId],
          previousPrice: state.prices[tokenId]?.price
        };
      });
      
      return {
        ...state,
        prices: updatedPrices,
        lastUpdated: Date.now()
      };

    case actionTypes.UPDATE_SINGLE_PRICE:
      return {
        ...state,
        prices: {
          ...state.prices,
          [action.payload.tokenId]: {
            ...state.prices[action.payload.tokenId],
            previousPrice: state.prices[action.payload.tokenId]?.price,
            price: action.payload.price
          }
        },
        lastUpdated: Date.now()
      };

    case actionTypes.SET_REAL_TIME_MODE:
      return {
        ...state,
        realTimeEnabled: action.payload
      };

    case actionTypes.LOAD_STATE:
      return action.payload;

    default:
      return state;
  }
};