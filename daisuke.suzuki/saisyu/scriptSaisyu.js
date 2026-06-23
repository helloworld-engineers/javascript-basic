//マスターデータ：プレイヤーマスタデータ
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
    name: "スライム",
    hp: 20,
    attack: 10,
    exp: 10,
    encounterRate: 0.65,
  },
  dragon: {
    name: "ドラゴン",
    hp: 40,
    attack: 20,
    exp: 15,
    encounterRate: 0.25,
  },
  metal_slime: {
    name: "メタルスライム",
    hp: 20,
    attack: 10,
    exp: 30,
    encounterRate: 0.1,
  },
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

const DIRECTION = {
  UP: "UP",
  DOWN: "DOWN",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
};

let isMoveValid = true;

const WORLD = {
  minX: -30,
  maxX: 30,
  minY: -30,
  maxY: 30,
};

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
  if (
    nextX >= WORLD.minX &&
    nextX <= WORLD.maxX &&
    nextY >= WORLD.minY &&
    nextY <= WORLD.maxY
  ) {
    isMoveValid = true;
  } else {
    isMoveValid = false;
  }
}

//マップ機能：現在地判定
function mapCheck(playerStatus, MAPS) {
  const { x, y } = playerStatus.position;
  return MAPS.find((map) => {
    return (
      x >= map.area.minX &&
      x <= map.area.maxX &&
      y >= map.area.minY &&
      y <= map.area.maxY
    );
  });
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
    return MONSTERS["metal_slime"];
  } else if (rand <= MONSTERS["dragon"].encounterRate) {
    return MONSTERS["dragon"];
  } else {
    return MONSTERS["slime"];
  }
}
