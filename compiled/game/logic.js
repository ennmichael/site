"use strict";
/// <reference path="utils.ts"/>
var Logic;
(function (Logic) {
    var GameOfLife = (function () {
        function GameOfLife(rules_, cells) {
            var _this = this;
            this.rules_ = rules_;
            this.advanceGeneration = function () {
                for (var _i = 0, _a = _this.rules_; _i < _a.length; _i++) {
                    var rule = _a[_i];
                    _this.cellsTable_.addSnapshotForRule(rule);
                }
                _this.cellsTable_.applyRuleSnapshots();
            };
            this.cellsTable_ = new CellsTable(cells);
        }
        Object.defineProperty(GameOfLife.prototype, "cells", {
            get: function () {
                return this.cellsTable_.cells;
            },
            enumerable: true,
            configurable: true
        });
        GameOfLife.boardSize = 30;
        return GameOfLife;
    }());
    Logic.GameOfLife = GameOfLife;
    Logic.createCells = function (size, liveCellsPositions) {
        var result = [];
        for (var _i = 0, _a = Utils.allPointsUpTo({ x: size, y: size }); _i < _a.length; _i++) {
            var point = _a[_i];
            var state = (Utils.arrayContains(liveCellsPositions, point, Utils.pointsAreEqual)) ? 0 /* Alive */ : 1 /* Dead */;
            result.push({ state: state, position: point });
        }
        return result;
    };
    var CellsTable = (function () {
        function CellsTable(cells_) {
            var _this = this;
            this.cells_ = cells_;
            this.addSnapshotForRule = function (rule) {
                _this.ruleSnapshots_.push({
                    targetCells: _this.getTargetCellsForRule(rule),
                    newCellState: rule.newCellState
                });
            };
            this.getTargetCellsForRule = function (rule) {
                var result = [];
                for (var _i = 0, _a = _this.cells_; _i < _a.length; _i++) {
                    var cell = _a[_i];
                    var neighbourCount = _this.getNeighbourCountForCell(cell);
                    if (rule.appliesToNeighbourCount(neighbourCount) && rule.targetCellState == cell.state) {
                        result.push(cell);
                    }
                }
                return result;
            };
            this.getNeighbourCountForCell = function (centerCell) {
                var liveCells = _this.getLiveCells();
                var neighbourCells = Utils.filterArray(liveCells, function (cell) { return cellsAreNeighbours(cell, centerCell); });
                return neighbourCells.length;
            };
            this.getLiveCells = function () { return Utils.filterArray(_this.cells_, Logic.cellIsAlive); };
            this.applyRuleSnapshots = function () {
                for (var _i = 0, _a = _this.ruleSnapshots_; _i < _a.length; _i++) {
                    var snapshot = _a[_i];
                    _this.applyRuleSnapshot(snapshot);
                }
                Utils.clearArray(_this.ruleSnapshots_);
            };
            this.applyRuleSnapshot = function (snapshot) {
                for (var _i = 0, _a = snapshot.targetCells; _i < _a.length; _i++) {
                    var cell = _a[_i];
                    _this.cells_[_this.cells_.indexOf(cell)] = { state: snapshot.newCellState, position: cell.position };
                }
            };
            this.ruleSnapshots_ = [];
        }
        Object.defineProperty(CellsTable.prototype, "cells", {
            get: function () {
                return this.cells_;
            },
            enumerable: true,
            configurable: true
        });
        return CellsTable;
    }());
    Logic.getConwaysRules = function () { return [
        AutomationRules.overpopulation,
        AutomationRules.reproduction,
        AutomationRules.survival,
        AutomationRules.underpopulation
    ]; };
    var cellsAreNeighbours = function (c1, c2) { return Utils.pointsAreBesides(c1.position, c2.position); };
    Logic.cellIsAlive = function (cell) { return cell.state == 0 /* Alive */; };
    var AutomationRules;
    (function (AutomationRules) {
        AutomationRules.underpopulation = {
            appliesToNeighbourCount: function (neighbourCount) { return neighbourCount < 2; },
            targetCellState: 0 /* Alive */,
            newCellState: 1 /* Dead */
        };
        AutomationRules.survival = {
            appliesToNeighbourCount: function (neighbourCount) { return neighbourCount == 2 || neighbourCount == 3; },
            targetCellState: 0 /* Alive */,
            newCellState: 0 /* Alive */
        };
        AutomationRules.overpopulation = {
            appliesToNeighbourCount: function (neighbourCount) { return neighbourCount > 3; },
            targetCellState: 0 /* Alive */,
            newCellState: 1 /* Dead */
        };
        AutomationRules.reproduction = {
            appliesToNeighbourCount: function (neighbourCount) { return neighbourCount == 3; },
            targetCellState: 1 /* Dead */,
            newCellState: 0 /* Alive */
        };
    })(AutomationRules || (AutomationRules = {}));
    // Fuck you
    Logic.runTests = function () {
        // Tests please
    };
})(Logic || (Logic = {}));
