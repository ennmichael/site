"use strict";
/// <reference path="logic.ts"/>
/// <reference path="graphics.ts"/>
/// <reference path="utils.ts"/>
/// <reference path="pixi.js.d.ts"/>
var Input;
(function (Input) {
    var Reader = (function () {
        function Reader(stage, window, onReadingEnded) {
            var _this = this;
            this.toggleCellAtPosition = function (position) {
                if (Utils.arrayContains(_this.liveCellsPositions_, position, Utils.pointsAreEqual)) {
                    Utils.removeFromArray(_this.liveCellsPositions_, position, Utils.pointsAreEqual);
                }
                else {
                    _this.liveCellsPositions_.push(position);
                }
            };
            this.liveCellsPositions_ = [];
            var toggleCells = function (clientMousePosition) {
                var mouseOffset = -6.5;
                var pointerTipPosition = { x: clientMousePosition.x + mouseOffset, y: clientMousePosition.y + mouseOffset };
                if (pointIsInsideContainer(stage, pointerTipPosition)) {
                    var clickRelativeToStage = pointRelativeToContainer(stage, pointerTipPosition);
                    var clickOnBoard = translatePointToBoard(clickRelativeToStage);
                    _this.toggleCellAtPosition(clickOnBoard);
                }
            };
            var actionToLeftMouseButtonBinding = Input.bindActionToLeftMouseButton(window, toggleCells);
            var actionToEnterKeyBinding = Input.bindActionToEnterKey(window, function () {
                onReadingEnded(_this);
                actionToLeftMouseButtonBinding.unbind();
                actionToEnterKeyBinding.unbind();
            });
        }
        Object.defineProperty(Reader.prototype, "liveCellsPositions", {
            get: function () {
                return this.liveCellsPositions_;
            },
            enumerable: true,
            configurable: true
        });
        return Reader;
    }());
    Input.Reader = Reader;
    Input.bindActionToEnterKey = function (window, action) { return bindActionToKey(window, 13, action); };
    var bindActionToKey = function (window, keyCode, action) {
        return ActionBinding.boundTo(window, 'keypress', function (event) {
            if (event.keyCode == keyCode) {
                action();
            }
        });
    };
    Input.bindActionToLeftMouseButton = function (window, action) {
        return bindActionToMouseButton(window, 0, action);
    };
    var bindActionToMouseButton = function (window, button, action) {
        return ActionBinding.boundTo(window, 'mouseup', function (mouseEvent) {
            if (mouseEvent.button == button)
                action({
                    x: mouseEvent.clientX,
                    y: mouseEvent.clientY
                });
        });
    };
    var ActionBinding = (function () {
        function ActionBinding(window_, on_, eventListener_) {
            var _this = this;
            this.window_ = window_;
            this.on_ = on_;
            this.eventListener_ = eventListener_;
            this.unbind = function () {
                _this.window_.removeEventListener(_this.on_, _this.eventListener_);
            };
            this.window_.addEventListener(this.on_, this.eventListener_);
        }
        ActionBinding.boundTo = function (window, on, eventListener) {
            return new ActionBinding(window, on, eventListener);
        };
        return ActionBinding;
    }());
    Input.ActionBinding = ActionBinding;
    var pointRelativeToContainer = function (container, mousePosition) {
        return {
            x: mousePosition.x - container.x,
            y: mousePosition.y - container.y
        };
    };
    var pointIsInsideContainer = function (container, point) {
        return Utils.valueIsInRange(point.x, Utils.range(container.x, container.x + container.width)) &&
            Utils.valueIsInRange(point.y, Utils.range(container.y, container.y + container.height));
    };
    var translatePointToBoard = function (point) {
        return {
            x: Math.floor(point.x / Graphics.cell_size),
            y: Math.floor(point.y / Graphics.cell_size)
        };
    };
})(Input || (Input = {}));
