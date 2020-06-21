const mongoose = require('mongoose')

const resetTokenSchema = new mongoose.Schema({
  username: String,
  token: String,
  timestamp: Number
})

const ResetToken = mongoose.model('ResetToken', resetTokenSchema)

module.exports = ResetToken
