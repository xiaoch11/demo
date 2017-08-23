var express = require('express');
var router = express.Router();

/* GET elements */
router.get('/', function(req, res, next) {
  res.sendfile('views/elem.html');
});

module.exports = router;
