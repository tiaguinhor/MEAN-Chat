var express = require('express'),
	path = require('path'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	mongoose = require('mongoose'),
	methodOverride = require('method-override'),
	dotenv = require('dotenv'),
	app = express(),
	http = require('http').createServer(app),
	io = require('socket.io')(http);

// Load environment variables from .env file
dotenv.load();

//CONNECT TO MONGO
mongoose.connect(process.env.MONGODB, function(err){
	if(err)
		console.error(err);
	else
		console.log('Conectado ao mongo com sucesso.');
});

var usernames = [];
var rooms = [];
io.sockets.on('connection', function(socket){
	socket.on('addUser', function(data){
		usernames.push(data.username);
		socket.username = data.username;
		socket.room = data.room;
		io.sockets.in(data.room).emit('updateUsers', data.username);

		socket.join(data.room);
		socket.broadcast.to(data.room).emit('updateChat', {
			username: 'SERVER',
			message: data.username + ' entrou na sala.',
			room: data.room
		});
	});

	socket.on('loadUsers', function(){
		socket.emit('loadUsers', usernames);
	});

	socket.on('loadRooms', function(data){
		rooms = data;
		socket.emit('updateRooms', data);
	});

	socket.on('newRoom', function(data){
		rooms.push(data);
		io.sockets.in('rooms').emit('updateRooms', data);
	});

	socket.on('sendChat', function(data){
		io.sockets.in(socket.room).emit('updateChat', data);
	});

	socket.on('switchRoom', function(newroom){
		socket.leave(socket.room);

		// sent message to OLD room
		socket.broadcast.to(socket.room).emit('updateChat', {
			username: 'SERVER',
			message: socket.username + ' saiu da sala.',
			room: socket.room
		});

		if(newroom && newroom != ''){
			socket.join(newroom);
			socket.room = newroom;
		}else{
			socket.join('rooms');
			socket.room = 'rooms';
		}
	});

	socket.on('disconnect', function(){
		usernames.splice(usernames.indexOf(socket.username), 1);
		io.sockets.in(socket.room).emit('removeUser', socket.username);

		socket.leave(socket.room);
	});
});

// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'public', 'views'));
// app.set('view engine', 'html');
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(session({secret: 'as89s0dfjsdiofjas90d8as0', resave: false, saveUninitialized: true}));
app.use(express.static(path.join(__dirname, 'public')));
//app.use('/js', express.static(path.join(__dirname, 'public/js')));

//CORS SUPPORT
app.use(function(req, res, next){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

//ROUTES GROUP
var routes = require('./routes/index');
var routeUsers = require('./routes/users');
var routeMessages = require('./routes/messages');
var routeRooms = require('./routes/rooms');

app.use('/', routes);
app.use('/api/users', routeUsers);
app.use('/api/messages', routeMessages);
app.use('/api/rooms', routeRooms);

// catch 404 and forward to error handler
app.use(function(req, res, next){
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if(app.get('env') === 'development'){
	app.use(function(err, req, res, next){
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next){
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

app.set('port', process.env.PORT || 3000);

http.listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;