import './App.css';
import TradesComponent from './components/Trades';
import { useState } from 'react';

function App() {
  const traderList = [
    { name: 'MRT', id: 3417809 },
    { name: 'MRT 2', id: 2924129 },
    { name: 'Blue Whale Capital', id: 1264293 },
  ];

  // Use null as the initial state since no trader is selected at first.
  const [selectedTrader, setSelectedTrader] = useState(null);

  return (
    <div className="App">
      {selectedTrader === null ? (
        // Show list of traders if none is selected
        traderList.map((trader, index) => (
          <button key={index} onClick={() => setSelectedTrader(trader)}>
            {trader.name}
          </button>
        ))
      ) : (
        // Show details for the selected trader
        <div>
          <button onClick={() => setSelectedTrader(null)}>Back to Traders</button>
          <TradesComponent traderId={selectedTrader.id} name={selectedTrader.name} />
        </div>
      )}
    </div>
  );
}

export default App;
