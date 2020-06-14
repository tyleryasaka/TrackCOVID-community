/* globals fetch */

function TrackCovid (config) {
  const {
    estimatedDiagnosisDelay,
    getCheckpoints,
    setCheckpoints,
    contactWindowBefore,
    contactWindowAfter,
    serverBaseUrl
  } = config

  const oneHour = 1000 * 60 * 60
  const oneDay = oneHour * 24
  const contactWindowBeforeHours = contactWindowBefore * oneHour
  const contactWindowAfterHours = contactWindowAfter * oneHour
  const estimatedDiagnosisDelayDays = estimatedDiagnosisDelay * oneDay

  async function serverRequest (method, url = '', body) {
    const response = await fetch(`${serverBaseUrl}/${url}`, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    })
    const responseJSON = response.json()
    if (responseJSON.error) {
      throw new Error(`request-failed: ${serverBaseUrl}/${url}`)
    }
    return responseJSON
  }

  async function addCheckpoint (checkpointKey) {
    const checkpoints = await getCheckpoints()
    const checkpointObj = {
      key: checkpointKey,
      timestamp: Date.now()
    }
    checkpoints.push(checkpointObj)
    await setCheckpoints(checkpoints)
    return checkpointObj
  }

  // Delete expired checkpoints and return the rest
  async function getRecentCheckpoints () {
    const checkpoints = await getCheckpoints()
    const recentCheckpoints = checkpoints.filter(checkpoint => {
      return Date.now() - checkpoint.timestamp <= estimatedDiagnosisDelayDays
    })
    await setCheckpoints(recentCheckpoints)
    return recentCheckpoints
  }

  function joinCheckpoint (checkpointKey) {
    return addCheckpoint(checkpointKey)
  }

  async function exportCheckpoints () {
    const recentCheckpoints = await getRecentCheckpoints()
    return recentCheckpoints
  }

  async function getExposureStatus () {
    const recentCheckpoints = await getRecentCheckpoints()
    const response = await serverRequest('GET')
    const exposedCheckpoints = response.error ? [] : response.checkpoints
    const matches = recentCheckpoints.filter(visited => {
      return exposedCheckpoints.filter(exposed => {
        return (
          (visited.key === exposed.key) &&
          (visited.timestamp >= (exposed.timestamp - contactWindowBeforeHours)) &&
          (visited.timestamp - exposed.timestamp <= contactWindowAfterHours)
        )
      }).length > 0
    })
    return matches.length > 0
  }

  return {
    joinCheckpoint,
    getExposureStatus,
    exportCheckpoints
  }
}

module.exports = TrackCovid
