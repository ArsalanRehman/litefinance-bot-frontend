// components/TradesComponent.js
import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'

const TradesComponent = ({ traderId, name }) => {
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/trades/${traderId}`
        )
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const tradesData = await response.json()
        setTrades(tradesData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTrades()
  }, [traderId])

  // Helper function to parse numeric strings.
  const parseNumericValue = (value) => {
    const numericString = value.replace(/[^0-9.-]+/g, '')
    const parsed = parseFloat(numericString)
    return isNaN(parsed) ? 0 : parsed
  }

  const totalVolume = trades.reduce(
    (acc, trade) => acc + parseNumericValue(trade.volume),
    0
  )
  const totalProfit = trades.reduce(
    (acc, trade) => acc + parseNumericValue(trade.profit),
    0
  )

  if (loading) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='200px'
      >
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Container>
        <Typography color='error' variant='h6'>
          Error: {error}
        </Typography>
      </Container>
    )
  }

  return (
    <Container>
      <Typography variant='h5' gutterBottom>
        Open Trades for{' '}
        <strong style={{ color: 'green' }}>
          {name} - {traderId}
        </strong>
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
                <TableCell>Profit / Loss</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trades.map((trade, index) => (
                <TableRow key={index}>
                  <TableCell>{trade.instrument}</TableCell>
                  <TableCell>{trade.type}</TableCell>
                  <TableCell>{trade.volume}</TableCell>
                  <TableCell>{trade.openPrice}</TableCell>
                  <TableCell>{trade.currentPrice}</TableCell>
                  <TableCell>{trade.openTime}</TableCell>
                  <TableCell>{trade.profit}</TableCell>
                </TableRow>
              ))}
              {/* Totals row */}
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
    </Container>
  )
}

export default TradesComponent
