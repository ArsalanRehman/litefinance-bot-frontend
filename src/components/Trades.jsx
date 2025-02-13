import React, { useEffect, useState } from 'react'
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
        // Use the proxy endpoint instead of the original URL.
        const response = await fetch(
          `http://localhost:5000/api/trades/${traderId}`
        )
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const htmlString = await response.text()

        // Parse the HTML string into a document
        const parser = new DOMParser()
        const doc = parser.parseFromString(htmlString, 'text/html')

        // Find the section containing the trades
        const tradesSection = doc.querySelector(
          'section.deals.deals_trader.js_mobile_deals_content'
        )
        if (!tradesSection) {
          throw new Error('Trades section not found')
        }

        // Select all rows representing individual trades
        const tradeRows = tradesSection.querySelectorAll('.content_row')

        // Extract trade details (Instrument, Type, Volume, Open Time, Profit/Loss)
        const tradesData = Array.from(tradeRows)
          .map((row) => {
            const cols = row.querySelectorAll('.content_col')
            // Ensure that the row contains the expected columns
            if (cols.length < 9) return null

            const instrument =
              cols[0].querySelector('.title a')?.textContent.trim() || ''
            const type =
              cols[1].querySelector('.label')?.textContent.trim() || ''
            const volume =
              cols[2].querySelector('.data_value')?.textContent.trim() || ''
            const openTime =
              cols[3].querySelector('.data_value')?.textContent.trim() || ''
            const profit =
              cols[8].querySelector('.data_value')?.textContent.trim() || ''

            return { instrument, type, volume, openTime, profit }
          })
          .filter((trade) => trade !== null)

        setTrades(tradesData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTrades()
  }, [traderId])

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

  // Helper function to parse a string value into a number.
  // This removes any non-numeric characters (except minus sign and dot).
  const parseNumericValue = (value) => {
    const numericString = value.replace(/[^0-9.-]+/g, '')
    const parsed = parseFloat(numericString)
    return isNaN(parsed) ? 0 : parsed
  }

  // Calculate totals for volume and profit
  const totalVolume = trades.reduce((acc, trade) => {
    return acc + parseNumericValue(trade.volume)
  }, 0)

  const totalProfit = trades.reduce((acc, trade) => {
    return acc + parseNumericValue(trade.profit)
  }, 0)

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
                <TableCell>Open Time</TableCell>
                <TableCell>Profit/Loss</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trades.map((trade, index) => (
                <TableRow key={index}>
                  <TableCell>{trade.instrument}</TableCell>
                  <TableCell>{trade.type}</TableCell>
                  <TableCell>{trade.volume}</TableCell>
                  <TableCell>{trade.openTime}</TableCell>
                  <TableCell>{trade.profit}</TableCell>
                </TableRow>
              ))}
              {/* Additional row for totals */}
              <TableRow>
                <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>
                  Totals
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{totalVolume}</TableCell>
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
