//矢印ボタン要素の取得
const left1 = document.getElementById("left1");
const left2 = document.getElementById("left2");
const left3 = document.getElementById("left3");
const left4 = document.getElementById("left4");
const right1 = document.getElementById("right1");
const right2 = document.getElementById("right2");
const right3 = document.getElementById("right3");
const right4 = document.getElementById("right4");
//ボール要素の取得
const ball1 = document.getElementById("ball1");
const ball2 = document.getElementById("ball2");
const ball3 = document.getElementById("ball3");
const ball4 = document.getElementById("ball4");
//箱要素の取得
const box1 = document.getElementById("box1");
const box2 = document.getElementById("box2");
const box3 = document.getElementById("box3");
const box4 = document.getElementById("box4");

//ボールの配列
const ballArray = [ball1, ball2, ball3, ball4];
console.log(ballArray);
//箱の配列
const boxArray = [box1, box2, box3, box4];
//箱の数を定義
const boxNum = 4;
//箱の番号をシャッフルする関数
const boxShuffle = () => {
  for (let i = 0; i <= 3; i++) {
    boxArray[i] = i;
  }
};
boxShuffle()
console.log(boxArray[0])



//配列内の位置の入れ替え関数
const changeLeft = () => {
  配列;
};

//左ボダンをクリックした際の動き
