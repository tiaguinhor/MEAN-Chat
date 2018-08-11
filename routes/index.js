var express = require('express'),
	path = require('path'),
	router = express.Router();

/* GET home page. */
router.get('/', function(req, res){
	res.render('index');
	// res.sendFile(path.resolve('public/views/index.html'));
});

/* DASHBOARD home page. */
router.get('/dashboard', function(req, res, next){
	if(!req.session.user)
		return res.status(401).send();

	return res.status(200).send('Welcome');
});

module.exports = router;
