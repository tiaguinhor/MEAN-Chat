app.controller('MenuController', function($scope, $rootScope, $state, $cookies){

	//menu mobile
	AS(".button-collapse").sideNav({
		edge: 'right',
		closeOnClick: true
	});
	
	//verifica se usuario esta logado
	if($cookies.get('auth')){
		$rootScope.auth = true;
		$rootScope.authUser = $cookies.getObject('authUser');
	}else if(!$cookies.get('auth') && ($state.$current == 'home' || $state.$current == 'chat')){
		Materialize.toast('Necessário estar logado para acessar essa página!', 3000);
		$rootScope.auth = false;
		$state.go('login');
	}

	//desconecta usuario
	$scope.logout = function(){
		$rootScope.authUser = {};
		$rootScope.auth = false;
		$cookies.remove('authUser');
		$cookies.remove('auth');
		$state.go('login');
		Materialize.toast('Usuário desconectado com sucesso!', 3000);
	};
});