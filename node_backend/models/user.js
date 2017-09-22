// user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
mongoose.Promise = require('bluebird');

var User = new Schema({
  name: String,
  wallet: String,
  username: String,
  password: String,
  phone: String,
  bitsLost : String});

User.plugin(passportLocalMongoose);


module.exports = mongoose.model('users', User);