/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("gameCanvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

// === WORLD CONFIGURATION ===
const TILE_SIZE = 40;
const WORLD_COLS = 50;
const WORLD_ROWS = 50;
const VISIBLE_COLS = canvas.width / TILE_SIZE;
const VISIBLE_ROWS = canvas.height / TILE_SIZE;
let lastOverworldX = 0;
let lastOverworldY = 0;

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
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,3,3,3,0,0,0], 
  [0,0,3,3,3,3,3,0,0], 
  [0,3,3,3,3,3,3,3,0], // 3 is roof
  [0,0,3.1,3.1,3.1,3.1,3.1,0,0], // 3.1 is walls
  [0,0,3.1,3.2,3.1,3.5,3.1,0,0], // 3.2 is window
  [0,0,3.1,3.1,3.1,3.5,3.1,0,0], // 3.5 is door
  [0,0,0,0,0,0,0,0,0]
];

const houseInterior = [
  [0,0,0,0,0,0,0,0,0],
  [0,3.1,3.1,3.1,3.1,3.1,3.1,3.1,0], 
  [0,3.1,3.3,3.3,4.5,3.3,3.3,3.1,0],          
  [0,3.1,3.3,3.3,3.3,3.3,3.3,3.1,0], // 3.3 is floor
  [0,3.1,3.3,3.3,3.3,3.3,3.3,3.1,0],
  [0,3.1,3.3,3.3,3.3,3.3,3.3,3.1,0],
  [0,3.1,3.3,3.3,3.3,3.3,3.3,3.1,0],
  [0,3.1,3.1,3.1,3.6,3.1,3.1,3.1,0], // 3.6 is exit door
  [0,0,0,0,0,0,0,0,0],
];

const overworldShop = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,4,4,4,4,4,4,4,4,4,4,4,4,0], // 4 is roof
  [0,4,4,4,4,4,4,4,4,4,4,4,4,0], // 4.1 is walls
  [0,4.1,4.3,4.3,4.1,4.1,4.1,4.1,4.1,4.1,4.3,4.3,4.1,0], // 4.2 is door
  [0,4.1,4.3,4.3,4.1,4.1,4.2,4.2,4.1,4.1,4.3,4.3,4.1,0], // 4.3 is window
  [0,4.1,4.1,4.1,4.1,4.1,4.2,4.2,4.1,4.1,4.1,4.1,4.1,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0] // 4.4 is floor
];

const shopInterior = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,4.1,4.1,4.1,4.1,4.1,4.1,4.1,4.1,4.1,4.1,4.1,4.1,0],
  [0,4.1,4.4,4.4,4.4,4.4,4.4,4.4,4.4,4.4,4.4,4.4,4.1,0],
  [0,4.1,4.4,4.5,4.5,4.4,4.4,4.4,4.4,4.5,4.5,4.4,4.1,0], // 4.5 is countertop
  [0,4.1,4.4,4.4,4.4,4.4,4.4,4.4,4.4,4.4,4.4,4.4,4.1,0],
  [0,4.1,4.1,4.1,4.1,4.1,4.6,4.6,4.1,4.1,4.1,4.1,4.1,0], // 4.6 is exit door
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0]           
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
for (let i = 0; i < 1; i++) placeStructure(overworldShop);

// === PLAYER ===
const player = {
  tileX: 5,
  tileY: 5,
  pixelX: 5 * TILE_SIZE,
  pixelY: 5 * TILE_SIZE,
  direction: "down",
};

// === SET PLAYER'S SPAWN ===
const spawnTopLeftX = 2;
const spawnTopLeftY = 2;

player.tileX = spawnTopLeftX + Math.floor(Math.random() * 3);
player.tileY = spawnTopLeftY + Math.floor(Math.random() * 3);

player.pixelX = player.tileX * TILE_SIZE;
player.pixelY = player.tileY * TILE_SIZE;

// === GAME STATE CONFIGURATION ===
let gameState = "game"; // When we showcase, change to menu

let currentMap = world; // start in overworld
let currentWorldType = "overworld"; // "overworld" or "shop"

let fadeOpacity = 0;
let fading = false;
let fadeDirection = 1; // 1 = fade out, -1 = fade in
let onFadeComplete = null;

function startFade(callback) {
  fading = true;
  fadeDirection = 1;
  fadeOpacity = 0;
  onFadeComplete = callback;
}

function updateFade() {
  if (!fading) return;
  fadeOpacity += 0.05 * fadeDirection;

  if (fadeDirection === 1 && fadeOpacity >= 1) {
    fadeOpacity = 1;
    fadeDirection = -1;

    if (onFadeComplete) {
      onFadeComplete(); //This calls the callback
      onFadeComplete = null;
    }
  }
  else if (fadeDirection === -1 && fadeOpacity <= 0) {
    fadeOpacity = 0;
    fading = false;
  }
}

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
  updateFade();
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

    if (!fading) {
      const tile = currentMap[player.tileY][player.tileX];

      // Enter house
      if (tile === 3.5) {
        lastOverworldX = player.tileX
        lastOverworldY = player.tileY + 1

        startFade(() => {
          currentMap = houseInterior;
          currentWorldType = "house";

          player.tileX = 4;
          player.tileY = 6;
          player.pixelX = player.tileX * TILE_SIZE;
          player.pixelY = player.tileY * TILE_SIZE;
        });
      }

      // Enter shop
      else if (tile === 4.2) {
        lastOverworldX = player.tileX
        lastOverworldY = player.tileY + 1
        
        startFade(() => {
          currentMap = shopInterior;
          currentWorldType = "shop";

          player.tileX = 6;
          player.tileY = 4;
          player.pixelX = player.tileX * TILE_SIZE;
          player.pixelY = player.tileY * TILE_SIZE;
        });
      }

      // Leave house
      else if (tile === 3.6) {
        startFade(() => {
          currentMap = world;
          currentWorldType = "overworld";
          player.tileX = lastOverworldX;
          player.tileY = lastOverworldY;
          player.pixelX = player.tileX * TILE_SIZE;
          player.pixelY = player.tileY * TILE_SIZE;
        });
      }

      // Leave shop
      else if (tile === 4.6) {
        startFade(() => {
          currentMap = world;
          currentWorldType = "overworld";
          player.tileX = lastOverworldX;
          player.tileY = lastOverworldY;
          player.pixelX = player.tileX * TILE_SIZE;
          player.pixelY = player.tileY * TILE_SIZE;
        });
      }
    }
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

  let walkableTiles;
  if (currentWorldType === "overworld") walkableTiles = [0, 3.5, 4.2];
  else if (currentWorldType === "house") walkableTiles = [3.6, 3.3];
  else if (currentWorldType === "shop") walkableTiles = [4.4, 4.2, 4.6];

  if (currentMap[targetY] && walkableTiles.includes(currentMap[targetY][targetX])) {
    moveDir = {x: dx, y: dy};
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
      const tile = currentMap[y] && currentMap[y][x];

      if (tile === 0) ctx.fillStyle = "#6c9";
      else if (tile === 1) ctx.fillStyle = "#555";

      else if (tile === 2) ctx.fillStyle = "#0f0";
      else if (tile === 2.5) ctx.fillStyle = "#682820ff";

      else if (tile === 3) ctx.fillStyle = "#aa8624ff";
      else if (tile === 3.1) ctx.fillStyle = "#dad1bbff";
      else if (tile === 3.2) ctx.fillStyle = "#05a8e9ff";
      else if (tile === 3.5) ctx.fillStyle = "#ff7b00ff";
      else if (tile === 3.6) ctx.fillStyle = "#ff7b00ff";
      else if (tile === 3.3) ctx.fillStyle = "#b58963"

      else if (tile === 4) ctx.fillStyle = "#b87800";
      else if (tile === 4.1) ctx.fillStyle = "#d6c9a0";
      else if (tile === 4.2) ctx.fillStyle = "#663300";
      else if (tile === 4.3) ctx.fillStyle = "#6ed0ff"; 
      else if (tile === 4.4) ctx.fillStyle = "#deb887"; 
      else if (tile === 4.5) ctx.fillStyle = "#8b4513"; 
      else if (tile === 4.6) ctx.fillStyle = "#663300";

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
if (fadeOpacity > 0) {
  ctx.fillStyle = `rgba(0, 0, 0, ${fadeOpacity})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
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