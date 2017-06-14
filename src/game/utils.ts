namespace Utils {
    export interface Point {
        readonly x: number;
        readonly y: number;
    }
    
    export interface Pair<T> {
        first: T;
        second: T;
    }
    
    export const pair = <T>(first: T, second: T): Pair<T> => {
        return { first: first, second: second };
    }
    
    export const pointsAreBesides = (p1: Utils.Point, p2: Utils.Point): boolean => {
        if (pointsAreEqual(p1, p2))
            return false;
        const distance = distanceBetweenPoints(p1, p2);
        return distance.x <= 1 && distance.y <= 1;
    }
    
    export const pointsAreEqual = (p1: Utils.Point, p2: Utils.Point): boolean =>  p1.x == p2.x && p1.y == p2.y;
    
    export const distanceBetweenPoints = (p1: Utils.Point, p2: Utils.Point): Utils.Point => {
        return {
            x: Math.abs(p1.x - p2.x),
            y: Math.abs(p1.y - p2.y),
        };
    }
    
    // Maybe all these array utils should share a namespace
    
    export const filterArray = <T>(array: T[]|ReadonlyArray<T>, predicate: (elem: T) => boolean): T[] => {
        const result: T[] = []
        for (const elem of array) {
            if (predicate(elem))
                result.push(elem);
        }
        return result;
    }
    
    export const clearArray = <T>(array: T[]): void => {
        const length = array.length;
        for (let i = 0; i < length; ++i) {
            array.pop();
        }
    }
    
    export interface EqualityComparer<T> {
        (a:T, b: T):  boolean;
    }
    
    export const operatorEqualsComparer = <T>(a: T, b: T): boolean => a == b;
    
    export const indexOfElement = <T>(array: T[]|ReadonlyArray<T>, elem: T, equalityComparer: EqualityComparer<T> = operatorEqualsComparer): number => {
        for (let i = 0; i < array.length; ++i) {
            if (equalityComparer(array[i], elem))
                return i;
        }
        return -1;
    }
    
    export const arrayContains = <T>(haystack: T[]|ReadonlyArray<T>, needle: T, equalityComparer: EqualityComparer<T> = operatorEqualsComparer): boolean => 
        indexOfElement(haystack, needle, equalityComparer) != -1;
    
    export const removeFromArray = <T>(array: T[], elem: T, equalityComparer: EqualityComparer<T> = operatorEqualsComparer): void => {
        array.splice(indexOfElement(array, elem, equalityComparer), 1);
    }
    
    export const allPointsUpTo = (limit: Point): Point[] =>{
        const result: Point[] = []
        for (let x = 0; x < limit.x; ++x) {
            for (let y = 0; y < limit.y; ++y) {
                result.push({ x, y });
            }
        }
        return result;
    }
    
    export const valueIsInRange = <T>(value: T, range: Range<T>): boolean => value >= range.from && value <= range.to;
    
    export interface Range<T> {
        from: T;
        to: T;
    }
    
    export const range = <T>(from: T, to: T): Range<T> => {
        return {
            from: from,
            to: to
        };
    }
    
    
    // Fuck off
    
    const testPointsAreBesides = () => {
        const knownPointsBesides: Utils.Pair<Utils.Point>[] = [
            Utils.pair({ x: 5, y: 5 }, { x: 4, y: 5 }),
            Utils.pair({ x: 5, y: 5 }, { x: 6, y: 5 }),
            Utils.pair({ x: 5, y: 5 }, { x: 5, y: 6 }),
            Utils.pair({ x: 5, y: 5 }, { x: 5, y: 4 }),
            Utils.pair({ x: 5, y: 5 }, { x: 4, y: 4 }),
            Utils.pair({ x: 5, y: 5 }, { x: 6, y: 6 })
        ];
        
        const knownPointsNotBesides: Utils.Pair<Utils.Point>[] = [
            Utils.pair({ x: 5, y: 5 }, { x: 3, y: 5 }),
            Utils.pair({ x: 5, y: 5 }, { x: 7, y: 5 }),
            Utils.pair({ x: 5, y: 5 }, { x: 5, y: 7 }),
            Utils.pair({ x: 5, y: 5 }, { x: 5, y: 3 }),
            Utils.pair({ x: 5, y: 5 }, { x: 4, y: 3 }),
            Utils.pair({ x: 5, y: 5 }, { x: 4, y: 7 }),
            Utils.pair({ x: 5, y: 5 }, { x: 7, y: 6 }),
            Utils.pair({ x: 5, y: 5 }, { x: 3, y: 6 })
        ];
        
        for (let pointPair of knownPointsBesides) {
            console.assert(
                Utils.pointsAreBesides(pointPair.first, pointPair.second), 
                'Points are besides one another, but areBesides returns false: '+pointPair.first+', '+pointPair.second);
        }
        
        for (let pointPair of knownPointsNotBesides) {
            console.assert(
                !Utils.pointsAreBesides(pointPair.first, pointPair.second),
                "Points aren't besides one another, but areBesides returns true: "+pointPair.first+', '+pointPair.second);
        }
    }
    
    export namespace Colors {
        export const white = 0xFFFFFF;
        export const black = 0x000000;
    }
    
    const testPointsAreEqual = (): void => {
        const generateUniquePoints = (): Utils.Point[] => {
            const result: Utils.Point[] = [];
            for (const currentPoint of allPointsUpTo({ x: 50, y: 50 }))
                result.push(currentPoint); 
            return result;
        }
        
        const uniquePoints = generateUniquePoints();
        
        for (let i = 0; i < uniquePoints.length; ++i) {
            console.assert(Utils.pointsAreEqual(uniquePoints[i], uniquePoints[i]),
            'Point is equal to itself, but pointsAreEqual returns false: '+uniquePoints[i]);
            for (let j = 0; j < uniquePoints.length; ++j) {
                if (i != j) {
                    console.assert(!Utils.pointsAreEqual(uniquePoints[i], uniquePoints[j]),
                    "Points aren't the same, but pointsAreEqual returns true: "+uniquePoints[i]+', '+uniquePoints[j]);
                }
            }
        }
    }
    
    const testFilterArray = (): void => {
        const numbers = [1, 2, 3, 5, 6, 8, 12, 15];
        const isEven = (n: number) => n % 2 == 0;
        const evenNumbers = filterArray(numbers, isEven);
        console.assert(evenNumbers.every(isEven),
        'Filtered numbers should all be even');
    }
    
    const testClearArray = (): void => {
        const numbers = [1, 2, 3, 5, 6, 8, 12, 15];
        clearArray(numbers);
        console.assert(numbers.length == 0, 
        "After clearing an array, it's length should be 0, but it's "+numbers.length);
    }
    
    const testArrayContains = (): void => {
        const numbers = [1, 2, 3, 5, 6, 8, 12, 15];
        console.assert(arrayContains(numbers, 2), 
        "2 contained in "+numbers+", but arrayContains returns false");
        console.assert(!arrayContains(numbers, 1024), 
        "1024 not contained in "+numbers+", but arrayContains returns true");
    }
    
    const testRemoveFromArray = (): void => {
        const numbers = [1, 2, 3, 5, 6, 8, 12, 15];
        const elemToRemove = 3;
        removeFromArray(numbers, elemToRemove);
        console.assert(!arrayContains(numbers, elemToRemove), 
        'Array still contains removed element '+elemToRemove);
    }
    
    const testRange = () => {
        const numbers = range(0, 10);
        console.assert(valueIsInRange(5, numbers),
        'Value is in range, yet valueIsInRange returns false');
        console.assert(valueIsInRange(3, numbers),
        'Value is in range, yet valueIsInRange returns false');
        console.assert(valueIsInRange(10, numbers),
        'Edge case value is in range, yet valueIsInRange returns false');
        console.assert(valueIsInRange(0, numbers),
        'Edge case value is in range, yet valueIsInRange returns false');
    }
    
    export const runTests = () => {
        testPointsAreBesides();
        testPointsAreEqual();
        testFilterArray();
        testClearArray();
        testArrayContains();
        testRemoveFromArray();
        testRange();
    }
}