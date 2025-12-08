import { readLines } from "https://deno.land/std/io/mod.ts";

const textFile = await Deno.open("input_original.txt");
// const textFile = await Deno.open("input.txt");

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

// for (let num of checkArray) {
//   if (isIDValid(num)) {
//     validCount++;
//   }
// }

let validIDSet = buildValidIDMap();

console.log(validIDSet);

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

function buildValidIDMap(): { min: number; max: number }[] {
  const fooSet: { min: number; max: number }[] = [];

  for (let i = 0; i < rangeArray.length; ++i) {
    const ARRAY_RANGE = rangeArray[i];

    if (i == 0) {
      fooSet.push(ARRAY_RANGE);
      continue;
    } else {
      for (const range of fooSet) {
        if (ARRAY_RANGE.min > range.min && ARRAY_RANGE.max > range.min) { // Array Range is separate and after
          fooSet.push(ARRAY_RANGE);
          continue;
        } else if (ARRAY_RANGE.min < range.min && ARRAY_RANGE.max < range.min) { // Array Range is separate and before
          fooSet.push(ARRAY_RANGE);
          continue;
        } else if (
          ARRAY_RANGE.min <= range.min && ARRAY_RANGE.max >= range.max
        ) { // Array Range engulfs existing range
          range.min = ARRAY_RANGE.min;
          range.max = ARRAY_RANGE.max;
        } else if (
          ARRAY_RANGE.min >= range.min && ARRAY_RANGE.max <= range.max
        ) { // Array Range is inside existing range
          // Do nothing
        } else if (
          ARRAY_RANGE.min <= range.max && ARRAY_RANGE.max >= range.max
        ) { // Array Range overlaps end of existing range
          range.max = ARRAY_RANGE.max;
        } else if (
          ARRAY_RANGE.min <= range.min && ARRAY_RANGE.max >= range.min
        ) { // Array Range overlaps beginning of existing range
          range.min = ARRAY_RANGE.min;
        }
      }
    }
  }

  return fooSet;
}
