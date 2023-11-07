const GRID_SIZE = 4;
let grid = new Array(GRID_SIZE);

for (let i = 0; i < GRID_SIZE; i++) {
  grid[i] = new Array(GRID_SIZE).fill(0);
}

function generateRandomTile() {
  const emptyCells = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j] === 0) {
        emptyCells.push({ x: i, y: j });
      }
    }
  }
  if (emptyCells.length > 0) {
    const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    grid[cell.x][cell.y] = Math.random() < 0.9 ? 2 : 4;
  }
}

function updateGrid() {
  const gridElement = document.getElementById("grid");
  gridElement.innerHTML = "";

  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const cell = grid[i][j];
      const cellElement = document.createElement("div");
      cellElement.className = cell > 0 ? `tile tile-${cell}` : "tile";
      cellElement.textContent = cell > 0 ? cell : "";
      gridElement.appendChild(cellElement);
    }
  }

  const scoreElement = document.getElementById("score");
  scoreElement.textContent = `Score: ${calculateScore()}`;
}

function calculateScore() {
  let score = 0;
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      score += grid[i][j];
    }
  }
  return score;
}

function init() {
  generateRandomTile();
  generateRandomTile();
  updateGrid();
}

function moveTiles(direction) {
  const oldGrid = grid.map((row) => [...row]);

  const reverseGrid = (arr) => {
    return arr.map((row) => row.slice().reverse());
  };

  const transposeGrid = (arr) => {
    const transposed = Array.from({ length: GRID_SIZE }, () => []);
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        transposed[j][i] = arr[i][j];
      }
    }
    return transposed;
  };

  const moveAndMerge = (row) => {
    const nonZeroTiles = row.filter((tile) => tile !== 0);
    const mergedRow = [];
    for (let i = 0; i < nonZeroTiles.length; i++) {
      if (
        i < nonZeroTiles.length - 1 &&
        nonZeroTiles[i] === nonZeroTiles[i + 1]
      ) {
        const mergedTile = nonZeroTiles[i] * 2;
        mergedRow.push(mergedTile);
        i++;
      } else {
        mergedRow.push(nonZeroTiles[i]);
      }
    }
    while (mergedRow.length < GRID_SIZE) {
      mergedRow.push(0);
    }
    return mergedRow;
  };

  if (direction === "up" || direction === "down") {
    grid = transposeGrid(grid);
  }
  if (direction === "right" || direction === "down") {
    grid = reverseGrid(grid);
  }

  for (let i = 0; i < GRID_SIZE; i++) {
    grid[i] = moveAndMerge(grid[i]);
  }

  if (direction === "up" || direction === "down") {
    grid = transposeGrid(grid);
  }
  if (direction === "right" || direction === "down") {
    grid = reverseGrid(grid);
  }

  if (!arraysEqual(grid, oldGrid)) {
    generateRandomTile();
    updateGrid();
  }
}

function arraysEqual(arr1, arr2) {
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (arr1[i][j] !== arr2[i][j]) {
        return false;
      }
    }
  }
  return true;
}

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    moveTiles("up");
  } else if (event.key === "ArrowDown") {
    moveTiles("down");
  } else if (event.key === "ArrowLeft") {
    moveTiles("left");
  } else if (event.key === "ArrowRight") {
    moveTiles("right");
  }
});

init();
