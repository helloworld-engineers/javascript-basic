const row = document.querySelector(".row");
const resultText = document.querySelector(".result-text");
const resetBtn = document.querySelector(".resetBtn");

const INITIAL_ORDER = [0, 1, 2, 3];
let order = [...INITIAL_ORDER];

const containers = [...document.querySelectorAll(".container")];

const renderLeftArrows = row.querySelectorAll(".left-arrow");
const renderRightArrows = row.querySelectorAll(".right-arrow");

// シャッフル
function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function countCorrect(array) {
  return array.filter((value, index) => value === index).length;
}

function shuffleZeroCorrect(array) {
  let result;
  do {
    result = shuffle(array);
  } while (countCorrect(result) !== 0);
  return result;
}

// 正解判定
function updateResult() {
  const count = countCorrect(order);
  resultText.textContent = `${count}個正解しています。`;
  if (countCorrect(order) === 0) {
    resetBtn.disabled = true;
  } else if (countCorrect(order) > 0) {
    resetBtn.disabled = false;
  }
}

// 入れ替え
function swap(index1, index2) {
  [order[index1], order[index2]] = [order[index2], order[index1]];
}

// 描画
function render() {
  order.forEach((index) => {
    row.appendChild(containers[index]);
  });
  updateResult();
}

// 初期のみイベント登録
function bindEvents() {
  const leftArrows = document.querySelectorAll(".left-arrow");
  const rightArrows = document.querySelectorAll(".right-arrow");

  leftArrows.forEach((arrow, index) => {
    arrow.onclick = () => {
      if (index === 0) return;
      swap(index, index - 1);
      order.forEach((i) => {
        row.appendChild(containers[i]);
      });
      updateResult();
      bindEvents();
    };
  });
  rightArrows.forEach((arrow, index) => {
    arrow.onclick = () => {
      if (index === order.length - 1) return;
      swap(index, index + 1);
      order.forEach((index) => {
        row.appendChild(containers[index]);
      });
      updateResult();
      bindEvents();
    };
  });
}

// リセット
resetBtn.addEventListener("click", () => {
  order = shuffleZeroCorrect(order);
  render();
  bindEvents();
});

// // 初期表示
order = shuffleZeroCorrect(order);
render();
bindEvents();
