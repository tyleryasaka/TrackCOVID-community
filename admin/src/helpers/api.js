/* globals fetch */

const serverBaseUrl = `${process.env.REACT_APP_SERVER_DOMAIN}`
const locizeProductId = process.env['REACT_APP_LOCIZE_PRODUCT_ID']

const sendExternalRequest = async (url, method = 'GET', body) => {
  const res = await fetch(`${url}`, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: { 'Content-Type': 'application/json', 'authorization': undefined }
  })
  return res.json()
}

const sendRequest = async (url, method = 'GET', body) => {
  const res = await fetch(`${serverBaseUrl}${url}`, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  })
  return res.json()
}

export const login = async (username, password) => {
  const res = await sendRequest('/admin/login', 'POST', { username, password })
  return res && res.isLoggedIn
}

export const fetchCurrentUser = async () => {
  const res = await sendRequest('/admin/api/status')
  return (res && res.isLoggedIn) ? res.user : undefined
}

export const fetchUsers = async () => {
  const res = await sendRequest('/admin/api/users')
  return (res && res.users) ? res.users : undefined
}

export const createUser = async ({ username, canUploadCheckpoints, canCreateCheckpoints, canManageUsers, canAccessReports }) => {
  const res = await sendRequest(
    '/admin/api/users',
    'POST',
    { username, canUploadCheckpoints, canCreateCheckpoints, canManageUsers, canAccessReports }
  )
  return res && !res.error ? res.user : undefined
}

export const resetPasswordRequest = async ({ username }) => {
  const res = await sendRequest(
    '/admin/api/users/reset-password-request',
    'POST',
    { username }
  )
  return res && !res.error
}

export const resetPassword = async ({ token, newPassword }) => {
  const res = await sendRequest(
    '/admin/api/users/reset-password',
    'POST',
    { token, newPassword }
  )
  return res && !res.error
}

export const updateUser = async ({ userId, canUploadCheckpoints, canCreateCheckpoints, canManageUsers, canAccessReports }) => {
  const res = await sendRequest(
    `/admin/api/users/${userId}`,
    'PUT',
    { canUploadCheckpoints, canCreateCheckpoints, canManageUsers, canAccessReports }
  )
  return res && !res.error
}

export const updateUsername = async ({ username }) => {
  const res = await sendRequest(
    '/admin/api/account',
    'PUT',
    { username }
  )
  return res && !res.error
}

export const updatePassword = async (currentPassword, newPassword) => {
  const res = await sendRequest(
    '/admin/api/account',
    'PUT',
    { currentPassword, newPassword }
  )
  return res && !res.error
}

export const deleteUser = async (userId) => {
  const res = await sendRequest(`/admin/api/users/${userId}`, 'DELETE')
  return res && !res.error
}

export const postCheckpoints = async (checkpoints) => {
  const res = await sendRequest(
    '/admin/api/checkpoints',
    'POST',
    { checkpoints }
  )
  return res && !res.error
}

export const postLocation = async ({ latitude, longitude, country, locale, name, phone, email }) => {
  const res = await sendRequest(
    '/admin/api/location',
    'POST',
    { latitude, longitude, country, locale, name, phone, email }
  )
  return res && !res.error && res.checkpointKey
}

export const fetchCheckpointLocations = async () => {
  const res = await sendRequest('/admin/api/checkpoints/locations')
  return (res && res.checkpoints) ? res.checkpoints : undefined
}

export const fetchLanguages = async () => {
  const res = await sendExternalRequest(`https://api.locize.app/languages/${locizeProductId}`)
  return res
}

export const fetchTranslations = async (language) => {
  const res = await sendExternalRequest(`https://api.locize.app/${locizeProductId}/latest/${language}/translation`)
  return res
}
