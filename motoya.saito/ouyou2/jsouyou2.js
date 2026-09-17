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

//左やじるしクリックで色を変える
for (let i = 0; i < btnLeft.length; i++) {
  btnLeft[i].addEventListener("click", () => {
    if (i === 0) {
      return
    };
    [circleArrayCopy[i -1], circleArrayCopy[i]] = [circleArrayCopy[i], circleArrayCopy[i -1]]
    circle[i].style.backgroundColor =circleArrayCopy[i];
    circle[i -1].style.backgroundColor = circleArrayCopy[i -1];
    let score = 0;
    for (let i = 0; i < answer.length; i++) {
      if (answer[i] === circleArrayCopy[i]) {
        score++;
        text.textContent = score + "個正解しています"
      };
      if (answer[i] !== circleArrayCopy[i]) {
        text.textContent = score + "個正解しています"
      };
    };
  });
};
//右やじるしクリックで色を変える
for (let i = 0; i < btnRight.length; i++) {
  btnRight[i].addEventListener("click", () => {
    [circleArrayCopy[i], circleArrayCopy[i +1]] = [circleArrayCopy[i +1], circleArrayCopy[i]];
    circle[i +1].style.backgroundColor =circleArrayCopy[i +1];
    circle[i].style.backgroundColor = circleArrayCopy[i];
    let score = 0;
    for (let i = 0; i < answer.length; i++) {
      if (answer[i] === circleArrayCopy[i]) {
      score++;
      text.textContent = score + "個正解しています"
      };
      if (answer[i] !== circleArrayCopy[i]) {
        text.textContent = score + "個正解しています"
      }
      if (btnRight[i] === btnRight.length -1) {
        return;
      };
    };
  });
};
resetBtn.addEventListener("click", () => {
  let score = 0;
  for (let i = 0; i < circleArray.length; i++) {
    circle[i].style.backgroundColor = circleArray[i];
    if (answer[i] !== circleArray[i]) {
      text.textContent = score + "個正解しています"
    };
  };
});