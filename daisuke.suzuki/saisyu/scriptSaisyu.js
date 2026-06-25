//マスターデータ：プレイヤーマスタデータ：状態データ
const playerStatus = {
  hp: 100,
  maxHp: 100,
  attack: 10,
  level: 1,
  exp: 0,
  position: { x: 0, y: 0 },
  mapId: "grass",
};

//モンスターマスタデータ
const MONSTERS = {
  slime: {
    id: "slime",
    name: "スライム",
    hp: 20,
    attack: 10,
    exp: 10,
    encounterRate: 0.65,
  },
  dragon: {
    id: "dragon",
    name: "ドラゴン",
    hp: 40,
    attack: 20,
    exp: 15,
    encounterRate: 0.25,
  },
  metal_slime: {
    id: "metal_slime",
    name: "メタルスライム",
    hp: 20,
    attack: 10,
    exp: 30,
    encounterRate: 0.1,
  },
};

//レベルテーブル 30ずつでレベルアップする
const LEVEL_TABLE = {
  1: 30,
  2: 30,
  3: 30,
  4: 30,
  5: 30,
  6: 30,
  7: 30,
  8: 30,
  9: 30,
  10: 30,
  11: 30,
  12: 30,
  13: 30,
  14: 30,
  15: 30,
};

//マップマスタデータ
const MAPS = {
  grass: {
    name: "草原",
    area: { minX: -30, maxX: 0, minY: -30, maxY: 0 },
    encounterRate: 0.4,
  },
  volcano: {
    name: "火山",
    area: { minX: 1, maxX: 30, minY: -30, maxY: 0 },
    encounterRate: 0.4,
  },
  village: {
    name: "村",
    area: { minX: -30, maxX: 0, minY: 1, maxY: 30 },
    encounterRate: 0.4,
  },
  seashore: {
    name: "海辺",
    area: { minX: 1, maxX: 30, minY: 1, maxY: 30 },
    encounterRate: 0.4,
  },
};

//逃走成功確率
const escapeRate = 0.5;

//移動方向
const DIRECTION = {
  UP: "UP",
  DOWN: "DOWN",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
};

//フィールドの範囲
const WORLD = {
  minX: -30,
  maxX: 30,
  minY: -30,
  maxY: 30,
};

//画面遷移：画面状態
let MODE = {
  MAP: "MAP",
  BATTLE: "BATTLE",
};
let currentMode = MODE.MAP;
//画面遷移：画面遷移
function changeMode(nextMode) {
  currentMode = nextMode;

  if (currentMode === MODE.MAP) {
    document.getElementById("map-screen").style.display = "block";
    document.getElementById("battle-screen").style.display = "none";
  }

  if (currentMode === MODE.BATTLE) {
    document.getElementById("map-screen").style.display = "none";
    document.getElementById("battle-screen").style.display = "block";
  }
}

changeMode(currentMode);
console.log(currentMode);

//ログ表示：ログ配列
let logList = [];
const LOG_TYPE = {
  INFO: "INFO",
  SYSTEM: "SYSTEM",
  BATTLE: "BATTLE",
};

//ログ表示：ログ追加
function addLog(message, type = LOG_TYPE.INFO) {
  logList.push({
    message,
    type,
  });
  renderLogs(message, type);
}

//ログ表示：ログ描画
function renderLogs(message, type = LOG_TYPE.INFO) {
  const ul = document.getElementById("log-list");
  ul.innerHTML = ""; // まずリストを空にする
  logList.forEach(({ message, type }) => {
    const li = document.createElement("li");
    li.className = `log ${type}`;
    li.textContent = message;
    ul.appendChild(li);
  });
  ul.scrollTop = ul.scrollHeight;
}

//マップ機能：移動関数
function move(direction, playerStatus) {
  const pos = playerStatus.position;
  if (direction === DIRECTION.UP) {
    pos.y -= 1;
  }
  if (direction === DIRECTION.DOWN) {
    pos.y += 1;
  }
  if (direction === DIRECTION.LEFT) {
    pos.x -= 1;
  }
  if (direction === DIRECTION.RIGHT) {
    pos.x += 1;
  }
}

//マップ機能：境界チェック
function borderCheck(direction, playerStatus) {
  const { x, y } = playerStatus.position;
  let nextX = x;
  let nextY = y;

  if (direction === DIRECTION.UP) nextY -= 1;
  if (direction === DIRECTION.DOWN) nextY += 1;
  if (direction === DIRECTION.LEFT) nextX -= 1;
  if (direction === DIRECTION.RIGHT) nextX += 1;

  return (
    nextX >= WORLD.minX &&
    nextX <= WORLD.maxX &&
    nextY >= WORLD.minY &&
    nextY <= WORLD.maxY
  );
}

//マップ機能：現在地判定
function mapCheck(playerStatus, MAPS) {
  const { x, y } = playerStatus.position;
  const entry = Object.entries(MAPS).find(([id, map]) => {
    return (
      x >= map.area.minX &&
      x <= map.area.maxX &&
      y >= map.area.minY &&
      y <= map.area.maxY
    );
  });
  if (!entry) return null;
  const [id, map] = entry;
  return {
    id,
    ...map,
  };
}

//マップ機能：エリア遷移(座標変更前後のマップ情報比較)
function changeAria(playerStatus, MAPS) {
  const nextMap = mapCheck(playerStatus, MAPS);
  if (!nextMap) return false;
  if (nextMap.id !== playerStatus.mapId) {
    playerStatus.mapId = nextMap.id;
    return true;
  }
  return false;
}

//エンカウント機能：エンカウント判定
function encountCheck(playerStatus, MAPS) {
  const rand = Math.random();
  const currentMap = MAPS[playerStatus.mapId];
  return rand < currentMap.encounterRate;
}

//エンカウント機能：出現モンスター判定
function appearMonsterCheck(MONSTERS) {
  const rand = Math.random();
  if (rand <= MONSTERS["metal_slime"].encounterRate) {
    return "metal_slime";
  } else if (rand <= MONSTERS["dragon"].encounterRate) {
    return "dragon";
  } else {
    return "slime";
  }
}

//モンスター生成
function createMonster(MONSTERS, monsterId) {
  const base = MONSTERS[monsterId];
  return {
    enemyId: monsterId,
    name: base.name,
    maxHp: base.hp,
    currentHp: base.hp,
    attack: base.attack,
    exp: base.exp,
  };
}

//ステータス管理：モンスターの状態
const monsterId = appearMonsterCheck(MONSTERS);
const monsterStatus = createMonster(MONSTERS, monsterId);

//ステータス管理：ダメージ計算
function calcHp(currentHp, damage) {
  const nextHp = Math.max(currentHp - damage, 0);
  const isDead = nextHp === 0;
  return {
    nextHp,
    isDead,
  };
}

//ステータス管理：レベルアップ
function levelUp(currentExp, gainedExp, currentLevel, LEVEL_TABLE) {
  let nextExp = currentExp + gainedExp;
  let nextLevel = currentLevel;
  let isLevelUp = false;
  while (true) {
    const needExp = LEVEL_TABLE[nextLevel];
    if (!needExp) break;
    if (nextExp >= needExp) {
      nextExp -= needExp;
      nextLevel += 1;
      isLevelUp = true;
    } else {
      break;
    }
  }
  return {
    nextExp,
    nextLevel,
    isLevelUp,
  };
}

//戦闘時：戦闘開始
function startBtl(playerStatus, enemyStatus) {
  return {
    playerHp: playerStatus.hp,
    enemyHp: enemyStatus.currentHp,
  };
}
//戦闘時：両者ステータス生成
let battleState = startBtl(playerStatus, monsterStatus);

//戦闘時：攻撃処理
function calcDamage(attackerAtk) {
  return Math.max(1, attackerAtk);
}

//戦闘時：逃走処理
function isEscapeSuccess(escapeRate) {
  let rand = Math.random();
  return rand < escapeRate;
}

//戦闘時：勝利時経験値処理
function applyExp(playerStatus, enemyStatus) {
  const gainExp = enemyStatus.exp;
  const levelResult = levelUp(
    playerStatus.exp,
    gainExp,
    playerStatus.level,
    LEVEL_TABLE,
  );
  playerStatus.exp = levelResult.nextExp;
  playerStatus.level = levelResult.nextLevel;
  return {
    gainExp,
    isLevelUp: levelResult.isLevelUp,
  };
}

//戦闘時：プレイヤー攻撃時処理
function inputAttack(state, playerAtk, enemyAtk) {
  //プレイヤー攻撃
  const damage = calcDamage(playerAtk);
  const playerResult = calcHp(state.enemyHp, damage);
  state.enemyHp = playerResult.nextHp;
  //log
  addLog(`敵に${damage}ダメージ！ 残りHP: ${state.enemyHp}`, LOG_TYPE.BATTLE);
  //敵死亡判定
  if (playerResult.isDead) {
    //log
    addLog("敵は倒れた！", "system");
    return "win";
  }
  //敵の攻撃
  const enemyDamage = calcDamage(enemyAtk);
  const enemyResult = calcHp(state.playerHp, enemyDamage);
  state.playerHp = enemyResult.nextHp;
  //log
  addLog(
    `プレイヤーは${enemyDamage}ダメージをうけた！ 残りHP: ${state.playerHp}`,
    LOG_TYPE.BATTLE,
  );
  //プレイヤー死亡判定
  if (enemyResult.isDead) {
    //log
    addLog("敗北...", LOG_TYPE.SYSTEM);
    return "lose";
  }
  return "continue";
}

//戦闘時：プレイヤー逃走処理
function inputEscape(state, enemyAtk, escapeRate) {
  if (isEscapeSuccess(escapeRate)) {
    //log
    addLog("逃走成功！", LOG_TYPE.SYSTEM);
    return "escape";
  }
  //log
  addLog("逃走失敗...", LOG_TYPE.SYSTEM);
  //失敗したら敵攻撃
  const enemyDamage = calcDamage(enemyAtk);
  const enemyResult = calcHp(state.playerHp, enemyDamage);
  state.playerHp = enemyResult.nextHp;
  //log
  addLog(
    `プレイヤーは${enemyDamage}ダメージをうけた！ 残りHP: ${state.playerHp}`,
    LOG_TYPE.BATTLE,
  );
  //プレイヤー死亡判定
  if (enemyResult.isDead) {
    //log
    addLog("敗北...", LOG_TYPE.SYSTEM);
    return "lose";
  }
  return "continue";
}
