//要素の取得
const btn = document.getElementById("shobu");
const shohai = document.getElementById("shohai");
const deme1 = document.getElementById("deme1");
const deme2 = document.getElementById("deme2");
const round = document.getElementById("round");
const p1Point = document.getElementById("p1Point");
const p2Point = document.getElementById("p2Point");

//カウント用の変数を定義
let roundCount = 0;
let player1Count = 0;
let player2Count = 0;

//勝負ボタンをクリックした場合の処理
btn.addEventListener("click", () => {
  if (roundCount >= 5) {
    return;
  }
  if (roundCount < 3) {
    shohai.textContent = "勝負中";
    roundCount++;
    round.textContent = `ラウンド数：${roundCount}ラウンド`;

    const deme1Random = Math.floor(Math.random() * 6) + 1;
    const deme2Random = Math.floor(Math.random() * 6) + 1;
    deme1.src = `./images/${deme1Random}.png`;
    deme2.src = `./images/${deme2Random}.png`;
    if (deme1Random > deme2Random) {
      player1Count++;
      p1Point.textContent = `プレイヤー1：${player1Count}ポイント`;
    }
    if (deme2Random > deme1Random) {
      player2Count++;
      p2Point.textContent = `プレイヤー2：${player2Count}ポイント`;
    }
  }
  if (roundCount === 3) {
    btn.setAttribute("disabled", true);
    btn.style.color = "white";
    round.textContent = `ラウンド数：${roundCount}ラウンド`;
    if (player1Count > player2Count) {
      shohai.textContent = "プレイヤー1の勝利";
    } else if (player2Count > player1Count) {
      shohai.textContent = "プレイヤー2の勝利";
    } else {
      shohai.textContent = "引き分け";
    }
  }
});
