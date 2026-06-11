const row = document.querySelector(".row");
const resultText = document.querySelector(".result-text");
const resetBtn = document.querySelector(".resetBtn");

const INITIAL_ORDER = [0, 1, 2, 3];
let order = [...INITIAL_ORDER];

const containers = [...document.querySelectorAll(".container")];

// シャッフル
function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// 描画
function render() {
  order.forEach((index) => {
    row.appendChild(containers[index]);
  });
  updateResult();
}

// 初期表示
bindEvents();
render();

// 正解判定
function updateResult() {
  const count = order.filter((value, index) => value === index).length;
  resultText.textContent = `${count}個正解しています。`;
}

// 入れ替え
function swap(index1, index2) {
  [order[index1], order[index2]] = [order[index2], order[index1]];
}

// 左移動
function moveLeft(index) {
  if (index === 0) return;
  swap(index, index - 1);
  render();
}

// 右移動
function moveRight(index) {
  if (index === order.length - 1) return;
  swap(index, index + 1);
  render();
}

// イベント登録
function bindEvents() {
  const leftArrows = document.querySelectorAll(".left-arrow");
  const rightArrows = document.querySelectorAll(".right-arrow");
  leftArrows.forEach((arrow, index) => {
    arrow.addEventListener(`click`, () => moveLeft(index));
  });
  rightArrows.forEach((arrow, index) => {
    arrow.addEventListener(`click`, () => moveRight(index));
  });
}

// リセット
resetBtn.addEventListener("click", () => {
  order = shuffle(order);
  render();
});
