import React, { useEffect, useState } from 'react'
import { TableRow, TableCell, Button } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

export default function TraderRowSummary({ trader }) {
  const [tradesSummary, setTradesSummary] = useState({
    count: 0,
    totalVolume: 0,
    totalProfit: 0,
  })
  const [personalAssets, setPersonalAssets] = useState('Loading...')
  const [loadingTrades, setLoadingTrades] = useState(true)

  const parseNumericValue = (value) => {
    const numericString = value.replace(/[^0-9.-]+/g, '')
    const parsed = parseFloat(numericString)
    return isNaN(parsed) ? 0 : parsed
  }

  useEffect(() => {
    async function fetchTrades() {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_IP}/api/trades/${trader.id}`
        )
        const data = await res.json()
        const count = data.length
        const totalVolume = data.reduce(
          (acc, t) => acc + parseNumericValue(t.volume),
          0
        )
        const totalProfit = data.reduce(
          (acc, t) => acc + parseNumericValue(t.profit),
          0
        )
        setTradesSummary({ count, totalVolume, totalProfit })
      } catch {
        // silent
      } finally {
        setLoadingTrades(false)
      }
    }
    fetchTrades()
  }, [trader.id])

  useEffect(() => {
    async function fetchInfo() {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_IP}/api/traderInfo/${trader.id}`
        )
        const info = await res.json()
        setPersonalAssets(info.personalAssets)
      } catch {
        setPersonalAssets('Error')
      }
    }
    fetchInfo()
  }, [trader.id])

  return (
    <TableRow
      component={RouterLink}
      to={`/trader/${trader.id}`}
      sx={{
        cursor: 'pointer',
        textDecoration: 'none',
        '&:hover': { backgroundColor: 'action.hover' },
      }}
    >
      <TableCell>{trader.name}</TableCell>
      <TableCell>{trader.id}</TableCell>
      <TableCell>{personalAssets}</TableCell>
      <TableCell>{loadingTrades ? 'Loading…' : tradesSummary.count}</TableCell>
      <TableCell>
        {loadingTrades ? 'Loading…' : tradesSummary.totalVolume}
      </TableCell>
      <TableCell
        sx={{
          color:
            !loadingTrades && tradesSummary.totalProfit > 0
              ? 'green'
              : !loadingTrades && tradesSummary.totalProfit < 0
              ? 'red'
              : 'inherit',
        }}
      >
        {loadingTrades ? 'Loading…' : tradesSummary.totalProfit}
      </TableCell>
      <TableCell>
        <Button
          variant='outlined'
          size='small'
          onClick={(e) => {
            e.stopPropagation()
            // TODO: open an info dialog here
          }}
        >
          Info
        </Button>
      </TableCell>
    </TableRow>
  )
}
