import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core/styles'
import App from './App'
import lightTheme from './themes/light'
import darkTheme from './themes/dark'
import './i18n'

const theme = process.env.REACT_APP_THEME === 'dark'
  ? darkTheme
  : lightTheme

const Loading = () => {
  return (
    <div />
  )
}

ReactDOM.render(
  <ThemeProvider theme={theme}>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    <Suspense fallback={<Loading />}>
      <App />
    </Suspense>
  </ThemeProvider>,
  document.querySelector('#root')
)
