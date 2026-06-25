const upBtn = document.getElementById("upBtn");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const downBtn = document.getElementById("downBtn");
const MAX_POSIOTION = 30;
const MIN_POSITION = -30;

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

// マップの上限か判定をする関数
const canMove = (direction) => {
  if (direction === "up" && playerPosition.y < MAX_POSIOTION) return false;
  if (direction === "down" && playerPosition.y > MIN_POSITION) return false;
  if (direction === "left" && playerPosition.x > MIN_POSITION) return false;
  if (direction === "right" && playerPosition.x < MAX_POSIOTION) return false;
  return true;
};

// モンスターが出現するか決める関数
const encounterCheck = () => {
  return Math.random() < 0.4;
};

// 出現するモンスターを決める関数
const randomMonsters = (masterMonsters) => {
  let selectMonster;
  const randomNum = Math.random();
  if (randomNum <= 0.1) {
    selectMonster = masterMonsters.metalslime;
  } else if (randomNum <= 0.35) {
    selectMonster = masterMonsters.doragon;
  } else {
    selectMonster = masterMonsters.slime;
  }
  return selectMonster;
};
// 現在のエリアを判定する関数
const areaCheck = (playerPosition) => {
  if (playerPosition.x === 0 || playerPosition.y === 0) {
    return "grassland";
  }
  if (playerPosition.x > 0 && playerPosition.y > 0) {
    return "sky";
  }
  if (playerPosition.x > 0 && playerPosition.y < 0) {
    return "sea";
  }
  if (playerPosition.x < 0 && playerPosition.y < 0) {
    return "castle";
  }
  if (playerPosition.x < 0 && playerPosition.y > 0) {
    return "volcano";
  }
  return "grassland"; //どこにも当てはまらない時の保険
};

// 上ボタンを押した時の処理
upBtn.addEventListener("click", () => {
  const direction = "up";
  if (canMove(direction)) {
    return;
  }
  moveCharacter(direction);
  encounterCheck();
  // Todo: ログに出力する
  const currentArea = areaCheck(playerPosition);
  // Todo: 移動ログ出力する
});

// 下ボタンを押した時の処理
downBtn.addEventListener("click", () => {
  const direction = "down";
  if (canMove(direction)) {
    return;
  }
  moveCharacter(direction);
  const currentArea = areaCheck(playerPosition);
  // Todo: 移動ログを出力する
});

// 左ボタンを押した時の処理
leftBtn.addEventListener("click", () => {
  const direction = "left";
  if (canMove(direction)) {
    return;
  }
  moveCharacter(direction);
  const currentArea = areaCheck(playerPosition);
  // Todo: 移動ログを出力する
});

// 右ボタンを押した時の処理
rightBtn.addEventListener("click", () => {
  const direction = "right";
  if (canMove(direction)) {
    return;
  }
  moveCharacter(direction);
  const currentArea = areaCheck(playerPosition);
  // Todo: 移動ログを出力する
});
