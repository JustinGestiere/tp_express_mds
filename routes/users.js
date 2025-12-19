var express = require('express');
var router = express.Router();

/* ============================
   Middleware protection
============================ */
const auth = (req, res, next) => {
  if (req.session.auth) return next();
  res.redirect("/connexion");
};



/* GET users listing. */
router.get('/', auth, function(req, res, next) {
  res.render('users', {
    title : "TP NodeJS",
    Message: "Liste des utilisateurs" 
  });
});

module.exports = router;
