app.factory("timestampInterceptor", function(){
	return {
		request: function(config){
			var url = config.url;
			if(url.indexOf('view') > -1) return config;
			var timestamp = new Date().getTime();
			config.url = url + "?tp=" + timestamp;
			return config;
		}
	};
});