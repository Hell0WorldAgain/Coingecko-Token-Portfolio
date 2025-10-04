import React, { useState } from 'react';
import Sparkline from './Sparkline';
import type { TokenWithPrice } from '../types';

interface WatchlistTableProps {
  tokens: TokenWithPrice[];
  onUpdateHoldings: (tokenId: string, holdings: number) => void;
  onRemoveToken: (tokenId: string) => void;
  isLoading?: boolean;
}

const WatchlistTable: React.FC<WatchlistTableProps> = ({
  tokens,
  onUpdateHoldings,
  onRemoveToken,
  isLoading = false
}) => {
  const [editingToken, setEditingToken] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const handleHoldingsChange = (tokenId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    onUpdateHoldings(tokenId, numValue);
    setEditingToken(null);
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Token</th>
          <th>Price</th>
          <th>24h %</th>
          <th>7d Chart</th>
          <th>Holdings</th>
          <th>Value</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {tokens.length === 0 ? (
          <tr>
            <td colSpan={7} className="empty-state">
              <div style={{ padding: '40px 20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📈</div>
                <p style={{ marginBottom: '8px', fontSize: '16px', fontWeight: 500 }}>
                  No tokens in your watchlist
                </p>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Click "Add Token" to start tracking your portfolio
                </p>
              </div>
            </td>
          </tr>
        ) : (
          tokens.map((token) => (
            <tr key={token.id} style={{ opacity: isLoading ? 0.6 : 1 }}>
              <td>
                <div className="token-info">
                  <img src={token.image} alt={token.name} className="token-icon" />
                  <div>
                    <div className="token-name">{token.name}</div>
                    <div className="token-symbol">{token.symbol}</div>
                  </div>
                </div>
              </td>
              <td className="price">
                {token.price > 0 ? (
                  <>
                    $
                    {token.price.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: token.price < 1 ? 6 : 2,
                    })}
                  </>
                ) : (
                  <span style={{ color: 'var(--text-secondary)' }}>Loading...</span>
                )}
              </td>
              <td>
                {token.price > 0 ? (
                  <span className={token.change24h >= 0 ? 'change-positive' : 'change-negative'}>
                    {token.change24h >= 0 ? '+' : ''}
                    {token.change24h.toFixed(2)}%
                  </span>
                ) : (
                  <span style={{ color: 'var(--text-secondary)' }}>--</span>
                )}
              </td>
              <td>
                <Sparkline data={token.sparkline} />
              </td>
              <td>
                {editingToken === token.id ? (
                  <input
                    type="number"
                    defaultValue={token.holdings}
                    onBlur={(e) => handleHoldingsChange(token.id, e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleHoldingsChange(token.id, (e.target as HTMLInputElement).value);
                      }
                    }}
                    autoFocus
                    className="holdings-input"
                    min="0"
                    step="any"
                  />
                ) : (
                  <div
                    onClick={() => setEditingToken(token.id)}
                    className="holdings-value"
                  >
                    {token.holdings.toLocaleString('en-US', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 8,
                    })}
                  </div>
                )}
              </td>
              <td className="price">
                $
                {token.value.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td style={{ position: 'relative' }}>
                <button
                  onClick={() => setMenuOpen(menuOpen === token.id ? null : token.id)}
                  className="menu-button"
                >
                  ⋮
                </button>
                {menuOpen === token.id && (
                  <>
                    <div 
                      style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 9
                      }}
                      onClick={() => setMenuOpen(null)}
                    />
                    <div className="token-menu">
                      <button
                        onClick={() => {
                          onRemoveToken(token.id);
                          setMenuOpen(null);
                        }}
                        className="menu-item"
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  </>
                )}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default WatchlistTable;