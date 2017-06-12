"use strict";
/// <reference path="pixi.js.d.ts"/>
/// <reference path="graphics.ts"/>
var app = new Graphics.AutoSizedApp(window, { backgroundColor: Utils.Colors.white });
document.body.appendChild(app.view);
Utils.runTests();
Logic.runTests();
console.log('Tests ran');
var game = new Logic.GameOfLife(Logic.getConwaysRules(), Logic.createCells(Logic.GameOfLife.boardSize, [
    { x: 0, y: 2 },
    { x: 1, y: 1 },
    { x: 2, y: 1 }
]));
var counter = 0;
PIXI.
;
new PIXI.Sprite().on('click', function () {
});
app.ticker.add(function () {
    ++counter;
    if (counter % 10 == 0) {
        Graphics.drawCells(game.readonlyCellArray, app);
        game.advanceGeneration();
    }
});
