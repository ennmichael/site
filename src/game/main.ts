/// <reference path="pixi.js.d.ts"/>
/// <reference path="graphics.ts"/>
/// <reference path="input.ts"/>

(() => {
    const everyNthFrame = (n: number, action: () => void) => {
        let counter = 0; // Factor this into a separate class
        app.ticker.add(() => {
            if (counter % n == 0) {
                action();
            }
            ++counter;
        });
    }
    
    const testing = false;
    
    if (testing) {
        Utils.runTests();
        Logic.runTests();
        console.log('Tests ran');
    }
    
    const app = Graphics.autoSizedApp(window, { backgroundColor: Utils.Colors.black });
    app.stage = Graphics.autoCenteredContainer(app);
    document.body.appendChild(app.view);
    
    const drawReadding = () => {
        Graphics.drawCells(Logic.createCells(Logic.GameOfLife.boardSize, inputReader.liveCellsPositions), app.stage);
    }
    
    const stopDrawingReading = () => {
        app.ticker.remove(drawReadding);
    }
    
    const onReadingEnded = (inputReader: Input.Reader) => {
        const game = new Logic.GameOfLife(
            Logic.getConwaysRules(), 
            Logic.createCells(Logic.GameOfLife.boardSize, inputReader.liveCellsPositions)
        );
        
        stopDrawingReading();
        
        everyNthFrame(5, () => {
            Graphics.drawCells(game.cells, app.stage);
            game.advanceGeneration(); 
        });
    }
    
    const inputReader = new Input.Reader(app.stage, window, onReadingEnded);
    
    app.ticker.add(drawReadding);
})();
