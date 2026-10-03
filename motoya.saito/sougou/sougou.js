const playerStatus = document.getElementById("playerStatus");
const heroImg = document.getElementById("heroImg");
const upBtn = document.getElementById("upBtn");
const rightBtn = document.getElementById("rightBtn");
const downBtn = document.getElementById("downBtn");
const leftBtn = document.getElementById("leftBtn");
const batlleBtn = document.getElementById("batlleBtn");
const escapeBtn = document.getElementById("escapeBtn");
const filedImg = document.getElementById("filedImg");
const moveBtnContainer = document.getElementById("moveBtnContainer");
const gameoverImg = document.getElementById("gameoverImg");
const currentenemyImg = document.getElementById("currentenemyImg");
const logcontainer = document.getElementById("logcontainer");
const actionBtnContainer = document.getElementById("actionBtnContainer");
//ステータス管理
const player = {
  name: "勇者",
  hp: 100,
  attack: 10,
  level: 1,
};
const enemies = [
  {
    name: "スライム",
    hp: 20,
    id: 1,
    attack: 10,
    exp: 10,
    encounterRate: 65,
    imgPath: "./images/slime.webp",
  },
  {
    name: "ドラゴン",
    hp: 40,
    id: 2,
    attack: 20,
    exp: 15,
    encounterRate: 25,
    imgPath: "./images/dragon.png",
  },
  {
    name: "メタルスライム",
    hp: 20,
    id: 3,
    attack: 10,
    exp: 30,
    encounterRate: 10,
    imgPath: "./images/metalslime.png",
  },
];
let currentenemy = null;
const ramMAX = 100;
const escapeRate = 50;
let startPosition = {
  x: 0,
  y: 0,
};
const mapLimitPlus = 20;
const mapLimitMinus = -20;
const map = [
  {
    mapid: 1,
    name: "火山",
    mapimg: "yama.png",
  },
  {
    mapid: 2,
    name: "海",
    mapimg: "umi.jpg",
  },
  {
    mapid: 3,
    name: "空",
    mapimg: "sora.webp",
  },
  {
    mapid: 4,
    name: "平原",
    mapimg: "heigen.jpg",
  },
  {
    mapid: 5,
    name: "街",
    mapimg: "machi.jpg",
  },
];
//初期戦闘ボタン非表示
actionBtnContainer.style.display = "none";
//GAMEOVERを非表示
gameoverImg.style.display = "none";
const encounterRate = 0.4;
//プレイヤーのHPを変動させる変数
const playerFluctuationHp = () => {
  playerStatus.innerHTML = `HP:${player.hp}<br>攻撃力：${player.attack}<br>Level:${player.level}`;
};
playerFluctuationHp();
//モンスターと遭遇する確率の処理
const enncountMonster = () => {
  if (Math.random() < encounterRate) {
    battleStart();
    logNotation(`${currentenemy.name}が現れた`);
  }
};
//敵３体のうち１体を決める処理
const randomMonster = () => {
  const randomNumber = Math.floor(Math.random() * ramMAX);
  if (randomNumber < enemies[0].encounterRate) {
    return { ...enemies[0] };
  } else if (
    randomNumber <
    enemies[1].encounterRate + enemies[0].encounterRate
  ) {
    return { ...enemies[1] };
  } else {
    return { ...enemies[2] };
  }
};
//戦闘開始時の処理
const battleStart = () => {
  currentenemy = randomMonster();
  moveBtnContainer.style.display = "none";
  currentenemyImg.style.display = "block";
  currentenemyImg.src = currentenemy.imgPath;
  heroImg.style.display = "none";
  actionBtnContainer.style.display = "flex";
};
//攻撃時の処理
const battleAttack = (attacker, target) => {
  target.hp -= attacker.attack;
  playerFluctuationHp();
  logNotation(`${target.name}に${attacker.attack}のダメージ`);
};
//戦闘終了時の処理
const battleFinish = () => {
  if (player.hp <= 0) {
    logNotation("勇者が倒れた");
    filedImg.style.display = "none";
    gameoverImg.style.display = "block";
  } else if (currentenemy.hp <= 0) {
    logNotation(`${currentenemy.name}を倒した`);
    moveBtnContainer.style.display = "grid";
    actionBtnContainer.style.display = "none";
    heroImg.style.display = "block";
    currentenemyImg.style.display = "none";
  }
};
//HPが０になった時の処理
const hpConfirmation = (character) => {
  if (character.hp <= 0) {
    battleFinish();
    return true;
  }
  return false;
};
//逃げる時の処理
escapeBtn.addEventListener("click", () => {
  if (Math.floor(Math.random() * 100) < escapeRate) {
    moveBtnContainer.style.display = "grid";
    actionBtnContainer.style.display = "none";
    heroImg.style.display = "block";
    currentenemyImg.style.display = "none";
    logNotation("逃げ切れた");
  } else {
    logNotation("逃げられなかった");
    battleAttack(currentenemy, player);
    hpConfirmation(player);
  }
});
//戦闘進行時の処理
const battleMain = () => {
  battleAttack(player, currentenemy);
  const enemyDeadCheck = hpConfirmation(currentenemy);
  if (enemyDeadCheck) return;
  battleAttack(currentenemy, player);
  hpConfirmation(player);
};
batlleBtn.addEventListener("click", () => {
  battleMain();
});
//背景のスタイル関数
const imgChange = (img) => {
  filedImg.style.backgroundImage = `url(./images/${img})`;
  filedImg.style.backgroundRepeat = `no-repeat`;
  filedImg.style.backgroundSize = `cover`;
};
//map移動時の背景処理
const mapChange = () => {
  if (
    startPosition.x >= 0 &&
    startPosition.x <= mapLimitPlus &&
    startPosition.y > 0 &&
    startPosition.y <= mapLimitPlus
  ) {
    imgChange(`${map[0].mapimg}`);
  } else if (
    startPosition.x > 0 &&
    startPosition.x <= mapLimitPlus &&
    startPosition.y <= 0 &&
    startPosition.y >= mapLimitMinus
  ) {
    imgChange(`${map[1].mapimg}`);
  } else if (
    startPosition.x < 0 &&
    startPosition.x >= mapLimitMinus &&
    startPosition.y >= 0 &&
    startPosition.y <= mapLimitPlus
  ) {
    imgChange(`${map[2].mapimg}`);
  } else if (
    startPosition.x <= 0 &&
    startPosition.x >= mapLimitMinus &&
    startPosition.y < 0 &&
    startPosition.y >= mapLimitMinus
  ) {
    imgChange(`${map[3].mapimg}`);
  } else {
    imgChange(`${map[4].mapimg}`);
  }
};
//移動ボタンの非活性化処理
const buttonStop = (plusBtn, minusBtn, start) => {
  if (startPosition[start] >= mapLimitPlus) {
    plusBtn.disabled = true;
  } else {
    plusBtn.disabled = false;
  }
  if (startPosition[start] <= mapLimitMinus) {
    minusBtn.disabled = true;
  } else {
    minusBtn.disabled = false;
  }
};
//map移動処理
const moveProcess = (button, start, limit, num, plusBtn, minusBtn, move) => {
  button.addEventListener("click", () => {
    if (num > 0) {
      if (startPosition[start] < limit) {
        startPosition[start] += num;
      }
    } else if (num < 0) {
      if (startPosition[start] > limit) {
        startPosition[start] += num;
      }
    }
    buttonStop(plusBtn, minusBtn, start);
    mapChange();
    enncountMonster();
    logNotation(`${move}方向に進みました`);
  });
};
//ログ表記する処理
logcontainer.style.overflowY = "auto";
const logNotation = (log) => {
  const logList = document.createElement("li");
  logList.textContent = log;
  logList.style.listStyle = "none";
  logcontainer.appendChild(logList);
};
//右へ移動
moveProcess(rightBtn, "x", mapLimitPlus, 1, rightBtn, leftBtn, "右");
//左へ移動
moveProcess(leftBtn, "x", mapLimitMinus, -1, rightBtn, leftBtn, "左");
//上へ移動
moveProcess(upBtn, "y", mapLimitPlus, 1, upBtn, downBtn, "上");
//下へ移動
moveProcess(downBtn, "y", mapLimitMinus, -1, upBtn, downBtn, "下");
