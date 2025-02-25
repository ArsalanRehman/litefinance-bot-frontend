// components/TradingHistoryComponent.js
import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Table,
  TableContainer,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material'

const TradingHistoryComponent = ({ traderId }) => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/tradingHistory/${traderId}`
        )
        if (!response.ok) {
          throw new Error('Failed to fetch trading history')
        }
        const historyData = await response.json()
        setHistory(historyData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [traderId])

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant='h5' gutterBottom>
        Trading History
      </Typography>

      {loading && (
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          minHeight='200px'
        >
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color='error' variant='body1'>
          Error: {error}
        </Typography>
      )}

      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Instrument</TableCell>
                <TableCell>Open Time</TableCell>
                <TableCell>Close Time</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Volume</TableCell>
                <TableCell>Entry</TableCell>
                <TableCell>Exit</TableCell>
                <TableCell>Profit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((trade, index) => {
                const profitValue = parseFloat(
                  trade.profit.replace(/[^0-9.-]/g, '')
                )
                return (
                  <TableRow key={index}>
                    <TableCell>{trade.instrument}</TableCell>
                    <TableCell>{trade.openTime}</TableCell>
                    <TableCell>{trade.closeTime}</TableCell>
                    <TableCell
                      sx={{
                        color: trade.type.toLowerCase().includes('buy')
                          ? 'green'
                          : trade.type.toLowerCase().includes('sell')
                          ? 'red'
                          : 'inherit',
                      }}
                    >
                      {trade.type}
                    </TableCell>
                    <TableCell>{trade.volume}</TableCell>
                    <TableCell>{trade.entry}</TableCell>
                    <TableCell>{trade.exit}</TableCell>
                    <TableCell
                      sx={{
                        color:
                          profitValue > 0
                            ? 'green'
                            : profitValue < 0
                            ? 'red'
                            : 'inherit',
                      }}
                    >
                      {trade.profit}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  )
}

export default TradingHistoryComponent
