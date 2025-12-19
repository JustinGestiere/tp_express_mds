let express = require('express');
let path = require('path');
let logger = require('morgan');
let session = require('express-session');
let http = require('http');
const { Server } = require("socket.io");

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let api = require("./routes/api");

let app = express();

/* Variable pour stocker l'historique en mémoire */
const messages = [];

/* VIEW ENGINE */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* MIDDLEWARES */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

/* SESSION */
app.use(session({
  secret: 'admin',
  resave: false,
  saveUninitialized: false
}));

app.use((req, res, next) => {
  res.locals.isAuthenticated = !!req.session.auth;
  next();
});

/* ROUTES */
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/api", api.router);

/* 404 */
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page introuvable' });
});

/* SERVER + SOCKET.IO */
const server = http.createServer(app);
const io = new Server(server);

/* API */
api.setMessagesArray(messages);


/* Socket.IO */
io.on("connection", (socket) => {
  console.log("Nouvel utilisateur connecté");

  // Envoi de l'historique au client
  socket.emit("chatHistory", messages);

  // Réception et diffusion des messages
  socket.on("chatMessage", (data) => {
    messages.push(data);          // ajout à l'historique
    io.emit("chatMessage", data); // broadcast à tous
  });

  socket.on("disconnect", () => {
    console.log("Utilisateur déconnecté");
  });
});

/* LANCEMENT DU SERVEUR */
const port = process.env.PORT || 8080;
server.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port} (HTTP + Socket.IO)`);
});

module.exports = app;
