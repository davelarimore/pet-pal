const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const morgan = require('morgan');
//const Navigo = require('navigo');
const app = express();

app.use(morgan('common'));
app.use(express.static('public'));
app.use(express.json());

//Auth
const { localStrategy, jwtStrategy } = require('./lib/authStrategy');
passport.use(localStrategy);
passport.use(jwtStrategy);
const jwtAuth = passport.authenticate('jwt', { session: false });

//DB
mongoose.Promise = global.Promise;
const { DATABASE_URL } = require('./config');

//App
app.use('/auth', require('./routes/authRouter'))

app.use('/api', [
  jwtAuth,
  require('./routes/usersRouter'),
  require('./routes/petsRouter'),
  require('./routes/visitsRouter'),
  require('./routes/tasksRouter'),
]);


// this function starts our server and returns a Promise.
// In our test code, we need a way of asynchronously starting
// our server, since we'll be dealing with promises there.

function runServer() {
  return new Promise((resolve, reject) => {
    const port = process.env.PORT || 8080;
    mongoose.connect(DATABASE_URL, err => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(port, () => {
          console.log(`Your app is listening on port ${port}`);
          resolve();
        })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

// like `runServer`, this function also needs to return a promise.
// `server.close` does not return a promise on its own, so we manually
// create one.

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}
  
  // if server.js is called directly (aka, with `node server.js`), this block
  // runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
  if (require.main === module) {
    runServer().catch(err => console.error(err));
  }
  
  module.exports = { app, runServer, closeServer };