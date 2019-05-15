const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const User = require('./models/user');
const Device = require('./models/device');
const Temp = require('./models/temperature');
var moment = require('moment-timezone');
const authRoutes = require('./routes/authentication');
const adminRoutes = require('./routes/admin');
const sslRedirect = require('heroku-ssl-redirect');


const MONGODB_URI =
  'mongodb+srv://smarthome:JuMzsDoiDo0sv1IT@smarthome-ogiob.mongodb.net/device?retryWrites=true';

const app = express();

/*The below middleware will be used in order to REDIRECT all the HTTP requests to the HTTPS encrypted connection
While testing the application locally please do comment them out, otherwise the application will not run locally
This is required for the production purposes.
*/
 // enable ssl redirect 
app.use(sslRedirect());


const PORT = process.env.PORT || 5000;

/**
 * For saving the authenticated sessions in the database
 */
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

const csrfProtection = csrf(); //initiallizing the CSRF protection for session which is default however you can set cookie protection as well

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }, //the session will expire in 1 hour, then the user must login 3600000 is in milliseconds
    store: store
  })
);

//after initialising the session use the CSRF protection middleware
app.use(csrfProtection);

//it is possible to use flash() middleware anywhere in application's request object
app.use(flash()); //this required in order to sent error messages to the front end this should be declared after session

//The below middleware to respond CSRF tokens to view. For every request that will come this 3 variables will be available 
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn,
    res.locals.isEmailConfirmed = req.session.isEmailConfirmed,
    res.locals.csrfToken = req.csrfToken() //locals allows set local variables it only exist in the view which is rendered
  next(); //call the next middleware next will come out from current middleware and proccedd to the next one
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id) //will check the database if there is a session exist
    .then(user => {
      //Any authenticated request to the server will have access to the below variables
      req.user = user;
      req.username = user.userName; //the username will be available for each request
      req.serialNumber = user.serialNumber; //will pull the serialNumber of the user which is requested the page.
      next();
    })
    .catch(err => console.log(err));
});

app.use(bodyParser.json());

app.use(adminRoutes);
app.use(authRoutes);


mongoose
  .connect(MONGODB_URI)
  .then(result => {
    console.log("Connected to the database");
/**
 * The CronJob will run every 1 minute in order, to check the time scheduling of the devices from the collection
 * if their time matches the current time then the state of device will be changed to the On or Off
 */
    var CronJob = require('cron').CronJob;
    new CronJob('* * * * *', function () { //the function will run every minute
      const currentDateTime = moment.tz("Europe/London").format(); //setting up the server time zone as London 

      var queryStartTime = {
        startTime: {
          $eq: currentDateTime
        }
      };
      var queryFinishTime = {
        finishTime: {
          $eq: currentDateTime
        }
      };

      Device.updateMany(queryStartTime, {
          startTime: null,
          state: 'On'
        })
        .then(devices => {
        });

      Device.updateMany(queryFinishTime, {
          finishTime: null,
          state: 'Off'
        })
        .then(devices => {
        });

        var aWeekAgo = moment().subtract(8,'days');  

        //On database collection only last 1 week of information will be kept regarding the Temperatures if it is longer then one week delete it
    Temp.deleteMany({date: {$lte: aWeekAgo}}, function (err) {
      if (err) return handleError(err);
    });
    }, null, true);

      app.listen(PORT);
  })
  .catch(err => {
    console.log(err);
  });