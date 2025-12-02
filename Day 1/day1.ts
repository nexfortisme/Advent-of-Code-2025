
const POS_MIN = 0;
const POS_MAX = 99;

const LEFT = -1;
const RIGHT = 1;

let pos = 50;
let prevPos = pos;

let zero_count = 0;


let movementDelta: string | number = '';
let movementDirection = 0;

const textFile = await Deno.readTextFile("input_old.txt");

let testBreak = 0;
let lineCount = 1;

for await (const textChar of textFile) {

    prevPos = pos;

    // End of Line - Process Movement
    if( textChar == "\n" ) {

        if(movementDirection == LEFT) { // Moving Left
            pos -= Number(movementDelta);
        } else if(movementDirection == RIGHT) { // Moving Right
            pos += Number(movementDelta);
        }

        console.log(`Movement Direction: ${movementDirection == -1 ? 'Left' : 'Right'}, Movement Delta: ${movementDelta}, Previous Position: ${prevPos}, New Position: ${pos}. Zero Hits: ${zero_count}`);
        
        if (pos > POS_MAX) {
            // console.log(`Something Fucked up in a spectacular way! On Line: ${lineCount}`);
            while (pos > POS_MAX) {
                pos -= (POS_MAX + 1);

                // console.log('Overflow! Crossed Zero! *click*' + ' Current Pos: ' + pos)

                // PART 2
                zero_count += 1;
            }
        } else if (pos < POS_MIN) {
            // console.log(`Something Fucked up in a spectacular way! On Line: ${lineCount}`);
            while (pos < POS_MIN) {
                pos += (POS_MAX + 1);

                // console.log('Underflow! Crossed Zero! *click* Current Pos: ' + pos)

                // // PART 2
                zero_count += 1;
            }
        }

        if(pos == 0 && prevPos != 0) {
            zero_count += 1;
        }

        movementDelta = '';
        movementDirection = 0;
        lineCount += 1;

        continue;
    }

    if(textChar == "L") {
        movementDirection = LEFT;
    } else if(textChar == "R") {
        movementDirection = RIGHT;
    } else { // It's a number
        movementDelta += textChar;
    }
}

console.log(`Final Position: ${pos}`);
console.log(`Total Zero Hits: ${zero_count}`);