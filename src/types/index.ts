export interface Token {
  id: string;
  symbol: string;
  name: string;
  image: string;
  holdings: number;
}

export interface PriceData {
  price: number;
  change24h: number;
  sparkline: number[];
  previousPrice?: number; 
}

export interface PortfolioState {
  tokens: Token[];
  prices: Record<string, PriceData>;
  lastUpdated: number | null;
  realTimeEnabled?: boolean;
}

export type PortfolioAction =
  | { type: 'ADD_TOKENS'; payload: Token[] }
  | { type: 'UPDATE_HOLDINGS'; payload: { tokenId: string; holdings: number } }
  | { type: 'REMOVE_TOKEN'; payload: string }
  | { type: 'UPDATE_PRICES'; payload: Record<string, PriceData> }
  | { type: 'UPDATE_SINGLE_PRICE'; payload: { tokenId: string; price: number } }
  | { type: 'LOAD_STATE'; payload: PortfolioState }
  | { type: 'SET_REAL_TIME_MODE'; payload: boolean };

export interface TokenWithPrice extends Token, PriceData {
  value: number;
  priceChange?: 'up' | 'down' | 'neutral';
}

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

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}