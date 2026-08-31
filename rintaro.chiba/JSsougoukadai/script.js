const backContainer = document.querySelector(".main"); // mainコンテナ

const currentImage = document.getElementById("currentImage"); // 中心表示する画像<img>
const currentHp = document.getElementById("HP"); // HPを表示する<p>
const currentAttack = document.getElementById("Attack"); // 攻撃力を表示する<p>
const currentLevel = document.getElementById("Level"); // レベルを表示する<p>

const moveArrow = document.querySelectorAll(".moveArrow"); // 矢印ボタン全て<button>
const upArrow = document.getElementById("upArrow"); // 上矢印<button>
const downArrow = document.getElementById("downArrow"); // 下矢印<button>
const rightArrow = document.getElementById("rightArrow"); // 右矢印<button>
const leftArrow = document.getElementById("leftArrow"); // 左矢印<button>

const battleButton = document.getElementById("battleButton"); // 戦う<button>
const escapeButton = document.getElementById("escapeButton"); // 逃げる<button>

const logs = document.getElementById("log"); // ログを表示するエリア<div>

const arrowArray = [...moveArrow]; // 矢印ボタンのNodeListを配列に変換

const MAX_PERCENT = 100;
const ENCOUNT_PERCENT = 40;
//プレイヤーステータスのマスターデータ
const playerStatus = {
  hp: 100,
  attack: 10,
  level: 1,
  exp: 0,
  x: 0,
  y: 0,
};
//敵ステータスのマスターデータ
const enemyStatus = [
  {
    name: "slime",
    id: 1,
    hp: 20,
    attack: 10,
    exp: 10,
    image: "./images/slime.gif",
    encountPercent: 65,
  },
  {
    name: "doragon",
    id: 2,
    hp: 40,
    attack: 20,
    exp: 15,
    image: "./images/dragon.gif",
    encountPercent: 25,
  },
  {
    name: "metalslime",
    id: 3,
    hp: 20,
    attack: 10,
    exp: 30,
    image: "./images/metalslime.gif",
    encountPercent: 10,
  },
];

//エンカウントした敵のデータ
let currentEnemy = null;
//マップの上限を宣言
const mapLimit = { x: 20, y: 20 };

//初期化
const initGame = () => {
  playerStatus = {
    hp: 100,
    attack: 10,
    level: 1,
    exp: 0,
    x: 0,
    y: 0,
  };
  currentStatus(playerStatus);
};

//ステータス情報を今の画面に表示する
const currentStatus = (playerStatus) => {
  currentHp.textContent = `HP：${playerStatus.hp}`;
  currentAttack.textContent = `攻撃力：${playerStatus.attack}`;
  currentLevel.textContent = `レベル：${playerStatus.level}`;
};

//マップ判定 x,y-20~20と画像の差し替え(マップ内の場合tureマップ外の場合にfalseを返す)
const checkMap = (playerStatus) => {
  const x = playerStatus.x;
  const y = playerStatus.y;
  if (
    x > mapLimit.x ||
    x < mapLimit.x * -1 ||
    y > mapLimit.y ||
    y < mapLimit.y * -1
  )
    return false;
  if (x >= 0 && y >= 0) {
    backContainer.style.backgroundImage = 'url("./images/Heigen.jpeg")';
    return true;
  }
  if (x >= 0 && y < 0) {
    backContainer.style.backgroundImage = 'url("./images/Kazan.jpg")';
    return true;
  }
  if (x < 0 && y >= 0) {
    backContainer.style.backgroundImage = 'url("./images/Yukiyama.jpg")';
    return true;
  }
  if (x < 0 && y < 0) {
    backContainer.style.backgroundImage = 'url("./images/sea.jpg")';
    return true;
  }
};

//1マス動いた時にマップ外の場合該当のボタンを非活性にする
const updateArrow = (currentStatus) => {
  upArrow.disabled = !checkMap({ ...currentStatus, y: currentStatus.y + 1 });
  downArrow.disabled = !checkMap({ ...currentStatus, y: currentStatus.y - 1 });
  rightArrow.disabled = !checkMap({ ...currentStatus, x: currentStatus.x + 1 });
  leftArrow.disabled = !checkMap({ ...currentStatus, x: currentStatus.x - 1 });
  checkMap(currentStatus);
};

//座標移動時40%の確率で敵とエンカウント
const isEncount = () => {
  const randomNumber = Math.floor(Math.random() * MAX_PERCENT) + 1;
  return randomNumber <= ENCOUNT_PERCENT;
};

//3種類のモンスターから1匹を選出
const randomEnemy = (array) => {
  let randomNumber = Math.floor(Math.random() * MAX_PERCENT) + 1;
  for (const currentEnemy of array) {
    if (randomNumber <= currentEnemy.encountPercent) {
      return currentEnemy; //１週目スライムの範囲内65%ならスライムオブジェクトを返す
    }
    randomNumber = randomNumber - currentEnemy.encountPercent; //66以上だったらスライム分の確率を引いて２週目以降ループ
  }
};

//エンカウント時に戦闘画面へ遷移する
const battleStart = (enemyObject) => {
  addLog(`${enemyObject.name}が現れた！`);
  battleButton.classList.remove("hide");
  escapeButton.classList.remove("hide");
  currentEnemy = { ...enemyObject };
  currentImage.src = currentEnemy.image;
  currentImage.alt = "敵の画像";
};

//「戦う」ボタンをクリックした時
const playerAttack = () => {
  addLog("プレイヤーの攻撃");
  currentEnemy.hp = currentEnemy.hp - playerStatus.attack;
  if (currentEnemy.hp > 0) {
    enemyAttack(currentEnemy);
  }
  judgeBattle(playerStatus, currentEnemy);
};

//敵の攻撃
const enemyAttack = (currentEnemy) => {
  addLog(`${currentEnemy.name}の攻撃`);
  if (playerStatus.hp <= currentEnemy.Attack) {
    playerStatus.hp = 0;
    currentStatus(playerStatus);
    return;
  }
  playerStatus.hp = playerStatus.hp - currentEnemy.attack;
  currentStatus(playerStatus);
};

//勝敗チェック
const judgeBattle = (playerStatus, currentEnemy) => {
  if (playerStatus.hp <= 0 && currentEnemy.hp > 0) {
    addLog("ゲームオーバー");
    battleButton.classList.add("hide");
    escapeButton.classList.add("hide");
  }
  if (currentEnemy.hp <= 0) {
    addLog("プレイヤーの勝利！");
    levelCheck();
    endBattle();
  }
};

//レベルアップ周りの数値
const expConfig = {
  nextExp: 30,
  plusAttack: 20,
  initHp: 100,
  plusHp: 20,
};

//敵を倒したときのレベル処理
const levelCheck = () => {
  playerStatus.exp += currentEnemy.exp;
  if (playerStatus.exp / expConfig.nextExp >= 1) {
    playerStatus.level += Math.floor(playerStatus.exp / expConfig.nextExp);
    addLog(`レベル${playerStatus.level}にアップしました！`);
    playerStatus.attack += expConfig.plusAttack;
    playerStatus.hp =
      expConfig.initHp + expConfig.plusHp * (playerStatus.level - 1);
    playerStatus.exp %= expConfig.nextExp;
  }
};

//「逃げる」ボタンをクリックした時
const playerEscape = () => {
  const randomNumber = Math.floor(Math.random() * 2);
  if (randomNumber === 0) {
    addLog("うまく逃げ切れた！");
    endBattle();
  }
  if (randomNumber === 1) {
    addLog("逃げられなかった");
    enemyAttack(currentEnemy);
    judgeBattle(playerStatus, currentEnemy);
  }
};

//非戦闘画面に移行する処理
const endBattle = () => {
  currentEnemy = null;
  currentImage.src = "./images/MainCharactor.png";
  currentImage.alt = "主人公の画像";
  battleButton.classList.add("hide");
  escapeButton.classList.add("hide");
  currentImage.style.maxWidth = "180px";
  currentImage.style.maxHeight = "200px";
  updateArrow(playerStatus);
  currentStatus(playerStatus);
};

//ログの追加
const addLog = (message) => {
  const log = document.createElement("p");
  log.textContent = message;
  logs.appendChild(log);
  logs.scrollTo(0, logs.scrollHeight);
};

//矢印ボタンをクリックした際の方向の判定と処理
const moveCoodinate = (playerStatus) => {
  arrowArray.forEach((arrow) => {
    arrow.addEventListener("click", () => {
      const nextStatus = { ...playerStatus };

      if (arrow.id === "upArrow") nextStatus.y++;
      if (arrow.id === "downArrow") nextStatus.y--;
      if (arrow.id === "rightArrow") nextStatus.x++;
      if (arrow.id === "leftArrow") nextStatus.x--;
      if (checkMap(nextStatus)) {
        playerStatus.x = nextStatus.x;
        playerStatus.y = nextStatus.y;

        const arrowNames = {
          upArrow: "上",
          downArrow: "下",
          rightArrow: "右",
          leftArrow: "左",
        };
        addLog(`${arrowNames[arrow.id]}に進んだ`);

        if (isEncount()) {
          arrowArray.forEach((arrow) => (arrow.disabled = true));
          currentEnemy = { ...randomEnemy(enemyStatus) };
          battleStart(currentEnemy);
        } else {
          updateArrow(nextStatus);
        }
      }
    });
  });
};

battleButton.addEventListener("click", playerAttack);
escapeButton.addEventListener("click", playerEscape);

window.onload = () => {
  initGame();
  moveCoodinate(playerStatus);
};
