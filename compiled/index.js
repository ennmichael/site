"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var server = require("./server");
var routing = require("./routing");
var mimeMap = routing.MimeMap.defaultingTo('text/html')
    .addMapping('.png', 'image/png')
    .addMapping('.ico', 'image/x-icon')
    .addMapping('.js', 'text/javascript');
var router = new routing.Router({ badRequestFile: 'badrequest.html', gameFile: 'game.html' }, mimeMap)
    .allowAccessToFile('pepe.png')
    .allowAccessToFile('lib/pixi.min.js')
    .allowAccessToFile('compiled/game/main.js')
    .allowAccessToFile('compiled/game/graphics.js')
    .allowAccessToFile('compiled/game/logic.js')
    .allowAccessToFile('compiled/game/utils.js')
    .allowAccessToFile('img/bunny.png');
server.start(8000, router);
console.log("Server started");
