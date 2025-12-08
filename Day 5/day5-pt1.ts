import { readLines } from "https://deno.land/std/io/mod.ts";

// const textFile = await Deno.open("input_original.txt");
const textFile = await Deno.open("input.txt");

const rangeArray: { min: number; max: number }[] = [];
const checkArray: number[] = [];

let checkStage = false;
let validCount = 0;

for await (const line of readLines(textFile)) {
  if (line == "\n" || line == "" || line == " ") {
    checkStage = true;
    continue;
  }

  if (!checkStage) {
    rangeArray.push(parseRange(line));
  } else {
    checkArray.push(parseInt(line));
  }
}

for (let num of checkArray) {
  if (isIDValid(num)) {
    validCount++;
  }
}

// First Guess: 773 -- Correct!

console.log("Valid Count:", validCount);

textFile.close();

function parseRange(range: string): { min: number; max: number } {
  const [minStr, maxStr] = range.split("-");
  return { min: parseInt(minStr), max: parseInt(maxStr) };
}

function isIDValid(id: number): boolean {
  for (const range of rangeArray) {
    if (id >= range.min && id <= range.max) {
      return true;
    }
  }
  return false;
}
