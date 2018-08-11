app.controller('LoginController', function($scope, $rootScope, $state, $filter, $cookies, User){

	//autentica usuario
	$scope.login = function(user){
		//lista usuarios
		User.login.find(user).$promise
			.then(function(data){
				//verifica se usuario existe
				if(data.status !== 404){
					$rootScope.authUser = data.user;
					$cookies.putObject('authUser', data.user);
					$rootScope.auth = true;
					$cookies.put('auth', true);
					$state.go('home');
				}

				Materialize.toast(data.message, 3000);
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
	};
});