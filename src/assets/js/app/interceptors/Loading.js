app.factory("loadingInterceptor", function($q, $rootScope, $timeout){
	return {
		request: function(config){
			$rootScope.completeLoading = false;

			return config;
		},
		requestError: function(rejection){
			$rootScope.completeLoading = false;
			
			return $q.reject(rejection);
		},
		response: function(response){
			// $timeout(function(){
				$rootScope.completeLoading = true;
			// }, 1000);
			return response;
		},
		responseError: function(rejection){
			$rootScope.completeLoading = false;
			
			return $q.reject(rejection);
		}
	};
});