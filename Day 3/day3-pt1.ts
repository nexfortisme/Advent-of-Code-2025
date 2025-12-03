// const textFile = await Deno.readTextFile("input_original.txt");
const textFile = await Deno.readTextFile("input.txt");

let input_num: string = "";
let sum: number = 0;

for await (const textChar of textFile) {
  // Handling of new line characters
  if (textChar === "\n") {
    console.log(`Number is: ${input_num}`);

    const maxJoltage = findMaxJoltage();
    console.log(`Max Joltage is: ${maxJoltage}`);

    sum += maxJoltage;

    input_num = "";

    continue;
  }
  
  input_num += textChar;
}

// First Guess: 17087 -- Correct!

console.log(`Final Number is: ${sum}`);

function findMaxJoltage(): number {
  let firstBiggest = 0;
  let firstBiggestIndex = Number.MAX_SAFE_INTEGER;
  let secondBiggest = 0;
  let secondBiggestIndex = Number.MAX_SAFE_INTEGER;

  // Finding the largest number in the string
  for (let i = 0; i < input_num.length; ++i) {
    const currentChar = parseInt(input_num[i]);
    
    if (currentChar > firstBiggest){
      firstBiggest = currentChar;
      firstBiggestIndex = i;
    }
  }
  
  // If the index of the first biggest is the last index, we need to start from the beginning;
  if (firstBiggestIndex === input_num.length - 1){
    console.log(`Largest Index is at the end, setting to second and running again`)
    
    secondBiggest = firstBiggest;
    secondBiggestIndex = firstBiggestIndex;
    
    firstBiggest = 0;
    firstBiggestIndex = Number.MAX_SAFE_INTEGER;
    
    // Cutting off the last character
    for (let i = 0; i < input_num.length - 1; ++i) {
      const currentChar = parseInt(input_num[i]);
      
      if (currentChar > firstBiggest){
        firstBiggest = currentChar;
        firstBiggestIndex = i;
      }
    }
    
  } else { // Normal case, just find the second biggest after the first biggest 
    for (let i = firstBiggestIndex + 1; i < input_num.length; ++i){
      const currentChar = parseInt(input_num[i]);
      
      if(currentChar > secondBiggest){
        secondBiggest = currentChar;
        secondBiggestIndex = i;
      }
    }
  }


  console.log(`First Biggest:${firstBiggest}, Second Biggest:${secondBiggest}`);
  console.log(
    `First Biggest Index:${firstBiggestIndex}, Second Biggest Index:${secondBiggestIndex}`,
  );

  if (firstBiggestIndex < secondBiggestIndex) {
    return Number(firstBiggest.toString() + secondBiggest.toString());
  } else {
    return Number(secondBiggest.toString() + firstBiggest.toString());
  }
}
