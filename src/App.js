import React, { useState } from 'react'
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Box,
} from '@mui/material'
import TradesComponent from './components/Trades'
import TradingHistoryComponent from './components/TradingHistoryComponent'
import TraderRowSummary from './components/TraderRowSummary'

function App() {
  const traderList = [
    { name: 'MRT', id: 3417809 },
    { name: 'MRT 2', id: 2924129 },
    { name: 'Blue Whale Capital', id: 1264293 },
    { name: 'Mafia Invest', id: 2634386 },
    { name: 'TradingSCapital', id: 1143035 },
    { name: 'Ichi', id: 2632660 },
    { name: 'Phamhien', id: 941691 },
    { name: 'Formula1', id: 2998600 },
  ]

  const [selectedTrader, setSelectedTrader] = useState(null)
  const [showHistory, setShowHistory] = useState(false)

  // When no trader is selected, show the summary table.
  if (!selectedTrader) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant='h4' gutterBottom>
          Trader List
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Trader Name</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Personal Assets</TableCell>
                <TableCell>Total Open Trades</TableCell>
                <TableCell>Total Volume</TableCell>
                <TableCell>Total Profit / Loss</TableCell>
                <TableCell>Info</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {traderList.map((trader, index) => (
                <TraderRowSummary
                  key={index}
                  trader={trader}
                  onSelect={setSelectedTrader}
                  onShowInfo={() => {}}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    )
  }

  // When a trader is selected, allow toggling between Open Trades and Trading History.
  return (
    <Container sx={{ mt: 4 }}>
      <Button
        variant='contained'
        onClick={() => {
          setSelectedTrader(null)
          setShowHistory(false)
        }}
        sx={{ mb: 2 }}
      >
        Back to Trader List
      </Button>
      <Typography variant='h4' gutterBottom>
        {selectedTrader.name}
      </Typography>
      <Box sx={{ my: 2 }}>
        <Button
          variant={showHistory ? 'outlined' : 'contained'}
          onClick={() => setShowHistory(false)}
          sx={{ mr: 1 }}
        >
          Open Trades
        </Button>
        <Button
          variant={showHistory ? 'contained' : 'outlined'}
          onClick={() => setShowHistory(true)}
        >
          Trading History
        </Button>
      </Box>
      {showHistory ? (
        <TradingHistoryComponent traderId={selectedTrader.id} />
      ) : (
        <TradesComponent
          traderId={selectedTrader.id}
          name={selectedTrader.name}
        />
      )}
    </Container>
  )
}

export default App
