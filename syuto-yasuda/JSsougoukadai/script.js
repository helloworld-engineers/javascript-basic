const upBtn = document.getElementById("upBtn");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const downBtn = document.getElementById("downBtn");
const characterImage = document.getElementById("characterImage");
const gameArea = document.getElementById("gameArea");
const battleEscape = document.getElementById("battleEscape");
const BTN_BACKGROUND_COLOR = "#fff";
const MAX_POSITION = 30;
const MIN_POSITION = -30;
const METALSLIME_RATE = 0.1;
const DORADON_RATE = 0.35;
const ENCOUNT_RATE = 0.4;

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
    imagePath: "slime.jpeg",
  },
  doragon: {
    HP: 40,
    attack: 20,
    exp: 15,
    appearanceRate: 25,
    imagePath: "doragon.jpeg",
  },
  metalslime: {
    HP: 20,
    attack: 10,
    exp: 30,
    appearanceRate: 10,
    imagePath: "metalslime.jpeg",
  },
};

// モンスターに遭遇するまでfalseにする
let isBattle = false;

// 移動キーを押した時にプレイヤーの位置を移動する関数、isBttleがtrueの時移動できない
const movePlayer = (direction) => {
  if (isBattle) {
    return;
  }
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
  console.log(playerPosition);
  return playerPosition;
};

// マップの上限か判定をする関数
const canMove = (direction) => {
  if (direction === "up" && playerPosition.y < MAX_POSITION) return false;
  if (direction === "down" && playerPosition.y > MIN_POSITION) return false;
  if (direction === "left" && playerPosition.x > MIN_POSITION) return false;
  if (direction === "right" && playerPosition.x < MAX_POSITION) return false;
  return true;
};

// モンスターが出現するか決める関数
const encounterCheck = () => {
  return Math.random() < ENCOUNT_RATE;
};

// 出現するモンスターを決める関数
const randomMonsters = (masterMonsters) => {
  let monster;
  const randomNum = Math.random();
  if (randomNum <= METALSLIME_RATE) {
    monster = masterMonsters.metalslime;
  } else if (randomNum <= DORADON_RATE) {
    monster = masterMonsters.doragon;
  } else {
    monster = masterMonsters.slime;
  }
  return monster;
};
const currentMonsters = randomMonsters(masterMonsters);

// モンスターに遭遇した時にtrueにする
const startBattle = (encounterCheck) => {
  isBattle = true;
};

// バトル画面に遷移する関数
const changeBattle = (currentMonsters) => {
  characterImage.src = currentMonsters.imagePath;
  startBattle();
  const battleBtn = document.createElement("button");
  battleBtn.textContent = "戦う";
  battleBtn.style.width = "150px";
  battleBtn.style.height = "65px";
  battleBtn.style.backgroundColor = BTN_BACKGROUND_COLOR;

  const escapeBtn = document.createElement("button");
  escapeBtn.textContent = "逃げる";
  escapeBtn.style.width = "150px";
  escapeBtn.style.height = "65px";
  escapeBtn.style.backgroundColor = BTN_BACKGROUND_COLOR;

  battleEscape.appendChild(battleBtn);
  battleEscape.appendChild(escapeBtn);
};

// HP計算する関数
const calculationHP = (target, attacker) => {
  target.HP -= attacker.attack;
};

// 生死判定する関数
const isDie = (character) => {
  return character.HP <= 0;
};

// 逃げれるか判定する関数
const judgeEscape = () => {
  return Math.random() <= 0.5;
};

// ゲームオーバーの関数
const gameOver = (isDie) => {
  if (isDie(player)) {
    alert("ゲームオーバー");
  }
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
  movePlayer(direction);
  const currentArea = areaCheck(playerPosition);
  // Todo: 移動ログ出力する
});

// 下ボタンを押した時の処理
downBtn.addEventListener("click", () => {
  const direction = "down";
  if (canMove(direction)) {
    return;
  }
  movePlayer(direction);
  const currentArea = areaCheck(playerPosition);
  // Todo: 移動ログを出力する
});

// 左ボタンを押した時の処理
leftBtn.addEventListener("click", () => {
  const direction = "left";
  if (canMove(direction)) {
    return;
  }
  movePlayer(direction);
  const currentArea = areaCheck(playerPosition);
  // Todo: 移動ログを出力する
});

// 右ボタンを押した時の処理
rightBtn.addEventListener("click", () => {
  const direction = "right";
  if (canMove(direction)) {
    return;
  }
  movePlayer(direction);
  const currentArea = areaCheck(playerPosition);
  // Todo: 移動ログを出力する
});
