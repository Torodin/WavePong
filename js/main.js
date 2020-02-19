// Modulos de matter
const Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body;

const socket = io();
let idJugador = 0;

let keys = {
    'k1': new Key('ArrowLeft'),
    'k2': new Key('ArrowRight')
}

let keys2 = {
    'k1': new Key('j'),
    'k2': new Key('l')
}

let keys3 = {
    'k1': new Key('a'),
    'k2': new Key('d')
}

const BACK_COLOR = '#3D144C';
const TEXT_COLOR = '#E900FF';

// Caracteristicas pelota
const PELOTA_RAD = 16;
const PELOTA_POS_INI = [950,430];
const PELOTA_MIN_VEL = 5.8;
const PELOTA_MAX_VEL = 10;
const PELOTA_COLOR = '#F52789';

// Caracteristicas paleta
const PLANK_HEGHT = 10;
const PLANK_WIDTH = 305;
const PLANK_VEL = 3.6;
const PLANK_COLOR = '#FAEB2C';

// Los muros y porterias
const PORTERIAS = [2,5,8];

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
const WALL_COLOR = '#1685F8';
const PORT_COLOR = '#F52789';

let velTot = 6;
let ultimoGolpe = -1;
let puntuaciones = [0,0,0];

// create an engine
let engine = Engine.create();

// create a renderer
var render = CustomRender.create({
    element: document.body,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        background: BACK_COLOR,
        wireframes: false
    }
});

engine.world.gravity.y = 0;

// -1.05
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
let wallJ = 0;

for(var i=0; i<wallsMedio.length; i++) {
    let tmp;

    if(PORTERIAS.includes(i)) {
        tmp = Bodies.rectangle(wallsMedio[i][0], wallsMedio[i][1], PLANK_HEGHT, PLANK_WIDTH, 
            {
                label: 'porteria',
                jugador: wallJ,
                isStatic:true,
                chamfer: { radius: 3 },
                angle: angle[i],
                render: {
                    fillStyle: PORT_COLOR
                }
            }
        );

        wallJ++;

    } else {
        tmp = Bodies.rectangle(wallsMedio[i][0], wallsMedio[i][1], PLANK_HEGHT, PLANK_WIDTH, 
            {
                label: 'muro',
                isStatic:true,
                chamfer: { radius: 3 },
                angle: angle[i],
                render: {
                    fillStyle: WALL_COLOR
                }
            }
        );
    }

    
    //Body.rotate(tmp, angle[i]);

    wallsWorld.push(tmp);
}

World.add(engine.world, wallsWorld);

var bola = Bodies.circle(PELOTA_POS_INI[0],PELOTA_POS_INI[1],PELOTA_RAD,
    {
        label: 'Pelota',
        inertia: 0,
        friction: 0,
        frictionStatic: 0,
        frictionAir: 0,
        restitution: 1,
        pause: true,
        render: {
            fillStyle: PELOTA_COLOR
        }
    }
);

var paleta = Bodies.rectangle(950, 750, 10, 75, 
    {
        label: 'paleta1',
        isStatic: true,
        angle: 1.57,
        moving: 0,
        render: {
            fillStyle: PLANK_COLOR
        }
    }
);

var posPal2 = moveAngle( Vector.create(1285, 220), 53, -2.35 );
var paleta2 = Bodies.rectangle(posPal2.x, posPal2.y, 10, 75, 
    {
        label: 'paleta2',
        isStatic: true,
        angle: -0.52,
        moving: 0,
        render: {
            fillStyle: PLANK_COLOR
        }
    }
);

var posPal3 = moveAngle( Vector.create(615, 260), 50, 1.35 );
var paleta3 = Bodies.rectangle(posPal3.x, posPal3.y, 10, 75, 
    {
        label: 'paleta3',
        isStatic: true,
        angle: 0.52,
        moving: 0,
        render: {
            fillStyle: PLANK_COLOR
        }
    }
);

var puntuacionJ1 = Bodies.rectangle(950, 850, 1, 1, 
    {
        label: "cont1",
        isStatic: true,
        render: {
            fillStyle: "red",
            text: {
                content: `Puntuación Jugador1: ${puntuaciones[0]}`,
                color: TEXT_COLOR,
                size: 20
            }
        }
    }
);

var puntuacionJ2 = Bodies.rectangle(950, 880, 1, 1, 
    {
        label: "cont2",
        isStatic: true,
        render: {
            fillStyle: "red",
            text: {
                content: `Puntuación Jugador2: ${puntuaciones[1]}`,
                color: TEXT_COLOR,
                size: 20
            }
        }
    }
);

var puntuacionJ3 = Bodies.rectangle(950, 910, 1, 1, 
    {
        label: "cont3",
        isStatic: true,
        render: {
            fillStyle: "red",
            text: {
                content: `Puntuación Jugador3: ${puntuaciones[2]}`,
                color: TEXT_COLOR,
                size: 20
            }
        }
    }
);

keyAsignation(keys, paleta);
keyAsignation(keys2, paleta2);
keyAsignation(keys3, paleta3);

Events.on(engine, 'collisionStart', event => {
    let pairs = event.pairs;
    
    for (var i = 0, j = pairs.length; i != j; ++i) {
        let pair = pairs[i];

        // Si la pelota choca con una porteria añadimos puntos
        if(pair.bodyA.label == 'porteria'){
            if(ultimoGolpe!=-1) {
                if(pair.bodyA.jugador==ultimoGolpe) {
                    puntuaciones[ultimoGolpe]-= puntuaciones[ultimoGolpe]>0 ? 1:0;
                } else {
                    puntuaciones[ultimoGolpe]++;
                }

                ultimoGolpe = -1;
                Composite.allBodies(engine.world).find(el => el.label == 'cont1').render.text.content = `Puntuación Jugador1: ${puntuaciones[0]}`;
                Composite.allBodies(engine.world).find(el => el.label == 'cont2').render.text.content = `Puntuación Jugador2: ${puntuaciones[1]}`;
                Composite.allBodies(engine.world).find(el => el.label == 'cont3').render.text.content = `Puntuación Jugador3: ${puntuaciones[2]}`;
            }

            /*
            if(pair.bodyA.label == 'Pelota') {
                Body.setPosition(pair.bodyA, Vector.create(PELOTA_POS_INI[0], PELOTA_POS_INI[1]));
                velTot = PELOTA_MIN_VEL;
                setRandVel(bola, velTot);
            } else {
                Body.setPosition(pair.bodyB, Vector.create(PELOTA_POS_INI[0], PELOTA_POS_INI[1]));
                velTot = PELOTA_MIN_VEL;
                setRandVel(bola, velTot);
            }
            */
        }
    }
});

Events.on(engine, 'collisionEnd', event => {
    let pairs = event.pairs;

    for (var i = 0, j = pairs.length; i != j; ++i) {
        let pair = pairs[i];

        // Si la pelota choca con una paleta se incrementa su velocidad
        if( (pair.bodyB.label.includes('paleta') ) && velTot <= PELOTA_MAX_VEL ) {
            let labelLength = pair.bodyB.label.length;

            switch(pair.bodyB.label.substring(labelLength-1, labelLength)) {
                case "1":
                    ultimoGolpe = 0;
                    break;
                case "2":
                    ultimoGolpe = 1;
                    break;
                case "3":
                    ultimoGolpe = 2;
                    break;
            }

            velTot+=0.5;
        }

        // Ajustamos la velocidad de la pelota para que no reducca la velocidad
        if(pair.bodyA.label == 'Pelota'){
            let newVel = {
                x:pair.bodyA.velocity.x,
                y:( pair.bodyA.velocity.y>0 ? 1:-1 )*Math.sqrt(velTot**2-pair.bodyA.velocity.x**2),
                id:idJugador
            }

            socket.emit('colision', newVel);
            Body.setVelocity(pair.bodyA, Matter.Vector.create( newVel.x, newVel.y ));

        } else {
            let newVel = {
                x:pair.bodyB.velocity.x,
                y:( pair.bodyB.velocity.y>0 ? 1:-1 )*Math.sqrt(velTot**2-pair.bodyB.velocity.x**2),
                id:idJugador
            }

            socket.emit('colision', newVel);
            Body.setVelocity(pair.bodyB, Matter.Vector.create( newVel.x, newVel.y ));
        }


        /*Body.setVelocity(pair.bodyA, 
            Matter.Vector.create(
                pair.bodyA.velocity.x,
                ((pair.bodyB.velocity.y>0)?1:-1) * Math.sqrt(velTot**2-pair.bodyA.velocity.x**2)
        ));*/
    }
});

Events.on(engine, 'beforeUpdate', event => {
    // Controlamos que la paleta no se pase de los limites
    if( (paleta.position.x>=843 || paleta.moving==1) && (paleta.position.x<=1056 || paleta.moving==-1) ) 
        Body.setPosition(paleta, Vector.add(paleta.position, Vector.create(PLANK_VEL*paleta.moving,0)));

    if( (paleta2.position.x>=1189 || paleta2.moving==-1) && (paleta2.position.x<=1293 || paleta2.moving==1) )
        Body.setPosition( paleta2, moveAngle(paleta2.position, PLANK_VEL*paleta2.moving, -0.52) );

    if( (paleta3.position.x>=609 || paleta3.moving==-1) && (paleta3.position.x<=719 || paleta3.moving==1) )
        Body.setPosition( paleta3, moveAngle(paleta3.position, PLANK_VEL*paleta3.moving, -2.6) );
});

function setRandVel(obj, targetVel) {
    let velX = Math.random()*(targetVel*2+1)-targetVel;
    Body.setVelocity(obj, Vector.create(
        velX,
        ((Math.random()>0.5)?1:-1)*Math.sqrt(targetVel**2-velX**2)
    ));
}

/**
 * Funcion para mover un objeto con la velocidad y angulo indicada
 * @param {Vector} position Posicion del objeto a mover
 * @param {Number} vel Velocidad a la que se mueve el objeto
 * @param {Number} angle Angulo al que apunta (0 el movimiento seria perpendicular negativo a x)
 * @return {Vector} Retorna la posicion resultante del movimiento
 */
function moveAngle(position, vel, angle) {
    return Vector.add( Vector.rotate( Vector.create(0,-vel), angle ), position );
}

//setRandVel(bola, velTot);

World.add(engine.world, [bola, paleta, paleta2, paleta3, puntuacionJ1, puntuacionJ2, puntuacionJ3]);

// run the engine
Engine.run(engine);

// run the renderer
CustomRender.run(render);

// Socket.io
socket.on('succes-conn', id => { 
    console.log("hola");
    if(idJugador == 0) {
        idJugador = id;
        console.log(idJugador);
    }
});

socket.on('sync-call', newVel => {
    Body.setVelocity( bola, Matter.Vector.create( newVel.x, newVel.y ) );
});

socket.on('full', v => {
    Body.setVelocity( bola, Vector.create(v.x, v.y) ) 
    console.log(`Vel set to: x-${v.x} y-${v.y} | Bola vel: x-${bola.velocity.x} y-${bola.velocity.y}`);
});

socket.on('hola', () => console.log("hola"));