enum CargoItem {
  EMPTY = 0,
  ITEM,
}

interface CargoSlot {
  item: CargoItem | null;
  valid: boolean | null;
}

enum DIRECTION {
  TOP_LEFT = 0,
  TOP_CENTER,
  TOP_RIGHT,
  MIDDLE_LEFT,
  MIDDLE_CENTER,
  MIDDLE_RIGHT,
  BOTTOM_LEFT,
  BOTTOM_CENTER,
  BOTTOM_RIGHT,
}

const CALCULATION_ARRAY: { xDelta: number; yDelta: number }[] = [
  { xDelta: -1, yDelta: -1 }, // Top Left, 0
  { xDelta: 0, yDelta: -1 }, // Top Center, 1
  { xDelta: 1, yDelta: -1 }, // Top Right, 2
  { xDelta: -1, yDelta: 0 }, // Middle Left, 3
  { xDelta: 0, yDelta: 0 }, // Middle Center, 4
  { xDelta: 1, yDelta: 0 }, // Middle Right, 5
  { xDelta: -1, yDelta: 1 }, // Bottom Left, 6
  { xDelta: 0, yDelta: 1 }, // Bottom Center, 7
  { xDelta: 1, yDelta: 1 }, // Bottom Right 7
];

const textFile = await Deno.readTextFile("input_original.txt");

let cargoArray: CargoItem[][] = [];
let validityArray: CargoSlot[][] = [];

let xIndex = 0;
let yIndex = 0;

for await (const textChar of textFile) {
  if (xIndex == 0 && yIndex == 0) {
    cargoArray.push([]);
  }

  if (textChar === "\n") {
    xIndex = 0;
    yIndex++;
    cargoArray.push([]);
    continue;
  }

  cargoArray[yIndex].push(textChar == "@" ? CargoItem.ITEM : CargoItem.EMPTY);
  xIndex++;

  // Catch All but I dont think its necessary
  if (textChar == "" || textChar == null) {
    console.log(`End of File`);
  }
}

printCargoArray();
checkCargoValidity();
printValidityArray();

/*
Helper Functions
*/
function printCargoArray() {
  console.log(`Printing Cargo Array:`);

  for (let y = 0; y < cargoArray.length; ++y) {
    let rowString = "";
    for (let x = 0; x < cargoArray[y].length; ++x) {
      rowString += cargoArray[y][x] == CargoItem.ITEM ? "@" : ".";
    }

    console.log(rowString);
  }
}

function printCargoArrayRow(row: CargoItem[]) {
  let rowString = "";
  for (let x = 0; x < row.length; ++x) {
    rowString += row[x] == CargoItem.ITEM ? "@" : ".";
  }
  console.log(rowString);
}

function checkCargoValidity() {
  // for (let y = 0; y < cargoArray.length; ++y) {
  for (let y = 0; y < 1; ++y) {
    printCargoArrayRow(cargoArray[y]);
    for (let x = 0; x < cargoArray[y].length; ++x) {
      let xCord = x;

      // console.log(`Raw Value:${cargoArray[y][x] == CargoItem.ITEM ? '@' : '.'} at ${x}, ${y}`)

      // Array Setup
      if (x == 0 && y == 0) {
        validityArray.push([]);
      }

      // Correcting for wrong indexing direction
      // const correctX = cargoArray[y].length - x - 1;

      console.log(
        `Check Item:${
          cargoArray[y][xCord] == CargoItem.ITEM ? "@" : "."
        } at ${xCord}, ${y}`,
      );

      if (cargoArray[xCord][y] == CargoItem.EMPTY) {
        validityArray[y].push({ item: null, valid: null });
        validityArray[y][xCord] = { item: CargoItem.EMPTY, valid: null };
        continue; // Skip the expensive check
      }

      let adjacentItemCount = 0;

      // For Checking the items around the current slot
      for (
        let direction = DIRECTION.TOP_LEFT;
        direction <= DIRECTION.BOTTOM_RIGHT;
        ++direction
      ) {
        // console.log(`DIRECTION:${direction}`);

        if (direction == DIRECTION.MIDDLE_CENTER) {
          continue; // Skip Counting itself
        }

        const delta = CALCULATION_ARRAY[direction];

        // console.log(`Delta`, delta);
        // console.log(`DeltaX:${delta.xDelta}, DeltaY:${delta.yDelta}`);

        const checkX = xCord + delta.xDelta;
        const checkY = y + delta.yDelta;

        // console.log(`CheckX:${checkX}, CheckY:${checkY}`);

        if (checkX < 0 || checkY < 0) {
          continue; // Out of bounds
        }

        if (checkX > cargoArray[y].length || checkY > cargoArray.length) {
          continue; // Out of bounds
        }

        if (cargoArray[checkY][checkX] == CargoItem.ITEM) {
          adjacentItemCount++;
        }
      }

      validityArray[y].push({ item: null, valid: null }); // Ensure the array is long enough
      if (adjacentItemCount > 4) {
        console.log(`AdjanceyCount Too High:${adjacentItemCount}`)
        validityArray[y][xCord] = { item: CargoItem.ITEM, valid: false };
      } else {
        validityArray[y][xCord] = { item: CargoItem.ITEM, valid: true };
      }
    }
    validityArray[y] = invertRow(validityArray[y]);
    validityArray.push([]);
  }
}

function printValidityArray() {
  console.log(`Printing Validity Array:`);

  let validCargoCount = 0;
  for (let y = 0; y < validityArray.length; ++y) {
    let rowString = "";
    for (let x = 0; x < validityArray[y].length; ++x) {
      if (validityArray[y][x].item == CargoItem.EMPTY) {
        rowString += ".";
      } else {
        rowString += validityArray[y][x].valid ? "O" : "X";
        validCargoCount += validityArray[y][x].valid ? 1 : 0;
      }
    }
    console.log(rowString);
  }

  console.log(`Total Valid Cargo Items: ${validCargoCount}`);
}

function invertRow(row: CargoSlot[]): CargoSlot[] {
  const newRow: CargoSlot[] = [];
  for (let i = row.length - 1; i >= 0; --i) {
    newRow.push(row[i]);
  }
  return newRow;
}
