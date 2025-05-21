import React from 'react'
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import TraderRowSummary from '../components/TraderRowSummary'

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

export default function TraderListPage() {
  return (
    <>
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
              <TableCell>Open Trades</TableCell>
              <TableCell>Total Volume</TableCell>
              <TableCell>Total P/L</TableCell>
              <TableCell>Info</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {traderList.map((trader) => (
              <TraderRowSummary key={trader.id} trader={trader} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
