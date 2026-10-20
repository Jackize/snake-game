// ===== Cấu hình game =====
const CONFIG = {
  gridSize: 20,          // số ô trên mỗi chiều
  cellSize: 20,          // pixel mỗi ô (gridSize * cellSize = canvas size)
  initialSpeed: 150,     // ms mỗi bước
  speedIncrement: 2,     // tăng tốc mỗi khi ăn
  minSpeed: 60,          // tốc độ nhanh nhất
};

// ===== Trạng thái =====
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("high-score");
const startBtn = document.getElementById("start-btn");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlay-title");
const overlayMessage = document.getElementById("overlay-message");
const restartBtn = document.getElementById("restart-btn");

let snake, direction, nextDirection, food, score, highScore, speed, timerId, running;

highScore = Number(localStorage.getItem("snakeHighScore")) || 0;
highScoreEl.textContent = highScore;

// ===== Hàm game =====
function initGame() {
  snake = [
    { x: 8, y: 10 },
    { x: 7, y: 10 },
    { x: 6, y: 10 },
  ];
  direction = { x: 1, y: 0 };
  nextDirection = { ...direction };
  score = 0;
  speed = CONFIG.initialSpeed;
  running = true;
  spawnFood();
  updateScore();
  hideOverlay();
  loop();
}

function loop() {
  clearTimeout(timerId);
  if (!running) return;
  update();
  draw();
  timerId = setTimeout(loop, speed);
}

function update() {
  direction = nextDirection;
  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };

  // Đi xuyên tường — rắn xuất hiện ở phía đối diện
  head.x = (head.x + CONFIG.gridSize) % CONFIG.gridSize;
  head.y = (head.y + CONFIG.gridSize) % CONFIG.gridSize;

  // Va thân
  if (snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
    return gameOver();
  }

  snake.unshift(head);

  // Ăn thức ăn
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    speed = Math.max(CONFIG.minSpeed, speed - CONFIG.speedIncrement);
    spawnFood();
    updateScore();
  } else {
    snake.pop();
  }
}

function spawnFood() {
  do {
    food = {
      x: Math.floor(Math.random() * CONFIG.gridSize),
      y: Math.floor(Math.random() * CONFIG.gridSize),
    };
  } while (snake.some((seg) => seg.x === food.x && seg.y === food.y));
}

function draw() {
  const { cellSize, gridSize } = CONFIG;

  // Nền
  ctx.fillStyle = "#0f3460";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Lưới (nhẹ)
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  for (let i = 0; i <= gridSize; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, gridSize * cellSize);
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(gridSize * cellSize, i * cellSize);
    ctx.stroke();
  }

  // Thức ăn
  ctx.fillStyle = "#ff4d6d";
  ctx.beginPath();
  ctx.arc(
    food.x * cellSize + cellSize / 2,
    food.y * cellSize + cellSize / 2,
    cellSize / 2 - 2,
    0,
    Math.PI * 2
  );
  ctx.fill();

  // Rắn
  snake.forEach((seg, i) => {
    ctx.fillStyle = i === 0 ? "#4ecca3" : "#3dbb92";
    ctx.fillRect(seg.x * cellSize + 1, seg.y * cellSize + 1, cellSize - 2, cellSize - 2);
  });
}

function updateScore() {
  scoreEl.textContent = score;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("snakeHighScore", highScore);
    highScoreEl.textContent = highScore;
  }
}

function gameOver() {
  running = false;
  clearTimeout(timerId);
  overlayTitle.textContent = "Game Over";
  overlayMessage.textContent = `Điểm của bạn: ${score}`;
  overlay.classList.remove("hidden");
}

function hideOverlay() {
  overlay.classList.add("hidden");
}

// ===== Điều khiển =====
const keyMap = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
};

document.addEventListener("keydown", (e) => {
  const dir = keyMap[e.key];
  if (!dir) return;
  e.preventDefault();
  // Không được quay ngược 180 độ
  if (dir.x === -direction.x && dir.y === -direction.y) return;
  nextDirection = dir;
});

startBtn.addEventListener("click", initGame);
restartBtn.addEventListener("click", initGame);

// ===== Vẽ trạng thái ban đầu (preview trước khi bấm Bắt đầu) =====
snake = [
  { x: 8, y: 10 },
  { x: 7, y: 10 },
  { x: 6, y: 10 },
];
direction = { x: 1, y: 0 };
nextDirection = { ...direction };
food = { x: 13, y: 10 };
score = 0;
running = false;
draw();
