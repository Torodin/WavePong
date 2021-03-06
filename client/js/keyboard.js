class Key {
    constructor(value) {
        this.value = value;
        this.isDown = false;
        this.isUp = true;
        this.press = undefined;
        this.release = undefined;

        let downListener = this.downHandler.bind(this);
        let upListener = this.upHandler.bind(this);

        window.addEventListener(
            "keydown", downListener, false
        );

        window.addEventListener(
            "keyup", upListener, false
        );
    }

    downHandler(event) {
        if (event.key === this.value) {
            if (this.isUp && this.press) this.press();
            this.isDown = true;
            this.isUp = false;
            event.preventDefault();
        }
    }

    upHandler(event) {
        if (event.key === this.value) {
            if (this.isDown && this.release) this.release();
            this.isDown = false;
            this.isUp = true;
            event.preventDefault();
        }
    }

    unsubscribe() {
        window.removeEventListener("keydown", this.downHandler);
        window.removeEventListener("keyup", this.upHandler);
    }
}

function keyAsignation(keys, paleta, id) {
    keys.k1.press = () => {
        paleta.moving = -1;
        socket.emit('move-paleta', -1, id);
    }
    
    keys.k1.release = () => {
        paleta.moving = 0;
        socket.emit('stop-move-paleta', 0, id, paleta.position);
    }
    
    keys.k2.press = () => {
        paleta.moving = 1;
        socket.emit('move-paleta', 1, id);
    }
    
    keys.k2.release = () => {
        paleta.moving = 0;
        socket.emit('stop-move-paleta', 0, id, paleta.position);
    }

    return keys;
}

function otherKeys(key, pelota) {
    key.k1.press = () => {
        bodies.body.isStatic = bodies.body.isStatic ? false:true;
    }
}