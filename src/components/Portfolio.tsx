import React, { useState, useEffect, useCallback } from 'react';
import DonutChart from './DonutChart';
import AddTokenModal from './AddTokenModal';
import WatchlistTable from './WatchlistTable';
import type { PortfolioState, PortfolioAction, Token, TokenWithPrice } from '../types';
import { fetchTokenPrices } from '../services/coingecko';

interface PortfolioProps {
  state: PortfolioState;
  dispatch: React.Dispatch<PortfolioAction>;
}

const Portfolio: React.FC<PortfolioProps> = ({ state, dispatch }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchPrices = useCallback(async () => {
    if (state.tokens.length === 0) return;

    const tokenIds = state.tokens.map((t) => t.id);
    const priceData = await fetchTokenPrices(tokenIds);
    dispatch({ type: 'UPDATE_PRICES', payload: priceData });
  }, [state.tokens, dispatch]);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  const handleAddTokens = (newTokens: Token[]) => {
    dispatch({ type: 'ADD_TOKENS', payload: newTokens });
  };

  const handleUpdateHoldings = (tokenId: string, holdings: number) => {
    dispatch({ type: 'UPDATE_HOLDINGS', payload: { tokenId, holdings } });
  };

  const handleRemoveToken = (tokenId: string) => {
    dispatch({ type: 'REMOVE_TOKEN', payload: tokenId });
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

  // Calculate percentages for legend
  const legendData = chartData.map(token => ({
    ...token,
    percentage: ((token.value / totalValue) * 100).toFixed(1)
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

        <div className="portfolio-content">
          <div style={{ maxWidth: '300px', margin: '0 auto' }}>
            {chartData.length > 0 ? (
              <DonutChart data={chartData} />
            ) : (
              <div style={{ 
                height: '300px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'var(--text-secondary)'
              }}>
                No holdings to display
              </div>
            )}
          </div>

          <div className="chart-legend">
            {legendData.map((token, index) => (
              <div key={token.id} className="legend-item">
                <div className="legend-left">
                  <div 
                    className="legend-color" 
                    style={{ 
                      background: ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444'][index % 6]
                    }}
                  />
                  <div>
                    <div className="legend-name">{token.name}</div>
                    <div className="legend-symbol">{token.symbol}</div>
                  </div>
                </div>
                <div className="legend-percentage">{token.percentage}%</div>
              </div>
            ))}
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
          <button onClick={fetchPrices} className="refresh-btn">
            <span>↻</span> Refresh Prices
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
        />

        {totalPages > 1 && (
          <div className="pagination">
            <div className="pagination-info">
              {currentPage} of {totalPages} pages
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