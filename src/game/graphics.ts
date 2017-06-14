/// <reference path="pixi.js.d.ts"/>
/// <reference path="logic.ts"/>

namespace Graphics {
    const addAutoSizeLoopForApp = (app: PIXI.Application, window: Window): void => {
        const sizeUpdater = (): void => {
            app.view.width = window.innerWidth;
            app.view.height = window.innerHeight;
            app.renderer.resize(app.view.width, app.view.height);
        }
        app.ticker.add(sizeUpdater);
    }
    
    export const autoSizedApp = (window: Window, options: PIXI.ApplicationOptions, noWebGL: boolean = false): PIXI.Application => {
        const app = new PIXI.Application(0, 0, options, noWebGL);
        addAutoSizeLoopForApp(app, window);
        return app;
    }
    
    const addAutoCenterLoopForContainer = (container: PIXI.Container, app: PIXI.Application): void => {
        const positionUpdater = (): void => {
            container.x = (app.view.width-container.width)/2;
            container.y = (app.view.height-container.height)/2;
        }
        app.ticker.add(positionUpdater);
    }
    
    export const autoCenteredContainer = (app: PIXI.Application): PIXI.Container => {
        const container = new PIXI.Container();
        addAutoCenterLoopForContainer(container, app);
        return container;
    }
    
    export const cell_size = 16;
    
    export const drawCells = (cells: ReadonlyArray<Logic.Cell>, scene: PIXI.Container): void => {
        const drawCell = (cell: Logic.Cell): void => {
            const rectangle = new PIXI.Graphics();
            const fill_color = (Logic.cellIsAlive(cell)) ? Utils.Colors.black : Utils.Colors.white;
            rectangle.beginFill(fill_color);
            rectangle.drawRect(cell.position.x*cell_size, cell.position.y*cell_size, cell_size-1, cell_size-1);
            scene.addChild(rectangle);
        }
        
        const clearScreen = (): void => {
            scene.children = [];
        }
        
        clearScreen();
        for (const cell of cells)
            drawCell(cell);
    }
}
