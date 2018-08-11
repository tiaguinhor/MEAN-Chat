var express = require('express'),
	router = express.Router(),
	Message = require('../models/Message');

router.get('/:id', function(req, res){
	var roomId = req.params.id;

	Message.find({room: roomId}, function(err, allMessages){
		if(err)
			return res.send(err);

		return res.send(allMessages);
	})
});

router.post('/', function(req, res){
	var message = new Message({
		room: req.body.room,
		username: req.body.username,
		message: req.body.message
	});

	message.save(function(err, saved){
		if(err)
			return res.send({status: 404, message: 'Não foi possível salvar a mensagem.'});
		else
			return res.send({newMessage: saved, status: 200, message: 'Mensagem enviada com sucesso.'});
	})
});

module.exports = router;
