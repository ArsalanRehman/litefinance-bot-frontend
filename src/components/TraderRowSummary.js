// TraderRowSummary.js
import React, { useEffect, useState } from 'react';

const TraderRowSummary = ({ trader, onSelect, onShowInfo }) => {
  // State for trades summary
  const [trades, setTrades] = useState([]);
  const [loadingTrades, setLoadingTrades] = useState(true);
  const [errorTrades, setErrorTrades] = useState(null);

  // State for personal assets (total capital)
  const [personalAssets, setPersonalAssets] = useState('Loading...');

  // Fetch trades data from /api/trades/:id
  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/trades/${trader.id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const htmlString = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const tradesSection = doc.querySelector(
          'section.deals.deals_trader.js_mobile_deals_content'
        );
        if (!tradesSection) {
          throw new Error('Trades section not found');
        }
        const tradeRows = tradesSection.querySelectorAll('.content_row');
        const tradesData = Array.from(tradeRows)
          .map((row) => {
            const cols = row.querySelectorAll('.content_col');
            if (cols.length < 9) return null;
            const instrument = cols[0].querySelector('.title a')?.textContent.trim() || '';
            const type = cols[1].querySelector('.label')?.textContent.trim() || '';
            const volume = cols[2].querySelector('.data_value')?.textContent.trim() || '';
            const openTime = cols[3].querySelector('.data_value')?.textContent.trim() || '';
            const profit = cols[8].querySelector('.data_value')?.textContent.trim() || '';
            return { instrument, type, volume, openTime, profit };
          })
          .filter((trade) => trade !== null);
        setTrades(tradesData);
      } catch (err) {
        setErrorTrades(err.message);
      } finally {
        setLoadingTrades(false);
      }
    };
    fetchTrades();
  }, [trader.id]);

  // Fetch trader info (for personal assets) from /api/traderInfo/:id
  useEffect(() => {
    const fetchTraderInfo = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/traderInfo/${trader.id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const htmlString = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        // Look inside the trader detail resume panel for a data element that has "Personal assets" in its label.
        const dataElements = doc.querySelectorAll('.trader_detail_resume .panel_inner .data');
        let assets = 'Not available';
        dataElements.forEach((el) => {
          const label = el.querySelector('.data_label');
          if (label && label.textContent.includes('Personal assets')) {
            const value = el.querySelector('.data_value');
            if (value) {
              assets = value.textContent.trim();
            }
          }
        });
        setPersonalAssets(assets);
      } catch (error) {
        setPersonalAssets('Error');
      }
    };
    fetchTraderInfo();
  }, [trader.id]);

  // Helper to convert string values (like volume or profit) into numbers.
  const parseNumericValue = (value) => {
    const numericString = value.replace(/[^0-9.-]+/g, '');
    const parsed = parseFloat(numericString);
    return isNaN(parsed) ? 0 : parsed;
  };

  const openTradesCount = trades.length;
  const totalVolume = trades.reduce((acc, trade) => acc + parseNumericValue(trade.volume), 0);
  const totalProfit = trades.reduce((acc, trade) => acc + parseNumericValue(trade.profit), 0);

  return (
    <tr onClick={() => onSelect(trader)} style={{ cursor: 'pointer' }}>
      <td>{trader.name}</td>
      <td>{trader.id}</td>
      <td>{personalAssets}</td>
      <td>{loadingTrades ? 'Loading...' : openTradesCount}</td>
      <td>{loadingTrades ? 'Loading...' : totalVolume}</td>
      <td>{loadingTrades ? 'Loading...' : totalProfit}</td>
      <td>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onShowInfo(trader);
          }}
        >
          Info
        </button>
      </td>
    </tr>
  );
};

export default TraderRowSummary;
