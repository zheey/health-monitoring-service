var express = require('express');
var mongoose = require('mongoose');
//mongoose.Promise = global.Promise;
var con = mongoose.connect('mongodb://heroku_scmpvt77:5l8r2mbg47nm4eg9penmvjv09j@ds141464.mlab.com:41464/heroku_scmpvt77',
    {useMongoClient:true});
var expressSession = require('express-session');
var mongoStore = require('connect-mongo') ({session:expressSession});
require('./models/health_model.js');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var app = express();
app.engine('html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(expressSession({
    secret: 'SECRET',
    saveUninitialized: false, // don't create session until something stored
    resave: false,
    cookie: {maxAge: 60*60*1000},
    store: new mongoStore({
        url: 'mongodb://heroku_scmpvt77:5l8r2mbg47nm4eg9penmvjv09j@ds141464.mlab.com:41464/heroku_scmpvt77',
        collection: 'sessions'
    })
}));
require('./health_routes') (app);
app.listen(3093);
