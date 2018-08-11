app
	.factory('Socket', function(socketFactory){
		var myIoSocket = io.connect("http://127.0.0.1:3000", {forceNew: true});

		mySocket = socketFactory({
			ioSocket: myIoSocket
		});

		return mySocket;
		// return socketFactory();
	})

	.factory('User', function($resource){
		return {
			rest: $resource('/api/users/:id', {id: '@id'}),
			login: $resource('/api/users/login', {
				username: '@username',
				password: '@password'
			}, {find: {method: 'POST'}})
		}
	})

	.factory('Message', function($resource){
		return {
			rest: $resource('/api/messages/:id', {id: '@id'})
		}
	})

	.factory('Room', function($resource){
		return {
			rest: $resource('/api/rooms/:id', {id: '@id'})
		}
	});