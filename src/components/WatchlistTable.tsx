import React, { useState } from 'react';
import Sparkline from './Sparkline';
import type { TokenWithPrice } from '../types';

interface WatchlistTableProps {
  tokens: TokenWithPrice[];
  onUpdateHoldings: (tokenId: string, holdings: number) => void;
  onRemoveToken: (tokenId: string) => void;
}

const WatchlistTable: React.FC<WatchlistTableProps> = ({
  tokens,
  onUpdateHoldings,
  onRemoveToken,
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
                <p style={{ marginBottom: '8px' }}>No tokens in your watchlist</p>
                <p style={{ fontSize: '13px' }}>Click "Add Token" to get started</p>
              </div>
            </td>
          </tr>
        ) : (
          tokens.map((token) => (
            <tr key={token.id}>
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
                $
                {token.price?.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: token.price < 1 ? 6 : 2,
                }) || '0.00'}
              </td>
              <td>
                <span className={token.change24h >= 0 ? 'change-positive' : 'change-negative'}>
                  {token.change24h >= 0 ? '+' : ''}
                  {token.change24h?.toFixed(2) || '0.00'}%
                </span>
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
                    step="0.01"
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