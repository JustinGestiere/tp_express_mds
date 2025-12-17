var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express',
    Message: "Message de la page index",
   });
});

router.get('/dashboard', function(req, res, next){
  res.render('dashboard', {title: 'Express', 
    Message: "Test du home quoi",
  });
});

module.exports = router;
