import React from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import CropFreeIcon from '@material-ui/icons/CropFree'
import HomeIcon from '@material-ui/icons/Home'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import StopIcon from '@material-ui/icons/Stop'
import QRCode from 'qrcode.react'
import QRReader from 'react-qr-reader'
import { Translation } from 'react-i18next'
import API from './api'

const checkpointKeyLength = Number(process.env.REACT_APP_CHECKPOINT_KEY_LENGTH)

const initialState = {
  mode: 'home',
  checkpointKey: null,
  checkpointTime: null,
  legacyMode: false
}

class Checkpoints extends React.Component {
  constructor () {
    super()
    this.state = initialState
  }

  async reset () {
    this.setState(initialState)
    this.props.resetUrlScanState()
  }

  async becomeHost () {
    try {
      const { key, timestamp } = await API.hostCheckpoint()
      this.setState({
        mode: 'host',
        checkpointKey: key,
        checkpointTime: timestamp
      })
    } catch (e) {
      console.error(e)
      window.alert('There was an unexpected error. Please leave feedback so the developer can fix this.')
    }
  }

  async endHost () {
    // TODO confirmation
    this.reset()
  }

  async joinCheckpoint () {
    this.setState({
      mode: 'join'
    })
  }

  async handleScan (data) {
    if (data) {
      // QR code is a url
      const urlSplit = data.split('?checkpoint=')
      if ((urlSplit.length === 2) && (urlSplit[1].length === checkpointKeyLength)) {
        await API.joinCheckpoint(urlSplit[1])
        this.setState({ mode: 'scan-success' })
        setTimeout(() => this.reset(), 10000) // automatically go back to main screen after 10 seconds
      } else {
        this.setState({ mode: 'scan-error' })
      }
    }
  }

  handleScanError () {
    this.setState({ legacyMode: true })
  }

  openImageDialog () {
    this.refs.checkpointQR.openImageDialog()
  }

  render () {
    const { mode, checkpointKey, checkpointTime, legacyMode } = this.state
    const { urlScanState } = this.props
    const computedMode = typeof urlScanState !== 'undefined'
      ? urlScanState
      : mode
    const qrValue = `${window.location.href}?checkpoint=${checkpointKey}`
    let content
    if (computedMode === 'home') {
      content = (
        <Grid
          container
          direction='column'
          justify='center'
          alignItems='center'
        >
          <Typography style={{ marginTop: 25, marginBottom: 25 }}>
            <Translation>{t => t('welcomeMessage')}</Translation>
          </Typography>
          <Button onClick={this.joinCheckpoint.bind(this)} variant='contained' color='primary' aria-label='add' style={{ marginTop: 50 }}>
            <CropFreeIcon />
            <Translation>{t => t('joinCheckpointButton')}</Translation>
          </Button>
          <Button onClick={this.becomeHost.bind(this)} variant='contained' color='secondary' aria-label='add' style={{ marginTop: 50 }}>
            <HomeIcon />
            <Translation>{t => t('hostCheckpointButton')}</Translation>
          </Button>
        </Grid>
      )
    } else if (computedMode === 'host') {
      content = (
        <Grid
          container
          direction='column'
          justify='center'
          alignItems='center'
        >
          <Typography style={{ marginTop: 25, marginBottom: 25 }}>
            <Translation>{t => t('hostingCheckpointMessage')}</Translation>
          </Typography>
          <QRCode value={qrValue} size={200} style={{ backgroundColor: '#fff', padding: 20 }} />
          <Button onClick={this.endHost.bind(this)} variant='contained' color='primary' aria-label='add' style={{ marginTop: 25 }}>
            <StopIcon />
            <Translation>{t => t('endCheckpointButton')}</Translation>
          </Button>
          <Typography style={{ marginTop: 25 }}>
            <Translation>{t => t('checkpointCreatedMessage')}</Translation> {new Date(checkpointTime).toString()}
          </Typography>
        </Grid>
      )
    } else if (computedMode === 'join') {
      content = (
        <Grid
          container
          direction='column'
          justify='center'
          alignItems='center'
        >
          <QRReader
            ref='checkpointQR'
            delay={300}
            onError={this.handleScanError.bind(this)}
            onScan={this.handleScan.bind(this)}
            style={{ width: legacyMode ? 0 : '100%' }}
            facingMode='environment'
            legacyMode={legacyMode}
          />
          { legacyMode && (
            <Typography style={{ marginTop: 25 }}>
              <Translation>{t => t('noCameraPermissionMessage')}</Translation>
            </Typography>
          ) }
          <Button onClick={this.openImageDialog.bind(this)} variant='contained' color='primary' aria-label='add' style={{ marginTop: 25 }}>
            <Translation>{t => t('takePictureButton')}</Translation>
          </Button>
          <Button onClick={this.reset.bind(this)} variant='contained' color='primary' aria-label='add' style={{ marginTop: 25 }}>
            <ArrowBackIcon />
            <Translation>{t => t('backButton')}</Translation>
          </Button>
        </Grid>
      )
    } else if (computedMode === 'scan-success') {
      content = (
        <Grid
          container
          direction='column'
          justify='center'
          alignItems='center'
        >
          <Typography style={{ marginTop: 25, marginBottom: 25 }}>
            <Translation>{t => t('joinSuccessfulMessage')}</Translation>
          </Typography>
          <Button onClick={this.reset.bind(this)} variant='contained' color='primary' aria-label='add' style={{ marginTop: 25 }}>
            <ArrowBackIcon />
            <Translation>{t => t('backButton')}</Translation>
          </Button>
        </Grid>
      )
    } else if (computedMode === 'scan-error') {
      content = (
        <Grid
          container
          direction='column'
          justify='center'
          alignItems='center'
        >
          <Typography style={{ marginTop: 25, marginBottom: 25 }}>
            <Translation>{t => t('scanErrorMessage')}</Translation>
          </Typography>
          <Button onClick={this.reset.bind(this)} variant='contained' color='primary' aria-label='add' style={{ marginTop: 25 }}>
            <ArrowBackIcon />
            <Translation>{t => t('backButton')}</Translation>
          </Button>
        </Grid>
      )
    }
    return content
  }
}

export default Checkpoints
