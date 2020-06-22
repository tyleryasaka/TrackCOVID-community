const Country = require('./models/country')
const { locales } = require('./admin/src/helpers/locale')
var mongoose = require('mongoose')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true
})

rl.write('migrating...')

async function run () {
  mongoose.connect('mongodb://localhost/checkpoints', { useNewUrlParser: true })
  const db = mongoose.connection
  db.once('open', async function () {
    await Promise.all(locales.map((country) => {
      const locales = country.locales.map(locale => {
        const code = Object.keys(locale)[0]
        return {
          code,
          name: locale[code]
        }
      })
      const countryData = {
        name: country.countryName,
        code: country.countryCode,
        locales
      }
      return new Promise(resolve => {
        Country.create(countryData, function (err, country) {
          if (err) {
            rl.write(err)
            resolve()
          } else {
            resolve()
          }
        })
      })
    }))
    rl.write('done')
    process.exit()
  })
}

run()
