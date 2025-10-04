import Portfolio from './components/Portfolio';
import WalletConnect from './components/WalletConnect';
import './App.css';

function App() {
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
      <Portfolio />
    </div>
  );
}

export default App;