import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { withTheme } from '@material-ui/core/styles'
import { Translation } from 'react-i18next'
import distanceIcon from './img/keep-distance.png'
import stayHomeIcon from './img/stay-home.png'

const initialState = {
  exposureStatus: false,
  loaded: false,
  mode: 'default'
}

class Exposures extends React.Component {
  constructor () {
    super()
    this.state = initialState
  }

  async reset () {
    this.setState(initialState)
  }

  render () {
    const { status, statusLoaded, theme } = this.props
    const { mode } = this.state
    const statusMessageLoading = (<Translation>{t => t('statusLoadingMessage')}</Translation>)
    const statusMessageNegative = (<Translation>{t => t('statusNegativeMessage')}</Translation>)
    const statusMessagePositive = (<Translation>{t => t('statusPositiveMessage')}</Translation>)
    const riskLevelLoading = (<Translation>{t => t('statusLoadingMessage')}</Translation>)
    const riskLevelNegative = (<Translation>{t => t('standardRiskLevelMessage')}</Translation>)
    const riskLevelPositive = (<Translation>{t => t('elevatedRiskLevelMessage')}</Translation>)
    const statusMessage = statusLoaded
      ? (status
        ? statusMessagePositive
        : statusMessageNegative)
      : statusMessageLoading
    const riskLevel = statusLoaded
      ? (status
        ? riskLevelPositive
        : riskLevelNegative)
      : riskLevelLoading
    const riskLevelColor = status
      ? 'error'
      : 'success'
    const icon = status
      ? stayHomeIcon
      : distanceIcon
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
              <img src={icon} width={200} style={{ maxWidth: '80px', marginTop: 20 }} />
              <Typography style={{ marginTop: 25 }}>
                <Translation>{t => t('yourRiskLevelMessage')}</Translation>: <span style={{ color: theme.palette[riskLevelColor].main }}>{riskLevel}</span>
              </Typography>
              <Typography style={{ marginTop: 15 }}>
                {statusMessage}
              </Typography>
            </Grid>
          ))
        }
      </Grid>
    )
  }
}

export default withTheme(Exposures)
