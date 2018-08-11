app.controller('HomeController', function($scope, $rootScope, $state, $cookies, Socket, Room){

	//verifica se usuario esta logado
	if(!$rootScope.auth) return;

	Socket.connect();
	Socket.emit('switchRoom', null);

	Room.rest.query().$promise
		.then(function(data){
			Socket.emit('loadRooms', data);
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

	$scope.createRoom = function(newRoom){
		delete $scope.newRoom;

		if(newRoom.name){
			Room.rest.save({
				name: newRoom.name,
				username: $rootScope.authUser.username
			}, function(data){
				if(data.status === 200)
					Socket.emit('newRoom', data.room);

				Materialize.toast(data.message, 3000);
			}, function(err){
				console.log(err);
			});
		}
	};

	Socket.on('updateRooms', function(data){
		if($scope.rooms)
			$scope.rooms.push(data);
		else
			$scope.rooms = data;
	});

	Socket.on('removeRoom', function(data){
		$scope.rooms.splice($scope.rooms.indexOf(data.roomname), 1);
	});

	$rootScope.$on('$stateChangeStart', function(event){
		Socket.disconnect(true);
	});
});