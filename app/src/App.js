import React, { Suspense } from 'react'
import Container from '@material-ui/core/Container'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import CropFree from '@material-ui/icons/CropFree'
import Face from '@material-ui/icons/Face'
import PinDropIcon from '@material-ui/icons/PinDrop'
import InfoIcon from '@material-ui/icons/Info'
import PersonIcon from '@material-ui/icons/Person'
import ReportIcon from '@material-ui/icons/Description'
import AppBar from '@material-ui/core/AppBar'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import CheckpointsPage from './Checkpoints'
import ExposuresPage from './Exposures'
import ReportPage from './Report'
import StatusAlert from './StatusAlert'
import API from './api'
import { Translation } from 'react-i18next'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import i18n from './i18n'
import languageNames from './languages'
import logo from './img/logo.svg'

const oneSecond = 1000
const pollingTime = 30 * oneSecond
const checkpointKeyLength = Number(process.env.REACT_APP_CHECKPOINT_KEY_LENGTH)
const adminDomain = process.env.REACT_APP_ADMIN_DOMAIN
const serverDomain = process.env.REACT_APP_SERVER_DOMAIN
const aboutUrl = process.env.REACT_APP_ABOUT_URL
const isUsingLocize = Boolean(process.env.REACT_APP_LOCIZE_PRODUCT_ID)

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
      urlScanState: undefined,
      languages: []
    }
  }

  componentDidMount () {
    this.checkUrl().then(() => {
      this.updateStatus()
      setInterval(this.updateStatus.bind(this), pollingTime)
    })
    if (isUsingLocize) {
      i18n.services.backendConnector.backend.getLanguages((err, data) => {
        if (err) {
          console.error(err)
        } else {
          const languages = Object.keys(data).map(languageCode => {
            return {
              code: languageCode,
              name: languageNames[languageCode] || data[languageCode].name
            }
          })
          const currentLanguage = i18n.language
          this.setState({ languages, currentLanguage })
        }
      })
    } else {
      const languages = {
        code: 'en',
        name: 'English'
      }
      this.setState({ languages, currentLanguage: 'en' })
    }
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
    const { currentTab, status, statusLoaded, isDrawerOpen, currentLanguage, urlScanState, languages } = this.state
    const CurrentPage = (currentTab === 'checkpoints')
      ? CheckpointsPage
      : (currentTab === 'status')
        ? ExposuresPage
        : ReportPage

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
                <img src={logo} width={30} height={30} style={{ width: 30 }} />
              </IconButton>
              <Typography variant='h6' component='h1' style={{ flexGrow: 1, fontFamily: '"Open Sans", sans-serif', fontWeight: 'bold' }}>
                {process.env.REACT_APP_NAME}
              </Typography>
              {languages.length > 1 && (
                <Container style={{ textAlign: 'right' }}>
                  <div>
                    <FormControl>
                      <Select
                        labelId='language-select-label'
                        id='language-select'
                        value={currentLanguage}
                        onChange={this.onSelectLanguage.bind(this)}
                      >
                        { languages.map((language, index) => {
                          return (
                            <MenuItem key={index} value={language.code}>{language.name}</MenuItem>
                          )
                        }) }
                      </Select>
                    </FormControl>
                  </div>
                </Container>
              )}
            </Toolbar>
          </Container>
        </AppBar>
        <Container maxWidth='sm' style={{ marginBottom: 76 }}>
          <Suspense fallback='loading'>
            <StatusAlert status={status} onExposuresTab={currentTab === 'status'} />
            <CurrentPage status={status} statusLoaded={statusLoaded} urlScanState={urlScanState} resetUrlScanState={this.resetUrlScanState.bind(this)} />
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
          <BottomNavigationAction label=<Translation>{t => t('reportTab')}</Translation> value='report' icon={<ReportIcon />} />
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
            <ListItemLink style={{ width: 250 }} href={`${serverDomain}/checkpoint`} target='_blank'>
              <ListItemIcon>
                <PinDropIcon />
              </ListItemIcon>
              <ListItemText primary=<Translation>{t => t('menuCheckpointButton')}</Translation> />
            </ListItemLink>
            <ListItemLink style={{ width: 250 }} href={`${adminDomain}/admin`} target='_blank'>
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
