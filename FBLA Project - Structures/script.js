/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("gameCanvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

// === CONFIGURATION ===
const TILE_SIZE = 40;
let gameState = "menu";
const VISIBLE_COLS = canvas.width / TILE_SIZE;
const VISIBLE_ROWS = canvas.height / TILE_SIZE;

// === FIXED MAP USING ARRAY ===
// 0 = empty, 1 = wall, 2 = building, 3 = water
const world = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,2,2,2,0,0,0,0,0,0,0,0,3,3,3,0,0,0,1],
  [1,0,2,0,2,0,0,0,0,0,0,0,0,3,0,3,0,0,0,1],
  [1,0,2,2,2,0,0,0,0,0,0,0,0,3,3,3,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

// === PLAYER ===
const player = {
  tileX: 2,
  tileY: 2,
  pixelX: 2 * TILE_SIZE,
  pixelY: 2 * TILE_SIZE,
};

// === MOVEMENT ===
const WALK_FRAMES = 16;
let moving = false;
let moveDir = {x:0, y:0};
let frameCount = 0;
let speedPerFrame = TILE_SIZE / WALK_FRAMES;

// === CAMERA ===
let cameraX = 0;
let cameraY = 0;

// === INPUT ===
const keys = {};
let showGrid = false;

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;

  if (e.key.toLowerCase() === "g") showGrid = !showGrid;
  if (gameState === "menu" && e.key === "Enter") gameState = "game";
});
document.addEventListener("keyup", (e) => keys[e.key] = false);

// === GAME LOOP FUNCTIONS ===
function update() {
  if (moving) {
    frameCount++;
    player.pixelX += moveDir.x * speedPerFrame;
    player.pixelY += moveDir.y * speedPerFrame;

    if (frameCount >= WALK_FRAMES) {
      moving = false;
      frameCount = 0;
      player.tileX += moveDir.x;
      player.tileY += moveDir.y;
      player.pixelX = player.tileX * TILE_SIZE;
      player.pixelY = player.tileY * TILE_SIZE;
    }
    return;
  }

  let dx=0, dy=0;
  if(keys["ArrowUp"] || keys["w"]) dy=-1;
  else if(keys["ArrowDown"] || keys["s"]) dy=1;
  else if(keys["ArrowLeft"] || keys["a"]) dx=-1;
  else if(keys["ArrowRight"] || keys["d"]) dx=1;
  else return;

  if(dx!==0 && dy!==0) return;

  const targetX = player.tileX + dx;
  const targetY = player.tileY + dy;

  if(world[targetY] && world[targetY][targetX] === 0) {
    moveDir = {x: dx, y: dy};
    moving = true;
    frameCount = 0;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Camera follows player
  const targetCamX = player.pixelX - canvas.width/2 + TILE_SIZE/2;
  const targetCamY = player.pixelY - canvas.height/2 + TILE_SIZE/2;
  cameraX += (targetCamX - cameraX) * 0.2;
  cameraY += (targetCamY - cameraY) * 0.2;
  cameraX = Math.round(cameraX);
  cameraY = Math.round(cameraY);

  cameraX = Math.max(0, Math.min(cameraX, world[0].length*TILE_SIZE - canvas.width));
  cameraY = Math.max(0, Math.min(cameraY, world.length*TILE_SIZE - canvas.height));

  const startCol = Math.floor(cameraX / TILE_SIZE);
  const startRow = Math.floor(cameraY / TILE_SIZE);
  const endCol = startCol + VISIBLE_COLS + 1;
  const endRow = startRow + VISIBLE_ROWS + 1;

  // Draw tiles
  for(let y=startRow; y<endRow; y++){
    for(let x=startCol; x<endCol; x++){
      const tile = world[y] && world[y][x];
      if(tile===0) ctx.fillStyle="#6c9";
      else if(tile===1) ctx.fillStyle="#555";
      else if(tile===2) ctx.fillStyle="#ff0";
      else if(tile===3) ctx.fillStyle="#0ff";
      ctx.fillRect(x*TILE_SIZE - cameraX, y*TILE_SIZE - cameraY, TILE_SIZE, TILE_SIZE);
    }
  }

  // Draw grid
  if(showGrid){
    ctx.strokeStyle="rgba(0,0,0,0.3)";
    for(let x=startCol; x<=endCol; x++){
      const screenX = x*TILE_SIZE - cameraX;
      ctx.beginPath(); ctx.moveTo(screenX,0); ctx.lineTo(screenX,canvas.height); ctx.stroke();
    }
    for(let y=startRow; y<=endRow; y++){
      const screenY = y*TILE_SIZE - cameraY;
      ctx.beginPath(); ctx.moveTo(0,screenY); ctx.lineTo(canvas.width,screenY); ctx.stroke();
    }
  }

  // Draw player
  ctx.fillStyle="red";
  ctx.fillRect(player.pixelX - cameraX, player.pixelY - cameraY, TILE_SIZE, TILE_SIZE);
}

function drawMenu(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="#4a8";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="white";
  ctx.font="40px 'Press Start 2P'";
  ctx.textAlign="center";
  ctx.fillText("Tile Game Starter", canvas.width/2, canvas.height/2 - 60);
  ctx.font="24px 'Press Start 2P'";
  ctx.fillText("Press ENTER to start!", canvas.width/2, canvas.height/2 + 20);
}

function gameLoop(){
  if(gameState==="menu") drawMenu();
  else if(gameState==="game"){ update(); draw(); }
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);