#!/usr/bin/env node

const debug = require('debug')('passport-mongo');
const app = require('./app');


app.set('port', process.env.PORT || 3000);


const server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});
