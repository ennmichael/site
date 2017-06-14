"use strict";
var Utils;
(function (Utils) {
    Utils.pair = function (first, second) {
        return { first: first, second: second };
    };
    Utils.pointsAreBesides = function (p1, p2) {
        if (Utils.pointsAreEqual(p1, p2))
            return false;
        var distance = Utils.distanceBetweenPoints(p1, p2);
        return distance.x <= 1 && distance.y <= 1;
    };
    Utils.pointsAreEqual = function (p1, p2) { return p1.x == p2.x && p1.y == p2.y; };
    Utils.distanceBetweenPoints = function (p1, p2) {
        return {
            x: Math.abs(p1.x - p2.x),
            y: Math.abs(p1.y - p2.y),
        };
    };
    // Maybe all these array utils should share a namespace
    Utils.filterArray = function (array, predicate) {
        var result = [];
        for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
            var elem = array_1[_i];
            if (predicate(elem))
                result.push(elem);
        }
        return result;
    };
    Utils.clearArray = function (array) {
        var length = array.length;
        for (var i = 0; i < length; ++i) {
            array.pop();
        }
    };
    Utils.operatorEqualsComparer = function (a, b) { return a == b; };
    Utils.indexOfElement = function (array, elem, equalityComparer) {
        if (equalityComparer === void 0) { equalityComparer = Utils.operatorEqualsComparer; }
        for (var i = 0; i < array.length; ++i) {
            if (equalityComparer(array[i], elem))
                return i;
        }
        return -1;
    };
    Utils.arrayContains = function (haystack, needle, equalityComparer) {
        if (equalityComparer === void 0) { equalityComparer = Utils.operatorEqualsComparer; }
        return Utils.indexOfElement(haystack, needle, equalityComparer) != -1;
    };
    Utils.removeFromArray = function (array, elem, equalityComparer) {
        if (equalityComparer === void 0) { equalityComparer = Utils.operatorEqualsComparer; }
        array.splice(Utils.indexOfElement(array, elem, equalityComparer), 1);
    };
    Utils.allPointsUpTo = function (limit) {
        var result = [];
        for (var x = 0; x < limit.x; ++x) {
            for (var y = 0; y < limit.y; ++y) {
                result.push({ x: x, y: y });
            }
        }
        return result;
    };
    Utils.valueIsInRange = function (value, range) { return value >= range.from && value <= range.to; };
    Utils.range = function (from, to) {
        return {
            from: from,
            to: to
        };
    };
    // Fuck off
    var testPointsAreBesides = function () {
        var knownPointsBesides = [
            Utils.pair({ x: 5, y: 5 }, { x: 4, y: 5 }),
            Utils.pair({ x: 5, y: 5 }, { x: 6, y: 5 }),
            Utils.pair({ x: 5, y: 5 }, { x: 5, y: 6 }),
            Utils.pair({ x: 5, y: 5 }, { x: 5, y: 4 }),
            Utils.pair({ x: 5, y: 5 }, { x: 4, y: 4 }),
            Utils.pair({ x: 5, y: 5 }, { x: 6, y: 6 })
        ];
        var knownPointsNotBesides = [
            Utils.pair({ x: 5, y: 5 }, { x: 3, y: 5 }),
            Utils.pair({ x: 5, y: 5 }, { x: 7, y: 5 }),
            Utils.pair({ x: 5, y: 5 }, { x: 5, y: 7 }),
            Utils.pair({ x: 5, y: 5 }, { x: 5, y: 3 }),
            Utils.pair({ x: 5, y: 5 }, { x: 4, y: 3 }),
            Utils.pair({ x: 5, y: 5 }, { x: 4, y: 7 }),
            Utils.pair({ x: 5, y: 5 }, { x: 7, y: 6 }),
            Utils.pair({ x: 5, y: 5 }, { x: 3, y: 6 })
        ];
        for (var _i = 0, knownPointsBesides_1 = knownPointsBesides; _i < knownPointsBesides_1.length; _i++) {
            var pointPair = knownPointsBesides_1[_i];
            console.assert(Utils.pointsAreBesides(pointPair.first, pointPair.second), 'Points are besides one another, but areBesides returns false: ' + pointPair.first + ', ' + pointPair.second);
        }
        for (var _a = 0, knownPointsNotBesides_1 = knownPointsNotBesides; _a < knownPointsNotBesides_1.length; _a++) {
            var pointPair = knownPointsNotBesides_1[_a];
            console.assert(!Utils.pointsAreBesides(pointPair.first, pointPair.second), "Points aren't besides one another, but areBesides returns true: " + pointPair.first + ', ' + pointPair.second);
        }
    };
    var Colors;
    (function (Colors) {
        Colors.white = 0xFFFFFF;
        Colors.black = 0x000000;
    })(Colors = Utils.Colors || (Utils.Colors = {}));
    var testPointsAreEqual = function () {
        var generateUniquePoints = function () {
            var result = [];
            for (var _i = 0, _a = Utils.allPointsUpTo({ x: 50, y: 50 }); _i < _a.length; _i++) {
                var currentPoint = _a[_i];
                result.push(currentPoint);
            }
            return result;
        };
        var uniquePoints = generateUniquePoints();
        for (var i = 0; i < uniquePoints.length; ++i) {
            console.assert(Utils.pointsAreEqual(uniquePoints[i], uniquePoints[i]), 'Point is equal to itself, but pointsAreEqual returns false: ' + uniquePoints[i]);
            for (var j = 0; j < uniquePoints.length; ++j) {
                if (i != j) {
                    console.assert(!Utils.pointsAreEqual(uniquePoints[i], uniquePoints[j]), "Points aren't the same, but pointsAreEqual returns true: " + uniquePoints[i] + ', ' + uniquePoints[j]);
                }
            }
        }
    };
    var testFilterArray = function () {
        var numbers = [1, 2, 3, 5, 6, 8, 12, 15];
        var isEven = function (n) { return n % 2 == 0; };
        var evenNumbers = Utils.filterArray(numbers, isEven);
        console.assert(evenNumbers.every(isEven), 'Filtered numbers should all be even');
    };
    var testClearArray = function () {
        var numbers = [1, 2, 3, 5, 6, 8, 12, 15];
        Utils.clearArray(numbers);
        console.assert(numbers.length == 0, "After clearing an array, it's length should be 0, but it's " + numbers.length);
    };
    var testArrayContains = function () {
        var numbers = [1, 2, 3, 5, 6, 8, 12, 15];
        console.assert(Utils.arrayContains(numbers, 2), "2 contained in " + numbers + ", but arrayContains returns false");
        console.assert(!Utils.arrayContains(numbers, 1024), "1024 not contained in " + numbers + ", but arrayContains returns true");
    };
    var testRemoveFromArray = function () {
        var numbers = [1, 2, 3, 5, 6, 8, 12, 15];
        var elemToRemove = 3;
        Utils.removeFromArray(numbers, elemToRemove);
        console.assert(!Utils.arrayContains(numbers, elemToRemove), 'Array still contains removed element ' + elemToRemove);
    };
    var testRange = function () {
        var numbers = Utils.range(0, 10);
        console.assert(Utils.valueIsInRange(5, numbers), 'Value is in range, yet valueIsInRange returns false');
        console.assert(Utils.valueIsInRange(3, numbers), 'Value is in range, yet valueIsInRange returns false');
        console.assert(Utils.valueIsInRange(10, numbers), 'Edge case value is in range, yet valueIsInRange returns false');
        console.assert(Utils.valueIsInRange(0, numbers), 'Edge case value is in range, yet valueIsInRange returns false');
    };
    Utils.runTests = function () {
        testPointsAreBesides();
        testPointsAreEqual();
        testFilterArray();
        testClearArray();
        testArrayContains();
        testRemoveFromArray();
        testRange();
    };
})(Utils || (Utils = {}));
