/// <reference path="logic.ts"/>
/// <reference path="graphics.ts"/>
/// <reference path="utils.ts"/>
/// <reference path="pixi.js.d.ts"/>

namespace Input {
    export class Reader {
        public constructor(stage: PIXI.Container, window: Window, onReadingEnded: (reader: Reader) => void) {
            const toggleCells = (clientMousePosition: Utils.Point) => {
                const mouseOffset = -6.5;
                const pointerTipPosition = { x: clientMousePosition.x+mouseOffset, y: clientMousePosition.y+mouseOffset };
                if (pointIsInsideContainer(stage, pointerTipPosition)) {
                    const clickRelativeToStage = pointRelativeToContainer(stage, pointerTipPosition);
                    const clickOnBoard = translatePointToBoard(clickRelativeToStage);
                    this.toggleCellAtPosition(clickOnBoard);
                }
            };
            
            const actionToLeftMouseButtonBinding = bindActionToLeftMouseButton(window, toggleCells);
            
            const actionToEnterKeyBinding = bindActionToEnterKey(window, () => {
                onReadingEnded(this);
                actionToLeftMouseButtonBinding.unbind();
                actionToEnterKeyBinding.unbind();
            });
        }
        
        private readonly toggleCellAtPosition = (position: Utils.Point): void => {
            if (Utils.arrayContains(this.liveCellsPositions_, position, Utils.pointsAreEqual)) {
                Utils.removeFromArray(this.liveCellsPositions_, position, Utils.pointsAreEqual);
            }
            else{
                this.liveCellsPositions_.push(position);
            }
        }
        
        public get liveCellsPositions(): ReadonlyArray<Utils.Point> {
            return this.liveCellsPositions_;
        }
        
        private readonly liveCellsPositions_: Utils.Point[] = [];
    }
    
    export const bindActionToEnterKey = (window: Window, action: KeyPressAction): ActionBinding => bindActionToKey(window, 13, action);
    
    const bindActionToKey = (window: Window, keyCode: number, action: KeyPressAction): ActionBinding => 
        ActionBinding.boundTo(window, 'keypress', (event: KeyboardEvent) => {
            if (event.keyCode == keyCode) {
                action();
            }
        });
    
    type KeyPressAction = () => void;
    
    export const bindActionToLeftMouseButton = (window: Window, action: MouseButtonUpAction): ActionBinding => 
        bindActionToMouseButton(window, 0, action);
    
    const bindActionToMouseButton = (window: Window, button: number, action: MouseButtonUpAction): ActionBinding => 
        ActionBinding.boundTo(window, 'mouseup', (mouseEvent: MouseEvent) => {
            if (mouseEvent.button == button)
                action({
                    x: mouseEvent.clientX,
                    y: mouseEvent.clientY
                });
        })
    
    type MouseButtonUpAction = (clientPosition: Utils.Point) => void;
    
    export class ActionBinding {
        public static readonly boundTo = (window: Window, on: string, eventListener: EventListener): ActionBinding => 
            new ActionBinding(window, on, eventListener);
        
        private constructor(private readonly window_: Window, private readonly on_: string, private readonly eventListener_: EventListener) {
            this.window_.addEventListener(this.on_, this.eventListener_);
        }
        
        public readonly unbind = () => {
            this.window_.removeEventListener(this.on_, this.eventListener_);
        }
    }
    
    export type EventListener = (event: any) => void;
    
    const pointRelativeToContainer = (container: PIXI.Container, mousePosition: Utils.Point): Utils.Point => {
        return {
            x: mousePosition.x - container.x,
            y: mousePosition.y - container.y
        };
    }
    
    const pointIsInsideContainer = (container: PIXI.Container, point: Utils.Point): boolean => 
        Utils.valueIsInRange(point.x, Utils.range(container.x, container.x + container.width)) &&
        Utils.valueIsInRange(point.y, Utils.range(container.y, container.y + container.height));
    
    const translatePointToBoard = (point: Utils.Point): Utils.Point => {
        return {
            x: Math.floor(point.x/Graphics.cell_size),
            y: Math.floor(point.y/Graphics.cell_size)
        };
    }
}
