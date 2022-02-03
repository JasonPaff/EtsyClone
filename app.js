const express = require('express');
const mustacheExpress = require('mustache-express');
const logger = require('morgan');
const path = require("path");
const app = express();

const indexRoute = require('./routes/index.js');
const loginRoute = require('./routes/login.js');

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use("/", indexRoute);
app.use("/login", loginRoute);

module.exports = app;