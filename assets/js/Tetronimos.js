function createTetronimo(x, y, type) {
    var tetronimo = {
        x: x,
        y: y,
        type: type,
        rotation: 0,
        shape: '',
        color: "",
        //create the shape based on the type
    }
    switch (type) {
        case 'square':
            tetronimo.shape = [
                "##..",
                "##..",
                "....",
                "...."
            ];
            tetronimo.color = "red";
            break;
        case 'line':
            tetronimo.shape = [
                "#...",
                "#...",
                "#...",
                "#..."
            ];
            tetronimo.color = "blue";
            break;
        case 'l':
            tetronimo.shape = [
                "#...",
                "#...",
                "##..",
                "...."
            ];
            tetronimo.color = "orange";
            break;
        case 'j':
            tetronimo.shape = [
                ".#..",
                ".#..",
                "##..",
                "...."
            ];
            tetronimo.color = "yellow";
            break;
        case 's':
            tetronimo.shape = [
                "#...",
                "##..",
                ".#..",
                "...."
            ];
            tetronimo.color = "pink";
            break;
        case 'z':
            tetronimo.shape = [
                ".#..",
                "##..",
                "#...",
                "...."
            ];
            tetronimo.color = "green";
            break;
        case 't':
            tetronimo.shape = [
                ".#..",
                "###.",
                "....",
                "...."
            ];
            tetronimo.color = "purple";
        default:
            break;
    }
    return tetronimo;
}

function rotate(tetronimo, direction) {
    if (direction === 'cw') {
        tetronimo.rotation++;

        let newArray = [];
        for (let col = 0; col < tetronimo.shape.length; col++) {
            let newRow = []
            for (let row = tetronimo.shape.length - 1; row >= 0; row--) {
                newRow.push(tetronimo.shape[row][col]);
            }
            newArray.push(newRow.join(''));

        }

        tetronimo.shape = newArray;

    } else if (direction === 'ccw') {
        tetronimo.rotation--;
        //alter shape matrix to match rotation
        let newArray = [];
        for (let col = tetronimo.shape.length - 1; col >= 0; col--) {
            let newRow = []
            for (let row = 0; row < tetronimo.shape.length; row++) {
                newRow.push(tetronimo.shape[row][col]);
            }
            newArray.push(newRow.join(''));

        }
        tetronimo.shape = newArray;

    }
    if (tetronimo.rotation === 4) {
        tetronimo.rotation = 0;
    } else if (tetronimo.rotation === -1) {
        tetronimo.rotation = 3;
    }
    pushTetronimoToTopLeft(tetronimo)
    return tetronimo.rotation;
}

function pushTetronimoToTopLeft(tetronimo) {
    //remove empty top rows
    while (true) {
        if (!tetronimo.shape[0].includes('#')) {
            tetronimo.shape.splice(0, 1);
            //add empty row to bottom
            tetronimo.shape.push('.'.repeat(tetronimo.shape[0].length));
            //tetronimo.shape.push(Array(tetronimo.shape[0].length).join('.'));
        }
        else {
            break;
        }
    }
    //remove empty left columns
    let columnsRemoved = 0;
    while(true) {
        let empty = true;
        for (let row = 0; row < tetronimo.shape.length; row++) {
            if (tetronimo.shape[row][0] === '#') {
                empty = false;
                break;
            }
        }
        if (empty) {

            for (let row = 0; row < tetronimo.shape.length; row++) {
                tetronimo.shape[row] = tetronimo.shape[row].substring(1);
                tetronimo.shape[row] += '.';
            }
            columnsRemoved++;
        }
        else {
            break;
        }
    }

}
