const fs = require('fs')

console.log('Building .env files...')

const appVars = [
  { originalName: 'APP_NAME', newName: 'REACT_APP_NAME' },
  { originalName: 'APP_THEME', newName: 'REACT_APP_THEME' },
  { originalName: 'ESTIMATED_DX_DELAY_DAYS', newName: 'REACT_APP_ESTIMATED_DX_DELAY_DAYS' },
  { originalName: 'CONTACT_WINDOW_HOURS_BEFORE', newName: 'REACT_APP_CONTACT_WINDOW_HOURS_BEFORE' },
  { originalName: 'CONTACT_WINDOW_HOURS_AFTER', newName: 'REACT_APP_CONTACT_WINDOW_HOURS_AFTER' }
]

const adminVars = [
  { originalName: 'APP_NAME', newName: 'REACT_APP_NAME' },
  { originalName: 'APP_URL', newName: 'REACT_APP_WEB_APP_URL' },
  { originalName: 'ADMIN_REGISTRATION_URL', newName: 'REACT_APP_REGISTRATION_URL' }
]

const envFile = fs.readFileSync('.env', 'utf8')
const envVars = envFile.split('\n').filter(str => str.length > 0).map(envVarStr => {
  const components = envVarStr.split('=')
  const name = components.length === 2 && components[0]
  const value = components.length === 2 && components[1]
  return {
    name,
    value
  }
})

const buildNewEnvFile = (originalVars, newVars) => {
  return newVars.map(newVar => {
    const originalVar = originalVars.find(v => v.name === newVar.originalName)
    if (originalVar) {
      return `${newVar.newName}=${originalVar.value}`
    } else {
      throw new Error(`Var missing: ${newVar.originalName}`)
    }
  }).join('\n')
}

const appEnvFile = buildNewEnvFile(envVars, appVars)
const adminEnvFile = buildNewEnvFile(envVars, adminVars)

fs.writeFileSync('./app/.env', appEnvFile)
fs.writeFileSync('./admin/.env', adminEnvFile)

console.log('.env files built successfully')
