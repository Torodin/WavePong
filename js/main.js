let pelota, modifi, walls;

let keys = {
    'kUp': new Key('ArrowUp'),
    'kDown': new Key('ArrowDown'),
    'kLeft': new Key('ArrowLeft'),
    'kRight': new Key('ArrowRight')
}

function init() {
    /*Carga los sprites
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

    pelota.rig = new Circulo(pelota.x,pelota.y,5);

    modifi = new PIXI.Sprite.from('./sprites/plus.png');
    modifi.anchor.set(0.5);
    modifi.x = Math.floor(Math.random() * app.screen.width);
    modifi.y = Math.floor(Math.random() * app.screen.height);
    modifi.vMod = 1.5;
    app.stage.addChild(modifi);*/
    
    /*var shpObj = [
        [540, 350],
        [800, 500],
        [800, 800],
        [1100, 800],
        [1100, 500],
        [1360, 350],
        [1210, 90],
        [950, 240],
        [690, 90],
        [540, 350]
    ];*/

    

    //Asignamos las teclas y sus funciones
    keys = keyAsignation(keys, pelota);
}

// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;
    Body = Matter.Body;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        showAngleIndicator: true,
        showVelocity: true
    }
});

engine.world.gravity.y = 0;

walls = [
    [540, 350],
    [800, 500],
    [800, 800],
    [1100, 800],
    [1100, 500],
    [1360, 350],
    [1210, 90],
    [950, 240],
    [690, 90],
];

let angle = [-1.05,0,1.57,0,1.05,-0.52,1.05,-1.05,0.52];

let wallsMedio = [];
for (var i=0; i<walls.length; i++) {
    let nextInd = (i==walls.length-1)? 0:i+1;

    wallsMedio.push([
        (walls[i][0]+walls[nextInd][0])/2,
        (walls[i][1]+walls[nextInd][1])/2,
    ]);
}

let wallsWorld = [];

for(var i=0; i<wallsMedio.length; i++) {
    let tmp = Bodies.rectangle(wallsMedio[i][0], wallsMedio[i][1], 10, 305, 
        {
            isStatic:true,
            render: {
                fillStyle: 'blue'
            }
        }
    );
    Body.rotate(tmp, angle[i]);

    wallsWorld.push(tmp);
}

World.add(engine.world, wallsWorld);

let bola = Bodies.circle(950,500,16,
    {
        inertia: 0,
        friction: 0,
        frictionStatic: 0,
        frictionAir: 0,
        restitution: 1,
        render: {
            fillStyle: 'red'
        }
    }
);

Body.setVelocity(bola, Matter.Vector.create(4,4));

World.add(engine.world, bola);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);