app.controller('ChatController', function($scope, $rootScope, $state, $stateParams, $cookies, Socket, Message){

	//verifica se usuario esta logado
	if(!$rootScope.auth) return;

	Socket.connect();
	$scope.users = [];
	$scope.messages = [];
	var _username = $rootScope.authUser.username;

	Socket.emit('switchRoom', $stateParams.roomId);
	Socket.emit('loadUsers');
	Socket.emit('addUser', {room: $stateParams.roomId, username: _username});

	Message.rest.query({id: $stateParams.roomId}).$promise
		.then(function(data){
			$scope.messages = data;
		})
		.catch(function(err){
			err = err.data;
			$scope.errors = {};

			// Update validity of form fields that match the mongoose errors
			angular.forEach(err.errors, function(error, field){
				form[field].$setValidity('mongoose', false);
				$scope.errors[field] = error.type;
			});
		});

	$scope.sendMessage = function(newMessage){
		delete $scope.newMessage;

		if(newMessage.message){
			Message.rest.save({
				room: $stateParams.roomId,
				message: newMessage.message,
				username: _username
			}, function(data){
				if(data.status === 200)
					Socket.emit('sendChat', data.newMessage);
			}, function(err){
				console.log(err);
			});
		}
	};

	Socket.on('updateChat', function(data){
		$scope.messages.push(data);
	});

	Socket.on('loadUsers', function(users){
		$scope.users = users;
	});

	Socket.on('updateUsers', function(username){
		$scope.users.push(username);
		// $scope.messages.push({username: username, message: 'entrou na sala.'});
	});

	Socket.on('removeUser', function(username){
		$scope.users.splice($scope.users.indexOf(username), 1);
		// $scope.messages.push({username: username, message: 'saiu da sala.'});
	});

	$rootScope.$on('$stateChangeStart', function(event){
		Socket.disconnect(true);
	});
});