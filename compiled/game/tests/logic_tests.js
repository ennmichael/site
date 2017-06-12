"use strict";
/// <reference path="../logic.ts"/>
var Logic;
(function (Logic) {
    var testPointsAreEqual = function () {
        var generateUniquePoints = function () {
            var result = [];
            xyLoop({ x: 50, y: 50 }, function (currentPoint) {
                result.push(currentPoint);
            });
            return result;
        };
        var uniquePoints = generateUniquePoints();
        for (var i = 0; i < uniquePoints.length; ++i) {
            console.assert(pointsAreEqual(uniquePoints[i], uniquePoints[i]), 'Point is equal to itself, but pointsAreEqual returns false: ' + uniquePoints[i]);
            for (var j = 0; j < uniquePoints.length; ++j) {
                if (i != j) {
                    console.assert(!pointsAreEqual(uniquePoints[i], uniquePoints[j]), "Points aren't the same, but pointsAreEqual returns true: " + uniquePoints[i] + ', ' + uniquePoints[j]);
                }
            }
        }
    };
    var testPointsAreBesides = function () {
        var knownPointsBesides = [
            pair({ x: 5, y: 5 }, { x: 4, y: 5 }),
            pair({ x: 5, y: 5 }, { x: 6, y: 5 }),
            pair({ x: 5, y: 5 }, { x: 5, y: 6 }),
            pair({ x: 5, y: 5 }, { x: 5, y: 4 }),
            pair({ x: 5, y: 5 }, { x: 4, y: 4 }),
            pair({ x: 5, y: 5 }, { x: 6, y: 6 })
        ];
        var knownPointsNotBesides = [
            pair({ x: 5, y: 5 }, { x: 3, y: 5 }),
            pair({ x: 5, y: 5 }, { x: 7, y: 5 }),
            pair({ x: 5, y: 5 }, { x: 5, y: 7 }),
            pair({ x: 5, y: 5 }, { x: 5, y: 3 }),
            pair({ x: 5, y: 5 }, { x: 4, y: 3 }),
            pair({ x: 5, y: 5 }, { x: 4, y: 7 }),
            pair({ x: 5, y: 5 }, { x: 7, y: 6 }),
            pair({ x: 5, y: 5 }, { x: 3, y: 6 })
        ];
        for (var _i = 0, knownPointsBesides_1 = knownPointsBesides; _i < knownPointsBesides_1.length; _i++) {
            var pointPair = knownPointsBesides_1[_i];
            console.assert(pointsAreBesides(pointPair.first, pointPair.second), 'Points are besides one another, but areBesides returns false: ' + pointPair.first + ', ' + pointPair.second);
        }
        for (var _a = 0, knownPointsNotBesides_1 = knownPointsNotBesides; _a < knownPointsNotBesides_1.length; _a++) {
            var pointPair = knownPointsNotBesides_1[_a];
            console.assert(!pointsAreBesides(pointPair.first, pointPair.second), "Points aren't besides one another, but areBesides return true: " + pointPair.first + ', ' + pointPair.second);
        }
    };
    var testUnderpopulationRule = function () {
        var rule = underpopulationRule();
        var neighbourCountsRuleDoesntApplyTo = [
            2, 3, 4, 5, 6, 7, 8, 9
        ];
        for (var _i = 0, neighbourCountsRuleDoesntApplyTo_1 = neighbourCountsRuleDoesntApplyTo; _i < neighbourCountsRuleDoesntApplyTo_1.length; _i++) {
            var neighbourCount = neighbourCountsRuleDoesntApplyTo_1[_i];
            console.assert(!rule.appliesToLiveNeighbourCount(neighbourCount), "Underpopulation rule shouldn't apply to neighbourCount " + neighbourCount + ", but it does.");
        }
        console.assert(rule.appliesToCellState(CellState.Alive), "Underpopulation rule should apply to cells that are alive, but it doesn't");
        console.assert(!rule.appliesToCellState(CellState.Dead), "Underpopulation rule shouldn't apply to cells that are dead, but it does");
    };
    Logic.runTests = function () {
        testPointsAreBesides();
        testPointsAreEqual();
        testUnderpopulationRule();
        console.log('Tests ran');
    };
})(Logic || (Logic = {}));
