const RANDOM_SAIKORO_NUMBER = 6;
const NUMBER_OF_ROUNDS = 3;
const saikoroImage1 = document.getElementById("saikoroimage1");
const saikoroImage2 = document.getElementById("saikoroimage2");
const p1Score = document.getElementById("p1score");
const p2Score = document.getElementById("p2score");
const roundCount = document.getElementById("roundcount");
const battleBtn = document.getElementById("battlebtn");
const resultText = document.getElementById("resultText");


let round = 0;
let p1 = 0;
let p2 = 0;
battleBtn.addEventListener("click", () => {
  let saikoroRandom1 = Math.floor(Math.random() * RANDOM_SAIKORO_NUMBER) + 1;
  let saikoroRandom2 = Math.floor(Math.random() * RANDOM_SAIKORO_NUMBER) + 1;
  saikoroImage1.src = "./images/saikoro" + saikoroRandom1 + ".jpg";
  saikoroImage2.src = "./images/saikoro" + saikoroRandom2 + ".jpg";
  round++;

  roundCount.textContent = round;
  if (round >= NUMBER_OF_ROUNDS) {
    battleBtn.disabled = true;
  };
  if (saikoroRandom1 > saikoroRandom2) {
    p1++;
    p1Score.textContent = p1;
  };
  if (saikoroRandom1 < saikoroRandom2) {
    p2++;
    p2Score.textContent = p2;
  };
  if (p1 > p2) {
    resultText.textContent = "プレイヤー1の勝ち";
  };
  if (p1 < p2) {
    resultText.textContent = "プレイヤー2の勝ち";
  };
  if (p1 === p2) {
    resultText.textContent = "引き分け";
  };
  if (round < NUMBER_OF_ROUNDS) {
    resultText.textContent = "試合中";
  };
});



