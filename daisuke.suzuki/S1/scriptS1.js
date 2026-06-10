let round = 0;
let playerScore1 = 0;
let playerScore2 = 0;

const maxRound = 3;
const roundCount = document.getElementById("round");
const plr1Score = document.getElementById("score1");
const plr2Score = document.getElementById("score2");
const battleBtn = document.getElementById("battleBtn");
const result = document.getElementById("result");
const diceNum1 = document.getElementById("dice1pc");
const diceNum2 = document.getElementById("dice2pc");

//サイコロを振って出た値を返す
function rollDice() {
  const num = Math.floor(Math.random() * 6) + 1;
  return num;
}

//勝敗を判定する
function determineWinner() {
  if (playerScore1 > playerScore2) {
    result.textContent = "プレイヤー1WIN";
  } else if (playerScore1 < playerScore2) {
    result.textContent = "プレイヤー2WIN";
  } else {
    result.textContent = "DRAW...";
  }
}

//スコアリスト表示する
function scoreList() {
  plr1Score.textContent = `プレイヤー1 : ${playerScore1} ポイント`;
  plr2Score.textContent = `プレイヤー2 : ${playerScore2} ポイント`;
  ``;
  roundCount.textContent = `ラウンド数 : ${round} ラウンド`;
}

//ダイス画像表示する
function dicePic(diceNum, number) {
  diceNum.src = `${number}` + ".jpg";
}

//ボタンクリックでサイコロを振る
battleBtn.addEventListener("click", () => {
  if (round < maxRound) {
    const num1 = rollDice();
    const num2 = rollDice();
    dicePic(diceNum1, num1);
    dicePic(diceNum2, num2);
    if (num1 > num2) {
      playerScore1++;
    } else if (num1 < num2) {
      playerScore2++;
    }
    round++;
    scoreList();
  }
  if (maxRound === round) {
    document.getElementById("battleBtn").disabled = true;
    determineWinner();
  }
});
