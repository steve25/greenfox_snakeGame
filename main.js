// Ukáž svoju tvorivosť a zaujímavým spôsobom sa pokús rozšíriť svoju hru.💪🏻 Pošli nám ju buď odkazom na codepen, zabalenú v .zip formáte alebo prekopíruj svoj kód do e-mailu. 📩

// Za úspech považujeme splnenie aspoň jedného bodu.
// 🐍 Uprav kód hada tak, aby nebolo možné otočiť smer "do seba", teda napr. keď je aktuálny smer vľavo, nesmie sa dať nastaviť smer vpravo.

// 🐍 🍎 Na náhodné miesto hracieho poľa umiestni "jablko". Keď naň had vstúpi, predĺži sa o 1 dielik a náhodne sa umiestni ďalšie jablko.

// Bonusová, extra ťažká úloha:

// 🐍 💥 Kolíza hada - keď had narazí sám do seba, mala by hra skončiť.

const areaSize = 20;

let gameInterval;
let isGameRunning = false;
let isGameStarting = false;

let score = 0;

let position = [];
let snakePositions = [];
const direction = { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] };
let actualDirection = [];
let applePosition = [];

const setSnakeStartPosition = () => {
  position = [Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)];

  const directionsArr = Object.values(direction);
  const randomIndex = Math.floor(Math.random() * directionsArr.length);

  actualDirection = directionsArr[randomIndex];

  for (let index = 0; index < snake.children.length; index++) {
    snake.children[index].style.left = position[0] + "em";
    snake.children[index].style.top = position[1] + "em";
  }
};

const setApplePosition = () => {
  applePosition = [
    Math.floor(Math.random() * 20),
    Math.floor(Math.random() * 20),
  ];

  // dont put a apple to the snake
  snakePositions.forEach((colisionPoint) => {
    if (
      colisionPoint.x == applePosition[0] &&
      colisionPoint.y == applePosition[1]
    ) {
      setApplePosition();
    }
  });

  apple.style.left = applePosition[0] + "em";
  apple.style.top = applePosition[1] + "em";
};

const keyPress = (event) => {
  if (event.key == "Enter" && !isGameRunning) {
    isGameRunning = true;
    startGame();
  }

  if (actualDirection !== direction.right && event.key == "ArrowLeft")
    return (actualDirection = direction.left);

  if ((actualDirection !== direction.left && event.key) == "ArrowRight")
    return (actualDirection = direction.right);

  if (actualDirection !== direction.down && event.key == "ArrowUp")
    return (actualDirection = direction.up);

  if (actualDirection !== direction.up && event.key == "ArrowDown")
    return (actualDirection = direction.down);
};

const step = () => {
  const tail = snake.children[0];
  const newTail = tail.cloneNode();

  snakePositions.forEach((colisionPoint, index) => {
    if (index !== snakePositions.length) {
      if (colisionPoint.x == position[0] && colisionPoint.y == position[1]) {
        endGame();
      }
    }
  });

  snakePositions.push({ x: position[0], y: position[1] });

  snakePositions = snakePositions.slice(-1 * snake.children.length);

  position = position.map((element, index) => {
    const location = (element + actualDirection[index]) % areaSize;
    return location < 0 ? areaSize - 1 : location;
  });

  tail.style.left = position[0] + "em";
  tail.style.top = position[1] + "em";

  if (position[0] === applePosition[0] && position[1] === applePosition[1]) {
    score++;
    scoreText.innerText = score;

    snake.prepend(newTail);
    setApplePosition();
  }

  snake.append(tail);
};

const startGame = () => {
  if (!isGameRunning) return;

  info.style.display = "none";

  setSnakeStartPosition();

  for (let index = 0; index < snake.children.length; index++) {
    snake.children[index].style.display = "block";
  }

  setTimeout(() => {
    apple.style.display = "block";
    setApplePosition();
  }, 0);

  gameInterval = setInterval(() => {
    step();
  }, 200);
};

const endGame = () => {
  isGameRunning = false;
  clearInterval(gameInterval);
  info.style.display = "block";
};

window.onkeydown = keyPress;
