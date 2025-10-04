export const testCoinGeckoAPI = async () => {
  console.log('🧪 Testing CoinGecko API...');
  
  try {
    // Test 1: Fetch trending coins
    console.log('Test 1: Fetching trending coins...');
    const trendingResponse = await fetch('https://api.coingecko.com/api/v3/search/trending');
    const trendingData = await trendingResponse.json();
    console.log('✅ Trending coins:', trendingData);
    
    // Test 2: Fetch Bitcoin price
    console.log('Test 2: Fetching Bitcoin price...');
    const btcResponse = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin&sparkline=true&price_change_percentage=24h');
    const btcData = await btcResponse.json();
    console.log('✅ Bitcoin data:', btcData);
    
    return { success: true, trending: trendingData, bitcoin: btcData };
  } catch (error) {
    console.error('❌ API Error:', error);
    return { success: false, error };
  }
};