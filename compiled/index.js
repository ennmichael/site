"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server = require("./server");
const routing = require("./routing");
const mimeMap = routing.MimeMap.defaultingTo('text/html')
    .addMapping('.png', 'image/png')
    .addMapping('.ico', 'image/x-icon')
    .addMapping('.js', 'text/javascript');
const router = new routing.Router({ badRequestFile: 'badrequest.html', gameFile: 'game.html' }, mimeMap)
    .allowAccessToFile('pepe.png')
    .allowAccessToFile('lib/pixi.min.js')
    .allowAccessToFile('compiled/game/main.js')
    .allowAccessToFile('bunny\\d.png');
server.start(8888, router);
console.log("Server started");
