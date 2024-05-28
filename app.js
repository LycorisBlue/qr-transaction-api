var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const AdminController = require('./controllers/AdminController');
const AgentController = require('./controllers/AgentController');
const ClientController = require('./controllers/ClientController');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    '/admin',
    (req, res, next) => {
        console.log("__AdminController________________________________");
        next();
    },
    AdminController
);

app.use('/agent', (req, res, next) => {
    console.log("__AgentController________________________________");
    next();
}, AgentController);

app.use('/client', (req, res, next) => {
    console.log("__ClientController________________________________");
    next();
}, ClientController);

module.exports = app;
