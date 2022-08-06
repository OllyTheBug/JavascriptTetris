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
    switch(type) {
        case 'square':
            tetronimo.shape = [
                "11",
                "11",
            ];
            tetronimo.color = "red";
            break;
        case 'line':
            tetronimo.shape = [
                "1",
                "1",
                "1",
                "1"
            ];
            tetronimo.color = "blue";
            break;
        case 'l':
            tetronimo.shape = [
                "1",
                "1",
                "11",

            ];
            tetronimo.color = "orange";
            break;
        case 'j':
            tetronimo.shape = [
                ".1",
                ".1",
                "11",

            ];
            tetronimo.color = "yellow";
            break;
        case 's':
            tetronimo.shape = [
                "1",
                "11",
                ".1",
                
            ];
            tetronimo.color = "pink";
            break;
        case 'z':
            tetronimo.shape = [
                ".1",
                "11",
                "1",
            ];
            tetronimo.color = "green";
            break;
        case 't':
            tetronimo.shape = [
                ".1",
                "111",
                
            ]
        default:
            break;
    }
    return tetronimo;
}

function rotate (tetronimo, direction) {
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
    return tetronimo.rotation;
}

testLine = createTetronimo(0, 0, 'j');
console.log(testLine);
console.log(rotate(testLine, 'cw'));
console.log(testLine)