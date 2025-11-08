const map = [
    [0,0,0,1,0,1,1,0,0,0],
    [0,1,0,1,0,0,1,0,1,0],
    [0,1,0,0,0,1,0,0,1,0],
    [0,1,1,1,0,1,1,1,1,0],
    [0,0,0,1,0,0,0,0,0,0],
    [1,1,0,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,1,0,0],
    [0,1,1,1,1,1,0,1,1,0],
    [0,0,0,0,0,0,0,0,1,0],
    [2,1,1,1,1,1,1,1,1,0],
];
const gridsize = map.length
const game = document.getElementById('game');
const tiles = [];

// This is the logic for the map and the css displays the map on screen.
for (let y = 0; y < gridsize; y += 1) {
    for (let x = 0; x < gridsize; x += 1) {
        const tile = document.createElement('div');
        tile.classList.add('tile')
        if (map[y][x] === 1) { tile.classList.add('wall'); }
        if (map[y][x] === 2) { tile.classList.add('goal'); }
        game.appendChild(tile);
        tiles.push(tile);
    }
}

let playerx = 9;
let playery = 0;

// 

function drawPlayer() {
    tiles.forEach(tile => tile.classList.remove('player'));
    const index = playerx + playery * gridsize;
    tiles[index].classList.add('player');
}

drawPlayer();

document.addEventListener('keydown', (event) => {
    let newplayerx = playerx;
    let newplayery = playery;
    if (event.key === 'ArrowUp' ||   event.key === 'w') {newplayery -= 1;}
    if (event.key === 'ArrowDown' ||  event.key === 's') {newplayery += 1;}
    if (event.key === 'ArrowLeft' ||  event.key === 'a') {newplayerx -= 1;}
    if (event.key === 'ArrowRight' ||  event.key === 'd') {newplayerx += 1;}
    if (newplayerx >= 0 && 
        newplayery >= 0 && 
        newplayerx < map[0].length && 
        newplayery < map.length && 
        map[newplayery][newplayerx] !== 1) {
        [playerx = newplayerx], 
        [playery = newplayery];
    }
    drawPlayer();
});