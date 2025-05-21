import React, { useState, useEffect } from 'react'
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
} from '@mui/material'
import Skeleton from '@mui/material/Skeleton'
export default function TradesComponent({ traderId }) {
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const parseNumericValue = (value) => {
    const numericString = value.replace(/[^0-9.-]+/g, '')
    const parsed = parseFloat(numericString)
    return isNaN(parsed) ? 0 : parsed
  }

  useEffect(() => {
    async function fetchTrades() {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_IP}/api/trades/${traderId}`
        )
        if (!res.ok) throw new Error('Network response was not ok')
        setTrades(await res.json())
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchTrades()
  }, [traderId])

  const totalVolume = trades.reduce(
    (acc, t) => acc + parseNumericValue(t.volume),
    0
  )
  const totalProfit = trades.reduce(
    (acc, t) => acc + parseNumericValue(t.profit),
    0
  )

  if (loading) {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {[...Array(7)].map((__, j) => (
                  <TableCell key={j}>
                    <Skeleton />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  if (error) {
    return <Alert severity='error'>Error: {error}</Alert>
  }

  return (
    <>
      <Typography variant='h5' gutterBottom>
        Open Trades for {traderId}
      </Typography>
      {trades.length === 0 ? (
        <Typography>No trades found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Instrument</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Volume</TableCell>
                <TableCell>Open Price</TableCell>
                <TableCell>Current Price</TableCell>
                <TableCell>Open Time</TableCell>
                <TableCell>P/L</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trades.map((trade, idx) => (
                <TableRow key={idx}>
                  <TableCell>{trade.instrument}</TableCell>
                  <TableCell>{trade.type}</TableCell>
                  <TableCell>{trade.volume}</TableCell>
                  <TableCell>{trade.openPrice}</TableCell>
                  <TableCell>{trade.currentPrice}</TableCell>
                  <TableCell>{trade.openTime}</TableCell>
                  <TableCell>{trade.profit}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>
                  Totals
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{totalVolume}</TableCell>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell sx={{ fontWeight: 'bold' }}>{totalProfit}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  )
}
