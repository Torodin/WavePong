var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + "/"));
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

let jugadores = 0,
    playing = false;

function getRandomVelocity(targetVel) {
    let velX = Math.random()*(targetVel*2+1)-targetVel;
    let vResult = {
            x: velX,
            y: (Math.random() > 0.5 ? 1:-1)*Math.sqrt(targetVel**2-velX**2)
    };

    console.log(`Velocity set to: ${vResult.x}, ${vResult.y}`)
    return vResult;
}

io.on('connection', socket => {
    console.log('a user connected');
    jugadores++;

    if(jugadores==3 && !playing) {
        console.log('start game');
        io.emit( 'full', getRandomVelocity(6) );
        playing = true;
    }

    socket.on('disconnect', () => {
        console.log('a user disconnected');
        jugadores--;
        if(jugadores<3 && playing) playing = false;
    });
});

http.listen(3000, () => console.log('listening on *:3000'));