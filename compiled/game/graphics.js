"use strict";
/// <reference path="pixi.js.d.ts"/>
/// <reference path="logic.ts"/>
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Graphics;
(function (Graphics) {
    var AutoSizedApp = (function (_super) {
        __extends(AutoSizedApp, _super);
        function AutoSizedApp(window, options, noWebGL, sharedTicker, sharedLoader) {
            var _this = _super.call(this, 0, 0, options, noWebGL, sharedTicker, sharedLoader) || this;
            _this.window = window;
            _this.sizeUpdater = function () {
                _this.view.width = _this.window.innerWidth;
                _this.view.height = _this.window.innerHeight;
            };
            _this.ticker.add(_this.sizeUpdater);
            return _this;
        }
        return AutoSizedApp;
    }(PIXI.Application));
    Graphics.AutoSizedApp = AutoSizedApp;
    Graphics.drawCells = function (cells, app) {
        var cell_size = 16;
        var gameContainer = new PIXI.Container();
        var drawCell = function (cell) {
            var rectangle = new PIXI.Graphics();
            var fill_color = (Logic.cellIsAlive(cell)) ? Utils.Colors.black : Utils.Colors.white;
            rectangle.beginFill(fill_color);
            rectangle.drawRect(cell.position.x * cell_size, cell.position.y * cell_size, cell_size, cell_size);
            gameContainer.addChild(rectangle);
        };
        var drawGameContainer = function () {
            gameContainer.x = (app.view.width - gameContainer.width) / 2;
            gameContainer.y = (app.view.height - gameContainer.height) / 2;
            app.stage.addChild(gameContainer);
        };
        var clearScreen = function () {
            Utils.clearArray(app.stage.children);
        };
        clearScreen();
        for (var _i = 0, cells_1 = cells; _i < cells_1.length; _i++) {
            var cell = cells_1[_i];
            drawCell(cell);
        }
        drawGameContainer();
        console.log('');
    };
})(Graphics || (Graphics = {}));
