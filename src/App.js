import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Container } from '@mui/material'
import TraderListPage from './pages/TraderListPage'
import TraderDetailPage from './pages/TraderDetailPage'
import NotFoundPage from './pages/NotFoundPage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6'>Trader Dashboard</Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path='/' element={<TraderListPage />} />
          <Route path='/trader/:id/*' element={<TraderDetailPage />} />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </Container>
    </BrowserRouter>
  )
}
