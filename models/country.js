const mongoose = require('mongoose')

const localeSchema = new mongoose.Schema({
  name: String,
  code: String
})

const countrySchema = new mongoose.Schema({
  name: String,
  code: String,
  locales: [localeSchema]
})
const Country = mongoose.model('Country', countrySchema)

module.exports = Country
