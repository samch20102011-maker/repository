const petStats = {
    name: "",
    age: 0,
    hunger: 100,
    happiness: 100,
    health: 100,
    inventory: ["Apple", "Ball", "Toy"]
};

// === INVENTORY ===
document.addEventListener("keydown", (e) => {

  // Open/close inventory only in game
  if (gameState === "game") {
    if (e.key.toLowerCase() === "e") {
      gameState = "inventory";
    }
  }

  // Return from inventory
  else if (gameState === "inventory") {
    if (e.key === "Escape") {
      gameState = "game";
    }
  }

  // ...Existing menu and instructions keys here
});

function drawInventory() {
  //ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background
  ctx.fillStyle = "#9090aa2e";
  ctx.fillRect(30, 30, canvas.width-60, canvas.height-60);

  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.textAlign = "left";
  ctx.font = "30px 'Press Start 2P'";

  // Stats, the numbers at the end are x,y position of the text
  ctx.fillText(`Name: ${petStats.name}`, 50, 80); 
  ctx.fillText(`Age: ${petStats.age}`, 50, 130);
  ctx.fillText(`Hunger: ${petStats.hunger}`, 50, 180);
  ctx.fillText(`Happiness: ${petStats.happiness}`, 50, 230);
  ctx.fillText(`Health: ${petStats.health}`, 50, 280);
  ctx.fillText(`Inventory:`, 50, 380);

  // Inventory
  petStats.inventory.forEach((item, i) => {
    ctx.fillText(`- ${item}`, 50, 430 + i * 40);
  });

  ctx.font = "20px 'Press Start 2P'";
  ctx.fillText("Press ESC to return", 50, canvas.height - 50)
}

// === DAY SYSTEM ===
let day = 1;
let money = 100;
const DAY_DURATION_MS = 60000; // This is 1 minute in milliseconds
let lastDayTime = Date.now();

function updateDaySystem() {
  const now = Date.now(); // Milliseconds since the unix epoch (Beginning of january 1, 1970 UTC)
  if (now - lastDayTime >= DAY_DURATION_MS) {
    day++;
    money += 100; // give 100 money each day
    lastDayTime = now;
  }

  ctx.fillStyle = "white";
  ctx.font = "30px 'Press Start 2P'";
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  ctx.fillText(`Day ${day}`, 20, canvas.height - 20);

  ctx.fillStyle = "white";
  ctx.font = "30px 'Press Start 2P'";
  ctx.textAlign = "right";
  ctx.textBaseline = "bottom";
  ctx.fillText(`$${money}`, canvas.width - 20, canvas.height - 20);


  
    
}