import React, { useState } from 'react';
import './App.css';
import TradesComponent from './components/Trades';
import TradingHistoryComponent from './components/TradingHistoryComponent';
import TraderRowSummary from './components/TraderRowSummary';

function App() {
  const traderList = [
    { name: 'MRT', id: 3417809 },
    { name: 'MRT 2', id: 2924129 },
    { name: 'Blue Whale Capital', id: 1264293 },
  ];

  const [selectedTrader, setSelectedTrader] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  // When no trader is selected, show the summary table.
  if (!selectedTrader) {
    return (
      <div className="App">
        <h2>Trader List</h2>
        <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Trader Name</th>
              <th>ID</th>
              {/* Include any additional summary columns as needed */}
            </tr>
          </thead>
          <tbody>
            {traderList.map((trader, index) => (
              <TraderRowSummary key={index} trader={trader} onSelect={setSelectedTrader} onShowInfo={() => {}} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // When a trader is selected, allow toggling between Open Trades and Trading History.
  return (
    <div className="App" style={{ padding: '20px' }}>
      <button
        onClick={() => {
          setSelectedTrader(null);
          setShowHistory(false);
        }}
      >
        Back to Trader List
      </button>
      <h2>{selectedTrader.name}</h2>
      <div style={{ margin: '20px 0' }}>
        <button onClick={() => setShowHistory(false)} style={{ marginRight: '10px' }}>
          Open Trades
        </button>
        <button onClick={() => setShowHistory(true)}>
          Trading History
        </button>
      </div>
      {showHistory ? (
        <TradingHistoryComponent traderId={selectedTrader.id} onBack={() => setShowHistory(false)} />
      ) : (
        <TradesComponent traderId={selectedTrader.id} name={selectedTrader.name} />
      )}
    </div>
  );
}

export default App;
