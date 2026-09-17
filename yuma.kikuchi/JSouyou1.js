//変数
const rollBtn = document.getElementById("syoubuButton");
const diceImg1 = document.getElementById("dice1-Img");
const diceImg2 = document.getElementById("dice2-Img");
const saikoro = 6;
let roundscore = 0;
let point1 = 0;
let point2 = 0;
const point1Display = document.getElementById("player1Point");
const point2Display = document.getElementById("player2Point");
const resultText = document.getElementById("syouhaiText");

//サイコロを振る
rollBtn.addEventListener("click", () => {
  //ダイス1をランダムに画像を表示する
  const roll1Dice = Math.floor(Math.random() * 6) + 1;
  diceImg1.src = `images/saikoro-illust${roll1Dice}.png`;
  //ダイス2をランダムに画像を表示する
  const roll2Dice = Math.floor(Math.random() * 6) + 1;
  diceImg2.src = `images/saikoro-illust${roll2Dice}.png`;
  //出目表示
  console.log("上：", roll1Dice);
  console.log("下：", roll2Dice);
  //勝負
  //ダイス1がダイス2に勝つ（trueの場合プレイヤー1にポイントが上がる)
  if (roll1Dice > roll2Dice) {
    point1++;
    point1Display.textContent = point1;
    //ダイス2がダイス1に勝つ（trueの場合プレイヤー2にポイントが上がる)
  } else if (roll1Dice < roll2Dice) {
    point2++;
    point2Display.textContent = point2;
  }
  //ラウンド数（3ラウンドまで）
  const roundScore = document.getElementById("roundscore");
  //ラウンド数の数が上がる
  roundscore++;
  console.log(roundscore);
  if (roundscore <= 3) {
    roundScore.textContent = roundscore;
  }
  //ゲーム終了（3ラウンド後）
  //3まで実行
  if (roundscore === 3) {
    //勝敗
    if (point1 > point2) {
      resultText.textContent = "プレイヤー1の勝利";
    } else if (point2 > point1) {
      resultText.textContent = "プレイヤー2の勝利";
    } else {
      resultText.textContent = "引き分け";
    }
    //3回目に勝負ボタンが非活性になる
    rollBtn.disabled = true;
  }
});
