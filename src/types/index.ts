// Token interface
export interface Token {
  id: string;
  symbol: string;
  name: string;
  image: string;
  holdings: number;
}

// Price data interface
export interface PriceData {
  price: number;
  change24h: number;
  sparkline: number[];
}

// Portfolio state interface
export interface PortfolioState {
  tokens: Token[];
  prices: Record<string, PriceData>;
  lastUpdated: number | null;
}

// Action types
export type PortfolioAction =
  | { type: 'ADD_TOKENS'; payload: Token[] }
  | { type: 'UPDATE_HOLDINGS'; payload: { tokenId: string; holdings: number } }
  | { type: 'REMOVE_TOKEN'; payload: string }
  | { type: 'UPDATE_PRICES'; payload: Record<string, PriceData> }
  | { type: 'LOAD_STATE'; payload: PortfolioState };

// Token with price data
export interface TokenWithPrice extends Token, PriceData {
  value: number;
}

// API response types
export interface CoinGeckoMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  sparkline_in_7d?: {
    price: number[];
  };
}

export interface TrendingCoin {
  item: {
    id: string;
    symbol: string;
    name: string;
    thumb: string;
    large: string;
  };
}

// UI State types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}