/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("gameCanvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

// === CONFIGURATION ===
let gameState = "menu";
const TILE_SIZE = 40;
const WORLD_COLS = 50;
const WORLD_ROWS = 50;
const VISIBLE_COLS = canvas.width / TILE_SIZE;
const VISIBLE_ROWS = canvas.height / TILE_SIZE;

// === WORLD GENERATION ===
const world = [];
for (let y = 0; y < WORLD_ROWS; y++) {
  const row = [];
  for (let x = 0; x < WORLD_COLS; x++) {
    if (
      x === 0 ||
      y === 0 ||
      x === WORLD_COLS - 1 ||
      y === WORLD_ROWS - 1 
      //Math.random() < 0.1
    ) {
      row.push(1); // wall
    } else {
      row.push(0); // empty
    }
  }
  world.push(row);
}

const rock = [
  [1,1],
  [1,1]
];

const tree = [
  [0,2,0],
  [2,2,2],
  [0,2.5,0] // 2 is leaves, 2.5 is wood
];

const house = [
  [0,0,3,3,3,0,0], 
  [0,3,3,3,3,3,0], 
  [3,3,3,3,3,3,3], 
  [0,3.1,3.1,3.1,3.1,3.1,0], // 3.1 is walls
  [0,3.1,3.2,3.1,3.5,3.1,0], // 3.2 is window
  [0,3.1,3.1,3.1,3.5,3.1,0] // 3.5 is door

];

const shop = [
  [1,1,1,1]
];

function placeStructure(structure) {
  const rows = structure.length;
  const cols = structure[0].length;

  let x, y, canPlace;

  // Tests positions until finds one that fits
  for (let attempts = 0; attempts < 100; attempts++) {
    x = Math.floor(Math.random() * (WORLD_COLS - cols - 1)) + 1;
    y = Math.floor(Math.random() * (WORLD_ROWS - rows - 1)) + 1;

    canPlace = true;
    for (let sy = 0; sy < rows; sy++) {
      for (let sx = 0; sx < cols; sx++) {
        if (structure[sy][sx] !==0 && world[y + sy][x + sx] !== 0) {
          canPlace = false;
          break;
        }
      }
      if (!canPlace) break;
    }
    if (canPlace) break; // This means found a valid position
  }
  if (canPlace) {
    for (let sy = 0; sy < rows; sy++) {
      for (let sx = 0; sx < cols; sx++) {
        if (structure[sy][sx] !== 0) {
          world[y + sy][x + sx] = structure[sy][sx];
        }
      }
    }
  }
}

// Place some random structures
for (let i = 0; i < 10; i++) placeStructure(tree);
for (let i = 0; i < 5; i++) placeStructure(rock);
for (let i = 0; i < 3; i++) placeStructure(house);

// === PLAYER ===
const player = {
  tileX: 5,
  tileY: 5,
  pixelX: 5 * TILE_SIZE,
  pixelY: 5 * TILE_SIZE,
  direction: "down",
};

// === MOVEMENT SETTINGS ===
const WALK_FRAMES = 16;
const RUN_FRAMES = 8;
let frameCount = 0;
let moving = false;
let moveDir = { x: 0, y: 0 };
let speedPerFrame = TILE_SIZE / WALK_FRAMES;

// === CAMERA ===
let cameraX = 0;
let cameraY = 0;

// === INPUT ===
const keys = {};
let showGrid = false; // ✅ global toggle variable

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;

  // Toggle grid visibility with G key
  if (e.key.toLowerCase() === "g") {
    showGrid = !showGrid;
  }

  // Start game with enter key
  if (gameState === "menu" && e.key === "Enter") {
    gameState = "game";
  }
});

document.addEventListener("keyup", (e) => (keys[e.key] = false));

function update() {
  if (moving) {
    frameCount++;
    player.pixelX += moveDir.x * speedPerFrame;
    player.pixelY += moveDir.y * speedPerFrame;

    if (frameCount >= (keys["Shift"] ? RUN_FRAMES : WALK_FRAMES)) {
      moving = false;
      frameCount = 0;
      player.tileX += moveDir.x;
      player.tileY += moveDir.y;
      player.pixelX = player.tileX * TILE_SIZE;
      player.pixelY = player.tileY * TILE_SIZE;
    }
    return;
  }

  let dx = 0,
    dy = 0;
  if (keys["ArrowUp"] || keys["w"]) dy = -1;
  else if (keys["ArrowDown"] || keys["s"]) dy = 1;
  else if (keys["ArrowLeft"] || keys["a"]) dx = -1;
  else if (keys["ArrowRight"] || keys["d"]) dx = 1;
  else return;

  if (dx !== 0 && dy !== 0) return;

  const targetX = player.tileX + dx;
  const targetY = player.tileY + dy;

  if (world[targetY] && world[targetY][targetX] === 0) {
    moveDir = { x: dx, y: dy };
    moving = true;
    frameCount = 0;
    speedPerFrame = TILE_SIZE / (keys["Shift"] ? RUN_FRAMES : WALK_FRAMES);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Camera follow
  const targetCamX = player.pixelX - canvas.width / 2 + TILE_SIZE / 2;
  const targetCamY = player.pixelY - canvas.height / 2 + TILE_SIZE / 2;
  cameraX += (targetCamX - cameraX) * 0.2;
  cameraY += (targetCamY - cameraY) * 0.2;

  // Prevents gridlines showing due to subpixel bleeding
  cameraX = Math.round(cameraX)
  cameraY = Math.round(cameraY)

  cameraX = Math.max(0, Math.min(cameraX, WORLD_COLS * TILE_SIZE - canvas.width));
  cameraY = Math.max(0, Math.min(cameraY, WORLD_ROWS * TILE_SIZE - canvas.height));

  const startCol = Math.floor(cameraX / TILE_SIZE);
  const startRow = Math.floor(cameraY / TILE_SIZE);
  const endCol = startCol + VISIBLE_COLS + 1;
  const endRow = startRow + VISIBLE_ROWS + 1;

  // Draw tiles
  for (let y = startRow; y < endRow; y++) {
    for (let x = startCol; x < endCol; x++) {
      const tile = world[y] && world[y][x];

      if (tile === 0) ctx.fillStyle = "#6c9";
      else if (tile === 1) ctx.fillStyle = "#555";
      else if (tile === 2) ctx.fillStyle = "#0f0";
      else if (tile === 2.5) ctx.fillStyle = "#682820ff"
      else if (tile === 3) ctx.fillStyle = "#aa8624ff"
      else if (tile === 3.1) ctx.fillStyle = "#dad1bbff"
      else if (tile === 3.2) ctx.fillStyle = "#05a8e9ff"
      else if (tile === 3.5) ctx.fillStyle = "#ff7b00ff"
      else ctx.fillStyle = "#aaa"

      ctx.fillRect(
        x * TILE_SIZE - cameraX,
        y * TILE_SIZE - cameraY,
        TILE_SIZE,
        TILE_SIZE
      );
    }
  }

// Draw grid overlay (if toggled on)
if (showGrid) {
  ctx.strokeStyle = "rgba(0,0,0,0.3)";
  ctx.lineWidth = 1;
  
    // Vertical lines
  for (let x = startCol; x <= endCol; x++) {
    const screenX = x * TILE_SIZE - cameraX;
    ctx.beginPath();
    ctx.moveTo(screenX, 0);
    ctx.lineTo(screenX, canvas.height);
    ctx.stroke();
  }

  // Horizontal lines
  for (let y = startRow; y <= endRow; y++) {
    const screenY = y * TILE_SIZE - cameraY;
    ctx.beginPath();
    ctx.moveTo(0, screenY);
    ctx.lineTo(canvas.width, screenY);
    ctx.stroke();
  }
}

  // Draw player
  ctx.fillStyle = "red";
  ctx.fillRect(
    player.pixelX - cameraX,
    player.pixelY - cameraY,
    TILE_SIZE,
    TILE_SIZE
  );
}

function drawMenu() { 
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // background
  ctx.fillStyle = "#4a8";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // title
  ctx.fillStyle = "white";
  ctx.font = "40px 'Press Start 2P'";
  ctx.textAlign = "center";
  ctx.fillText("My Tile Adventure", canvas.width / 2, canvas.height / 2 - 60);

  // instructions
  ctx.font = "24px 'Press Start 2P'";
  ctx.fillText("Press ENTER to start!", canvas.width / 2, canvas.height / 2 + 20)
}

function gameLoop() {
  if (gameState === "game") {
    update()
    draw()
  }
  else if (gameState === "menu") {
    drawMenu();
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);