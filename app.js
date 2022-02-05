const express = require('express');
const mustacheExpress = require('mustache-express');
const logger = require('morgan');
const path = require("path");
const debug = require('debug')('etsyclone:server');
const http = require('http');
const port = process.env.PORT || '3000';
const app = express();

const session = require('express-session')
app.use(session({
    secret: 'tacocat',
    saveUninitialized: true,
    resave: true
}))

// add not logged in flag
session.loggedIn = false;

app.set('port', port);
const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES
app.use("/", require('./routes/index.js'));
app.use("/index", require('./routes/index.js'));
app.use("/cart", require('./routes/cart.js'));
app.use("/login", require('./routes/login.js'));
app.use("/product", require('./routes/product.js'));
app.use("/store", require('./routes/store.js'));
app.use("/stores", require('./routes/stores.js'));
app.use("/dashboard", authenticator, require('./routes/dashboard.js'));
app.use("/search", require('./routes/search.js'));
app.use("/categories", require('./routes/categories.js'));
app.use("/wishlist", authenticator, require('./routes/wishlist.js'));
app.use("/loggingIn", require('./routes/loggingIn.js'));

// error handler
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

// console server logging
function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

// authenticate login status when using certain routes
function authenticator(req, res, next) {
    if (req.session && req.session.loggedIn)
        next();
    else
        res.redirect('/login');
};

// TODO: middleware to auto login on visit based off a cookie from previous visit?