const upBtn = document.getElementById("upBtn");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const downBtn = document.getElementById("downBtn");
const characterImage = document.getElementById("characterImage");
const battleEscape = document.getElementById("battleEscape");
const logContainer = document.getElementById("logContainer");
const hp = document.getElementById("hp");
const gameImage = document.getElementById("gameImage");
const MAX_POSITION = 30;
const MIN_POSITION = -30;
const METALSLIME_RATE = 0.1;
const DORADON_RATE = 0.35;
const ENCOUNT_RATE = 0.4;

const areaImages = {
  grassland: "grassland.jpeg",
  sky: "sky.jpeg",
  sea: "sea.jpeg",
  castle: "castle.jpeg",
  volcano: "volcano.jpeg",
};

let player = {
  name: "主人公",
  HP: 100,
  attack: 10,
  level: 1,
};

let playerPosition = { x: 0, y: 0 };

const masterMonsters = {
  slime: {
    name: "スライム",
    HP: 20,
    attack: 10,
    exp: 10,
    appearanceRate: 65,
    imagePath: "slime.jpeg",
  },
  doragon: {
    name: "ドラゴン",
    HP: 40,
    attack: 20,
    exp: 15,
    appearanceRate: 25,
    imagePath: "doragon.jpeg",
  },
  metalslime: {
    name: "メタルスライム",
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
  if (isBattle) {
    return false;
  }
  if (direction === "up" && playerPosition.y >= MAX_POSITION) return false;
  if (direction === "down" && playerPosition.y <= MIN_POSITION) return false;
  if (direction === "left" && playerPosition.x <= MIN_POSITION) return false;
  if (direction === "right" && playerPosition.x >= MAX_POSITION) return false;
  return true;
};

// モンスターが出現するか決める関数
const encounterCheck = () => {
  return Math.random() < ENCOUNT_RATE;
};

// 出現するモンスターを決める関数
const randomMonsters = (masterMonsters) => {
  const randomNum = Math.random();
  if (randomNum <= METALSLIME_RATE) {
    return { ...masterMonsters.metalslime };
  } else if (randomNum <= DORADON_RATE) {
    return { ...masterMonsters.doragon };
  } else {
    return { ...masterMonsters.slime };
  }
};

// バトル画面に遷移する関数
const changeBattle = (currentMonsters) => {
  isBattle = true;
  characterImage.src = currentMonsters.imagePath;

  const battleBtn = document.createElement("button");
  battleBtn.classList.add("buttons");
  battleBtn.textContent = "戦う";

  const escapeBtn = document.createElement("button");
  escapeBtn.classList.add("buttons");
  escapeBtn.textContent = "逃げる";

  battleEscape.appendChild(battleBtn);
  battleEscape.appendChild(escapeBtn);
  return { battleBtn, escapeBtn };
};

// HP計算する関数
const calculationHP = (target, attacker) => {
  target.HP -= attacker.attack;
};

// HPを描画する関数
const displayHP = () => {
  hp.textContent = player.HP;
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
const gameOver = () => {
  if (isDie(player)) {
    alert("ゲームオーバー");
  }
};

let logArray = [];
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

// モンスターが出現した時ログ関数
const logEncountHistory = (currentMonsters) => {
  logArray.unshift(`${currentMonsters.name}が現れました`);
  displayLog();
};

// プレイヤーの移動時ログ関数
const logMoveHistory = (direction) => {
  if (direction === "up") {
    logArray.unshift("上に移動しました");
  }
  if (direction === "down") {
    logArray.unshift("下に移動しました");
  }
  if (direction === "left") {
    logArray.unshift("左に移動しました");
  }
  if (direction === "right") {
    logArray.unshift("右に移動しました");
  }
  displayLog();
};

// 戦闘時のログ関数
const logBattleHistory = (character) => {
  logArray.unshift(`${character.name}が${character.attack}攻撃した`);
  displayLog();
};

// UIにログを描画する関数
const displayLog = () => {
  logContainer.innerHTML = "";
  logArray.forEach((log) => {
    const createLog = document.createElement("div");
    createLog.textContent = log;
    logContainer.appendChild(createLog);
  });
};

// 画面を表示する関数
const renderDisplay = () => {
  characterImage.src = "syuzinnkou.jpeg";
  battleEscape.innerHTML = "";
  const area = areaCheck(playerPosition);
  gameImage.style.backgroundImage = `url(${areaImages[area]})`;
};

// 初期画面の実行
renderDisplay();

// 上ボタンを押した時の処理
upBtn.addEventListener("click", () => {
  const direction = "up";
  if (!canMove(direction)) {
    return;
  }
  movePlayer(direction);
  logMoveHistory(direction);
  renderDisplay();
  if (encounterCheck()) {
    isBattle = true;
    let currentMonsters = randomMonsters(masterMonsters);
    logEncountHistory(currentMonsters);
    const { battleBtn, escapeBtn } = changeBattle(currentMonsters);
    battleBtn.addEventListener("click", () => {
      logBattleHistory(player);
      calculationHP(currentMonsters, player);
      if (isDie(currentMonsters)) {
        isBattle = false;
        renderDisplay();
        return;
      } else {
        logBattleHistory(currentMonsters);
        calculationHP(player, currentMonsters);
        displayHP();
        gameOver();
        isBattle = false;
      }
    });
    escapeBtn.addEventListener("click", () => {
      if (judgeEscape()) {
        isBattle = false;
        renderDisplay();
      } else {
        logBattleHistory(currentMonsters);
        calculationHP(player, currentMonsters);
        displayHP();
        gameOver();
        isBattle = false;
        return;
      }
    });
  }
});

// 下ボタンを押した時の処理
downBtn.addEventListener("click", () => {
  const direction = "down";
  if (!canMove(direction)) {
    return;
  }
  movePlayer(direction);
  renderDisplay();
  logMoveHistory(direction);
  renderDisplay();
  if (encounterCheck()) {
    isBattle = true;
    let currentMonsters = randomMonsters(masterMonsters);
    logEncountHistory(currentMonsters);
    const { battleBtn, escapeBtn } = changeBattle(currentMonsters);
    battleBtn.addEventListener("click", () => {
      logBattleHistory(player);
      calculationHP(currentMonsters, player);
      if (isDie(currentMonsters)) {
        isBattle = false;
        renderDisplay();
        return;
      } else {
        logBattleHistory(currentMonsters);
        calculationHP(player, currentMonsters);
        displayHP();
        gameOver();
        isBattle = false;
      }
    });
    escapeBtn.addEventListener("click", () => {
      if (judgeEscape()) {
        isBattle = false;
        renderDisplay();
      } else {
        logBattleHistory(currentMonsters);
        calculationHP(player, currentMonsters);
        displayHP();
        gameOver();
        isBattle = false;
        return;
      }
    });
  }
});

// 左ボタンを押した時の処理
leftBtn.addEventListener("click", () => {
  const direction = "left";
  if (!canMove(direction)) {
    return;
  }
  movePlayer(direction);
  renderDisplay();
  logMoveHistory(direction);
  renderDisplay();
  if (encounterCheck()) {
    isBattle = true;
    let currentMonsters = randomMonsters(masterMonsters);
    logEncountHistory(currentMonsters);
    const { battleBtn, escapeBtn } = changeBattle(currentMonsters);
    battleBtn.addEventListener("click", () => {
      logBattleHistory(player);
      calculationHP(currentMonsters, player);
      if (isDie(currentMonsters)) {
        isBattle = false;
        renderDisplay();
        return;
      } else {
        logBattleHistory(currentMonsters);
        calculationHP(player, currentMonsters);
        displayHP();
        gameOver();
        isBattle = false;
      }
    });
    escapeBtn.addEventListener("click", () => {
      if (judgeEscape()) {
        isBattle = false;
        renderDisplay();
      } else {
        logBattleHistory(currentMonsters);
        calculationHP(player, currentMonsters);
        displayHP();
        gameOver();
        isBattle = false;
        return;
      }
    });
  }
});

// 右ボタンを押した時の処理
rightBtn.addEventListener("click", () => {
  const direction = "right";
  if (!canMove(direction)) {
    return;
  }
  movePlayer(direction);
  renderDisplay();
  logMoveHistory(direction);
  renderDisplay();
  if (encounterCheck()) {
    isBattle = true;
    let currentMonsters = randomMonsters(masterMonsters);
    logEncountHistory(currentMonsters);
    const { battleBtn, escapeBtn } = changeBattle(currentMonsters);
    battleBtn.addEventListener("click", () => {
      logBattleHistory(player);
      calculationHP(currentMonsters, player);
      if (isDie(currentMonsters)) {
        isBattle = false;
        renderDisplay();
        return;
      } else {
        logBattleHistory(currentMonsters);
        calculationHP(player, currentMonsters);
        displayHP();
        gameOver();
        isBattle = false;
      }
    });
    escapeBtn.addEventListener("click", () => {
      if (judgeEscape()) {
        isBattle = false;
        renderDisplay();
      } else {
        logBattleHistory(currentMonsters);
        calculationHP(player, currentMonsters);
        displayHP();
        gameOver();
        isBattle = false;
        return;
      }
    });
  }
});
