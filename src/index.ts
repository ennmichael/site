import * as server from './server';
import * as routing from './routing';

const mimeMap = routing.MimeMap.defaultingTo('text/html')
    .addMapping('.png', 'image/png')
    .addMapping('.ico', 'image/x-icon')
    .addMapping('.js', 'text/javascript');

const router = new routing.Router({ badRequestFile: 'badrequest.html', gameFile: 'game.html' }, mimeMap)
    .allowAccessToFile('pepe.png')
    .allowAccessToFile('lib/pixi.min.js')
    .allowAccessToFile('compiled/game/main.js')
    .allowAccessToFile('compiled/game/graphics.js')
    .allowAccessToFile('compiled/game/logic.js')
    .allowAccessToFile('compiled/game/utils.js')
    .allowAccessToFile('compiled/game/input.js')
    .allowAccessToFile('img/bunny.png');
    
server.start(8000, router);

console.log("Server started");
