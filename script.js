
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const playerImg = new Image();
playerImg.src = "player.png";

const playerHappyImg = new Image();
playerHappyImg.src = "player_happy.png";

const images = {
    batata: new Image(),
    hamburguer: new Image(),
    coca: new Image(),
    milkshake: new Image(),
    obstaculo: new Image()
};

images.batata.src = "batata.png";
images.hamburguer.src = "hamburguer.png";
images.coca.src = "coca.png";
images.milkshake.src = "milkshake.png";
images.obstaculo.src = "obstaculo.png";

let player = { x: 180, y: 520, width: 40, height: 60, speed: 7 };
let items = [];
let obstacles = [];
let itemTypes = ["batata", "hamburguer", "coca", "milkshake"];
let score = 0;
let lives = 3;
let phase = 1;
let isHappy = false;

let loadedImages = 0;
const totalImages = 2 + Object.keys(images).length;

function checkAllLoaded() {
    loadedImages++;
    if (loadedImages >= totalImages) gameLoop();
}

playerImg.onload = checkAllLoaded;
playerHappyImg.onload = checkAllLoaded;
images.batata.onload = checkAllLoaded;
images.hamburguer.onload = checkAllLoaded;
images.coca.onload = checkAllLoaded;
images.milkshake.onload = checkAllLoaded;
images.obstaculo.onload = checkAllLoaded;

function randomItem() {
    let item;
    do {
        item = {
            x: Math.random() * (canvas.width - 40),
            y: -40, width: 40, height: 40,
            type: itemTypes[Math.floor(Math.random() * itemTypes.length)],
            speed: 1 + phase
        };
    } while (collision(player, item));
    return item;
}

function randomObstacle() {
    let obs;
    do {
        obs = { x: Math.random() * (canvas.width - 40), y: -40, width: 40, height: 40, speed: 1 + phase };
    } while (collision(player, obs));
    return obs;
}

function drawPlayer() {
    const img = isHappy ? playerHappyImg : playerImg;
    if (img.complete) ctx.drawImage(img, player.x, player.y, player.width, player.height);
}

function drawItems() {
    items.forEach(item => {
        const img = images[item.type];
        if (img.complete) ctx.drawImage(img, item.x, item.y, item.width, item.height);
    });
}

function drawObstacles() {
    obstacles.forEach(obs => {
        const img = images.obstaculo;
        if (img.complete) ctx.drawImage(img, obs.x, obs.y, obs.width, obs.height);
    });
}

function updateItems() {
    items = items.filter(item => {
        item.y += item.speed;
        if (collision(player, item)) {
            score += 10;
            isHappy = true;
            setTimeout(() => isHappy = false, 500);
            if (score % 100 === 0) phase++;
            return false;
        }
        return item.y <= canvas.height;
    });
}

function updateObstacles() {
    obstacles = obstacles.filter(obs => {
        obs.y += obs.speed;
        if (collision(player, obs)) {
            lives--;
            if (lives <= 0) {
                alert("Game Over! Você fez " + score + " pontos.");
                document.location.reload();
            }
            return false;
        }
        return obs.y <= canvas.height;
    });
}

function collision(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawItems();
    drawObstacles();
    updateItems();
    updateObstacles();
    document.getElementById("score").innerText = `Pontos: ${score} | Vidas: ${lives} | Fase: ${phase}`;
}

function gameLoop() {
    update();
    if (Math.random() < 0.03) items.push(randomItem());
    if (Math.random() < 0.01) obstacles.push(randomObstacle());
    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft" && player.x > 0) player.x -= player.speed;
    if (e.key === "ArrowRight" && player.x + player.width < canvas.width) player.x += player.speed;
});

document.getElementById("leftBtn")?.addEventListener("touchstart", () => {
    if (player.x > 0) player.x -= player.speed;
});

document.getElementById("rightBtn")?.addEventListener("touchstart", () => {
    if (player.x + player.width < canvas.width) player.x += player.speed;
});
