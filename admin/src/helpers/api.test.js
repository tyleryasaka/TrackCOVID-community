/* globals describe, test, expect, beforeEach, fetch */
const {
  login,
  fetchCurrentUser,
  fetchUsers,
  createUser,
  updatePassword,
  deleteUser,
  postCheckpoints
} = require('./api')

describe('api', () => {
  beforeEach(() => {
    fetch.resetMocks()
  })

  test('login: fail', async () => {
    fetch.mockResponseOnce(JSON.stringify({ isLoggedIn: false }))
    const loginResult = await login('hello', 'world')
    expect(fetch.mock.calls.length).toEqual(1)
    expect(fetch.mock.calls[0][0]).toEqual('https://demo.trackcovid.net/admin/login')
    expect(loginResult).toBe(false)
  })

  test('login: success', async () => {
    fetch.mockResponseOnce(JSON.stringify({ isLoggedIn: true }))
    const loginResult = await login('mrfox', 'mfoxe')
    expect(fetch.mock.calls.length).toEqual(1)
    expect(fetch.mock.calls[0][0]).toEqual('https://demo.trackcovid.net/admin/login')
    expect(loginResult).toBe(true)
  })

  test('fetchCurrentUser: fail', async () => {
    fetch.mockResponseOnce(JSON.stringify({ isLoggedIn: false }))
    const currentUser = await fetchCurrentUser()
    expect(fetch.mock.calls.length).toEqual(1)
    expect(fetch.mock.calls[0][0]).toEqual('https://demo.trackcovid.net/admin/api/status')
    expect(currentUser).toBe(undefined)
  })

  test('fetchCurrentUser: success', async () => {
    fetch.mockResponseOnce(JSON.stringify({
      isLoggedIn: true,
      user: {
        privilege: 1,
        id: 'abc123',
        username: 'mrfox'
      }
    }))
    const currentUser = await fetchCurrentUser()
    expect(fetch.mock.calls.length).toEqual(1)
    expect(fetch.mock.calls[0][0]).toEqual('https://demo.trackcovid.net/admin/api/status')
    expect(currentUser).toEqual({
      privilege: 1,
      id: 'abc123',
      username: 'mrfox'
    })
  })

  test('fetchUsers', async () => {
    fetch.mockResponseOnce(JSON.stringify({
      error: false,
      users: [
        { id: 'abc123', username: 'mrfox', privilege: 1 },
        { id: 'def456', username: 'mfoxe', privilege: 2 }
      ]
    }))
    const users = await fetchUsers()
    expect(fetch.mock.calls.length).toEqual(1)
    expect(fetch.mock.calls[0][0]).toEqual('https://demo.trackcovid.net/admin/api/users')
    expect(users).toEqual([
      { id: 'abc123', username: 'mrfox', privilege: 1 },
      { id: 'def456', username: 'mfoxe', privilege: 2 }
    ])
  })

  test('createUser', async () => {
    const userObj = { username: 'mrfox', privilege: 1, password: 'helloworld' }
    fetch.mockResponseOnce(JSON.stringify({
      error: false,
      user: userObj
    }))
    const createdUser = await createUser(userObj)
    expect(fetch.mock.calls.length).toEqual(1)
    expect(fetch.mock.calls[0][0]).toEqual('https://demo.trackcovid.net/admin/api/users')
    expect(createdUser).toEqual({ username: 'mrfox', privilege: 1, password: 'helloworld' })
  })

  test('updatePassword', async () => {
    fetch.mockResponseOnce(JSON.stringify({
      error: false,
      user: { username: 'mrfox', privilege: 1, password: 'helloworld' }
    }))
    const success = await updatePassword('helloworld', 'worldhello')
    expect(fetch.mock.calls.length).toEqual(1)
    expect(fetch.mock.calls[0][0]).toEqual('https://demo.trackcovid.net/admin/api/account')
    expect(success).toBe(true)
  })

  test('deleteUser', async () => {
    fetch.mockResponseOnce(JSON.stringify({ error: false }))
    const success = await deleteUser('abc123')
    expect(fetch.mock.calls.length).toEqual(1)
    expect(fetch.mock.calls[0][0]).toEqual('https://demo.trackcovid.net/admin/api/users/abc123')
    expect(success).toBe(true)
  })

  test('postCheckpoints', async () => {
    fetch.mockResponseOnce(JSON.stringify({ error: false }))
    const success = await postCheckpoints([
      { key: '1234567890abcdef', timestamp: Date.now() }
    ])
    expect(fetch.mock.calls.length).toEqual(1)
    expect(fetch.mock.calls[0][0]).toEqual('https://demo.trackcovid.net/admin/api/checkpoints')
    expect(success).toBe(true)
  })
})
