var createError = require('http-errors');
var express = require('express');
const mongoose = require('mongoose');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

//const router
const viewsRouter = require('./routes/viewAPI');
const memberRouter = require('./routes/memberAPI');
const coursesRouter = require('./routes/coursesAPI');
const sectionsRouter = require('./routes/sectionsAPI');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//middleware va session rất quan trọng để hiển thị trang
require('./config/passport')(passport);
// Cấu hình session
app.use(session({
  secret: "assignmentFinal",
  resave: false,
  saveUninitialized: true,
}));

// Middleware để gán session vào res.locals
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
})
//connect db
const url = "mongodb://localhost:27017/SE171999";
const connect = mongoose.connect(url)
connect.then(()=>{
  console.log("connect successfully")
  require('./models/member')
}).catch(err=>{
  console.log('Database connection error: ' + err)
});


//app.use call router
app.use('/', viewsRouter);
app.use('/members', memberRouter);
app.use('/courses', coursesRouter);
app.use('/sections', sectionsRouter);

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
