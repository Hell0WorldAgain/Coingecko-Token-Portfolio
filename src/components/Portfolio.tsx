import React, { useState, useEffect, useCallback } from 'react';
import DonutChart from './DonutChart';
import AddTokenModal from './AddTokenModal';
import WatchlistTable from './WatchlistTable';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addTokens, updateHoldings, removeToken, updatePrices } from '../store/actions';
import type { Token, TokenWithPrice } from '../types';
import { fetchTokenPrices } from '../services/coingecko';

const Portfolio: React.FC = () => {
  // Redux state and dispatch
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);
  const itemsPerPage = 10;

  const fetchPrices = useCallback(async () => {
    if (state.tokens.length === 0) return;

    setIsLoadingPrices(true);
    setPriceError(null);

    try {
      const tokenIds = state.tokens.map((t) => t.id);
      const priceData = await fetchTokenPrices(tokenIds);
      
      if (Object.keys(priceData).length === 0) {
        setPriceError('Failed to fetch prices. Please try again.');
      } else {
        dispatch(updatePrices(priceData));
      }
    } catch (error) {
      console.error('Error fetching prices:', error);
      setPriceError('Failed to fetch prices. Please check your connection.');
    } finally {
      setIsLoadingPrices(false);
    }
  }, [state.tokens, dispatch]);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  const handleAddTokens = (newTokens: Token[]) => {
    dispatch(addTokens(newTokens));
  };

  const handleUpdateHoldings = (tokenId: string, holdings: number) => {
    dispatch(updateHoldings(tokenId, holdings));
  };

  const handleRemoveToken = (tokenId: string) => {
    dispatch(removeToken(tokenId));
  };

  const portfolioData: TokenWithPrice[] = state.tokens.map((token) => {
    const priceData = state.prices[token.id] || {
      price: 0,
      change24h: 0,
      sparkline: [],
    };
    const value = token.holdings * priceData.price;
    return { ...token, ...priceData, value };
  });

  const totalValue = portfolioData.reduce((sum, item) => sum + item.value, 0);
  const chartData = portfolioData.filter((d) => d.value > 0);

  const chartColors = ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444'];

  const legendData = chartData.map((token, index) => ({
    ...token,
    percentage: ((token.value / totalValue) * 100).toFixed(1),
    color: chartColors[index % chartColors.length]
  }));

  const paginatedTokens = portfolioData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(portfolioData.length / itemsPerPage);

  return (
    <div className="portfolio-container">
      {/* Portfolio Card with Chart */}
      <div className="portfolio-card">
        <div className="portfolio-header">Portfolio Total</div>
        <div className="portfolio-value">
          ${totalValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
        {state.lastUpdated && (
          <div className="portfolio-updated">
            Last updated: {new Date(state.lastUpdated).toLocaleTimeString()}
          </div>
        )}
        {isLoadingPrices && (
          <div className="portfolio-updated" style={{ color: 'var(--accent-green)' }}>
            ⟳ Updating prices...
          </div>
        )}
        {priceError && (
          <div className="portfolio-updated" style={{ color: 'var(--negative)' }}>
            ⚠️ {priceError}
          </div>
        )}

        <div className="portfolio-content">
          <div style={{ maxWidth: '300px', margin: '0 auto' }}>
            {chartData.length > 0 ? (
              <DonutChart data={chartData} colors={chartColors} />
            ) : (
              <div style={{ 
                height: '300px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ fontSize: '48px' }}>📊</div>
                <div>No holdings to display</div>
                <div style={{ fontSize: '13px' }}>Edit holdings to see your portfolio chart</div>
              </div>
            )}
          </div>

          <div className="chart-legend">
            {legendData.length > 0 ? (
              legendData.map((token) => (
                <div key={token.id} className="legend-item">
                  <div className="legend-left">
                    <div 
                      className="legend-color" 
                      style={{ background: token.color }}
                    />
                    <div>
                      <div className="legend-name">{token.name}</div>
                      <div className="legend-symbol">{token.symbol}</div>
                    </div>
                  </div>
                  <div className="legend-percentage">{token.percentage}%</div>
                </div>
              ))
            ) : (
              <div style={{ 
                color: 'var(--text-secondary)', 
                fontSize: '14px',
                textAlign: 'center',
                padding: '20px'
              }}>
                Set token holdings to see portfolio breakdown
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Watchlist Section */}
      <div className="watchlist-header">
        <div className="watchlist-title">
          <span className="star-icon">⭐</span>
          Watchlist
        </div>
        <div className="watchlist-actions">
          <button 
            onClick={fetchPrices} 
            className="refresh-btn"
            disabled={isLoadingPrices}
            style={{ opacity: isLoadingPrices ? 0.6 : 1 }}
          >
            <span style={{ 
              display: 'inline-block',
              animation: isLoadingPrices ? 'spin 1s linear infinite' : 'none'
            }}>↻</span> 
            {isLoadingPrices ? 'Refreshing...' : 'Refresh Prices'}
          </button>
          <button onClick={() => setIsModalOpen(true)} className="add-token-btn">
            <span>+</span> Add Token
          </button>
        </div>
      </div>

      <div className="watchlist-table">
        <WatchlistTable
          tokens={paginatedTokens}
          onUpdateHoldings={handleUpdateHoldings}
          onRemoveToken={handleRemoveToken}
          isLoading={isLoadingPrices && state.tokens.length > 0}
        />

        {totalPages > 1 && (
          <div className="pagination">
            <div className="pagination-info">
              Page {currentPage} of {totalPages}
            </div>
            <div className="pagination-buttons">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                Prev
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <AddTokenModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTokens={handleAddTokens}
      />
    </div>
  );
};

export default Portfolio;