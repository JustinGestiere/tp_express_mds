var express = require('express');
var router = express.Router();

/* ============================
   Middleware protection
============================ */
const auth = (req, res, next) => {
  if (req.session.auth) return next();
  res.redirect("/connexion");
};



/* ============================
   GET home page
============================ */
router.get('/', function(req, res) {
  res.render('index', { 
    title: 'TP NodeJS',
    Message: "Message de la page index"
  });
});

/* ============================
   GET dashboard page
============================ */
router.get('/dashboard', function(req, res) {
  res.render('dashboard', { 
    title: 'TP NodeJS', 
    Message: "Test du Dashboard"
  });
});

/* ============================
   GET chat page
============================ */
router.get("/chat", (req, res) => {
  res.render("chat", { 
    title: "Chat en temps réel"
  });
});

/* ============================
   GET / POST connexion page
============================ */
router.get("/connexion", (req, res) => {
  res.render("connexion", { 
    error: null, 
    title: "Connexion" 
  });
});

router.post("/connexion", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "admin") {
    req.session.auth = true;
    return res.redirect("/dashboard");
  }

  res.render("connexion", { 
    error: "Identifiants ou Mot de passe incorrects", 
    title: "Connexion" 
  });
});

/* ============================
   GET logout
============================ */
router.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err);
      return res.redirect("/dashboard"); // fallback si erreur
    }
    res.redirect("/connexion");
  });
});

module.exports = router;
