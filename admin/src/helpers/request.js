/* globals fetch */

export const sendRequest = async (url, method = 'GET', body) => {
  const res = await fetch(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: { 'Content-Type': 'application/json' }
  })
  return res.json()
}
