"use strict";

let express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    helmet = require('helmet'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    compression = require('compression');

require('dotenv').config();

app.use(compression());

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Basic setup, express static folder (public), body parser and controllers folder
// public folder available as '/assets'
app.use('/assets', express.static(path.join(__dirname, 'public')));

// Setup views folder and view engine, making .ejs to .html
app.engine('.html', require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(cookieParser());

// Let's protect our app..
app.use(helmet());

app.use(require('./routes/site'));
app.use(require('./routes/modules'));
app.use(require('./routes/error'));

app.disable('x-powered-by');

module.exports = app;
