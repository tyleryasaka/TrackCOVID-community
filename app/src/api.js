import TrackCovid from 'trackcovid-js'
import {
  checkpointKeyLength,
  serverBaseUrl as defaultServerBaseUrl
} from 'trackcovid-js/config'

const checkpointsDBKey = 'CHECKPOINTS'
const serverBaseUrl = defaultServerBaseUrl
const estimatedDiagnosisDelay = process.env.REACT_APP_ESTIMATED_DX_DELAY_DAYS
const contactWindowBefore = process.env.REACT_APP_CONTACT_WINDOW_HOURS_BEFORE
const contactWindowAfter = process.env.REACT_APP_CONTACT_WINDOW_HOURS_AFTER

function getCheckpoints () {
  const localStorage = window.localStorage
  const checkpointsString = localStorage.getItem(checkpointsDBKey) || '[]'
  return Promise.resolve(JSON.parse(checkpointsString))
}

function setCheckpoints (checkpointsArr) {
  const localStorage = window.localStorage
  return Promise.resolve(localStorage.setItem(checkpointsDBKey, JSON.stringify(checkpointsArr)))
}

const trackCovid = TrackCovid({
  serverBaseUrl,
  estimatedDiagnosisDelay,
  getCheckpoints,
  setCheckpoints,
  contactWindowBefore,
  contactWindowAfter,
  checkpointKeyLength
})

const {
  hostCheckpoint,
  joinCheckpoint,
  getExposureStatus,
  exportCheckpoints
} = trackCovid

export default {
  hostCheckpoint,
  joinCheckpoint,
  getExposureStatus,
  exportCheckpoints
}
