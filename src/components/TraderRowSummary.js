// components/TraderRowSummary.js
import React, { useEffect, useState } from 'react'
import { TableRow, TableCell, Button } from '@mui/material'

const TraderRowSummary = ({ trader, onSelect, onShowInfo }) => {
  const [tradesSummary, setTradesSummary] = useState({
    count: 0,
    totalVolume: 0,
    totalProfit: 0,
  })
  const [personalAssets, setPersonalAssets] = useState('Loading...')
  const [loadingTrades, setLoadingTrades] = useState(true)

  // Helper to convert strings to numbers.
  const parseNumericValue = (value) => {
    const numericString = value.replace(/[^0-9.-]+/g, '')
    const parsed = parseFloat(numericString)
    return isNaN(parsed) ? 0 : parsed
  }

  // Fetch trades summary data.
  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const response = await fetch(
          `http://${process.env.REACT_APP_IP}/api/trades/${trader.id}`
        )
        
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const tradesData = await response.json()
        const count = tradesData.length
        const totalVolume = tradesData.reduce(
          (acc, trade) => acc + parseNumericValue(trade.volume),
          0
        )
        const totalProfit = tradesData.reduce(
          (acc, trade) => acc + parseNumericValue(trade.profit),
          0
        )
        setTradesSummary({ count, totalVolume, totalProfit })
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingTrades(false)
      }
    }

    fetchTrades()
  }, [trader.id])

  // Fetch trader info for personal assets.
  useEffect(() => {
    const fetchTraderInfo = async () => {
      try {
        const response = await fetch(
          `http://${process.env.REACT_APP_IP}/api/traderInfo/${trader.id}`
        )
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const info = await response.json()
        setPersonalAssets(info.personalAssets)
      } catch (error) {
        setPersonalAssets('Error')
      }
    }

    fetchTraderInfo()
  }, [trader.id])

  return (
    <TableRow onClick={() => onSelect(trader)} sx={{ cursor: 'pointer' }}>
      <TableCell>{trader.name}</TableCell>
      <TableCell>{trader.id}</TableCell>
      <TableCell>{personalAssets}</TableCell>
      <TableCell>
        {loadingTrades ? 'Loading...' : tradesSummary.count}
      </TableCell>
      <TableCell>
        {loadingTrades ? 'Loading...' : tradesSummary.totalVolume}
      </TableCell>
      <TableCell
        sx={{
          color: loadingTrades
            ? 'inherit'
            : tradesSummary.totalProfit > 0
            ? 'green'
            : tradesSummary.totalProfit < 0
            ? 'red'
            : 'inherit',
        }}
      >
        {loadingTrades ? 'Loading...' : tradesSummary.totalProfit}
      </TableCell>
      <TableCell>
        <Button
          variant='outlined'
          size='small'
          onClick={(e) => {
            e.stopPropagation()
            onShowInfo(trader)
          }}
        >
          Info
        </Button>
      </TableCell>
    </TableRow>
  )
}

export default TraderRowSummary
