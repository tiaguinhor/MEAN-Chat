app.config(function($stateProvider, $urlRouterProvider){
	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state('home', {
			url: '/',
			views: {
				"menu": {
					templateUrl: 'partials/menu.html',
					controller: 'MenuController'
				},
				"": {
					templateUrl: 'partials/home.html',
					controller: 'HomeController'
				}
			}
		})
		.state('chat', {
			url: '/chat/:roomId',
			views: {
				"menu": {
					templateUrl: 'partials/menu.html',
					controller: 'MenuController'
				},
				"": {
					templateUrl: 'partials/chat.html',
					controller: 'ChatController'
				}
			}
		})
		.state('user', {
			url: '/user',
			views: {
				"menu": {
					templateUrl: 'partials/menu.html',
					controller: 'MenuController'
				},
				"": {
					templateUrl: 'partials/user.html',
					controller: 'UserController'
				}
			}
		})
		.state('login', {
			url: '/login',
			views: {
				"menu": {
					templateUrl: 'partials/menu.html',
					controller: 'MenuController'
				},
				"": {
					templateUrl: 'partials/login.html',
					controller: 'LoginController'
				}
			}
		});
});