// dependencies
const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const mongoose = require('mongoose');
const hash = require('bcrypt-nodejs');
const path = require('path');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

// mongoose
mongoose.connect('mongodb://localhost/webSlots');

// user schema/model
const User = require('./models/user.js');

// create instance of express
const app = express();

// require routes
const routes = require('./routes/api.js');

// define middleware
app.use(express.static(path.join(__dirname, '../src')));
app.use(express.static(path.join(__dirname, '../src/dist')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(require('express-session')({
  secret: 'web-slots',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// configure passport
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// routes
app.use('/user/', routes);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../src', 'index.html'));
});

// error hndlers
app.use(function(req, res, next) {
  res.sendFile(path.join(__dirname, '../src', 'index.html'));
  // let err = new Error('Not Found');
  // err.status = 404;
  // next(err);
});

app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.end(JSON.stringify({
    message: err.message,
    error: {}
  }));
});

module.exports = app;
