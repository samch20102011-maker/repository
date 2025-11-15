const petStats = {
    name: "",
    age: 0,
    hunger: 100,
    happiness: 100,
    inventory: ["Apple", "Ball", "Toy"]
};

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
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background
  ctx.fillStyle = "#000000b3";
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
  ctx.fillText(`Inventory:`, 50, 330);

  // Inventory
  petStats.inventory.forEach((item, i) => {
    ctx.fillText(`- ${item}`, 50, 380 + i * 40);
  });

  ctx.font = "20px 'Press Start 2P'";
  ctx.fillText("Press ESC to return", 50, canvas.height - 50)
}