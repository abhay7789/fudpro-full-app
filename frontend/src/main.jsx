import React from 'react'
import ReactDOM from 'react-dom/client'
import { MantineProvider, createTheme } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { ModalsProvider } from '@mantine/modals'
import { BrowserRouter } from 'react-router-dom'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import App from './App.jsx'
import './index.css'
import './i18n'

const theme = createTheme({
  primaryColor: 'brand',
  colors: {
    brand: [
      '#fff0e4',
      '#ffe0c7',
      '#ffc099',
      '#ff9e68',
      '#fe813d',
      '#fe6d1e',
      '#fc8019',
      '#e45100',
      '#cb4700',
      '#b13c00',
    ],
    'premium-orange': [
      '#fff0e4',
      '#ffe0c7',
      '#ffc099',
      '#ff9e68',
      '#fe813d',
      '#fe6d1e',
      '#fc8019',
      '#e45100',
      '#cb4700',
      '#b13c00',
    ],
  },
  fontFamily: 'Inter, sans-serif',
  headings: { fontFamily: 'Outfit, sans-serif' },
  defaultRadius: 'md',
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <ModalsProvider>
        <Notifications position="top-right" zIndex={2000} />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ModalsProvider>
    </MantineProvider>
  </React.StrictMode>,
)

