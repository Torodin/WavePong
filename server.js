const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const aws = require('aws-sdk');
const config = require('./config.js');

// Clases

class Partida {
    constructor() {
        this._id = Partida.nextId();
        this.nombre = `partida-${this._id}`;
        this.jugadores = 0;
        this.players = [
            new Jugador(1), 
            new Jugador(2), 
            new Jugador(3)
        ];
        this.playing = false;

        console.log(`Partida creada id->${this._id} nombre->${this.nombre}`);
    }

    static nextId() {
        if(!this.lastId) this.lastId = 1;
        else this.lastId++;
        return this.lastId;
    }
}

class Jugador {
    constructor(id) {
        this.id = id;
        this.name = `Jugador${this.id}`;
    }
}

app.use(express.static(__dirname + "/"));
app.get('/', (req, res) => res.sendFile(__dirnombre + '/index.html'));

aws.config.update(config.aws_remote_config);

const docClient = new aws.DynamoDB.DocumentClient();

let partidas = [new Partida()];

function getRandomVelocity(targetVel) {
    let velX = Math.random()*(targetVel*2+1)-targetVel;
    let vResult = {
            x: velX,
            y: (Math.random() > 0.5 ? 1:-1)*Math.sqrt(targetVel**2-velX**2)
    };

    console.log(`Velocity set to: ${vResult.x}, ${vResult.y}`)
    return vResult;
}

// Guardamos index de la ultima partida añadida
let ultimaPartida = 0;

io.on('connection', socket => {
    // Si la ultima partida está llena creamos otra y reasignamos el index de ultima
    if (partidas[ultimaPartida].jugadores == 3) {
        partidas.push( new Partida() );
        ultimaPartida = partidas.length-1;
    }

    // Añadimos al nuevo jugador a la ultima partida
    let partidaAsignada = ultimaPartida;
    partidas[partidaAsignada].jugadores++;
    socket.join(partidas[partidaAsignada].nombre);

    console.log(`User connected to ${partidas[partidaAsignada].nombre}`);
    io.to(partidas[partidaAsignada].nombre).emit( 'succes-conn', partidas[partidaAsignada].jugadores );
    io.to(partidas[partidaAsignada].nombre).emit('cambio-usuario', partidas[partidaAsignada].players, -1);

    let idJugador = partidas[partidaAsignada].jugadores;

    // Si la ultima partida ya tiene tres jugadores les indicamos que empiecen a jugar
    if(partidas[partidaAsignada].jugadores==3 && !partidas[partidaAsignada].playing) {
        console.log(`Start game ${partidas[partidaAsignada].nombre}`);
        io.to(partidas[partidaAsignada].nombre).emit( 'full', getRandomVelocity(6) );
        partidas[partidaAsignada].playing = true;
    }

    socket.on('colision', (vel,pos) => {
        //socket.to(partidas[partidaAsignada].nombre).emit('sync-call', { x:vel.x, y:vel.y }, { x:pos.x, y:pos.y });
        socket.to(partidas[partidaAsignada].nombre).emit('sync-call', vel, pos);
    });

    socket.on('move-paleta', (dir,id) => {
        socket.to(partidas[partidaAsignada].nombre).emit('move-paleta', dir, id);
    });

    socket.on('stop-move-paleta', (dir,id,position) => {
        socket.to(partidas[partidaAsignada].nombre).emit('sync-paleta', dir, id, position);
    });

    socket.on('puntua', (v, puntuacionesSync) => {
        socket.to(partidas[partidaAsignada].nombre).emit('puntua', v, puntuacionesSync);
    });

    socket.on('new-user', (id, name, psw) => {
        let params = {
            TableName:'usuarios',
            Item:{
                "name": name,
                "psw": psw,
            }
        };

        console.log(`Solicitud de registro de ${name}`);
        docClient.put(params, function(err, data) {
            if (err) {
                console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Added item:", JSON.stringify(data, null, 2));
            }
        });

        partidas[partidaAsignada].players[id-1].name = name;
        io.to(partidas[partidaAsignada].nombre).emit('cambio-usuario', partidas[partidaAsignada].players, id);
    });

    socket.on('login', (id, name, psw) => {
        let params = {
            TableName:'usuarios',
            Key:{
                "name": name,
            }
        };

        console.log(`Solicitud de logeo ${name}`);
        docClient.get(params, function(err, data) {
            if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                if(data.Item.psw === psw) {
                    console.log(`Usuario ${name} logeado`);
                    partidas[partidaAsignada].players[id-1].name = name;
                    io.to(partidas[partidaAsignada].nombre).emit('cambio-usuario', partidas[partidaAsignada].players, id);
                } else {
                    console.log(`Usuario ${name} no logeado`);
                }
            }
        });
    });

    socket.on('id-update', newId => idJugador=newId);

    socket.on('disconnect', () => {
        console.log(`User disconnected from ${partidas[partidaAsignada].nombre}`);

        socket.to(partidas[partidaAsignada].nombre).emit('user-disconnect', idJugador);
        socket.leave(partidas[partidaAsignada].nombre);

        if(partidas[partidaAsignada].jugadores<3 && partidas[partidaAsignada].playing) 
            partidas[partidaAsignada].playing = false;
    });
});

http.listen(80, () => console.log('listening on *:80'));
