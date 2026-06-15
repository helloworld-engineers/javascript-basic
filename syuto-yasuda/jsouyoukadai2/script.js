// イメージイラストはそれぞれ左矢印、右矢印のイラストになります。

// シャッフルする関数
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// 正解の数を表示する関数
const correctDisplay = (selectColor) => {
  let correctNum = 0;
  for (let i = 0; i < correctArray.length; i++) {
    if (correctArray[i] === selectColor[i]) {
      correctNum++;
    }
  }
  newCorrectText.textContent = `${correctNum}個正解しています`;
};

// 配列の色をUIに表示する関数
const circleColors = (colors) => {
  for (let i = 0; i < balls.length; i++) {
    balls[i].style.backgroundColor = colors[i];
  }
};

// リセットボタン
const newResetBtn = document.getElementById("resetBtn");
const correctArray = ["pink", "red", "blue", "yellow"];
let randomArray = shuffleArray(["red", "blue", "yellow", "pink"]);
newResetBtn.addEventListener("click", () => {
  let i = 0;
  while (i < correctArray.length) {
    if (randomArray[i] === correctArray[i]) {
      shuffleArray(randomArray);
      i = 0;
    }
    if (randomArray[i] !== correctArray[i]) {
      i++;
    }
  }
  console.log(randomArray);
  circleColors(randomArray);
  correctDisplay(randomArray);
});

// ボールのデフォルトの色を指定
// let defaultColoers = ["red", "blue", "yellow", "pink"];
const balls = document.querySelectorAll(".Circle");
circleColors(randomArray);

// 右矢印を押した時の処理
const moveRights = document.querySelectorAll(".rightBtn");
for (let i = 0; i < moveRights.length; i++)
  moveRights[i].addEventListener("click", () => {
    if (i === moveRights.length - 1) {
      return;
    }
    let temp = randomArray[i];
    randomArray[i] = randomArray[i + 1];
    randomArray[i + 1] = temp;
    circleColors(randomArray);
  });

// 左矢印を押した時の処理
const moveLefts = document.querySelectorAll(".leftBtn");
for (let i = 0; i < moveLefts.length; i++)
  moveLefts[i].addEventListener("click", () => {
    if (i === 0) {
      return;
    }
    let temp = randomArray[i];
    randomArray[i] = randomArray[i - 1];
    randomArray[i - 1] = temp;
    circleColors(randomArray);
  });

const newCorrectText = document.getElementById("correctText");

// チェックボタンをした時の正解の数の識別,表示
const newStartBtn = document.getElementById("startBtn");
newStartBtn.addEventListener("click", () => {
  correctDisplay(randomArray);
});
