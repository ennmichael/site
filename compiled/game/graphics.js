"use strict";
/// <reference path="pixi.js.d.ts"/>
/// <reference path="logic.ts"/>
var Graphics;
(function (Graphics) {
    var addAutoSizeLoopForApp = function (app, window) {
        var sizeUpdater = function () {
            app.view.width = window.innerWidth;
            app.view.height = window.innerHeight;
            app.renderer.resize(app.view.width, app.view.height);
        };
        app.ticker.add(sizeUpdater);
    };
    Graphics.autoSizedApp = function (window, options, noWebGL) {
        if (noWebGL === void 0) { noWebGL = false; }
        var app = new PIXI.Application(0, 0, options, noWebGL);
        addAutoSizeLoopForApp(app, window);
        return app;
    };
    var addAutoCenterLoopForContainer = function (container, app) {
        var positionUpdater = function () {
            container.x = (app.view.width - container.width) / 2;
            container.y = (app.view.height - container.height) / 2;
        };
        app.ticker.add(positionUpdater);
    };
    Graphics.autoCenteredContainer = function (app) {
        var container = new PIXI.Container();
        addAutoCenterLoopForContainer(container, app);
        return container;
    };
    Graphics.cell_size = 16;
    Graphics.drawCells = function (cells, scene) {
        var drawCell = function (cell) {
            var rectangle = new PIXI.Graphics();
            var fill_color = (Logic.cellIsAlive(cell)) ? Utils.Colors.black : Utils.Colors.white;
            rectangle.beginFill(fill_color);
            rectangle.drawRect(cell.position.x * Graphics.cell_size, cell.position.y * Graphics.cell_size, Graphics.cell_size - 1, Graphics.cell_size - 1);
            scene.addChild(rectangle);
        };
        var clearScreen = function () {
            scene.children = [];
        };
        clearScreen();
        for (var _i = 0, cells_1 = cells; _i < cells_1.length; _i++) {
            var cell = cells_1[_i];
            drawCell(cell);
        }
    };
})(Graphics || (Graphics = {}));
