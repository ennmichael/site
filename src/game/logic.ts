/// <reference path="utils.ts"/>

namespace Logic {
    export class GameOfLife {
        public static readonly boardSize = 30;
        
        public constructor(private readonly rules_: AutomationRule[], cells: Cell[]) {
            this.cellsTable_ = new CellsTable(cells);
        }
        
        public readonly advanceGeneration = () => {
            for (const rule of this.rules_) {
                this.cellsTable_.addSnapshotForRule(rule);
            }
            this.cellsTable_.applyRuleSnapshots();
        }
        
        public get cells(): ReadonlyArray<Cell> {
            return this.cellsTable_.cells;
        }
        
        private readonly cellsTable_: CellsTable;
    }
    
    export const createCells = (size: number, liveCellsPositions: ReadonlyArray<Utils.Point>): Cell[] => {
        const result: Cell[] = [];
        for (const point of Utils.allPointsUpTo({ x: size, y: size })) {
            const state = (Utils.arrayContains(liveCellsPositions, point, Utils.pointsAreEqual)) ? CellState.Alive : CellState.Dead;
            result.push({ state: state, position: point });
        }
        return result;
    }
    
    class CellsTable {
        public constructor(private readonly cells_: Cell[]) {
        }
        
        public readonly addSnapshotForRule = (rule: AutomationRule): void => {
            this.ruleSnapshots_.push({
                targetCells: this.getTargetCellsForRule(rule),
                newCellState: rule.newCellState
            });
        }
        
        private readonly getTargetCellsForRule = (rule: AutomationRule): Cell[] => {
            const result: Cell[] = [];
            for (const cell of this.cells_) {
                const neighbourCount = this.getNeighbourCountForCell(cell);
                if (rule.appliesToNeighbourCount(neighbourCount) && rule.targetCellState == cell.state) {
                    result.push(cell);
                }
            }
            return result;
        }
        
        private readonly getNeighbourCountForCell = (centerCell: Cell): number => {
            const liveCells = this.getLiveCells();
            const neighbourCells = Utils.filterArray(liveCells, (cell) => cellsAreNeighbours(cell, centerCell));
            return neighbourCells.length;
        }
        
        public readonly getLiveCells = (): Cell[] => Utils.filterArray(this.cells_, cellIsAlive);
        
        public readonly applyRuleSnapshots = (): void => {
            for (const snapshot of this.ruleSnapshots_)
                this.applyRuleSnapshot(snapshot);
            Utils.clearArray(this.ruleSnapshots_);
        }
        
        private readonly applyRuleSnapshot = (snapshot: RuleSnapshot): void => {
            for (let cell of snapshot.targetCells)
                this.cells_[this.cells_.indexOf(cell)] = { state: snapshot.newCellState, position: cell.position };
        }
        
        public get cells(): ReadonlyArray<Cell> {
            return this.cells_;
        }
        
        private readonly ruleSnapshots_: RuleSnapshot[] = [];
    }
    
    export const getConwaysRules = (): AutomationRule[] => [
        AutomationRules.overpopulation,
        AutomationRules.reproduction,
        AutomationRules.survival,
        AutomationRules.underpopulation
    ];
    
    interface RuleSnapshot {
        targetCells: Cell[];
        newCellState: CellState;
    }
    
    const cellsAreNeighbours = (c1: Cell, c2: Cell) => Utils.pointsAreBesides(c1.position, c2.position);
    
    export const cellIsAlive = (cell: Cell) => cell.state == CellState.Alive;
    
    export interface Cell {
        readonly state: CellState;
        readonly position: Utils.Point;
    }
    
    export const enum CellState {
        Alive, Dead
    }
    
    export interface AutomationRule {
        readonly appliesToNeighbourCount: (neighbourCount: number) => boolean;
        readonly targetCellState: CellState;
        readonly newCellState: CellState;
    }
    
    namespace AutomationRules {
        export const underpopulation: AutomationRule = {
            appliesToNeighbourCount: (neighbourCount) => neighbourCount < 2,
            targetCellState: CellState.Alive,
            newCellState: CellState.Dead
        };
        
        export const survival: AutomationRule = {
            appliesToNeighbourCount: (neighbourCount) => neighbourCount == 2 || neighbourCount == 3,
            targetCellState: CellState.Alive,
            newCellState: CellState.Alive
        };
        
        export const overpopulation: AutomationRule = {
            appliesToNeighbourCount: (neighbourCount) => neighbourCount > 3,
            targetCellState: CellState.Alive,
            newCellState: CellState.Dead
        }
        
        export const reproduction: AutomationRule = {
            appliesToNeighbourCount: (neighbourCount) => neighbourCount == 3,
            targetCellState: CellState.Dead,
            newCellState: CellState.Alive
        }
    }
    
    
    
    // Fuck you
    
    export const runTests = () => {
        // Tests please
    }
}
