import React, { useState, useEffect, useCallback, useRef } from 'react';
import Modal from './Modal';
import type { Token } from '../types';
import { fetchTrendingCoins, fetchCoinsMarket } from '../services/coingecko';

interface AddTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTokens: (tokens: Token[]) => void;
}

const AddTokenModal: React.FC<AddTokenModalProps> = ({ isOpen, onClose, onAddTokens }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tokens, setTokens] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [selectedTokens, setSelectedTokens] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const lastTokenRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    const loadTrending = async () => {
      if (isOpen) {
        const trendingData = await fetchTrendingCoins();
        setTrending(trendingData.slice(0, 8).map((c) => c.item));
      }
    };
    loadTrending();
  }, [isOpen]);

  useEffect(() => {
    const fetchTokens = async () => {
      if (!searchQuery) {
        setTokens([]);
        setPage(1);
        return;
      }

      setLoading(true);
      const data = await fetchCoinsMarket(page, 50);
      const filtered = data.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (page === 1) {
        setTokens(filtered);
      } else {
        setTokens((prev) => [...prev, ...filtered]);
      }
      setHasMore(filtered.length === 50);
      setLoading(false);
    };

    const timer = setTimeout(fetchTokens, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, page]);

  const handleSelect = (tokenId: string) => {
    setSelectedTokens((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tokenId)) {
        newSet.delete(tokenId);
      } else {
        newSet.add(tokenId);
      }
      return newSet;
    });
  };

  const handleAdd = () => {
    const tokensToAdd = [...tokens, ...trending]
      .filter((t) => selectedTokens.has(t.id))
      .map((t) => ({
        id: t.id,
        symbol: t.symbol,
        name: t.name,
        image: t.image || t.thumb || t.large,
        holdings: 0,
      }));
    onAddTokens(tokensToAdd);
    setSelectedTokens(new Set());
    setSearchQuery('');
    setTokens([]);
    setPage(1);
    onClose();
  };

  const displayTokens = searchQuery ? tokens : trending;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Modal Header */}
      <div style={{
        padding: '24px',
        borderBottom: '1px solid var(--border-color)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Add Token</h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              color: 'var(--text-secondary)',
              fontSize: '24px',
              padding: '4px',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
        
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search tokens (e.g., ETH, SOL)"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
          style={{
            width: '100%',
            padding: '12px 16px',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            color: 'var(--text-primary)',
            fontSize: '14px',
          }}
        />
      </div>

      {/* Token List */}
      <div style={{
        padding: '16px 24px',
        maxHeight: '400px',
        overflowY: 'auto',
      }}>
        {!searchQuery && trending.length > 0 && (
          <div style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Trending
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {displayTokens.map((token, index) => (
            <div
              key={token.id}
              ref={index === displayTokens.length - 1 ? lastTokenRef : null}
              onClick={() => handleSelect(token.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                background: selectedTokens.has(token.id) ? 'var(--bg-tertiary)' : 'transparent',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!selectedTokens.has(token.id)) {
                  e.currentTarget.style.background = 'var(--bg-tertiary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!selectedTokens.has(token.id)) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={token.image || token.thumb || token.large}
                  alt={token.name}
                  style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{token.name}</div>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                  }}>
                    {token.symbol}
                  </div>
                </div>
              </div>
              
              {/* Checkbox */}
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: `2px solid ${selectedTokens.has(token.id) ? 'var(--accent-green)' : 'var(--border-color)'}`,
                background: selectedTokens.has(token.id) ? 'var(--accent-green)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}>
                {selectedTokens.has(token.id) && (
                  <span style={{ color: 'var(--bg-primary)', fontSize: '12px', fontWeight: 'bold' }}>✓</span>
                )}
              </div>
            </div>
          ))}
          
          {loading && (
            <div style={{
              textAlign: 'center',
              padding: '20px',
              color: 'var(--text-secondary)',
              fontSize: '14px',
            }}>
              Loading more tokens...
            </div>
          )}
        </div>
      </div>

      {/* Modal Footer */}
      <div style={{
        padding: '20px 24px',
        borderTop: '1px solid var(--border-color)',
      }}>
        <button
          onClick={handleAdd}
          disabled={selectedTokens.size === 0}
          className="add-token-btn"
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '15px',
            fontWeight: 600,
            borderRadius: '8px',
            opacity: selectedTokens.size === 0 ? 0.5 : 1,
            cursor: selectedTokens.size === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          Add to Watchlist ({selectedTokens.size})
        </button>
      </div>
    </Modal>
  );
};

export default AddTokenModal;