var app = angular.module('test', ['ngResource', 'ngAnimate', 'ngSanitize', 'ui.router', 'ngCookies', 'btford.socket-io'])

	.run(function($rootScope, $state, $cookies){
		//atalho para selecionar um elemento com angular
		window.AS = function(selector){
			return angular.element(document.querySelectorAll(selector));
		};
	});