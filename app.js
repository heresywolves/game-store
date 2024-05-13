var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');


// Connect mongodb
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

// Define the database URL to connect to.
// const mongoDB = "mongodb+srv://heresywolves:mACSNDL7e3BRZGTO@cluster0.avuxlqr.mongodb.net/store?retryWrites=true&w=majority&appName=Cluster0";
const mongoDB = process.env.dblink;


// Wait for database to connect, logging an error if there is a problem
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

var indexRouter = require('./routes/index');
var gamesRouter = require('./routes/games');
var categoriesRouter = require('./routes/categories');
var studiosRouter = require('./routes/studios');

var app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Favicon
app.use(favicon(path.join(__dirname, 'public', 'images', 'game-nexus-favicon-black.ico')))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/games', gamesRouter);
app.use('/categories', categoriesRouter);
app.use('/studios', studiosRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
