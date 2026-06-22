const playerStatus = {
  hp: 100,
  maxHp: 100,
  attack: 10,
  level: 1,
  exp: 0,
  position: { x: 0, y: 0 },
  mapId: "grass",
};

const DIRECTION = {
  UP: "UP",
  DOWN: "DOWN",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
};

const isMoveValid = true;

const WORLD = {
  minX: -30,
  maxX: 30,
  minY: -30,
  maxY: 30,
};

const MAPS = [
  {
    id: "grass",
    area: { minX: -30, maxX: 0, minY: -30, maxY: 0 },
    encounterRate: 0.2,
  },
  {
    id: "volcano",
    area: { minX: 1, maxX: 30, minY: -30, maxY: 0 },
    encounterRate: 0.4,
  },
  {
    id: "village",
    area: { minX: -30, maxX: 0, minY: 1, maxY: 30 },
    encounterRate: 0.05,
  },
  {
    id: "seashore",
    area: { minX: 1, maxX: 30, minY: 1, maxY: 30 },
    encounterRate: 0.15,
  },
];

//マップ機能：移動関数
function move(direction, playerStatus) {
  if (DIRECTION === "UP") {
    playerStatus.position.y = -1;
  }
  if (DIRECTION === "DOWN") {
    playerStatus.position.y = +1;
  }
  if (DIRECTION === "LEFT") {
    playerStatus.position.x = -1;
  }
  if (DIRECTION === "RIGHT") {
    playerStatus.position.x = +1;
  }
}

//マップ機能：境界チェック
function borderCheck(direction, playerStatus) {
  let nextX = playerStatus.position.x;
  let nextY = playerStatus.position.y;
  if (direction === "UP") nextY -= 1;
  if (direction === "DOWN") nextY += 1;
  if (direction === "LEFT") nextX -= 1;
  if (direction === "RIGHT") nextX += 1;
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
  return MAPS.find((map) => {
    return (
      playerStatus.position.x >= map.area.minX &&
      playerStatus.position.x <= map.area.maxX &&
      playerStatus.position.y >= map.area.minY &&
      playerStatus.position.y <= map.area.maxY
    );
  });
}

//マップ機能：エリア遷移(座標変更前後のマップ情報比較)
function changeAria(playerStatus, MAPS) {
  const nextMap = MAPS.find(
    (map) =>
      playerStatus.position.x >= map.area.minX &&
      playerStatus.position.x <= map.area.maxX &&
      playerStatus.position.y >= map.area.minY &&
      playerStatus.position.y <= map.area.maxY,
  );
  if (nextMap.id !== playerStatus.mapId) {
    playerStatus.mapId = nextMap.id;
    return true;
  }
  return false;
}
