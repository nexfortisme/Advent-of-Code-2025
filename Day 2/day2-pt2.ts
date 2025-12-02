
let invalidIDSum = 0;

const textFile = await Deno.readTextFile("input.txt");

let firstNumber: string | number = '';
let secondNumber: string | number = '';

let readingInFirstNumber = true;

for await (const textChar of textFile) {


    // Determining when to swap from first ID to second ID
    // pattern XXX-YYY
    if( textChar == '-' ) {
        readingInFirstNumber = false;
        continue; // For skipping the dash
    }

    // End of ID Line
    if( textChar == ','){

        console.log(`First ID:${firstNumber}, Second ID:${secondNumber}`);

        checkIDRange(firstNumber, secondNumber);

        // Resetting for next line
        firstNumber = '';
        secondNumber = '';
        readingInFirstNumber = true;

        console.log(`---`);

        continue; // For skipping the comma
    }

    if(readingInFirstNumber) {
        firstNumber += textChar;
    } else {
        secondNumber += textChar;
    }
}

// First Guess: 22617871034 -- Correct

console.log(`Sum of Invalid IDs: ${invalidIDSum}`);

function checkIDRange(firstID: number | string, secondID: number | string){

    let idMap: Record<string, boolean> = {};

    let firstIDNum = Number(firstID);
    let secondIDNum = Number(secondID);

    for (let i = firstIDNum; i <= secondIDNum; i++) {
        // Check for repeating sequences
        if(findRepeatingSequence(i)) {
            console.log(`ID ${i} is INVALID due to repeating sequence.`);
            invalidIDSum += i;
        }
    }
}

// I will be the first to admit that this is the ChatGPT special.
function findRepeatingSequence(num: number): boolean | null {
  const str = num.toString();
  const len = str.length;

  // Try every possible unit length from 1 up to half of the string
  for (let unitLen = 1; unitLen <= len / 2; unitLen++) {
    if (len % unitLen !== 0) continue; // unit must divide evenly into the full length

    const unit = str.slice(0, unitLen);
    const repeated = unit.repeat(len / unitLen);

    if (repeated === str) {
      return true;
    }
  }

  // If no repeating pattern is found
  return null;
}