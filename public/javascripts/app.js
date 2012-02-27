$(function () {
    var socket = io.connect(host);
    var game = new GameView(socket);
    game.render();
});
