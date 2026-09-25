//矢印の変数
const leftBtn = document.querySelectorAll(".numberleft");
const rightBtn = document.querySelectorAll(".numberright");
// カラーボールの答え
const colorBoxes = document.querySelectorAll(".numbercircle");
const answerColors = ["#f08080", "#6495ed", "#fff8dc", "#dda0dd"];
// カラーボールのランダムに出てくるカラーコード
const colorSet = ["#6495ed", "#f08080", "#dda0dd", "#fff8dc"];
// リセットボタン
const resetBtn = document.getElementById("reset");
// スコアテキスト
const resultText = document.getElementById("answer");
// 正解数を表示する
const scoreText = (answerMatch) => {
  const score = answerMatch.length;
  resultText.textContent = score;
};

// シャッフル配列
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
//初期画面でカラーボールをランダムで表示する
const colorShuffle = document.querySelectorAll(".numbercircle");
let shuffleColrs = shuffleArray(colorSet);
colorShuffle.forEach((colorBall, i) => {
  colorBall.style.backgroundColor = shuffleColrs[i];
});
// 配列をアンサーと重複チェック
let answerMatch = answerColors.filter((color, index) => {
  if (color === shuffleColrs[index]) {
    return color;
  };
});
// 2回目以降再度ループ処理をする
while (answerMatch.length > 0) {
  shuffleColrs = shuffleArray(colorSet);
  answerMatch = answerColors.filter((color, index) => {
    if (color === shuffleColrs[index]) {
      return color;
    }:
  });
};
// リセットボタン「0個正解してます」状態にする
resetBtn.addEventListener("click", () => {
  while (answerMatch.length > 0) {
    shuffleColrs = shuffleArray(colorSet);
    answerMatch = answerColors.filter((color, index) => {
      if (color === shuffleColrs[index]) {
        return color;
      }
    });
  }
  colorBoxes.forEach((colorBox, i) => {
    colorBox.style.backgroundColor = shuffleColrs[i];
  });
  resultText.textContent = "0";
});

// 各右矢印をクリック
for (let j = 0; j < rightBtn.length; j++) {
  rightBtn[j].addEventListener("click", () => {
    // 配列3番目（一番端）の時に配列2と3を代入する
    if (j === 3) {
      [shuffleColrs[2], shuffleColrs[3]] = [shuffleColrs[3], shuffleColrs[2]];
      return;
    }
    [shuffleColrs[j], shuffleColrs[j + 1]] = [
      shuffleColrs[j + 1],
      shuffleColrs[j],
    ];
    // 重複チェック
    answerMatch = answerColors.filter((color, index) => {
      if (color === shuffleColrs[index]) {
        return color;
      }
    });
    // 色を表示する
    colorBoxes.forEach((colorBoxright, i) => {
      colorBoxright.style.backgroundColor = shuffleColrs[i];
    });
    // 正解数のカウント
    scoreText(answerMatch);
  });
}
// 各左矢印をクリック
for (let i = 0; i < leftBtn.length; i++) {
  leftBtn[i].addEventListener("click", () => {
    // 配列0番目の時に0と1を代入する
    if (i === 0) {
      [shuffleColrs[0], shuffleColrs[1]] = [shuffleColrs[1], shuffleColrs[0]];
    } else {
      [shuffleColrs[i + 1], shuffleColrs[i]] = [
        shuffleColrs[i],
        shuffleColrs[i + 1],
      ];
    }
    // 重複チェック
    answerMatch = answerColors.filter((color, index) => {
      if (color === shuffleColrs[index]) {
        return color;
      }
    });
    // 色を表示する
    colorBoxes.forEach((colorBoxleft, j) => {
      colorBoxleft.style.backgroundColor = shuffleColrs[j];
    });
    // 正解数のカウント
    scoreText(answerMatch);
  });
}