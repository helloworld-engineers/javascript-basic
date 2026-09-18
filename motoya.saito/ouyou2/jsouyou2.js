const circleRed = document.getElementById("circleRed");
const circleBlue = document.getElementById("circleBlue");
const circleYellow = document.getElementById("circleYellow");
const circlePink = document.getElementById("circlePink");
const btnLeft = document.querySelectorAll(".btnLeft");
const btnRight = document.querySelectorAll(".btnRight")
const circlemain = document.getElementById("circlemain");
const squareRed = document.getElementById("squareRed");
const squareBlue = document.getElementById("squareBlue");
const squareYellow = document.getElementById("squareYellow");
const squarePink = document.getElementById("squarePink");
const resetBtn = document.getElementById("resetBtn");
const text = document.querySelector(".text");
const circle = document.querySelectorAll(".circle");
const circleArray = ["red","blue","yellow","pink"];
const answer = ["yellow","red","pink","blue"];
const circleArrayCopy = [...circleArray];
///anwerの配列とcircleArrayCopyの配列が一致しているときはカウントする
const textCount = () => {
  let score = 0;
  for (let j = 0; j < answer.length; j++) {
    if(answer[j] === circleArrayCopy[j]) {
      score++;
    }
  }
  text.textContent = score + "個正解しています"
};
//左やじるしクリックで色を変える
for (let i = 0; i < btnLeft.length; i++) {
  btnLeft[i].addEventListener("click", () => {
    //btnLeftの[0]番目は何もしない
    if (i === 0) {
      return
    };
    //circleArrayCopy(色の配列)の[0番目]と[1番目]を入れ替える
    [circleArrayCopy[i -1], circleArrayCopy[i]] = [circleArrayCopy[i], circleArrayCopy[i -1]]
    circle[i].style.backgroundColor =circleArrayCopy[i];
    circle[i -1].style.backgroundColor = circleArrayCopy[i -1];
    textCount();
  });
};
//右やじるしクリックで色を変える
for (let i = 0; i < btnRight.length; i++) {
  btnRight[i].addEventListener("click", () => {
    [circleArrayCopy[i], circleArrayCopy[i +1]] = [circleArrayCopy[i +1], circleArrayCopy[i]];
    circle[i +1].style.backgroundColor =circleArrayCopy[i +1];
    circle[i].style.backgroundColor = circleArrayCopy[i];
    textCount();
  });
};
//リセットで配置を戻す
resetBtn.addEventListener("click", () => {;
  for (let i = 0; i < circleArray.length; i++) {
    circleArrayCopy[i] = circleArray[i];
    circle[i].style.backgroundColor = circleArray[i];
  };
  textCount();
});