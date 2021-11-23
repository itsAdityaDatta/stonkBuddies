const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');
const favicon = require('express-favicon');


// Load Config
dotenv.config({ path: './config/config.env'});

// passport config
require('./config/passport')(passport);

// connect to mongoDB
connectDB();

const app = express();
app.use(favicon(__dirname + '/public/images/favicon.ico'));

// Body parser
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Methon override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method
      delete req.body._method
      return method
    }
}));

// Logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// Handlebar helpers
const {formatDate, stripTags, truncate} = require('./helpers/hbs');

// Handlebars
app.engine('.hbs',exphbs({
    helpers: {
        formatDate,
        stripTags,
        truncate
    },
    defaultLayout: 'main', 
    extname:'.hbs'
}));
app.set('viewengine', '.hbs');

// Sessions middleware
app.use(session({
    secret: 'hugh jassman',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI})
}));

// passport middleware
app.use(passport.initialize());

//persistent login sessions
app.use(passport.session());


// static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index.js'));
app.use('/auth', require('./routes/auth.js'));
app.use('/groups', require('./routes/groups.js'));
app.use('/users', require('./routes/users.js'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log("server running in " + process.env.NODE_ENV + " mode on port " + PORT));