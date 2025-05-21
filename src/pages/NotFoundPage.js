import React from 'react'
import { Typography, Box } from '@mui/material'

export default function NotFoundPage() {
  return (
    <Box textAlign='center' mt={8}>
      <Typography variant='h3' gutterBottom>
        404
      </Typography>
      <Typography variant='h6'>Page not found.</Typography>
    </Box>
  )
}
