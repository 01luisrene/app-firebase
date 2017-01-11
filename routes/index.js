var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Recorderis', description: 'Recordatorio de fechas importantes y ocasiones especiales.' });
});

module.exports = router;
