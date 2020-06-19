require('dotenv').config()
const fs = require('fs')

console.log('Building .env files...')

const appVars = [
  { originalName: 'APP_NAME', newName: 'REACT_APP_NAME' },
  { originalName: 'APP_THEME', newName: 'REACT_APP_THEME' },
  { originalName: 'ADMIN_DOMAIN', newName: 'REACT_APP_ADMIN_DOMAIN' },
  { originalName: 'SERVER_DOMAIN', newName: 'REACT_APP_SERVER_DOMAIN' },
  { originalName: 'ABOUT_URL', newName: 'REACT_APP_ABOUT_URL' },
  { originalName: 'ESTIMATED_DX_DELAY_DAYS', newName: 'REACT_APP_ESTIMATED_DX_DELAY_DAYS' },
  { originalName: 'CONTACT_WINDOW_HOURS_BEFORE', newName: 'REACT_APP_CONTACT_WINDOW_HOURS_BEFORE' },
  { originalName: 'CONTACT_WINDOW_HOURS_AFTER', newName: 'REACT_APP_CONTACT_WINDOW_HOURS_AFTER' },
  { originalName: 'CHECKPOINT_KEY_LENGTH', newName: 'REACT_APP_CHECKPOINT_KEY_LENGTH' },
  { originalName: 'LOCIZE_PRODUCT_ID', newName: 'REACT_APP_LOCIZE_PRODUCT_ID', optional: true }
]

const adminVars = [
  { originalName: 'APP_NAME', newName: 'REACT_APP_NAME' },
  { originalName: 'APP_DOMAIN', newName: 'REACT_APP_WEB_APP_DOMAIN' },
  { originalName: 'SERVER_DOMAIN', newName: 'REACT_APP_SERVER_DOMAIN' },
  { originalName: 'ADMIN_REGISTRATION_URL', newName: 'REACT_APP_REGISTRATION_URL', optional: true },
  { originalName: 'GOOGLE_API_KEY', newName: 'REACT_APP_GOOGLE_API_KEY' },
  { originalName: 'LOCIZE_PRODUCT_ID', newName: 'REACT_APP_LOCIZE_PRODUCT_ID', optional: true }
]

const buildNewEnvFile = (newVars) => {
  return newVars.map(newVar => {
    const value = process.env[newVar.originalName]
    if (typeof value !== 'undefined') {
      return `${newVar.newName}=${value}`
    } else {
      if (newVar.optional) {
        return undefined
      } else {
        throw new Error(`Environment variable not set: ${newVar.originalName}`)
      }
    }
  }).filter(v => v).join('\n')
}

const appEnvFile = buildNewEnvFile(appVars)
const adminEnvFile = buildNewEnvFile(adminVars)

fs.writeFileSync('./app/.env', appEnvFile)
fs.writeFileSync('./admin/.env', adminEnvFile)

console.log('.env files built successfully')
