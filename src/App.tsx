import Portfolio from './components/Portfolio';
import WalletConnect from './components/WalletConnect';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <div className="app-logo">
          <div className="logo-icon">T</div>
          <span>Token Portfolio</span>
        </div>
        <WalletConnect />
      </header>

      <Portfolio />
    </div>
  );
}

export default App;