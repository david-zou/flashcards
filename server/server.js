const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const morgan = require('morgan');
const history = require('connect-history-api-fallback');
const passport = require('passport');
const flash = require('connect-flash');

const database = require('../db/index.js');
const bindrouter = require('./router.js');
const { SESSION_SECRET } = require('../config/config.js');
const cors = require('cors');

const PORT = process.env.PORT || 8000;

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

require('./util/passport/passport')(passport); // pass passport for configuration

// set up our express application
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // get information from html forms
app.use(cookieParser()); // read cookies (needed for auth)
app.use(morgan('dev')); // log every request to the console
app.use(history());
app.use(express.static(path.join(__dirname, '../public')));

// required for passport
app.use(session({
  secret: SESSION_SECRET, // session secret
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./util/passport/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

bindrouter(app);

database();

app.listen(PORT, () => {
  console.log('Obento express server connection established at:', PORT);
});

exports.app = app;