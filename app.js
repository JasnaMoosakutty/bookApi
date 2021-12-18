var createError = require('http-errors');
var express = require('express');

var cookieParser = require('cookie-parser');

var env = require('dotenv').config();



var userRouter = require('./routes/user');
var bookRouter = require('./routes/book');



var app = express();
var cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/api/v1/book', bookRouter);

;
app.use('/api/v1/', userRouter);


app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = {};
    res.status(200);
    res.send("Health Check");
   
});


module.exports = app;
