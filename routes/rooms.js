var express = require('express'),
	router = express.Router(),
	Room = require('../models/Room');

router.get('/', function(req, res){
	Room.find({}, function(err, allRooms){
		if(err)
			return res.send(err);

		return res.send(allRooms);
	})
});

router.post('/', function(req, res){
	var room = new Room({
		name: req.body.name,
		username: req.body.username
	});

	room.save(function(err, saved){
		if(err)
			return res.send({status: 404, message: 'Essa sala já existe, tente outro nome.'});
		else
			return res.send({room: saved, status: 200, message: 'Sala cadastrada com sucesso.'});
	})
});

module.exports = router;
