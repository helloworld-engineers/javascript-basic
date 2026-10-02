const SLIME_APPEAR_RATE = 0.65; // 65%未満はスライム
const DRAGON_APPEAR_RATE = 0.9; // 65%以上90%未満（25%）はドラゴン
const topBtn = document.getElementById("top-btn");
const leftBtn = document.getElementById("left-btn");
const rightBtn = document.getElementById("right-btn");
const downBtn = document.getElementById("down-btn");
let currentInfo = {
  x: 0,
  y: 0,
  HP: 100,
  attack: 10,
  level: 1,
};
let monsterInfo = {
  slime: {
    id: 1,
    name: "slime",
    HP: 20,
    attack: 10,
    skill: 10,
    imagePath: "slime.png",
  },
  Dragon: {
    id: 2,
    name: "Dragon",
    HP: 40,
    attack: 20,
    skill: 15,
    imagePath: "dragon,png",
  },
  MetalSlime: {
    id: 3,
    name: "Metal Slime",
    HP: 20,
    attack: 10,
    skill: 30,
    imagePath: "metalSlime.png",
  },
};
const areaImg = {
  spring: "spring.jpg",
  summer: "summer.jpg",
  autumn: "autumn.jpg",
  winter: "winter.jpg",
};
// move関数（ボタンを押したらx,yの座標移動）
const move = (direction, x, y) => {
  if (!isMove(x, y)) {
    return;
  }
  if (direction === "up") {
    currentInfo.x += 1;
  }
  if (direction === "down") {
    currentInfo.x -= 1;
  }
  if (direction === "right") {
    currentInfo.y += 1;
  }
  if (direction === "left") {
    currentInfo.y -= 1;
  }
  return currentInfo;
};
// is Move関数（移動が可か不可かマップの範囲内の判定するための関数）
//座標移動変数
let actionX = currentInfo.x;
let actionY = currentInfo.y;
//移動可能か不可能か
const isMove = (actionX, actionY) => {
  if (actionX > 20 || actionX < -20 || actionY > 20 || actionY < -20) {
    return false; //移動不可
  }
  return true; //移動可能（成功）
};
// currentLocation関数（現在位置の判定）
const currentLocation = () => {
  const { x, y } = currentPosition;
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
