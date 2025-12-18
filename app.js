var express = require('express');
var path = require('path');
var logger = require('morgan');
var session = require('express-session');
var http = require('http');
var { Server } = require('socket.io');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

/* ======================
   VIEW ENGINE
====================== */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* ======================
   MIDDLEWARES GLOBAUX
====================== */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

/* ======================
   SESSION (MINIMALE)
====================== */
app.use(session({
  secret: 'admin',
  resave: false,
  saveUninitialized: false
}));

app.use((req, res, next) => {
  res.locals.isAuthenticated = !!req.session.auth;
  next();
});

/* ======================
   ROUTES
====================== */
app.use('/', indexRouter);
app.use('/users', usersRouter);

/* ======================
   404
====================== */
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page introuvable' });
});

/* ======================
   SERVER HTTP + SOCKET.IO
====================== */
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("Nouvel utilisateur connecté");

  // réception des messages
  socket.on("chatMessage", (data) => {
    // broadcast à tous les clients
    io.emit("chatMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("Utilisateur déconnecté");
  });
});

/* ======================
   LANCEMENT DU SERVEUR
====================== */
const port = process.env.PORT || 8080;
server.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port} (HTTP + Socket.IO)`);
});

module.exports = app;
