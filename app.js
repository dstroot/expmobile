
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , socketio = require('socket.io');  // add socket.io

var app = express()
  , server = http.createServer(app)   // create a server
  , io = socketio.listen(server);     // bind socket.io to server

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hjs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

server.listen(app.get('port'), function(){  // start server on port
  console.log("Express server listening on port " + app.get('port'));
});

// socket.io stuff
io.sockets.on('connection', function(socket){
  socket.emit('question', { q: 'What is your favorite color?', a: ['red', 'yellow', 'orange'] });
  socket.on('client event', function (data) {
    console.log(data);
  });
});
