export const isValidJSON = val => {
  try {
    JSON.parse(val)
  } catch (e) {
    return false
  }
  return true
}
