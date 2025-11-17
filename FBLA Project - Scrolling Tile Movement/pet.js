const inventory = {
  foodUnits: 3,
  apples: 1,
  balls: 1,
  toys: 1,
};

const petStats = {
    name: "",
    type: "",
    age: 0,
    hunger: 100,
    happiness: 100,
    health: 100,
    inventory: [`Apple(${inventory.apples})`, `Ball(${inventory.balls})`, `Toy(${inventory.toys})`, `Food(${inventory.foodUnits})`]
};

function startingMessage() {
  alert("You moved to a new town and you decided to get a new pet! (You, the player, are the red square)")
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
let hungerDecay = 2;
let happinessDecay = 1;

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
  // Background
  ctx.fillStyle = "#9090aa2e";
  ctx.fillRect(30, 30, canvas.width-60, canvas.height-60);

  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.textAlign = "left";
  ctx.font = "30px 'Press Start 2P'";

  // Title
  ctx.fillText(`Inventory:`, 50, 80);

  // Inventory
  let y = 130;
  for (let key in inventory) {
    let itemName = key.charAt(0).toUpperCase() + key.slice(1); // Capitalize
    ctx.fillText(`- ${itemName}: ${inventory[key]}`, 50, y);
    y += 40;
  }

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

// === ACTIONS PAGE ===
let actionsSelection = 0;
const actionsOptions = ["Play", "Feed", "Use Item", "Exit"];

document.addEventListener("keydown", (e) => {
  if (gameState === "actions") {
    if (e.key === "ArrowUp") actionsSelection = (actionsSelection + actionsOptions.length - 1) % actionsOptions.length;
    if (e.key === "ArrowDown") actionsSelection = (actionsSelection + 1) % actionsOptions.length;

    if (e.key === "Enter") {
      doAction(actionsSelection);
    }
  }
});

function drawActions() {
  // background
  ctx.fillStyle = "#9090aa2e"
  ctx.fillRect(30, 30, canvas.width-60, canvas.height-60);

  // Title
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.font = "60px 'Press Start 2P'";
  ctx.textAlign = "center";
  ctx.fillText("Actions", canvas.width / 2, 100);
  ctx.strokeText("Actions", canvas.width / 2, 100);

  // Navigation
  ctx.font = "40px 'Press Start 2P'";
  actionsOptions.forEach((option, i) => {
    const yPos = 200 + i * 70;

    if (i === actionsSelection) {
      ctx.fillStyle = "#0074f8ff"
      ctx.strokeStyle = "#fffb00ff";
    } else {
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
    }
    ctx.fillText(option, canvas.width / 2, yPos);
    ctx.strokeText(option, canvas.width / 2, yPos);    
});
}

function doAction(index) {
  const choice = actionsOptions[index];

  if (currentWorldType === "playerhouse") {
    if (choice === "Play") {
      if (petStats.hunger > 30) {
        alert(`You played with ${petStats.name} which made it more happy (+15) but it also got hungry. (-15)`);
        petStats.happiness += 15;
        petStats.hunger -= 15;
    } else {
      alert("Your pet is too hungry to play right now.");
    }
  }
    else if (choice === "Feed") {
      if (inventory.foodUnits > 0) {
        inventory.foodUnits -= 1;
        alert(`You fed ${petStats.name} (+20). You now have ${inventory.foodUnits} food left.`);
        petStats.hunger += 20;
      } else {
        alert("You don't have any food right now.")
      }
    }
    else if (choice === "Use Item") {
      useItem()
    }
    else if (choice === "Exit") {
      gameState = "game";
    }
  }
}

// === USE ITEMS SYSTEM ===
function useItem() {
  let itemPrompt = ""
  itemPrompt = prompt("What item would you like to use? Items: Apple, Toy, Ball").toLowerCase()

  if (!itemPrompt) return;

  else if (itemPrompt === "apple") {
    if (inventory.apples > 0) {
      alert(`You fed ${petStats.name} 1 apple which increased its health (+10) and made it less hungry (+15). You now have ${inventory.apples - 1} apples left.`)
      petStats.health += 10
      petStats.hunger += 15
      inventory.apples -= 1
    }
    else {
      alert("You have no apples.")
    }

  }
  else if (itemPrompt === "toy") {
    if (inventory.toys > 0) {
      alert(`You gave ${petStats.name} a toy which increased happiness (+25). You now have ${inventory.toys - 1} toys left.`)
      petStats.happiness += 25
      inventory.toys -= 1
    }
    else {
      alert("You have no toys.")
    }

  }
  else if (itemPrompt === "ball") {
    if (inventory.balls > 0) {
    alert(`You played fetch with ${petStats.name} which made it more happy (+40) but it also got hungry (-10). You now have ${inventory.balls - 1} balls left.`)
    petStats.happiness += 40
    petStats.hunger -= 10
    inventory.balls -= 1
    }
    else {
      alert("You have no balls.")
    }
  }
  else {
    alert("Invalid choice.")
  }
}

// === SHOP PAGE ===
let shopSelection = 0;
const shopOptions = [
  "Buy Food - $20", 
  "Buy Toy - $15",
  "Buy Ball - $15",
  "Buy Apple - $10", 
  "Exit"]

document.addEventListener("keydown", (e) => {
  if (gameState === "shop") {
    if (e.key === "ArrowUp") shopSelection = (shopSelection + shopOptions.length - 1) % shopOptions.length;
    if (e.key === "ArrowDown") shopSelection = (shopSelection + 1) % shopOptions.length;

    if (e.key === "Enter") {
      doShopAction(shopSelection)
    }
  }
});

function drawShop() {
  // Background
  ctx.fillStyle = "#9090aa2e";
  ctx.fillRect(30, 30, canvas.width - 60, canvas.height - 60);

  // Title
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.font = "60px 'Press Start 2P'";
  ctx.textAlign = "center";
  ctx.fillText("Shop", canvas.width / 2, 100);
  ctx.strokeText("Shop", canvas.width / 2, 100);

  // Options
  ctx.font = "40px 'Press Start 2P'";
  shopOptions.forEach((option, i) => {
    const yPos = 200 + i * 70;

    if (i === shopSelection) {
      ctx.fillStyle = "#0074f8ff";
      ctx.strokeStyle = "#fffb00ff";
    } else {
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
    }

    ctx.fillText(option, canvas.width / 2, yPos);
    ctx.strokeText(option, canvas.width / 2, yPos);
  });
}

function doShopAction(index) {
  const choice = shopOptions[index]

  
  if (choice.includes("Food")) {
    if (money >= 20) {
      money -= 20;
      inventory.foodUnits += 1;
      alert(`You bought 1 food. You now have ${inventory.foodUnits} food.`);
    } else alert("Not enough money!");

  } else if (choice.includes("Toy")) {
    if (money >= 15) {
      money -= 15;
      inventory.toys += 1;
      alert("You bought a Toy!");
    } else alert("Not enough money!");

  } else if (choice.includes("Ball")) {
    if (money >= 15) {
      money -= 15;
      inventory.balls += 1;
      alert("You bought a Ball!");
    } else alert("Not enough money!");

  } else if (choice.includes("Apple")) {
    if (money >= 10) {
      money -= 10;
      inventory.apples += 1;
      alert("You bought an Apple!");
    } else alert("Not enough money!");

  } else if (choice === "Exit") {
    gameState = "game";
  }
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
  else if (gameState === "actions") {
    drawActions();
    updatePetStats();
  }
  else if (gameState === "shop") {
    drawShop();
    updatePetStats();
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);