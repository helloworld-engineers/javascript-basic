const backContainer = document.querySelector(".main"); // mainコンテナ

const currentImage = document.getElementById("currentImage"); // 中心表示する画像<img>
const currentHP = document.getElementById("HP"); // HPを表示する<p>
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

const PERCENT = 100;
const ENCOUNT_PERCENT = 40;
//プレイヤーステータスのマスターデータ
let playerStatus = {
  HP: 100,
  Attack: 10,
  Level: 1,
  x: 0,
  y: 0,
};
//敵ステータスのマスターデータ
const enemyStatus = [
  {
    name: "slime",
    id: 1,
    HP: 20,
    Attack: 10,
    exp: 10,
    image: "./images/Slime.webp",
    encountPercent: 65,
  },
  {
    name: "doragon",
    id: 2,
    HP: 40,
    Attack: 20,
    exp: 15,
    image: "./images/Doragon.png",
    encountPercent: 25,
  },
  {
    name: "metalslime",
    id: 3,
    HP: 20,
    Attack: 10,
    exp: 30,
    image: "./images/MetalSlime.webp",
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
    HP: 100,
    Attack: 10,
    Level: 1,
    x: 0,
    y: 0,
  };
  currentStatus(playerStatus);
};

//現在のステータスを表示する
const currentStatus = (playerStatus) => {
  currentHP.textContent = `HP：${playerStatus.HP}`;
  currentAttack.textContent = `攻撃力：${playerStatus.Attack}`;
  currentLevel.textContent = `レベル：${playerStatus.Level}`;
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
    backContainer.style.backgroundImage = 'url("./Images/Heigen.jpeg")';
    return true;
  }
  if (x >= 0 && y < 0) {
    backContainer.style.backgroundImage = 'url("./Images/Kazan.jpg")';
    return true;
  }
  if (x < 0 && y >= 0) {
    backContainer.style.backgroundImage = 'url("./Images/Yukiyama.jpg")';
    return true;
  }
  if (x < 0 && y < 0) {
    backContainer.style.backgroundImage = 'url("./Images/sea.jpg")';
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
  const randomNumber = Math.floor(Math.random() * PERCENT) + 1;
  if (randomNumber <= ENCOUNT_PERCENT) {
    return true;
  }
};

//3種類のモンスターから1匹を選出
const randomEnemy = (array) => {
  let randomNumber = Math.floor(Math.random() * PERCENT) + 1;
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
  if (enemyObject.name === "slime") {
    //slime画像の表示調整
    currentImage.style.maxWidth = "180px";
    currentImage.style.maxHeight = "200px";
  }
  if (enemyObject.name === "doragon") {
    //doragon画像の表示調整
    currentImage.style.maxWidth = "450px";
    currentImage.style.maxHeight = "450px";
  }
  if (enemyObject.name === "metalslime") {
    //metalslime画像の表示調整
    currentImage.style.maxWidth = "170px";
    currentImage.style.maxHeight = "190px";
  }
};

//「戦う」ボタンをクリックした時
const playrAttack = () => {
  addLog("プレイヤーの攻撃");
  currentEnemy.HP = currentEnemy.HP - playerStatus.Attack;
  if (currentEnemy.HP > 0) {
    enemyAttack(currentEnemy);
  }
  judgeBattle(playerStatus, currentEnemy);
};

//敵の攻撃
const enemyAttack = (currentEnemy) => {
  addLog(`${currentEnemy.name}の攻撃`);
  if (playerStatus.HP <= currentEnemy.Attack) {
    playerStatus.HP = 0;
    currentStatus(playerStatus);
    return;
  }
  playerStatus.HP = playerStatus.HP - currentEnemy.Attack;
  currentStatus(playerStatus);
};

//勝敗チェック
const judgeBattle = (playerStatus, currentEnemy) => {
  if (playerStatus.HP <= 0 && currentEnemy.HP > 0) {
    addLog("ゲームオーバー");
    battleButton.classList.add("hide");
    escapeButton.classList.add("hide");
  }
  if (currentEnemy.HP <= 0) {
    addLog("プレイヤーの勝利！");
    endBattle();
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
  battleButton.classList.add("hide");
  escapeButton.classList.add("hide");
  currentImage.style.maxWidth = "180px";
  currentImage.style.maxHeight = "200px";
  updateArrow(playerStatus);
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

battleButton.addEventListener("click", playrAttack);
escapeButton.addEventListener("click", playerEscape);

window.onload = () => {
  initGame();
  moveCoodinate(playerStatus);
};
