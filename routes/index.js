var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'TP NodeJS',
    Message: "Message de la page index",
   });
});

router.get('/dashboard', function(req, res, next){
  res.render('dashboard', {title: 'TP NodeJS', 
    Message: "Test du Dashboard",
  });
});

router.get('/connexion', function(req, res, next){
  res.render('connexion', {title: 'TP NodeJS', 
    Message: "Connexion",
  });
});


module.exports = router;
