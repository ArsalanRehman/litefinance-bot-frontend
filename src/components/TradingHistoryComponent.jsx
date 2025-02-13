import React, { useState, useEffect } from 'react'
import {
  Container,
  Button,
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

const TradingHistoryComponent = ({ traderId, onBack }) => {
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
        const htmlString = await response.text()
        const parser = new DOMParser()
        const doc = parser.parseFromString(htmlString, 'text/html')

        // Find the container for the trading history.
        const historySection = doc.querySelector('#trades-history')
        if (!historySection) {
          throw new Error('Trading history section not found')
        }

        // Grab all rows of history (each row is a <div> with class "content_row")
        const rows = historySection.querySelectorAll('.content_row')

        const historyData = Array.from(rows)
          .map((row) => {
            const cols = row.querySelectorAll('.content_col')
            if (cols.length < 8) return null // Skip if unexpected

            // Column 0: Instrument (try to get the text of the <a> inside .title)
            const instrumentAnchor = cols[0].querySelector('.title a')
            const instrument = instrumentAnchor
              ? instrumentAnchor.textContent.trim()
              : ''

            // Column 1: Opening date and time
            const openTimeEl = cols[1].querySelector('.data_value') || cols[1]
            const openTime = openTimeEl ? openTimeEl.textContent.trim() : ''

            // Column 2: Closing date and time
            const closeTimeEl = cols[2].querySelector('.data_value') || cols[2]
            const closeTime = closeTimeEl ? closeTimeEl.textContent.trim() : ''

            // Column 3: Type (Buy/Sell)
            const typeEl = cols[3].querySelector('.label') || cols[3]
            const type = typeEl ? typeEl.textContent.trim() : ''

            // Column 4: Trade volume
            const volumeEl = cols[4].querySelector('.data_value') || cols[4]
            const volume = volumeEl ? volumeEl.textContent.trim() : ''

            // Column 5: Entry Point
            const entryEl = cols[5].querySelector('.data_value') || cols[5]
            const entry = entryEl ? entryEl.textContent.trim() : ''

            // Column 6: Exit
            const exitEl = cols[6].querySelector('.data_value') || cols[6]
            const exit = exitEl ? exitEl.textContent.trim() : ''

            // Column 7: Profit
            const profitEl = cols[7].querySelector('.data_value') || cols[7]
            const profit = profitEl ? profitEl.textContent.trim() : ''

            return {
              instrument,
              openTime,
              closeTime,
              type,
              volume,
              entry,
              exit,
              profit,
            }
          })
          .filter((item) => item !== null)

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
      <Button
        variant='contained'
        color='primary'
        onClick={onBack}
        sx={{ mb: 2 }}
      >
        Back
      </Button>
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
                // Parse the profit value from the string, removing any non-numeric characters.
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
