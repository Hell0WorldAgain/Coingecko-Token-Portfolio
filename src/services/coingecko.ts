import type { CoinGeckoMarket, TrendingCoin, PriceData } from '../types/index';

const BASE_URL = 'https://api.coingecko.com/api/v3';

/**
 * Fetch trending coins
 */
export const fetchTrendingCoins = async () => {
  try {
    const response = await fetch(`${BASE_URL}/search/trending`);
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
    const response = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false`
    );
    const data = await response.json();
    return data as CoinGeckoMarket[];
  } catch (error) {
    console.error('Failed to fetch coins market:', error);
    return [];
  }
};

/**
 * Fetch prices for specific token IDs
 */
export const fetchTokenPrices = async (tokenIds: string[]): Promise<Record<string, PriceData>> => {
  if (tokenIds.length === 0) return {};

  try {
    const ids = tokenIds.join(',');
    const response = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=250&sparkline=true&price_change_percentage=24h`
    );
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