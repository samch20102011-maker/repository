let hunger = 100;
let happiness = 100;

const clicksound = new Audio("sounds/clicksound.mp3");

function updateStats() {
    document.getElementById('hunger').innerText = hunger;
    document.getElementById('happiness').innerText = happiness;

    const petImg = document.getElementById('pet-image');
    if (hunger < 30 || happiness < 30) {
        petImg.src = 'sadpet.png';
    } else {
        petImg.src = 'happypet.png';
    }
}

setInterval(() => {
    hunger = Math.max(hunger - 2, 0);
    happiness = Math.max(happiness - 1, 0);
    updateStats();
}, 1000);

function feed() {
    hunger = Math.min(hunger + 5, 100);
    clicksound.currentTime = 0;
    clicksound.play()
    updateStats();
}

function play() {
    happiness = Math.min(happiness + 3, 100);
    clicksound.currentTime = 0;
    clicksound.play()
    updateStats();
}

updateStats();