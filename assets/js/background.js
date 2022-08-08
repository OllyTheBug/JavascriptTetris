let tetronimos = [];
let w, h;

function setup() {
    w = $("#tetrisContainer").width();
    h = $("#tetrisContainer").height();
    let c = createCanvas(w, h);
    c.parent('#tetrisContainer');
    c.style('width', '100%');
    c.style('height', 'auto');
    //position: relative;
    c.style('position', 'relative');
    //top = -h;
    c.style('top', -h + 'px');
    //z-index = -1
    c.style('z-index', -1);
    for (let i = 0; i < 10; i++) {
        tetronimos.push(new BackgroundTetronimo);
        console.log("tetro");
    }
    //set framerate to 15
    frameRate(40);
}

function draw() {
    background(56, 56, 56);
    //transparent background
    for (let i = 0; i < tetronimos.length; i++) {
        //random delay between 0 and 1 second
        //pause for the delay
        tetronimos[i].display();
        tetronimos[i].update();
    }
}

class BackgroundTetronimo {
    constructor() {
        this.data = TetrisBoard._getRandomTetronimo();
        this.r = random(255);
        this.g = random(255);
        this.b = random(255);
        this.speed = random(1, 3);
        //set this.data.x to a random number between 0 and the width of the canvas - 120
        this.data.x = random(w - 120);
        this.data.y = random(0, h/4);
        this.size = random(10, 30);
    }

    update() {
        this.data.y += this.speed * 5;
        if (this.data.y > h) {
            this.reset();
        }
    }

    reset(left) {
        this.data.y = -120;
        this.data.x = random(w - 120);
        this.size = random(10, 30);
    }

    display() {
        //draw 4x4 grid of squares
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (this.data.shape[row][col] === '#') {
                    //get random fill color
                    fill(this.r, this.g, this.b);
                    rect(this.data.x + this.size * col, this.data.y + this.size * row, this.size, this.size);
                }
            }
        }
    }
}
