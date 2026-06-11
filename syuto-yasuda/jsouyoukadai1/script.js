// プレイヤー名でサイコロの目のイラストが変わる関数
// 指定されているイメージファイルはそれぞれサイコロの目のイメージ図になります。
const playerScore = (playerNumber) => {
  const changeImage = document.getElementById(playerNumber);
  const score = Math.floor(Math.random() * 6) + 1;
  changeImage.src = `saikoro-illust${score}.png`;
  return score;
};

const gameResult = { round: 0, player1: 0, player2: 0 };
const gameBtn = document.getElementById("game");
const newRound = document.getElementById("round");
const newPlayer1Count = document.getElementById("player1Count");
const newPlayer2Count = document.getElementById("player2Count");
// ボタンを押した時に実行される関数
gameBtn.addEventListener("click", () => {
  if (gameResult.round >= 3) {
    return (disabled = true);
  }
  const gamePoint1 = playerScore("player1");
  const gamePoint2 = playerScore("player2");

  if (gamePoint1 > gamePoint2) {
    // プレイヤー1のポイント数を変更
    gameResult.player1++;
    newPlayer1Count.textContent = `プレイヤー1:${gameResult.player1}ポイント`;
  } else if (gamePoint1 < gamePoint2) {
    // プレイヤー2のポイント数を変更
    gameResult.player2++;
    newPlayer2Count.textContent = `プレイヤー2:${gameResult.player2}ポイント`;
  }
  //ラウンド数更新
  gameResult.round++;
  const newResult = document.getElementById("result");
  newRound.textContent = `ラウンド数:${gameResult.round}ラウンド`;

  // 3ラウンド目のポイント数を判定
  if (gameResult.round === 3) {
    if (gameResult.player1 > gameResult.player2) {
      newResult.textContent = "プレイヤー1の勝ち";
    }
    if (gameResult.player1 < gameResult.player2) {
      newResult.textContent = "プレイヤー2の勝ち";
    }
    if (gameResult.player1 === gameResult.player2) {
      newResult.textContent = "引き分け";
    }
  }
});
