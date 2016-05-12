'use strict';
/** Module imports */
let fs = require('fs');
let express = require('express');
let handlebars = require('express-handlebars');
let path = require('path');
let bodyParser = require('body-parser');
let methodOverride = require('method-override');
let cookieParser = require('cookie-parser');
let cookieSession = require('cookie-session');
let session = require('express-session');
let MongoStore = require('connect-mongo')(session);
let passport = require('passport');
let flash = require('connect-flash');

/** File imports */
let config = require('./config');
let routes = require('./routes/main');
let mgDb = require('./src/database');
/** @type {express} The application variables */
let app = express();
/** Set view engine */
app.engine('hbs', handlebars(
  {
    extname: '.hbs'
  })
);
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'hbs');
/** Body parser */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
/** Support REST methods */
app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
/** Setup cookie + session */
app.use(cookieParser());
app.use(cookieSession({ secret: 'Y4Y9SA7v' }));
app.use(session({
  secret: config.appName,
  proxy: true,
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mgDb,
    collection : 'sessions'
  })
}));
/** Serving static */
app.use(express.static(path.join(__dirname, 'public')));
/** Passport */
app.use(passport.initialize());
app.use(passport.session());
/** Flash */
app.use(flash());
/** Require models */
fs.readdirSync(__dirname + '/src/models').forEach((f) => {
  if (~f.indexOf('.js')) require(__dirname + '/src/models/' + f);
});
/** ROUTES */
require('./routes/websocket');
app.use('/', routes);

/** Handle 404 */
app.use((req, res, next) => {
  let er = new Error('Not found!');
  er.status = 404;
  next(er);
});

/** If in development, print stacktrace */
if (config.environment === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {error: err});
  });
}
/** Production error handling */
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {error: err});
});

module.exports = app;