import React, { useState, useEffect } from 'react';

const TradingHistoryComponent = ({ traderId, onBack }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/tradingHistory/${traderId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch trading history');
        }
        const htmlString = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');

        // Find the container for the trading history.
        const historySection = doc.querySelector('#trades-history');
        if (!historySection) {
          throw new Error('Trading history section not found');
        }

        // Grab all rows of history (each row is a <div> with class "content_row")
        const rows = historySection.querySelectorAll('.content_row');

        const historyData = Array.from(rows).map(row => {
          const cols = row.querySelectorAll('.content_col');
          if (cols.length < 8) return null; // Skip if unexpected

          // Column 0: Instrument (try to get the text of the <a> inside .title)
          const instrumentAnchor = cols[0].querySelector('.title a');
          const instrument = instrumentAnchor ? instrumentAnchor.textContent.trim() : '';

          // Column 1: Opening date and time
          const openTimeEl = cols[1].querySelector('.data_value') || cols[1];
          const openTime = openTimeEl ? openTimeEl.textContent.trim() : '';

          // Column 2: Closing date and time
          const closeTimeEl = cols[2].querySelector('.data_value') || cols[2];
          const closeTime = closeTimeEl ? closeTimeEl.textContent.trim() : '';

          // Column 3: Type (Buy/Sell) – note the cell usually contains a <div class="label ...">
          const typeEl = cols[3].querySelector('.label') || cols[3];
          const type = typeEl ? typeEl.textContent.trim() : '';

          // Column 4: Trade volume
          const volumeEl = cols[4].querySelector('.data_value') || cols[4];
          const volume = volumeEl ? volumeEl.textContent.trim() : '';

          // Column 5: Entry Point
          const entryEl = cols[5].querySelector('.data_value') || cols[5];
          const entry = entryEl ? entryEl.textContent.trim() : '';

          // Column 6: Exit
          const exitEl = cols[6].querySelector('.data_value') || cols[6];
          const exit = exitEl ? exitEl.textContent.trim() : '';

          // Column 7: Profit
          const profitEl = cols[7].querySelector('.data_value') || cols[7];
          const profit = profitEl ? profitEl.textContent.trim() : '';

          return { instrument, openTime, closeTime, type, volume, entry, exit, profit };
        }).filter(item => item !== null);

        setHistory(historyData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [traderId]);

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={onBack} style={{ marginBottom: '20px' }}>Back</button>
      <h2>Trading History</h2>
      {loading && <div>Loading trading history...</div>}
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {!loading && !error && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }} border="1">
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Open Time</th>
              <th>Close Time</th>
              <th>Type</th>
              <th>Volume</th>
              <th>Entry</th>
              <th>Exit</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tbody>
            {history.map((trade, index) => (
              <tr key={index}>
                <td>{trade.instrument}</td>
                <td>{trade.openTime}</td>
                <td>{trade.closeTime}</td>
                <td style={{ color: trade.type.toLowerCase().includes('buy') ? 'green' : (trade.type.toLowerCase().includes('sell') ? 'red' : 'black') }}>
                  {trade.type}
                </td>
                <td>{trade.volume}</td>
                <td>{trade.entry}</td>
                <td>{trade.exit}</td>
                <td>{trade.profit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TradingHistoryComponent;
