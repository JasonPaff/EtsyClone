const express = require('express');
const mustacheExpress = require('mustache-express');
const logger = require('morgan');
const path = require("path");
const debug = require('debug')('etsyclone:server');
const http = require('http');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

const session = require('express-session')
app.use(session({
    secret: 'tacocat', saveUninitialized: true, resave: true
}));

app.set('port', port);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

app.engine('mustache', mustacheExpress('./views/partials', '.mustache'));
app.set('views', './views');
app.set('view engine', 'mustache');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES
app.use("/", require('./routes/index.js'));
app.use("/index", require('./routes/index.js'));
app.use("/cart", require('./routes/cart.js'));
app.use("/chat", require('./routes/chat.js'));
app.use("/checkout", authenticator, require('./routes/checkout.js'));
app.use("/login", require('./routes/login.js'));
app.use("/products", require('./routes/products.js'));
app.use("/register", require('./routes/register.js'));
app.use("/store", require('./routes/store.js'));
app.use("/sales", require('./routes/sales.js'));
app.use("/dashboard", authenticator, require('./routes/dashboard.js'));
app.use("/search", require('./routes/search.js'));
app.use("/category", require('./routes/category.js'));
app.use("/wishlist", authenticator, require('./routes/wishlist.js'));
app.use("/googleLogin", require('./routes/googleLogin.js'));
app.use("/summary", require('./routes/summary.js'));
app.use("/review", require('./routes/review.js'));

// error handler
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

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
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

// authenticate login status
function authenticator(req, res, next) {
    if (req.session.loggedIn) next();
    else {
        req.session.redirect = true;
        req.session.redirectUrl = req.baseUrl;

        // hack to redirect dashboards to index
        if (req.baseUrl === "/dashboard") req.session.redirectUrl = '/index';

        // hack to redirect wishlist
        if (req.baseUrl === 'undefined') req.session.redirectUrl = '/wishlist';

        res.redirect('/login');
    }
}