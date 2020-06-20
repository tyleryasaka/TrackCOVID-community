import React from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import CropFreeIcon from '@material-ui/icons/CropFree'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import { withTheme } from '@material-ui/core/styles'
import QRReader from 'react-qr-reader'
import { Translation } from 'react-i18next'
import Link from '@material-ui/core/Link'
import virusIcon from './img/virus-icon.png'
import API from './api'

const checkpointKeyLength = Number(process.env.REACT_APP_CHECKPOINT_KEY_LENGTH)
const aboutUrl = process.env.REACT_APP_ABOUT_URL

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
    const { mode, legacyMode } = this.state
    const { status, statusLoaded, urlScanState, theme } = this.props
    const riskLevelLoading = (<Translation>{t => t('statusLoadingMessage')}</Translation>)
    const riskLevelNegative = (<Translation>{t => t('standardRiskLevelMessage')}</Translation>)
    const riskLevelPositive = (<Translation>{t => t('elevatedRiskLevelMessage')}</Translation>)
    const riskLevel = statusLoaded
      ? (status
        ? riskLevelPositive
        : riskLevelNegative)
      : riskLevelLoading
    const riskLevelColor = status
      ? 'error'
      : 'success'
    const computedMode = typeof urlScanState !== 'undefined'
      ? urlScanState
      : mode
    let content
    if (computedMode === 'home') {
      content = (
        <Grid
          container
          direction='column'
          justify='center'
          alignItems='center'
        >
          <Typography variant='h5' style={{ marginTop: 25 }}>
            <Translation>{t => t('slogan')}</Translation>
          </Typography>
          <img src={virusIcon} width={200} style={{ maxWidth: '80px', marginTop: 20 }} />
          <Typography style={{ marginTop: 25 }}>
            <Translation>{t => t('welcomeMessage')}</Translation>
          </Typography>
          <Button onClick={this.joinCheckpoint.bind(this)} variant='contained' color='primary' aria-label='add' style={{ marginTop: 35 }}>
            <CropFreeIcon />
            <Translation>{t => t('joinCheckpointButton')}</Translation>
          </Button>
          <Typography style={{ marginTop: 35, marginBottom: 25 }}>
            <Translation>
              {t => t('learnMoreText')}
            </Translation>
            <Link href={aboutUrl} target='_blank'>
              {aboutUrl}
            </Link>
            .
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
          <Typography style={{ marginTop: 25 }}>
            <Translation>{t => t('joinSuccessfulMessage')}</Translation>
          </Typography>
          <Typography style={{ marginTop: 15, marginBottom: 25 }}>
            <Translation>{t => t('yourRiskLevelMessage')}</Translation>: <span style={{ color: theme.palette[riskLevelColor].main }}>{riskLevel}</span>
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

export default withTheme(Checkpoints)
