let app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
});
document.body.appendChild(app.view);

let pelota, modifi, state;

let keys = {
    'kUp': new Key('ArrowUp'),
    'kDown': new Key('ArrowDown'),
    'kLeft': new Key('ArrowLeft'),
    'kRight': new Key('ArrowRight')
}

function init() {
    //Carga los sprites
    pelota = new PIXI.Sprite.from('./sprites/pelota.png');
    pelota.anchor.set(0.5);
    pelota.x = app.screen.width/2;
    pelota.y = app.screen.height/2;
    pelota.vMax = 3;
    pelota.v = Math.random() < 0.5 ? -pelota.vMax : pelota.vMax;
    pelota.vx = pelota.v * Math.random();
    pelota.vy = pelota.v - pelota.vx;
    pelota.vMod = 0;
    app.stage.addChild(pelota);

    modifi = new PIXI.Sprite.from('./sprites/plus.png');
    modifi.anchor.set(0.5);
    modifi.x = Math.floor(Math.random() * app.screen.width);
    modifi.y = Math.floor(Math.random() * app.screen.height);
    modifi.vMod = 1.5;
    app.stage.addChild(modifi);

    //Asignamos las teclas y sus funciones
    //keys = keyAsignation(keys, pelota);

    //Iniciamos y ejecutamos el estado de juego
    state = play;

    app.ticker.add((delta) => mainLoop(delta));
}

function mainLoop(delta) {
    state(delta);
}

function play(delta) {
    if (hitTestRectangle(pelota, modifi)) {
        pelota.vMod = modifi.vMod;

        app.stage.removeChild(modifi);
    }
    
    pelota.x += (pelota.vx + pelota.vx * pelota.vMod) * delta;
    pelota.y += (pelota.vy + pelota.vy * pelota.vMod) * delta;
}

init();