import type { CoinGeckoMarket, TrendingCoin, PriceData } from '../types';

const BASE_URL = 'https://api.coingecko.com/api/v3';

// Track last request time to avoid rate limiting
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2000; // 2 seconds between requests

// Helper to throttle requests
const throttleRequest = async () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => 
      setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
    );
  }
  
  lastRequestTime = Date.now();
};

/**
 * Fetch trending coins
 */
export const fetchTrendingCoins = async () => {
  try {
    await throttleRequest();
    const response = await fetch(`${BASE_URL}/search/trending`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.coins as TrendingCoin[];
  } catch (error) {
    console.error('Failed to fetch trending coins:', error);
    return [];
  }
};

/**
 * Fetch coins market data with search query
 */
export const fetchCoinsMarket = async (page: number = 1, perPage: number = 50) => {
  try {
    await throttleRequest();
    const response = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data as CoinGeckoMarket[];
  } catch (error) {
    console.error('Failed to fetch coins market:', error);
    return [];
  }
};

/**
 * Fetch prices for specific token IDs with full market data
 */
export const fetchTokenPrices = async (tokenIds: string[]): Promise<Record<string, PriceData>> => {
  if (tokenIds.length === 0) return {};

  try {
    await throttleRequest();
    const ids = tokenIds.join(',');
    const response = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=250&sparkline=true&price_change_percentage=24h`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CoinGeckoMarket[] = await response.json();

    const priceMap: Record<string, PriceData> = {};
    data.forEach(coin => {
      priceMap[coin.id] = {
        price: coin.current_price,
        change24h: coin.price_change_percentage_24h,
        sparkline: coin.sparkline_in_7d?.price || []
      };
    });

    return priceMap;
  } catch (error) {
    console.error('Failed to fetch token prices:', error);
    return {};
  }
};

/**
 * Fetch simple price updates (lightweight, for frequent polling)
 */
export const fetchSimplePrices = async (tokenIds: string[]): Promise<Record<string, number>> => {
  if (tokenIds.length === 0) return {};

  try {
    await throttleRequest();
    const ids = tokenIds.join(',');
    const response = await fetch(
      `${BASE_URL}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Convert to price map
    const priceMap: Record<string, number> = {};
    Object.keys(data).forEach(id => {
      priceMap[id] = data[id].usd;
    });

    return priceMap;
  } catch (error) {
    console.error('Failed to fetch simple prices:', error);
    return {};
  }
};

/**
 * Check API status
 */
export const checkAPIStatus = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/ping`);
    return response.ok;
  } catch (error) {
    console.error('API ping failed:', error);
    return false;
  }
};