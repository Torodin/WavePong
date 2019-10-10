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
/*
function keyAsignation(keys, pelota) {
    keys.kUp.press = () => {
        pelota.vy = -pelota.vBase;
    }
    
    keys.kUp.release = () => {
        pelota.vy = 0;
    }
    
    keys.kDown.press = () => {
        pelota.vy = pelota.vBase;
    }
    
    keys.kDown.release = () => {
        pelota.vy = 0;
    }
    
    keys.kLeft.press = () => {
        pelota.vx = -pelota.vBase;
    }
    
    keys.kLeft.release = () => {
        pelota.vx = 0;
    }
    
    keys.kRight.press = () => {
        pelota.vx = pelota.vBase;
    }
    
    keys.kRight.release = () => {
        pelota.vx = 0;
    }

    return keys;
}*/