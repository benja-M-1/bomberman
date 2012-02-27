
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();
var io  = require('socket.io').listen(app);

_ = require('underscore')._;
Backbone = require('backbone');

var Player  = require('./model/player');
var Players = require('./model/player_collection');

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', { layout: false });
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'w3lcom3inb0mb3rman' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

// Controllers
app.get('/', function(req, res) {
  res.render('index', { 'host': req.header('host') });
});

// Player collection
var players = new Players();

io.sockets.on('connection', function (socket) {
  socket.on('subscribe', function(data) {
    var player = new Player({ id: socket.id ,name: data.name });
    players.add(player, { at: player.get('id') });

    socket.emit('connected', { players: players.toJSON() });
    socket.broadcast.emit('player:new', { player: player })
  });
});


