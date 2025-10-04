import { useEffect, useReducer } from 'react';
import Portfolio from './components/Portfolio';
import WalletConnect from './components/WalletConnect';
import { portfolioReducer, initialState } from './store/reducer';
import './App.css';

function App() {
  const [state, dispatch] = useReducer(portfolioReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('portfolioState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        // Only load if it has tokens, otherwise use default
        if (parsed.tokens && parsed.tokens.length > 0) {
          dispatch({ type: 'LOAD_STATE', payload: parsed });
        }
      } catch (err) {
        console.error('Failed to load state', err);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('portfolioState', JSON.stringify(state));
  }, [state]);

  return (
    <div className="App">
      {/* Header */}
      <header className="app-header">
        <div className="app-logo">
          <div className="logo-icon">T</div>
          <span>Token Portfolio</span>
        </div>
        <WalletConnect />
      </header>

      {/* Main Content */}
      <Portfolio state={state} dispatch={dispatch} />
    </div>
  );
}

export default App;