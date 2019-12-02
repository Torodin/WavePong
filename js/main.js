let pelota, modifi, walls;

// Modulos de matter
const Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Events = Matter.Events;

/*let keys = {
    'kUp': new Key('ArrowUp'),
    'kDown': new Key('ArrowDown'),
    'kLeft': new Key('ArrowLeft'),
    'kRight': new Key('ArrowRight')
}*/

// Caracteristicas objetos
const PLANK_HEGHT = 10;
const PLANK_WIDTH = 305;
const PLANK_VEL = 3;

const WALLS = [
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

let velTot = 6;

let angle = [-1.05,0,1.57,0,1.05,-0.52,1.05,-1.05,0.52];

let wallsMedio = [];
for (var i=0; i<WALLS.length; i++) {
    let nextInd = (i==WALLS.length-1)? 0:i+1;

    wallsMedio.push([
        (WALLS[i][0]+WALLS[nextInd][0])/2,
        (WALLS[i][1]+WALLS[nextInd][1])/2,
    ]);
}

let wallsWorld = [];

for(var i=0; i<wallsMedio.length; i++) {
    let tmp = Bodies.rectangle(wallsMedio[i][0], wallsMedio[i][1], PLANK_HEGHT, PLANK_WIDTH, 
        {
            isStatic:true,
            chamfer: { radius: 3 },
            angle: angle[i],
            render: {
                fillStyle: 'blue'
            }
        }
    );
    //Body.rotate(tmp, angle[i]);

    wallsWorld.push(tmp);
}

World.add(engine.world, wallsWorld);

let bola = Bodies.circle(950,500,16,
    {
        label: 'Pelota',
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

let paleta = Bodies.rectangle(950, 750, 10, 75, 
    {
        label: 'Paleta',
        isStatic: true,
        angle: 1.57,
        render: {
            fillStyle: 'red'
        }
    }
);

Events.on(engine, 'collisionStart', event => {
    let pairs = event.pairs;
    
    for (var i = 0, j = pairs.length; i != j; ++i) {
        let pair = pairs[i];

        if(pair.bodyB.label == 'Paleta' || pair.bodyA.label == 'Paleta'){
            console.log('Colisión paleta');
        }
    }
});

Events.on(engine, 'collisionEnd', event => {
    let pairs = event.pairs;

    for (var i = 0, j = pairs.length; i != j; ++i) {
        let pair = pairs[i];
        velTot+=(velTot >= 10)?0.5:0;

        if(pair.bodyA.label == 'Pelota'){
            Body.setVelocity(pair.bodyA, Matter.Vector.create(
                pair.bodyA.velocity.x,
                ((pair.bodyB.velocity.y>0)?1:-1)*Math.sqrt(velTot**2-pair.bodyA.velocity.x**2)
            ));
        } else {
            Body.setVelocity(pair.bodyB, Matter.Vector.create(
                pair.bodyB.velocity.x,
                ((pair.bodyB.velocity.y>0)?1:-1)*Math.sqrt(velTot**2-pair.bodyB.velocity.x**2)                
            ));
        }
    }
});

let velX = Math.random()*(velTot*2+1)-velTot;
Body.setVelocity(bola, Matter.Vector.create(
    velX,
    ((Math.random()>0.5)?1:-1)*Math.sqrt(velTot**2-velX**2)
));

World.add(engine.world, bola);
World.add(engine.world, paleta);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);