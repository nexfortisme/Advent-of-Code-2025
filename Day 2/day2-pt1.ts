
let invalidIDSum = 0;

const textFile = await Deno.readTextFile("input.txt");

let firstNumber: string | number = '';
let secondNumber: string | number = '';

let readingInFirstNumber = true;

for await (const textChar of textFile) {

    console.log(`Reading Character: ${textChar}`);

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

// First Guess: 15873079070 -- Too Low
// Second Guess: 15873079081 -- Correct!
// First Guess was wrong because there isn't a trailing comma causing it to miss the last range

console.log(`Sum of Invalid IDs: ${invalidIDSum}`);

function checkIDRange(firstID: number | string, secondID: number | string){

    let firstIDNum = Number(firstID);
    let secondIDNum = Number(secondID);

    for (let i = firstIDNum; i <= secondIDNum; i++) {

        let iStr = i.toString();
        
        if(iStr.length % 2 == 0) {

            let firstHalf = iStr.slice(0, iStr.length / 2);
            let secondHalf = iStr.slice(iStr.length / 2);

            // console.log(`Checking ID: ${iStr}, First Half: ${firstHalf}, Second Half: ${secondHalf} -- Pre-Logic: ${firstHalf == secondHalf}`);

            if(firstHalf == secondHalf) {
                // console.log(`FirstHalf: ${firstHalf}, SecondHalf: ${secondHalf} -- Invalid ID Found: ${iStr}`);
                // console.log(`Invalid ID Found: ${iStr}`);
                invalidIDSum += i;
            }
        }
    }
}