const gridsize = 10;
const game = document.getElementById('game');
const message = document.getElementById('message');
let tiles = [];
let map = [];
let playerx, playery;

// --------------- Map Generation ----------------
function generateRandomMap(size) {
    const newMap = [];
    for (let y = 0; y < size; y++) {
        const row = [];
        for (let x = 0; x < size; x++) {
            row.push(Math.random() < 0.25 ? 1 : 0);
        }
        newMap.push(row);
    }
    return newMap;
}

function randomEmptyTile(map) {
    const openTiles = [];
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[0].length; x++) {
            if (map[y][x] === 0) openTiles.push({x, y});
        }
    }
    return openTiles[Math.floor(Math.random() * openTiles.length)];
}

function isReachable(map, start, goal) {
    const queue = [start];
    const visited = new Set();
    const key = (x, y) => `${x},${y}`;

    while (queue.length > 0) {
        const {x, y} = queue.shift();
        if (x === goal.x && y === goal.y) return true;

        for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
            const nx = x + dx;
            const ny = y + dy;
            if (
                nx >= 0 && ny >= 0 &&
                nx < map[0].length && ny < map.length &&
                map[ny][nx] !== 1 &&
                !visited.has(key(nx, ny))
            ) {
                visited.add(key(nx, ny));
                queue.push({x: nx, y: ny});
            }
        }
    }
    return false;
}

function createSolvableMap(size) {
    let map, start, goal;
    do {
        map = generateRandomMap(size);
        start = randomEmptyTile(map);
        goal = randomEmptyTile(map);
    } while (!isReachable(map, start, goal));

    map[goal.y][goal.x] = 2; // This sets the goal on the map
    return { map, start, goal };
}

// --------------- Game Functions ----------------
function buildMap() {
    game.innerHTML = '';
    tiles = [];
    const grassTiles = ['grass1.png', 'grass2.png', 'grass3.png'];

    for (let y = 0; y < gridsize; y++) {
        for (let x = 0; x < gridsize; x++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            if (map[y][x] === 1) {
                tile.classList.add('wall');
            }
            else if (map[y][x] === 2) {
                tile.classList.add('goal');
            }
            else {
                const randomGrass = grassTiles[Math.floor(Math.random() * grassTiles.length)];
                tile.style.backgroundImage = `url('${randomGrass}')`;
                tile.style.backgroundSize = 'cover';
            }
            game.appendChild(tile);
            tiles.push(tile);
        }
    }
}

function drawPlayer() {
    tiles.forEach(tile => {
        const existing = tile.querySelector('.player');
        if (existing) tile.removeChild(existing);
    });
    const index = playerx + playery * gridsize;
    const playerDiv = document.createElement('div');
    playerDiv.classList.add('player');
    tiles[index].appendChild(playerDiv);
}

function showMessage(text) {
    message.textContent = text;
    message.style.opacity = 1;
    setTimeout(() => { message.style.opacity = 0; }, 2000);
}

// --------------- Start Game ----------------
function startGame() {
    const result = createSolvableMap(gridsize);
    map = result.map;
    playerx = result.start.x;
    playery = result.start.y;
    buildMap();
    drawPlayer();
}

startGame();

// --------------- Player Movement ----------------
document.addEventListener('keydown', (event) => {
    let newplayerx = playerx;
    let newplayery = playery;

    if (event.key === 'ArrowUp' || event.key === 'w') newplayery--;
    if (event.key === 'ArrowDown' || event.key === 's') newplayery++;
    if (event.key === 'ArrowLeft' || event.key === 'a') newplayerx--;
    if (event.key === 'ArrowRight' || event.key === 'd') newplayerx++;

    // To check boundaries and walls
    if (
        newplayerx >= 0 &&
        newplayery >= 0 &&
        newplayerx < gridsize &&
        newplayery < gridsize &&
        map[newplayery][newplayerx] !== 1
    ) {
        playerx = newplayerx;
        playery = newplayery;
    }

    drawPlayer();

    // To check if the player won
    if (map[playery][playerx] === 2) {
        showMessage("You Win!");
        setTimeout(startGame, 800);
    }
});