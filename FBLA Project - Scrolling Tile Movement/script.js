/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("gameCanvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

// Tile size in pixels
const TILE_SIZE = 40;

// Visible area (tiles that fit on screen)
const VISIBLE_COLS = canvas.width / TILE_SIZE; // 20
const VISIBLE_ROWS = canvas.height / TILE_SIZE; // 15

// World size (larger than visible area)
const WORLD_COLS = 50;
const WORLD_ROWS = 50;

// Create the world map: 0 = empty, 1 = wall
const world = [];
for (let y = 0; y < WORLD_ROWS; y++) {
    const row = [];
    for (let x = 0; x < WORLD_COLS; x++) {
        if (x === 0 || y === 0 || x === WORLD_COLS-1 || y === WORLD_ROWS-1 || Math.random() < 0.1) {
            row.push(1); // wall
        } else {
            row.push(0); // empty tile
        }
    }
    world.push(row);
}

// Player position (in world coordinates)
const player = { x: 5, y: 5 };

// Camera position (top-left tile of visible area)
let cameraX = 0;
let cameraY = 0;

// Keyboard input
const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function update() {
    let newX = player.x;
    let newY = player.y;

    // Move player based on keys
    if (keys["ArrowUp"] || keys["w"]) newY--;
    if (keys["ArrowDown"] || keys["s"]) newY++;
    if (keys["ArrowLeft"] || keys["a"]) newX--;
    if (keys["ArrowRight"] || keys["d"]) newX++;

    // Collision check (optional)
    if (world[newY] && world[newY][newX] === 0) {
        player.x = newX;
        player.y = newY;
    }

    // Update camera to follow player
    cameraX = player.x - Math.floor(VISIBLE_COLS / 2);
    cameraY = player.y - Math.floor(VISIBLE_ROWS / 2);

    // Clamp camera so it doesn’t go outside world bounds
    cameraX = Math.max(0, Math.min(cameraX, WORLD_COLS - VISIBLE_COLS));
    cameraY = Math.max(0, Math.min(cameraY, WORLD_ROWS - VISIBLE_ROWS));
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Loop over only the visible tiles
    for (let y = 0; y < VISIBLE_ROWS; y++) {
        for (let x = 0; x < VISIBLE_COLS; x++) {
            const worldX = x + cameraX;
            const worldY = y + cameraY;
            const tile = world[worldY][worldX];

            // Draw tile
            ctx.fillStyle = tile === 0 ? "#6c9" : "#555";
            ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

            // Optional: draw tile border. The map looks better without this but i'll keep the line here
            // ctx.strokeStyle = "#333";
            // ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }

    // Draw player relative to camera
    ctx.fillStyle = "red";
    const screenX = (player.x - cameraX) * TILE_SIZE;
    const screenY = (player.y - cameraY) * TILE_SIZE;
    ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop)