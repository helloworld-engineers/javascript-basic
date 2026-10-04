const SLIME_APPEAR_RATE = 0.65; // 65%未満はスライム
const DRAGON_APPEAR_RATE = 0.9; // 65%以上90%未満（25%）はドラゴン
const MONSTERENCOUNT = 0.4;
const ESCAPE = 0.5;
const MAX_MOVE = 20;
const MIN_MOVE = -20;
const hitPointText = document.querySelector(".hit-point");
const attackText = document.querySelector(".attack");
const levelText = document.querySelector(".level");
const logHistory = document.getElementById("message");
const topBtn = document.getElementById("top-btn");
const leftBtn = document.getElementById("left-btn");
const rightBtn = document.getElementById("right-btn");
const downBtn = document.getElementById("down-btn");
const actionBtnArea = document.getElementById("actionbtn-container");
const attackBtn = document.getElementById("attackBtn");
const escapeBtn = document.getElementById("escapeBtn");
const playerImage = document.getElementById("playerImage");
const heroArea = document.querySelector(".hero");
let currentInfo = {
  x: 0,
  y: 0,
  HP: 100,
  attack: 10,
  level: 1,
  img: "img/hero.jpg",
};
let monsterInfo = [
  {
    id: 1,
    name: "スライム",
    HP: 20,
    attack: 10,
    skill: 10,
    imagePath: "img/slime.jpg",
  },
  {
    id: 2,
    name: "ドラゴン",
    HP: 40,
    attack: 20,
    skill: 15,
    imagePath: "img/dragon.jpg",
  },
  {
    id: 3,
    name: "メタルスライム",
    HP: 20,
    attack: 10,
    skill: 30,
    imagePath: "img/metalSlime.jpg",
  },
];
const areaImg = {
  spring: "spring.jpg",
  summer: "summer.jpg",
  autumn: "autumn.jpg",
  winter: "winter.jpg",
};
let currentMonster = null;
// addLog関数（ログの表示判定）
const addLog = (text) => {
  const addList = document.createElement("li");
  addList.textContent = text;
  logHistory.prepend(addList);
};
// 最初のUI
const backUI = () => {
  if (hitPointText) hitPointText.textContent = "HP: " + currentInfo.HP;
  if (attackText) attackText.textContent = "攻撃力：" + currentInfo.attack;
  if (levelText) levelText.textContent = "レベル：" + currentInfo.level;
  if (currentMonster || currentInfo.HP <= 0) {
    heroArea.style.backgroundImage = "none";
  } else {
    const backPath = currentLocation();
    if (backPath) {
      heroArea.style.backgroundImage = `url('img/${backPath}')`;
    } else {
      heroArea.style.backgroundImage = "none";
    }
  }
};
// is Move関数（移動が可か不可かマップの範囲内の判定するための関数）
const isMove = (actionX, actionY) => {
  if (
    actionX > MAX_MOVE ||
    actionX < MIN_MOVE ||
    actionY > MAX_MOVE ||
    actionY < MIN_MOVE
  ) {
    return false; // 移動不可
  }
  return true; // 移動可能
};
// move関数（ボタンを押したらx,yの座標移動）
const move = (direction) => {
  let actionX = currentInfo.x;
  let actionY = currentInfo.y;
  if (direction === "up") actionY += 1;
  if (direction === "down") actionY -= 1;
  if (direction === "right") actionX += 1;
  if (direction === "left") actionX -= 1;
  if (!isMove(actionX, actionY)) {
    addLog("これ以上進めない！");
    return false;
  }
  currentInfo.x = actionX;
  currentInfo.y = actionY;
  backUI();
  return true;
};
// currentLocation関数（現在位置の判定）
const currentLocation = () => {
  const { x, y } = currentInfo;
  if (x === 0 && y === 0) {
    return;
  }
  // 春エリア: X+ Y+ (x > 0 で y = 0 を含む)
  if (x > 0 && y >= 0) {
    return areaImg.spring;
  }
  // 夏エリア: X+ Y- (x = 0 で y < 0 を含む)
  if (x >= 0 && y < 0) {
    return areaImg.summer;
  }
  // 秋エリア: X- Y- (x < 0 で y = 0 を含む)
  if (x < 0 && y <= 0) {
    return areaImg.autumn;
  }
  // 冬エリア: X- Y+ (x = 0 で y > 0 を含む)
  if (x <= 0 && y > 0) {
    return areaImg.winter;
  }
};
// encountMonster関数（モンスターとエンカウントする確率）
const encountMonster = () => {
  return Math.random() < MONSTERENCOUNT;
};
// randomMonster関数（確率が異なる3匹のモンスターの出現。３つのモンスター名の文字列をランダムで出現)
const randomMonster = () => {
  const appear = Math.random();
  if (appear < SLIME_APPEAR_RATE) {
    return monsterInfo.find((m) => m.id === 1); // 65%でスライム出現
  } else if (appear < DRAGON_APPEAR_RATE) {
    return monsterInfo.find((m) => m.id === 2); // 0.65 〜 0.89 (25%)でドラゴン出現
  } else {
    return monsterInfo.find((m) => m.id === 3); // 10%でメタルスライム出現
  }
};
//主人公のHPが0か判定する
const isHeroDie = () => {
  return currentInfo.HP <= 0;
};
const isEscape = () => {
  return Math.random() < ESCAPE;
};
// btnAction関数（十字キーが戦闘の有無で切り替わるボタン
const btnAction = (action) => {
  const moveBtn = document.querySelectorAll(".movebtn");
  moveBtn.forEach(function (btn) {
    if (action) {
      btn.disabled = false;
    } else {
      btn.disabled = true;
    }
  });
};
// isBattleActive関数（戦闘時の戦うと逃げるボタンの活性/非活性)
const isBattleActive = (isBattle) => {
  if (actionBtnArea) {
    if (isBattle) {
      actionBtnArea.style.display = "block";
    } else {
      actionBtnArea.style.display = "none";
    }
  }
  if (isBattle) {
    heroArea.style.backgroundImage = "none";
  }
  const battleBtns = document.querySelectorAll(".battle-btn");
  battleBtns.forEach(function (btn) {
    if (isBattle) {
      btn.disabled = false;
    } else {
      btn.disabled = true;
    }
  });
};
// monsterActive関数（モンスター討伐有無、モンスターのHP0以下で判定)
const monsterActive = () => {
  if (currentMonster && currentMonster.HP <= 0) {
    addLog(`${currentMonster.name}を倒した！`);
    const originalMonster = monsterInfo.find((m) => m.id === currentMonster.id);
    const copyMonsterInfo = { ...originalMonster };
    currentMonster = copyMonsterInfo;
    return true; // 討伐成功
  }
  return false; // 戦闘継続
};
// ゲームオーバー（ボタン非活性）
const gameOver = () => {
  currentInfo.HP === 0;
  backUI();
  addLog("GAME OVER");
  alert("ゲームオーバー");
  btnAction(false);
  isBattleActive(false);
};
// 戦闘終了（マップ操作状態へ戻す）
const endBattle = () => {
  currentMonster = null;
  // 画像を主人公に復帰
  if (playerImage) {
    playerImage.src = currentInfo.img;
  }
  btnAction(true);
  isBattleActive(false);
  backUI();
};
// 十字キー移動処理
const arrowBtn = (direction) => {
  const isMoved = move(direction);
  if (isMoved) {
    const mapMove = {
      up: "上",
      down: "下",
      left: "左",
      right: "右",
    };
    let logDisplay = mapMove[direction];
    addLog(`${logDisplay} へ移動した`);
    // 移動後のエンカウント
    if (encountMonster()) {
      // モンスターエンカウント
      const monsters = randomMonster();
      currentMonster = { ...monsters };
      addLog(`${currentMonster.name}が現れた！`);
      // モンスターの画像に変更
      if (playerImage && currentMonster.imagePath) {
        playerImage.src = currentMonster.imagePath;
      }
      // 十字キー非活性化、戦闘ボタン活性化
      btnAction(false);
      isBattleActive(true);
    }
  }
};
//  battle関数（戦うor 逃げる）
if (attackBtn) {
  attackBtn.addEventListener("click", () => {
    if (!currentMonster) return;
    //主人公が攻撃してモンスターにダメージを与える
    currentMonster.HP = currentMonster.HP - currentInfo.attack;
    addLog(
      `主人公の攻撃！${currentMonster.name}に${currentInfo.attack}のダメージ`,
    );
    //モンスターのHPが0なら戦闘終了
    if (monsterActive()) {
      endBattle();
      addLog("勝負に勝った！");
      return;
    }
    //HP0以上ならモンスターが主人公に攻撃してダメージを与える
    currentInfo.HP = currentInfo.HP - currentMonster.attack;
    if (currentInfo.HP < 0) {
      currentInfo.HP = 0;
    }
    addLog(`モンスターの攻撃！主人公に${currentMonster.attack}のダメージ`);
    backUI();
    //主人公のHPが0なら戦闘終了
    if (isHeroDie()) {
      gameOver();
    }
  });
}
// 戦闘（にげる）ボタン処理
if (escapeBtn) {
  escapeBtn.addEventListener("click", () => {
    // 戦うモンスターがいないとき返す
    if (!currentMonster) {
      return;
    }
    if (isEscape()) {
      addLog("うまく逃げ切れた！");
      endBattle();
    } else {
      addLog("逃げ切れなかった！");
      // 逃走失敗時：モンスターの反撃
      currentInfo.HP = currentInfo.HP - currentMonster.attack;
      if (currentInfo.HP < 0) {
        currentInfo.HP = 0;
      }
      addLog(
        `${currentMonster.name}の攻撃！ 主人公は${currentMonster.attack}のダメージを受けた！`,
      );
      backUI();
      if (isHeroDie()) {
        gameOver();
      }
    }
  });
}
// 上ボタンを押した時の処理
topBtn.addEventListener("click", () => {
  arrowBtn("up");
});
// 下ボタンを押した時の処理
downBtn.addEventListener("click", () => {
  arrowBtn("down");
});
// 左ボタンを押した時の処理
leftBtn.addEventListener("click", () => {
  arrowBtn("left");
});
// 右ボタンを押した時の処理
rightBtn.addEventListener("click", () => {
  arrowBtn("right");
});
backUI();
btnAction(true);
isBattleActive(false);
