const mongoose = require('mongoose')

const locationSchema = new mongoose.Schema({
  checkpoint: String,
  latitude: Number,
  longitude: Number,
  country: String,
  locale: String,
  name: String,
  phone: String,
  email: String
})

const Location = mongoose.model('Location', locationSchema)

module.exports = Location
