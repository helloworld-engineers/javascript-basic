// 初期のボールの配置(変わらない)
const COLOR = ['red', 'blue', 'yellow', 'purple'];

// 箱に設定された正解の色(毎回ランダム)
let answer = [];

// 現在のボールの並び(ゲーム中に変化)
let current = [];

// class = ballImg の要素を全て取得
const ballImg = document.querySelectorAll('.ballImg');
// id = count の要素を1つ取得(正解数)
const countEl = document.getElementById('count');

// current の並び順通りにボールの画像表示(red, blue, yellow, purple)
function render() {
  ballImg.forEach((img, i) => {
    const color = current[i];
    img.className = 'ballImg ' + color;
  });
}

// 正解数を表示する関数
function showCount(n) {
  countEl.textContent = n;
}

// 配列をランダムに並び替える関数
function shuffle(array) {
  const result = array.slice(); // 元の配列をコピー

  // シャッフル関数: フィッシャーイェーツ関数を採用(sortを使うと元の配列が壊れるから)
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

// 同じ位置に同じ色が1つでもあれば true を返す
function hasSamePosition(a, b) {
  for (let i = 0; i < a.length; i++) {
    if (a[i] === b[i]) {
      return true;
    }
  }
  return false;
}

// 正解の色をランダムに決める（初期配置と1つも一致しないようにする）
function createAnswer(arr) {
  let result;
  do {
    result = shuffle(arr);
  } while (hasSamePosition(arr, result));
  return result;
}

// 正解数を数える
function countCorrect() {
  return current.filter((color, i) => color === answer[i]).length;
}

// ボール横の矢印を押したときに移動するデータ処理（動かした時点で正解数を表示する）
function swap(i, j) {
  [current[i], current[j]] = [current[j], current[i]];
  render();
  showCount(countCorrect()); // ボールを動かした瞬間に正解数を更新
}

// 矢印のクリックイベント(ボールの画像が変わる処理)
document.querySelectorAll('.slot').forEach((slot, i) => {
  slot.querySelector('.left').addEventListener('click', () => swap(i, i - 1));  /* 自分と左隣入れ替え */
  slot.querySelector('.right').addEventListener('click', () => swap(i, i + 1)); /* 自分と右隣入れ替え */
});

// 初期化：ボールを初期配置に戻し、正解をランダムに決め直す
function init() {
  current = [...COLOR];
  answer = createAnswer([...COLOR]);
  render();
  showCount(0);
}

// リセット
document.querySelector('.resetBtn').addEventListener('click', init);

// 初期表示
init();