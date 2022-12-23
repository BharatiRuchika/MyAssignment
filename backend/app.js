var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
var logger = require('morgan');
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var userRouter = require('./routes/users');
const User = require("./models/user");
const ErrorHandler = require('./utils/errorHandler');
const jwt = require("jsonwebtoken");
const cors = require("cors");
var app = express();
if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: './config/config.env' })
const corsOptions = {
  origin: true,
  credentials: true,
};
app.options("*" , cors(corsOptions));
app.use(cors(corsOptions));
const mongo = require("./config/connection.js");
mongo.connect();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
app.use('/auth', authRouter);

app.use('/users', userRouter);
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
// app.listen(process.env.PORT || 3001, () => console.log(`server started at ${process.env.PORT}`));
module.exports = app;
