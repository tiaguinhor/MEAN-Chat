app.controller('UserController', function($scope, $rootScope, $state, Socket, User){
	
	$scope.user = {};
	$scope.errors = {};

	$scope.register = function(user){
		if($scope.form.$valid){
			// var newUser = new User();
			// newUser.name = user.name;
			// newUser.username = user.username;
			// newUser.password = user.password;
			// newUser.$save();
			User.rest.save({
				name: user.name,
				username: user.username,
				password: user.password
			}).$promise
				.then(function(data){
					Materialize.toast(data.message, 3000);

					// Account created, redirect to login
					if(data.status !== 404)
						$state.go('login');
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
		}
	};
});