/* globals jest, describe, beforeEach, test, expect, fetchMock */
const TrackCovid = require('./index')

const getConfig = (checkpointsDb) => {
  return {
    estimatedDiagnosisDelay: 1,
    getCheckpoints: jest.fn(() => checkpointsDb.checkpoints),
    setCheckpoints: jest.fn((checkpoints) => {
      checkpointsDb.checkpoints = checkpoints
    }),
    contactWindowBefore: 1,
    contactWindowAfter: 2,
    checkpointKeyLength: 16
  }
}

describe('trackcovid-js', () => {
  let config, checkpointsDb

  beforeEach(() => {
    checkpointsDb = {
      checkpoints: [
        { key: '2529195eebe16a42', timestamp: Date.now() },
        { key: 'a1a2535a3ccbd45c', timestamp: Date.now() }
      ]
    }
    expect(checkpointsDb.checkpoints.length).toBe(2)
    config = getConfig(checkpointsDb)
  })

  test('joinCheckpoint', async () => {
    const newCheckpointKey = 'd033e29071c4e485'
    const trackCovid = new TrackCovid(config)
    await trackCovid.joinCheckpoint(newCheckpointKey)
    expect(config.getCheckpoints.mock.calls.length).toBe(1)
    expect(config.setCheckpoints.mock.calls.length).toBe(1)
    expect(checkpointsDb.checkpoints.length).toBe(3)
    expect(checkpointsDb.checkpoints[2].key).toBe(newCheckpointKey)
  })

  // user scanned same checkpoint *before* covid-positive patient, within time window
  test('getExposureStatus: contact before', async () => {
    const halfHour = (1000 * 60 * 60) / 2
    fetchMock.mockOnce(JSON.stringify({
      checkpoints: [
        { key: 'a1a2535a3ccbd45c', timestamp: Date.now() + halfHour }
      ],
      error: false
    }))
    const trackCovid = new TrackCovid(config)
    const status = await trackCovid.getExposureStatus()
    expect(status).toBe(true)
  })

  // user scanned same checkpoint *before* covid-positive patient, outside of time window
  test('getExposureStatus: no contact before', async () => {
    const justOverOneHour = (1000 * 60 * 60) + 1000
    fetchMock.mockOnce(JSON.stringify({
      checkpoints: [
        { key: 'a1a2535a3ccbd45c', timestamp: Date.now() + justOverOneHour }
      ],
      error: false
    }))
    const trackCovid = new TrackCovid(config)
    const status = await trackCovid.getExposureStatus()
    expect(status).toBe(false)
  })

  // user scanned same checkpoint *after* covid-positive patient, within time window
  test('getExposureStatus: contact after', async () => {
    const oneHour = 1000 * 60 * 60
    fetchMock.mockOnce(JSON.stringify({
      checkpoints: [
        { key: 'a1a2535a3ccbd45c', timestamp: Date.now() - oneHour }
      ],
      error: false
    }))
    const trackCovid = new TrackCovid(config)
    const status = await trackCovid.getExposureStatus()
    expect(status).toBe(true)
  })

  // user scanned same checkpoint *after* covid-positive patient, outside of time window
  test('getExposureStatus: no contact after', async () => {
    const justOverTwoHours = ((1000 * 60 * 60) * 2) + 1000
    fetchMock.mockOnce(JSON.stringify({
      checkpoints: [
        { key: 'a1a2535a3ccbd45c', timestamp: Date.now() - justOverTwoHours }
      ],
      error: false
    }))
    const trackCovid = new TrackCovid(config)
    const status = await trackCovid.getExposureStatus()
    expect(status).toBe(false)
  })
})
