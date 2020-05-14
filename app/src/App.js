import React, { Suspense } from 'react'
import Container from '@material-ui/core/Container'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import CropFree from '@material-ui/icons/CropFree'
import Face from '@material-ui/icons/Face'
import MenuIcon from '@material-ui/icons/Menu'
import InfoIcon from '@material-ui/icons/Info'
import RoomIcon from '@material-ui/icons/Room'
import PersonIcon from '@material-ui/icons/Person'
import AppBar from '@material-ui/core/AppBar'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import CheckpointsPage from './Checkpoints'
import ExposuresPage from './Exposures'
import StatusAlert from './StatusAlert'
import API from './api'
import { Translation } from 'react-i18next'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import i18n from './i18n'
import supportedLanguages from './languages'

const oneSecond = 1000
const pollingTime = 30 * oneSecond
const checkpointKeyLength = Number(process.env.REACT_APP_CHECKPOINT_KEY_LENGTH)

function ListItemLink (props) {
  return <ListItem button component='a' {...props} />
}

class App extends React.Component {
  constructor () {
    super()
    this.state = {
      currentTab: 'checkpoints',
      status: false,
      statusLoaded: false,
      isDrawerOpen: false,
      currentLanguage: i18n.language,
      urlScanState: undefined
    }
  }

  componentDidMount () {
    this.checkUrl().then(() => {
      this.updateStatus()
      setInterval(this.updateStatus.bind(this), pollingTime)
    })
  }

  async checkUrl () {
    const urlParams = new URLSearchParams(window.location.search)
    const checkpointKey = urlParams.get('checkpoint')
    if (checkpointKey) {
      if (checkpointKey.length === checkpointKeyLength) {
        try {
          await API.joinCheckpoint(checkpointKey)
          this.setState({ urlScanState: 'scan-success' })
          window.history.replaceState(null, null, window.location.pathname)
        } catch (e) {
          console.error(e)
          this.setState({ urlScanState: 'scan-error' })
          window.history.replaceState(null, null, window.location.pathname)
        }
      } else {
        this.setState({ urlScanState: 'scan-error' })
        window.history.replaceState(null, null, window.location.pathname)
      }
    }
  }

  async updateStatus () {
    try {
      const exposureStatus = await API.getExposureStatus()
      this.setState({ status: exposureStatus, statusLoaded: true })
    } catch (e) {
      console.error(e)
      this.setState({ status: false, statusLoaded: false })
    }
  }

  resetUrlScanState () {
    this.setState({ urlScanState: undefined })
  }

  onChangeTab (event, newVal) {
    this.setState({ currentTab: newVal })
  }

  openDrawer () {
    this.setState({ isDrawerOpen: true })
  }

  closeDrawer () {
    this.setState({ isDrawerOpen: false })
  }

  onSelectLanguage (event) {
    i18n.changeLanguage(event.target.value)
    this.setState({ currentLanguage: event.target.value })
  }

  render () {
    const { currentTab, status, statusLoaded, isDrawerOpen, currentLanguage, urlScanState } = this.state
    const CurrentPage = (currentTab === 'checkpoints')
      ? CheckpointsPage
      : ExposuresPage
    const aboutUrl = process.env.REACT_APP_ABOUT_URL

    return (
      <div>
        <AppBar position='static' color='secondary'>
          <Container maxWidth='sm' style={{ flexGrow: 1 }}>
            <Toolbar>
              <IconButton
                edge='start'
                color='inherit'
                aria-label='open drawer'
                onClick={this.openDrawer.bind(this)}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant='h6' component='h1' style={{ flexGrow: 1 }}>
                {process.env.REACT_APP_NAME}
              </Typography>
            </Toolbar>
          </Container>
        </AppBar>
        <Container maxWidth='sm' style={{ marginBottom: 76 }}>
          <Suspense fallback='loading'>
            <StatusAlert status={status} onExposuresTab={currentTab === 'status'} />
            <CurrentPage status={status} statusLoaded={statusLoaded} urlScanState={urlScanState} resetUrlScanState={this.resetUrlScanState.bind(this)} />
            {supportedLanguages.length > 1 && (
              <Container style={{ textAlign: 'center' }}>
                <div>
                  <FormControl style={{ marginTop: '20px' }}>
                    <Select
                      labelId='language-select-label'
                      id='language-select'
                      value={currentLanguage}
                      onChange={this.onSelectLanguage.bind(this)}
                    >
                      { supportedLanguages.map(language => {
                        return (
                          <MenuItem value={language.id}>{language.name}</MenuItem>
                        )
                      }) }
                    </Select>
                  </FormControl>
                </div>
              </Container>
            )}
          </Suspense>
        </Container>
        <BottomNavigation
          value={currentTab}
          style={{
            width: '100%',
            position: 'fixed',
            bottom: 0
          }}
          onChange={this.onChangeTab.bind(this)}
          showLabels
        >
          <BottomNavigationAction label={<Translation>{t => t('checkpointsTab')}</Translation>} value='checkpoints' icon={<CropFree />} />
          <BottomNavigationAction label=<Translation>{t => t('statusTab')}</Translation> value='status' icon={<Face />} />
        </BottomNavigation>
        <SwipeableDrawer
          open={isDrawerOpen}
          onOpen={() => {}}
          onClose={this.closeDrawer.bind(this)}
        >
          <List component='nav' aria-label='settings'>
            <ListItemLink style={{ width: 250 }} href={aboutUrl} target='_blank'>
              <ListItemIcon>
                <InfoIcon />
              </ListItemIcon>
              <ListItemText primary=<Translation>{t => t('menuAboutButton')}</Translation> />
            </ListItemLink>
            <ListItemLink style={{ width: 250 }} href='/checkpoint' target='_blank'>
              <ListItemIcon>
                <RoomIcon />
              </ListItemIcon>
              <ListItemText primary=<Translation>{t => t('menuCheckpointButton')}</Translation> />
            </ListItemLink>
            <ListItemLink style={{ width: 250 }} href='/admin' target='_blank'>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary=<Translation>{t => t('menuAdminButton')}</Translation> />
            </ListItemLink>
          </List>
        </SwipeableDrawer>
      </div>
    )
  }
}

export default App
