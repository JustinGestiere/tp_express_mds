var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//session
var session = require("express-session");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//session
app.use(session({
  secret: "secret-admin",
  resave: false,
  saveUninitialized: false
}));

app.get("/connexion", (req, res) => {
  res.render("connexion", { title:"TP NodeJS", error: null });
});

app.post("/connexion", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "admin") {
    req.session.isAdmin = true;
    return res.redirect("/dashboard");
  }

  res.render("connexion", { error: "Identifiants incorrects" });
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/connexion");
  });
});

//
app.use(express.urlencoded({ extended: true }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public"));


app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('404', {title:'Error 404'});
});

// -----------------------
// AJOUT : démarrage du serveur
// -----------------------
const port = process.env.PORT || 8080;

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
// -----------------------
module.exports = app;

