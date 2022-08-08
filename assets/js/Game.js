let backgroundAnimation = true;
running = false;
class Game {
    constructor() {
        this.Tboard = new TetrisBoard(10, 20);
        this.level = 1;
        this.tickCount = 0;
        this.addInputListener();
        this.fate = 'life';
    }
    start() {
        backgroundAnimation = false;
        running = true;
        this.interval = setInterval(() => {
            this.tickCount++;
            //console.log(`tick ${this.tickCount}`);

            this.tick();
        }, 100);
    }
    tick() {

        this.fate = this.Tboard.tock(this.tickCount);
        if (this.fate === 'death') {
            running = false;
            console.log('death');
            //cancel the interval
            clearInterval(this.interval);

            //reset the game
            setTimeout(() => {
                this.resetGame();
            }, 3000);
        }

    }
    resetGame() {
        this.Tboard = new TetrisBoard(10, 20);
        this.level = 1;
        this.tickCount = 0;
        this.fate = 'life';
        game.start();
    }

    setInput(action) {
        this.Tboard.setActionBuffer(action);
    }

    addInputListener() {

        document.addEventListener('keydown', (e) => {
            if (running === false) {
                game.start();
            }
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

document.addEventListener('keydown', (e) => {
    if (running === false) {
        game = new Game();
        game.addInputListener();
        game.start();
    }
});


//game.start();