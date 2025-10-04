import type { PortfolioState, PortfolioAction } from '../types';

// Initial state with default tokens
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
  lastUpdated: null
};

// Portfolio reducer
export const portfolioReducer = (
  state: PortfolioState,
  action: PortfolioAction
): PortfolioState => {
  switch (action.type) {
    case 'ADD_TOKENS':
      const newTokens = action.payload.filter(
        t => !state.tokens.find(st => st.id === t.id)
      );
      return {
        ...state,
        tokens: [...state.tokens, ...newTokens]
      };

    case 'UPDATE_HOLDINGS':
      return {
        ...state,
        tokens: state.tokens.map(t =>
          t.id === action.payload.tokenId
            ? { ...t, holdings: action.payload.holdings }
            : t
        )
      };

    case 'REMOVE_TOKEN':
      return {
        ...state,
        tokens: state.tokens.filter(t => t.id !== action.payload)
      };

    case 'UPDATE_PRICES':
      return {
        ...state,
        prices: action.payload,
        lastUpdated: Date.now()
      };

    case 'LOAD_STATE':
      return action.payload;

    default:
      return state;
  }
};