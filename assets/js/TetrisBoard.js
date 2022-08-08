class TetrisBoard {
    constructor(width = 10, height = 19) {
        this.width = width;
        this.height = height;
        this.grid = [];
        this.ghostTetronimo = null;
        this.activeTetronimo = null;
        //this.nextTetronimo = null;
        this.actionBuffer = '';
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.fate = 'life';
        this.tockCount = 0;
        this.gridElement = document.getElementById('tetrisDiv');
        this.scoreElement = document.getElementById('score');
        this._init();
    }
    _init() {
        for (let i = 0; i < this.height; i++) {
            this.grid.push(new Array(this.width).fill(0));
        }
        this.nextTetronimo = this._getRandomTetronimo();
        this._initializeGrid();
    }
    /* -------------------------------- Main loop ------------------------------- */
    tock(tickCount) {
        // add a new tetronimo if there is no active tetronimo
        if (this.activeTetronimo === null) {
            // newTetronimo returns death if the tetronimo immediately collides with the board
            this.fate = this._newTetronimo();
        }
        // handeTetronimo calls functions to move/rotate it, lower it, and check for collisions.
        this._handleTetronimo(tickCount);
        this._updateBoard();
        return this.fate;
    }

    /* -------------------------------------------------------------------------- */
    /*                             Tetronimo Functions                            */
    /* -------------------------------------------------------------------------- */

    /* -------------------------------- Creation -------------------------------- */
    _newTetronimo() {
        this.activeTetronimo = this._getRandomTetronimo();
        //this.nextTetronimo = this._getRandomTetronimo();
        this.activeTetronimo.x = Math.floor((this.width) / 2);
        this.activeTetronimo.y = 0;
        if (this._isColliding(this.activeTetronimo)) {
            return 'death';
        }
        return 'life';
    }

    _getRandomTetronimo() {
        let random = Math.floor(Math.random() * 7);
        switch (random) {
            //tetronimo types from Tetrominos.js
            case 0:
                return createTetronimo(0, 0, 'line');
            case 1:
                return createTetronimo(0, 0, 'square');
            case 2:
                return createTetronimo(0, 0, 'l');
            case 3:
                return createTetronimo(0, 0, 'j');
            case 4:
                return createTetronimo(0, 0, 's');
            case 5:
                return createTetronimo(0, 0, 'z');
            case 6:
                return createTetronimo(0, 0, 't');

            default:
                //raise an error if the random number is not between 0 and 7
                throw new Error('Invalid random number');
        }
    }
    /* -------------------------------- Movement -------------------------------- */
    setActionBuffer(action) {
        this.actionBuffer = action;
    }
    _handleTetronimo(tickCount) {
        //TODO: implement levels
        //If the tetronimo won't collide from lowering
        if (!this._willCollide(this.activeTetronimo, 'lower')) {
            //if enough time has passed to lower the tetronimo
            if (tickCount % 3 === 0) {
                this._lowerTetronimo(this.activeTetronimo);
            }
        } else {
            //wait 500ms then lock it in place
            if (!this.activeTetronimo.locked) {
                this._lockTetronimo();
            }
        }
        //if the next action is shifting
        if (this.actionBuffer === 'left' || this.actionBuffer === 'right') {
            //if it won't collide, shift it
            if (!this._willCollide(this.activeTetronimo, this.actionBuffer)) {
                this._moveTetronimo(this.activeTetronimo, this.actionBuffer);
            }
        }
        //if the next action is rotating
        //TODO: add bounce out of wall
        if (this.actionBuffer === 'cw' || this.actionBuffer === 'ccw') {
            //if it won't collide, rotate it
            if (!this._willCollide(this.activeTetronimo, this.actionBuffer)) {
                this._rotateTetronimo(this.activeTetronimo, this.actionBuffer);
            }
        }
        //if the next action is dropping
        if (this.actionBuffer === 'drop') {
            this._dropTetronimo(this.activeTetronimo);
        }
        this.actionBuffer = '';
        
    }
    _moveTetronimo(tetronimo, direction) {
        switch (direction) {
            case 'left':
                tetronimo.x--;
                break;
            case 'right':
                tetronimo.x++;
                break;
            default:
                throw new Error('Invalid direction');
        }
    }
    _rotateTetronimo(tetronimo, direction) {
        //rotate defined in Tetronimos.js
        Trotate(tetronimo, direction);
    }

    _dropTetronimo(tetronimo) {
        //lower while the tetronimo won't collide
        while (!this._willCollide(tetronimo, 'lower')) {
            this._lowerTetronimo(tetronimo);
        }
    }
    _lowerTetronimo(tetronimo) {
        tetronimo.y++;
    }
    _lockTetronimo() {
        this._addTetronimoToBoard();
        this.activeTetronimo = null;
        this._clearLines();
        this._updateScore();


    }
    /* -------------------------------- Collision -------------------------------- */
    _willCollide(tetronimo, action) {
        //copy the active tetronimo
        let tetronimoCopy = { ...tetronimo };
        //if tetronimoCopy is null or undefined, return
        //move the tetronimo copy and see if it collides
        switch (action) {
            case 'left':
                this._moveTetronimo(tetronimoCopy, 'left');
                break;
            case 'right':
                this._moveTetronimo(tetronimoCopy, 'right');
                break;
            case 'cw':
                this._rotateTetronimo(tetronimoCopy, 'cw');
                break;
            case 'ccw':
                this._rotateTetronimo(tetronimoCopy, 'ccw');
                break;
            case 'lower':
                this._lowerTetronimo(tetronimoCopy);
                break;
            default:
                throw new Error('Invalid action');
        }
        //check for collision
        return this._isColliding(tetronimoCopy);



    }

    _isColliding(tetronimo) {
        // for row, col in activeTetronimo.shape
        //if tetronimo is null or undefined, it's obviously not colliding
        if (!tetronimo) {
            return false;
        }
        for (let row = 0; row < tetronimo.shape.length; row++) {
            //for col in row
            for (let col = 0; col < tetronimo.shape[row].length; col++) {
                //if a '#' is outside the board, return true
                if (tetronimo.shape[row][col] === '#' && (tetronimo.x + col < 0 || tetronimo.x + col >= this.width || tetronimo.y + row >= this.height)) {
                    return true;
                }
                //if a '#' in the tetronimo overlaps with a 1 in the board, return true
                if (tetronimo.shape[row][col] === '#' && this.grid[tetronimo.y + row][tetronimo.x + col] === 1) {
                    return true;
                }
            }
        }
    }
    /* ----------------------------- Board functions ---------------------------- */
    _drawGhostTetronimo() {
        //copy the active tetronimo
        this.ghostTetronimo = { ...this.activeTetronimo };
        this.ghostTetronimo.color = 'rgba(255, 255, 255, 0.2)';
        //move the tetronimo copy and see if it collides
        this._dropTetronimo(this.ghostTetronimo);
        //draw the tetronimo copy
        this._drawTetronimo(this.ghostTetronimo);
    }

    _clearLines() {
        //for row in grid
        let fullRows = [];
        for (let row = 0; row < this.height; row++) {
            //if all the columns in the row are 1, clear the row
            if (this.grid[row].every(col => col === 1)) {
                fullRows.push(row);
                //for each full row add 100 to the score
                this.score += 100;
            }

        }
        //if there are full rows, clear them
        if (fullRows.length > 0) {
            this._clearRows(fullRows);
        }
    }

    _clearRows(fullRows) {
        //for row in fullRows
        for (let row = 0; row < fullRows.length; row++) {
            //for col in grid[row]
            //shift the grid down
            this.grid.splice(fullRows[row], 1);
            //add a new row to the top of the grid
            this.grid.unshift(new Array(this.width).fill(0));

        }
    }

    _updateBoard() {
        this._drawBoard();
        if (this.activeTetronimo !== null) {
            this._drawGhostTetronimo();
            this._drawTetronimo(this.activeTetronimo);
            
        }
    }

    _initializeGrid() {
        this.gridElement.innerHTML = '';
        //gridElement is an HTML grid class that is used to display the board
        //set grid template of gridElement such that rows are of length width
        this.gridElement.style.gridTemplateColumns = `repeat(${this.width}, 1fr)`;
        //for each row and col in grid, append child to gridElement
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                let child = document.createElement('div');
                child.classList.add('grid-item');
                //add id
                child.id = `${row}-${col}`;
                this.gridElement.appendChild(child);
            }
        }


    }
    _addTetronimoToBoard() {
        //for row in the length of the tetronimo
        for (let row = 0; row < this.activeTetronimo.shape.length; row++) {
            //for column in the length of the tetronimo
            for (let column = 0; column < this.activeTetronimo.shape[row].length; column++) {
                //if the tetronimo is at that position
                if (this.activeTetronimo.shape[row][column] === '#') {
                    //add it to the board
                    this.grid[this.activeTetronimo.y + row][this.activeTetronimo.x + column] = 1;
                }
            }
        }

    }

    _drawBoard() {
        //for each row and col in grid
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                //if the grid is at that position
                if (this.grid[row][col] === 1) {
                    //fill in the grid
                    document.getElementById(`${row}-${col}`).style.backgroundColor = '#fff';
                }
                else {
                    if (row <= 2) {
                        document.getElementById(`${row}-${col}`).style.backgroundColor = '#383838';
                    }
                    else {
                        document.getElementById(`${row}-${col}`).style.backgroundColor = '#212529';
                    }
                }
            }
        }
    }

    _drawTetronimo(tetronimo) {
        //draw the active tetronimo to the grid
        //for row in activeTetronimo.shape
        for (let row = 0; row < tetronimo.shape.length; row++) {
            // for col in row
            for (let col = 0; col < tetronimo.shape[row].length; col++) {
                //if the tetronimo is at that position
                if (tetronimo.shape[row][col] === '#') {
                    //color #{activeTetronimo.y}-#{activeTetronimo.x} the color of the active tetronimo
                    let cell = document.getElementById(`${tetronimo.y + row}-${tetronimo.x + col}`);
                    cell.style.backgroundColor = tetronimo.color;
                    cell.classList.add('tetronimo');
                    //console.log('added class')
                }
            }
        }

    }
    _updateScore() {
        this.scoreElement.innerHTML = `Score: ${this.score}`;
    }
}

