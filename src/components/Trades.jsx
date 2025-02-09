import React, { useEffect, useState } from 'react';

const TradesComponent = ({traderId, name}) => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        // Use the proxy endpoint instead of the original URL.
        const response = await fetch(`http://localhost:5000/api/trades/${traderId}`, );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const htmlString = await response.text();

        // Parse the HTML string into a document
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');

        // Find the section containing the trades
        const tradesSection = doc.querySelector('section.deals.deals_trader.js_mobile_deals_content');
        if (!tradesSection) {
          throw new Error('Trades section not found');
        }

        // Select all rows representing individual trades
        const tradeRows = tradesSection.querySelectorAll('.content_row');

        // Extract trade details (Instrument, Type, Volume, Open Time, Profit/Loss)
        const tradesData = Array.from(tradeRows)
          .map(row => {
            const cols = row.querySelectorAll('.content_col');
            // Ensure that the row contains the expected columns
            if (cols.length < 9) return null;

            const instrument = cols[0].querySelector('.title a')?.textContent.trim() || '';
            const type = cols[1].querySelector('.label')?.textContent.trim() || '';
            const volume = cols[2].querySelector('.data_value')?.textContent.trim() || '';
            const openTime = cols[3].querySelector('.data_value')?.textContent.trim() || '';
            const profit = cols[8].querySelector('.data_value')?.textContent.trim() || '';

            return { instrument, type, volume, openTime, profit };
          })
          .filter(trade => trade !== null);

        setTrades(tradesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrades();
  }, []);

  if (loading) {
    return <div>Loading trades...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  
  return (
    <div>
      <h2>Open Trades for <strong style={{ color: 'green' }}> {name} - {traderId} </strong>   </h2>
      {trades.length === 0 ? (
        <div>No trades found.</div>
      ) : (
        <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Type</th>
              <th>Volume</th>
              <th>Open Time</th>
              <th>Profit/Loss</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade, index) => (
              <tr key={index}>
                <td>{trade.instrument}</td>
                <td>{trade.type}</td>
                <td>{trade.volume}</td>
                <td>{trade.openTime}</td>
                <td>{trade.profit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TradesComponent;
