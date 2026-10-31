// [ 設定 ]　全3ラウンドで行う
const MAX_ROUND = 3;

// 各要素の取得　HTMLの中からidを持つ要素を探して取得
const roundEl = document.getElementById("round");
const point1El = document.getElementById("point1");
const point2El = document.getElementById("point2");
const dice1El = document.getElementById("dice1");
const dice2El = document.getElementById("dice2");
const player1El = document.getElementById("player1");
const player2El = document.getElementById("player2");
const battleBtn = document.getElementById("battleBtn");
const resultBtn = document.getElementById("resultBtn");

// 初期状態　ゲームの進行に合わせて変化するのでletで宣言する
let round = 0;
let point1 = 0;
let point2 = 0;

// 1〜6のランダムな数を返す(return ←呼び出し元に返すという意味)
function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

// ラウンド数・ポイントを画面に反映(右上の部分)
function renderInfo() {
  if (round === 0) {
    roundEl.textContent = 1;
  } else {
    roundEl.textContent = round;
  }
  point1El.textContent = point1;
  point2El.textContent = point2;
}

// 3ラウンド終了後の最終結果を表示(勝敗ボタンを押した際に表示)
function showFinalResult() {
  if (point1 > point2) {
    resultBtn.textContent = "プレイヤー1の勝ち";
  } else if (point2 > point1) {
    resultBtn.textContent = "プレイヤー2の勝ち";
  } else {
    resultBtn.textContent = "引き分け";
  }
}

// 勝負ボタンを押したときの処理
// 勝負ボタンを押すとラウンドが1ずつ増える
battleBtn.addEventListener("click", () => {
  round++;

  // サイコロを振って、出目の画像に切り替える
  // ゲーム自体の中身↓
  const dicenum1 = rollDice();
  const dicenum2 = rollDice();
  // 下記2行がサイコロの画像を切り替える(見た目)
  dice1El.src = `images/dice${dicenum1}.png`;
  dice2El.src = `images/dice${dicenum2}.png`;
  // ラウンドごとに勝った方のプレイヤーの色が切り替わるのをリセットする
  player1El.classList.remove("win");
  player2El.classList.remove("win");

  // 出目が高い方に1ポイント（同じ目はポイントなし）
  // 上から順に実行。当てはまった箇所で処理
  if (dicenum1 > dicenum2) {
    point1++;
    player1El.classList.add("win");
  } else if (dicenum2 > dicenum1) {
    point2++;
    player2El.classList.add("win");
  }

  // ラウンド数・ポイントを画面に反映
  renderInfo();

  // 3ラウンド終了で勝負ボタンを非活性、勝敗ボタンを活性にする
  if (round >= MAX_ROUND) {
    battleBtn.disabled = true;
    resultBtn.disabled = false;
  }
});

// 初期表示
renderInfo();
resultBtn.addEventListener("click", showFinalResult);