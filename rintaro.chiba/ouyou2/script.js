//矢印ボタン要素の取得
const left = document.querySelectorAll(".left");
const right = document.querySelectorAll(".right");
//正答数の文字列要素取得
const answertext = document.getElementById("answer");
//リセットボタン要素の取得
const resetBtn = document.getElementById("reset");
//ボール要素のNodeListをスプレッド構文で配列に格納
const balls = [...document.querySelectorAll(".ball")];
//箱要素の取得
const boxes = document.querySelectorAll(".box");

//ボールの初期配列
let ballArray = [0, 1, 2, 3];

//ボール配列のディープコピー(矢印ボタンで入れ替える用)
let changeArr = [...ballArray];

//箱の初期配列
let boxArray = [];

//シャッフル関数
const shuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

//箱配列のシャッフル関数(中身を空にしてからシャッフルし格納する)
const boxShuffle = () => {
  boxArray.length = 0;
  const shuffledArr = shuffle(changeArr);
  for (let i = 0; i <= shuffledArr.length - 1; i++) {
    boxArray.push(shuffledArr[i]);
  }
};

//エラー検知関数を定義(同じ番号が一つでもあればfalseを返し、全部違う番号であればtrueを返す)
const errorCheck = (array1, array2) => {
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] === array2[i]) {
      return false;
    }
  }
  return true;
};

//エラー検知関数がfalseを返す限りシャッフルし続ける関数(すべて被っていないパターンの配列を返す)
const reShuffle = (array1, array2) => {
  var result = errorCheck(array1, array2);
  while (result === false) {
    boxShuffle();
    result = errorCheck(array1, array2);
  }
  return boxArray;
};

//ボール移動後の配列と箱配列のチェック(false,trueが格納された配列を返す)
const answerCheck = (array1, array2) => {
  let checkedArray = [];
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] === array2[i]) {
      checkedArray.push(false);
    } else {
      checkedArray.push(true);
    }
  }
  return checkedArray;
};

//色の配列
const colors = ["red", "blue", "green", "yellow"];
//配列の番号に応じてリスト化されたHTML要素のスタイルを変更
const colorChange = (array) => {
  for (let i = 0; i < array.length; i++) {
    balls[i].style.backgroundColor = colors[array[i]];
  }
};

//正解数を判定する関数
const AnswerText = () => {
  const checkedArray = answerCheck(changeArr, boxArray);
  const filteredArray = checkedArray.filter((index) => index === false);
  const answer = filteredArray.length;
  answertext.textContent = `${answer}個正解しています。`;
};

//左矢印を押したとき左隣と入れ替える(左端は早期リターン),
//合致した場合falseのみを配列化してlengthを正解数として表示する
left.forEach((button, index) => {
  button.addEventListener("click", () => {
    if (index === 0) {
      return;
    }
    [changeArr[index - 1], changeArr[index]] = [
      changeArr[index],
      changeArr[index - 1],
    ];
    colorChange(changeArr);
    AnswerText()
  });
});

//右矢印を押したとき右隣と入れ替える(右端は早期リターン),
//合致した場合falseのみを配列化してlengthを正解数として表示する
right.forEach((button, index) => {
  button.addEventListener("click", () => {
    if (index === changeArr.length - 1) {
      return;
    }
    [changeArr[index], changeArr[index + 1]] = [
      changeArr[index + 1],
      changeArr[index],
    ];
    colorChange(changeArr);
    AnswerText()
  });
});

//リセットボタンを押下時、変更点を初期値に戻す,
//背景色を与え直し、箱配列の再シャッフル後、正解数0を表示する
resetBtn.addEventListener("click", () => {
  changeArr = [0, 1, 2, 3];
  boxArray.length = 0;
  colorChange(ballArray);
  boxShuffle();
  reShuffle(ballArray, boxArray);
  AnswerText()
});

//初期実行
colorChange(changeArr);
boxShuffle();
reShuffle(ballArray, boxArray);
