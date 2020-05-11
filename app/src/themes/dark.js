import { createMuiTheme } from '@material-ui/core/styles'

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#82b1ff'
    },
    secondary: {
      main: '#3f51b5'
    }
  }
})

export default theme
