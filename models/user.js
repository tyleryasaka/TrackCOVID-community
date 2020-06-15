const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
  canUploadCheckpoints: Boolean,
  canCreateCheckpoints: Boolean,
  canManageUsers: Boolean,
  canAccessReports: Boolean
})
userSchema.plugin(passportLocalMongoose)
const User = mongoose.model('User', userSchema)

module.exports = User
