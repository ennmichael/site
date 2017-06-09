"use strict";
/// <reference path="pixi.js.d.ts"/>
const app = new PIXI.Application({
    width: 300, height: 300,
    backgroundColor: 0xFFFFFF
});
PIXI.loader.add('pepe', './pepe.png').load((_, resources) => {
    const sprite = new PIXI.Sprite(resources.pepe.texture);
    sprite.x = app.screen.width / 2;
    sprite.y = app.screen.height / 2;
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    app.stage.addChild(sprite);
    app.ticker.add(() => {
        sprite.rotation += 0.01;
    });
});
document.body.appendChild(app.view);
