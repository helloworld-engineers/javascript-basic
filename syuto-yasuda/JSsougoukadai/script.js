const newUpBtn = document.getElementById("upBtn");
const newLeftBtn = document.getElementById("leftBtn");
const newRightBtn = document.getElementById("rightBtn");
const newDownBtn = document.getElementById("downBtn");

let player = {
  HP: 100,
  attack: 10,
  level: 1,
};

let playerPosition = { x: 0, y: 0 };

const masterMonsters = {
  slime: {
    HP: 20,
    attack: 10,
    exp: 10,
    appearanceRate: 65,
  },
  doragon: {
    HP: 40,
    attack: 20,
    exp: 15,
    appearanceRate: 25,
  },
  metalslime: {
    HP: 20,
    attack: 10,
    exp: 30,
    appearanceRate: 10,
  },
};

// 移動キーを押した時にプレイヤーの位置を移動する関数
const moveCharacter = (direction) => {
  if (direction === "up") {
    playerPosition.y += 1;
  }
  if (direction === "down") {
    playerPosition.y -= 1;
  }

  if (direction === "left") {
    playerPosition.x -= 1;
  }

  if (direction === "right") {
    playerPosition.x += 1;
  }
  return playerPosition;
};

// 上ボタンを押した時の処理
newUpBtn.addEventListener("click", () => {
  if (playerPosition.y === 30) {
    return;
  }
  const direction = "up";
  moveCharacter(direction);
});

// 下ボタンを押した時の処理
newDownBtn.addEventListener("click", () => {
  if (playerPosition.y === -30) {
    return;
  }
  const direction = "down";
  moveCharacter(direction);
});

// 左ボタンを押した時の処理
newLeftBtn.addEventListener("click", () => {
  if (playerPosition.x === -30) {
    return;
  }
  const direction = "left";
  moveCharacter(direction);
});

// 右ボタンを押した時の処理
newRightBtn.addEventListener("click", () => {
  if (playerPosition.x === 30) {
    return;
  }
  const direction = "right";
  moveCharacter(direction);
});
