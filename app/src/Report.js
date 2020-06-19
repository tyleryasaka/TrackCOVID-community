import React from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import GetAppIcon from '@material-ui/icons/GetApp'
import { withTheme } from '@material-ui/core/styles'
import { Translation } from 'react-i18next'
import reportIcon from './img/report-icon.png'
import API from './api'

const initialState = {
  exposureStatus: false,
  loaded: false,
  mode: 'default'
}

class Report extends React.Component {
  constructor () {
    super()
    this.state = initialState
  }

  async reset () {
    this.setState(initialState)
  }

  async downloadHistory () {
    const checkpoints = await API.exportCheckpoints()
    var dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(checkpoints))
    var dlAnchorElem = document.getElementById('downloadAnchorElem')
    dlAnchorElem.setAttribute('href', dataStr)
    dlAnchorElem.setAttribute('download', 'checkpoints.json')
    dlAnchorElem.click()
  }

  render () {
    const { mode } = this.state
    return (
      <Grid
        container
      >
        {
          ((mode === 'default') && (
            <Grid
              container
              direction='column'
              justify='center'
              alignItems='center'
            >
              <img src={reportIcon} width={200} style={{ maxWidth: '80px', marginTop: 20 }} />
              <Typography style={{ marginTop: 25 }}>
                <Translation>{t => t('aboutReportMessage')}</Translation>
              </Typography>
              <Button onClick={this.downloadHistory.bind(this)} variant='contained' color='primary' aria-label='add' style={{ marginTop: 25 }}>
                <GetAppIcon />
                <Translation>{t => t('downloadHistoryButton')}</Translation>
              </Button>
              <a id='downloadAnchorElem' href='/' style={{ display: 'none' }}><Translation>{t => t('downloadHistoryButton')}</Translation></a>
            </Grid>
          ))
        }
      </Grid>
    )
  }
}

export default withTheme(Report)
