const mongoose = require('mongoose')

const checkpointSchema = new mongoose.Schema({
  key: String,
  timestamp: Number,
  symptomStartTime: Number
})

const Checkpoint = mongoose.model('Checkpoint', checkpointSchema)

module.exports = Checkpoint
