import TrackCovid from 'trackcovid-js'

const checkpointsDBKey = 'CHECKPOINTS'
const estimatedDiagnosisDelay = Number(process.env.REACT_APP_ESTIMATED_DX_DELAY_DAYS)
const contactWindowBefore = Number(process.env.REACT_APP_CONTACT_WINDOW_HOURS_BEFORE)
const contactWindowAfter = Number(process.env.REACT_APP_CONTACT_WINDOW_HOURS_AFTER)
const checkpointKeyLength = Number(process.env.REACT_APP_CHECKPOINT_KEY_LENGTH)
const serverBaseUrl = `${process.env.REACT_APP_SERVER_DOMAIN}/api/checkpoints`

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
  estimatedDiagnosisDelay,
  getCheckpoints,
  setCheckpoints,
  contactWindowBefore,
  contactWindowAfter,
  checkpointKeyLength,
  serverBaseUrl
})

const {
  joinCheckpoint,
  getExposureStatus,
  exportCheckpoints
} = trackCovid

export default {
  joinCheckpoint,
  getExposureStatus,
  exportCheckpoints
}
