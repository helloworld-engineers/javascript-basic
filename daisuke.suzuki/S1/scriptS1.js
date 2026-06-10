let round = 0;
let scr1 = 0;
let scr2 = 0;

const diceNum1 = document.getElementById("dice1pc");
const diceNum2 = document.getElementById("dice2pc");
const battleBtn = document.getElementById("battleBtn");
const maxRound = 3;
const result = document.getElementById("result");
const plr1Score = document.getElementById("score1");
const plr2Score = document.getElementById("score2");
const roundCount = document.getElementById("round");

//サイコロを振って出た値を返す
function rollDice() {
  const num = Math.floor(Math.random() * 6) + 1;
  return num;
}

//ボタンクリックでサイコロを振る
battleBtn.addEventListener("click", () => {
  if (round < maxRound) {
    const num1 = rollDice();
    const num2 = rollDice();
    diceNum1.src = num1 + ".jpg";
    diceNum2.src = num2 + ".jpg";
    if (num1 > num2) {
      scr1++;
    } else if (num1 < num2) {
      scr2++;
    }
    round++;
    plr1Score.textContent = `プレイヤー1 : ${scr1} ポイント`;
    plr2Score.textContent = `プレイヤー2 : ${scr2} ポイント`;
    roundCount.textContent = `ラウンド数 : ${round} ラウンド`;
  }
  if (maxRound === round) {
    document.getElementById("battleBtn").disabled = true;
    if (scr1 > scr2) {
      result.textContent = "プレイヤー1WIN";
    } else if (scr1 < scr2) {
      result.textContent = "プレイヤー2WIN";
    } else {
      result.textContent = "DRAW...";
    }
  }
});
