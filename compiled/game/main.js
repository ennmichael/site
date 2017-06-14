"use strict";
/// <reference path="pixi.js.d.ts"/>
/// <reference path="graphics.ts"/>
/// <reference path="input.ts"/>
(function () {
    var everyNthFrame = function (n, action) {
        var counter = 0; // Factor this into a separate class
        app.ticker.add(function () {
            if (counter % n == 0) {
                action();
            }
            ++counter;
        });
    };
    var testing = false;
    if (testing) {
        Utils.runTests();
        Logic.runTests();
        console.log('Tests ran');
    }
    var app = Graphics.autoSizedApp(window, { backgroundColor: Utils.Colors.black });
    app.stage = Graphics.autoCenteredContainer(app);
    document.body.appendChild(app.view);
    var drawReadding = function () {
        Graphics.drawCells(Logic.createCells(Logic.GameOfLife.boardSize, inputReader.liveCellsPositions), app.stage);
    };
    var stopDrawingReading = function () {
        app.ticker.remove(drawReadding);
    };
    var onReadingEnded = function (inputReader) {
        var game = new Logic.GameOfLife(Logic.getConwaysRules(), Logic.createCells(Logic.GameOfLife.boardSize, inputReader.liveCellsPositions));
        stopDrawingReading();
        everyNthFrame(5, function () {
            Graphics.drawCells(game.cells, app.stage);
            game.advanceGeneration();
        });
    };
    var inputReader = new Input.Reader(app.stage, window, onReadingEnded);
    app.ticker.add(drawReadding);
})();
