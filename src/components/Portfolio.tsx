import React, { useState, useEffect, useCallback, useRef } from 'react';
import DonutChart from './DonutChart';
import AddTokenModal from './AddTokenModal';
import WatchlistTable from './WatchlistTable';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addTokens, updateHoldings, removeToken, updatePrices, setRealTimeMode } from '../store/actions';
import type { Token, TokenWithPrice } from '../types';
import { fetchTokenPrices } from '../services/coingecko';

const Portfolio: React.FC = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [updateInterval, setUpdateInterval] = useState<number>(30); // seconds
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const itemsPerPage = 10;

  const fetchPrices = useCallback(async (showLoading = true) => {
    if (state.tokens.length === 0) return;

    if (showLoading) setIsLoadingPrices(true);
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
      if (showLoading) setIsLoadingPrices(false);
    }
  }, [state.tokens, dispatch]);

  // Initial fetch
  useEffect(() => {
    fetchPrices(true);
  }, []);

  // Real-time updates with configurable interval
  useEffect(() => {
    if (!state.realTimeEnabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set new interval
    intervalRef.current = setInterval(() => {
      fetchPrices(false); // Silent update
    }, updateInterval * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchPrices, updateInterval, state.realTimeEnabled]);

  const handleAddTokens = (newTokens: Token[]) => {
    dispatch(addTokens(newTokens));
  };

  const handleUpdateHoldings = (tokenId: string, holdings: number) => {
    dispatch(updateHoldings(tokenId, holdings));
  };

  const handleRemoveToken = (tokenId: string) => {
    dispatch(removeToken(tokenId));
  };

  const toggleRealTime = () => {
    dispatch(setRealTimeMode(!state.realTimeEnabled));
  };

  const portfolioData: TokenWithPrice[] = state.tokens.map((token) => {
    const priceData = state.prices[token.id] || {
      price: 0,
      change24h: 0,
      sparkline: [],
      previousPrice: 0
    };
    
    const value = token.holdings * priceData.price;
    
    // Determine price change direction
    let priceChange: 'up' | 'down' | 'neutral' = 'neutral';
    if (priceData.previousPrice && priceData.price !== priceData.previousPrice) {
      priceChange = priceData.price > priceData.previousPrice ? 'up' : 'down';
    }
    
    return { ...token, ...priceData, value, priceChange };
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
      {/* Real-time Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        padding: '16px',
        background: 'var(--bg-secondary)',
        borderRadius: '12px',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: state.realTimeEnabled ? 'var(--positive)' : 'var(--text-secondary)',
              animation: state.realTimeEnabled ? 'pulse 2s infinite' : 'none'
            }} />
            <span style={{ fontSize: '14px', fontWeight: 500 }}>
              {state.realTimeEnabled ? 'Live Updates' : 'Updates Paused'}
            </span>
          </div>
          
          <button
            onClick={toggleRealTime}
            style={{
              padding: '6px 12px',
              fontSize: '13px',
              background: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            {state.realTimeEnabled ? 'Pause' : 'Resume'}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Update every:
          </span>
          <select
            value={updateInterval}
            onChange={(e) => setUpdateInterval(Number(e.target.value))}
            style={{
              padding: '6px 12px',
              fontSize: '13px',
              background: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            <option value={10}>10 seconds</option>
            <option value={30}>30 seconds</option>
            <option value={60}>1 minute</option>
            <option value={300}>5 minutes</option>
          </select>
        </div>
      </div>

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
            {state.realTimeEnabled && (
              <span style={{ color: 'var(--positive)', marginLeft: '8px' }}>● Live</span>
            )}
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
            onClick={() => fetchPrices(true)} 
            className="refresh-btn"
            disabled={isLoadingPrices}
            style={{ opacity: isLoadingPrices ? 0.6 : 1 }}
          >
            <span style={{ 
              display: 'inline-block',
              animation: isLoadingPrices ? 'spin 1s linear infinite' : 'none'
            }}>↻</span> 
            {isLoadingPrices ? 'Refreshing...' : 'Refresh Now'}
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