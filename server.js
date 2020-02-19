var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

// Clases

class Partida {
    constructor() {
        this._id = Partida.nextId();
        this.nombre = `partida-${this._id}`;
        this.jugadores = 0;
        this.playing = false;

        console.log(`Partida creada id->${this._id} nombre->${this.nombre}`);
    }

    static nextId() {
        if(!this.lastId) this.lastId = 1;
        else this.lastId++;
        return this.lastId;
    }
}

app.use(express.static(__dirname + "/"));
app.get('/', (req, res) => res.sendFile(__dirnombre + '/index.html'));

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
    partidas[ultimaPartida].jugadores++;
    socket.join(partidas[ultimaPartida].nombre);

    console.log(`User connected to ${partidas[ultimaPartida].nombre}`);
    io.to(partidas[partidaAsignada].nombre).emit( 'succes-conn', partidas[ultimaPartida].jugadores ); 

    // Si la ultima partida ya tiene tres jugadores les indicamos que empiecen a jugar
    if(partidas[ultimaPartida].jugadores==3 && !partidas[ultimaPartida].playing) {
        console.log(`Start game ${partidas[ultimaPartida].nombre}`);
        io.to(partidas[ultimaPartida].nombre).emit( 'full', getRandomVelocity(6) );
        partidas[ultimaPartida].playing = true;
    }

    socket.on('colision', data => {
        if(data.id == 1) {
            console.log(`Sync x-${data.x} y-${data.y}`);
            socket.emit('sync-call', { x:data.x, y:data.y } );
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected from ${partidas[partidaAsignada].nombre}`);
        socket.leave(partidas[partidaAsignada].nombre);
        partidas[partidaAsignada].jugadores--;

        if(partidas[partidaAsignada].jugadores<3 && partidas[partidaAsignada].playing) 
            partidas[partidaAsignada].playing = false;
    });
});

http.listen(8080, () => console.log('listening on *:8080'));