const petStats = {
    name: "",
    type: "",
    age: 0,
    hunger: 100,
    happiness: 100,
    health: 100,
    inventory: ["Apple", "Ball", "Toy"]
};

function startingMessage() {
  alert("You moved to a new town and you decided to get a new pet!")
  alert("Explore, visit shops, and take care of your new pet!")
  alert("You get $100 per day to spend on your pet's necessities.")

}

function petPrompt() {
  let petName = "";
  while (true) {
    petName = prompt("What would you like to name your pet?");            
    
    if (petName.length === 0) {
      alert("Name cannot be empty!");

    } else if (petName.length > 16) {
      alert("Name cannot be longer than 16 characters!");

    } else {
      break;
    }
  }
  petStats.name = petName.charAt(0).toUpperCase() + petName.slice(1);

  let petType = "";
  while (true) {
    petType = prompt("Would you like to have a cat, dog, rabbit, or bird?").toLowerCase();
    
    if (petType === "cat" || petType === "dog" || petType === "rabbit" || petType === "bird") {
      break;
    } else {
      alert("Invalid choice.")
    }
  }
  petStats.type = petType.charAt(0).toUpperCase() + petType.slice(1);
}
  


// === UPDATE STATS ===
let hungerDecay = 1;
let happinessDecay = 0.5;

let lastStatUpdate = Date.now();
const statUpdateMS = 2000; // Updates every 2 seconds

function updatePetStats() {
  const now = Date.now();

  if (now - lastStatUpdate >= statUpdateMS) {

    petStats.hunger -= hungerDecay;
    petStats.happiness -= happinessDecay;

    // Clamp values so they never go below 0 or above 100
    petStats.hunger = Math.max(0, Math.min(100, petStats.hunger));
    petStats.happiness = Math.max(0, Math.min(100, petStats.happiness));

    petStats.hunger = Math.round(petStats.hunger * 10) / 10;
    petStats.happiness = Math.round(petStats.happiness * 10) / 10;

    lastStatUpdate = now;
  }
}

//function play() {}


// === INVENTORY PAGE ===
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
  ctx.fillText(`Inventory:`, 50, 80);

  // Inventory
  petStats.inventory.forEach((item, i) => {
    ctx.fillText(`- ${item}`, 50, 130 + i * 40);
  });

  ctx.font = "20px 'Press Start 2P'";
  ctx.fillText("Press ESC to return", 50, canvas.height - 50)
}

// === STATS PAGE ===
document.addEventListener("keydown", (e) => {

  // Open/close inventory only in game
  if (gameState === "game") {
    if (e.key.toLowerCase() === "c") {
      gameState = "stats";
    }
  }

  // Return from inventory
  else if (gameState === "stats") {
    if (e.key === "Escape") {
      gameState = "game";
    }
  }

  // ...Existing menu and instructions keys here
});

function drawStats() {
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
  ctx.fillText(`Type: ${petStats.type}`, 50, 130); 
  ctx.fillText(`Age: ${petStats.age}`, 50, 180);
  ctx.fillText(`Hunger: ${petStats.hunger}`, 50, 230);
  ctx.fillText(`Happiness: ${petStats.happiness}`, 50, 280);
  ctx.fillText(`Health: ${petStats.health}`, 50, 330);

  ctx.font = "20px 'Press Start 2P'";
  ctx.fillText("Press ESC to return", 50, canvas.height - 50)
}

// === DAY SYSTEM ===
let day = 1;
let money = 100;
let ageIncrease = 0.1
const DAY_DURATION_MS = 60000; // This is 1 minute in milliseconds
let lastDayTime = Date.now();

function showDay(dayNumber) {
  const dayDisplay = document.getElementById("dayDisplay");
  dayDisplay.textContent = "Day " + dayNumber;

  dayDisplay.style.opacity = "1";

  setTimeout(() => {
    dayDisplay.style.opacity = "0";
  }, 5000);
}

function updateDaySystem() {
  const now = Date.now(); // Milliseconds since the unix epoch (Beginning of january 1, 1970 UTC)
  if (now - lastDayTime >= DAY_DURATION_MS) {
    day++;
    money += 100; // give 100 money each day
    
    petStats.age += ageIncrease
    petStats.age = Math.round(petStats.age * 100) / 100;

    lastDayTime = now;

    showDay(day)
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


// === GAMELOOP ===

function gameLoop() {
  
  if (gameState === "game") {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    update();
    draw();
    updateDaySystem();
    updatePetStats();

  }
  else if (gameState === "menu") {
    drawMenu();
  }
  else if (gameState === "instructions") {
    drawInstructions();
    updatePetStats();
  }
  else if (gameState === "inventory") {
    drawInventory();
    updatePetStats();
  }
  else if (gameState === "stats") {
    drawStats();
    updatePetStats();
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);