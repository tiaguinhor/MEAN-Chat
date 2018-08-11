var express = require('express'),
	router = express.Router(),
	User = require('../models/User');

router.get('/', function(req, res, next){
	var select = req.query.select;
	var responseObject = [];

	User.find({}, function(err, foundObject){
		if(err){
			return res.status(500).send();
		}else{
			if(foundObject.length){
				responseObject = foundObject;
				if(select && select == 'count')
					responseObject = {count: foundObject.length};

				return res.send(responseObject);
			}else{
				responseObject = undefined;
				if(select && select == 'count')
					responseObject = {count: 0};

				return res.status(404).send(responseObject);
			}
		}
	});
});

router.get('/:id', function(req, res, next){
	var userId = req.params.id;

	User.findById(userId, function(err, user){
		if(err)
			return next(new Error('Failed to load User'));

		if(user)
			return res.send(user);
		else
			return res.send(404, 'USER_NOT_FOUND');
	});
});

router.post('/', function(req, res, next){
	var name = req.body.name,
		username = req.body.username,
		password = req.body.password;

	var newUser = new User();
	newUser.name = name;
	newUser.username = username;
	newUser.password = password;
	newUser.save(function(err, saveObject){
		if(err)
			return res.send({status: 404, message: 'Esse usuário já existe, tente outro.'});
		else
			return res.send({status: 200, message: 'Usuário cadastrado com sucesso.'});
		// return res.status(200).send(saveObject);
	});
});

router.put('/:id', function(req, res, next){
	var id = req.params.id;

	User.findOne({_id: id}, function(err, foundObject){
		if(foundObject){
			if(req.body.name)
				foundObject.name = req.body.name;
			if(req.body.age)
				foundObject.age = req.body.age;

			foundObject.save(function(err, updatedObject){
				if(err){
					return res.status(500).send();
				}else
					return res.send(updatedObject);
			});
		}else
			return res.status(404).send();
	});
});

router.delete('/:id', function(req, res){
	var id = req.params.id;

	User.findOneAndRemove({_id: id}, function(err){
		if(err){
			console.error(err);
			return res.status(500).send();
		}

		return res.status(200).send();
	});
});

router.post('/login', function(req, res){
	var username = req.body.username,
		password = req.body.password;

	User.findOne({username: username}, function(err, user){
		if(err)
			return res.status(500).send();
		if(!user)
			return res.send({status: 404, message: "Usuário não encontrado."});

		user.comparePassword(password, function(err, isMatch){
			if(isMatch && isMatch === true){
				req.session.user = user;
				return res.send({status: 200, message: 'Seja bem vindo ' + user.name, user: user});
			}else
				return res.send({status: 404, message: "Senha inválida."});
		});
	});
});

router.get('/logout', function(req, res){
	req.session.destroy();
	return res.status(200).send('Desconectado com sucesso.');
});

module.exports = router;
