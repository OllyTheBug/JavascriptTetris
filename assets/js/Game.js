class Game {
    constructor() {
        this.Tboard = new TetrisBoard(10, 20);
        this.level = 1;
        this.tickCount = 0;
        this.addInputListener();
    }
    start() {
        this.interval = setInterval(() => {
            this.tickCount++;
            console.log(`tick ${this.tickCount}`);

            this.tick();
        }, 100);
    }
    tick() {

            let fate = this.Tboard.tock(this.tickCount);
            if (fate === 'death') {
                console.log('death');
                //cancel the interval
                clearInterval(this.interval);
            }
        
    }

    setInput(action) {
        this.Tboard.setActionBuffer(action);
    }

    addInputListener() {

        document.addEventListener('keydown', (e) => {
            //if the key is left
            if (e.keyCode === 37) {
                game.setInput('left');
            }
            //if the key is right
            if (e.keyCode === 39) {
                game.setInput('right');
            }
            //if the key is down
            if (e.keyCode === 40) {
                game.setInput('drop');
            }
            //if z is pressed
            if (e.keyCode === 90) {
                game.setInput('ccw');
            }
            //if x is pressed
            if (e.keyCode === 88) {
                game.setInput('cw');
            }
        });


    }
}

game = new Game();
game.addInputListener();
game.start();