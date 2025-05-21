import React from 'react'
import {
  Routes,
  Route,
  useParams,
  Navigate,
  Link as RouterLink,
  useLocation,
} from 'react-router-dom'
import {
  Box,
  Button,
  Breadcrumbs,
  Typography,
  Link as MUILink,
} from '@mui/material'
import TradesComponent from '../components/TradesComponent'
import TradingHistoryComponent from '../components/TradingHistoryComponent'

export default function TraderDetailPage() {
  const { id } = useParams()
  const location = useLocation()
  const tab = location.pathname.includes('history') ? 'history' : 'open'

  return (
    <>
      <Breadcrumbs sx={{ mb: 2 }}>
        <MUILink component={RouterLink} to='/'>
          Home
        </MUILink>
        <Typography color='text.primary'>Trader {id}</Typography>
      </Breadcrumbs>

      <Box sx={{ mb: 2 }}>
        <Button
          component={RouterLink}
          to={`/trader/${id}/open`}
          variant={tab === 'open' ? 'contained' : 'outlined'}
          sx={{ mr: 1 }}
        >
          Open Trades
        </Button>
        <Button
          component={RouterLink}
          to={`/trader/${id}/history`}
          variant={tab === 'history' ? 'contained' : 'outlined'}
        >
          Trading History
        </Button>
      </Box>

      <Routes>
        <Route path='' element={<Navigate to='open' replace />} />
        <Route path='open' element={<TradesComponent traderId={id} />} />
        <Route
          path='history'
          element={<TradingHistoryComponent traderId={id} />}
        />
      </Routes>
    </>
  )
}
