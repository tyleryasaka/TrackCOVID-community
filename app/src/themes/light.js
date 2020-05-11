import { createMuiTheme } from '@material-ui/core/styles'

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#2979ff'
    },
    secondary: {
      main: '#3f51b5'
    }
  }
})

export default theme
