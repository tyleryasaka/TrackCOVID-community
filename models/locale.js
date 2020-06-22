const mongoose = require('mongoose')

const localeSchema = new mongoose.Schema({
  name: String,
  code: String
})
const Locale = mongoose.model('User', localeSchema)

module.exports = Locale
