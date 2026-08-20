//APIのURLを指定
const API_URL = "https://dog.ceo/api/breeds/image/random";
//HTML要素の取得(画像取得ボタン,imgタグ自体,ロード中に文字を表示するための場所)
const getBtn = document.getElementById("getBtn");
const img = document.getElementById("image");
const loadingText = document.getElementById("loadingText");

//asyncで関数を定義することでawait(同期処理と同じ上から順に処理)を使える
//犬の画像を取得し代入する関数
async function getDog() {
  try {
    loadingText.textContent = "読み込み中…";
    loadingText.classList.remove("hide");

    // await: fetchが完了するまで一時停止,responseに
    const response = await fetch(API_URL);
    //HTTPステータスが200~299ではない場合
    if (!response.ok) {
      throw new Error("HTTPエラー");
    }
    //promiseをjson形式で格納し、keyがmessageのvalueをimg要素のsrc属性に代入
    const data = await response.json();
    img.src = data.message;
    return data;
  } catch (error) {
    //エラーが起こった際にエラーメッセージを表示
    console.error("非同期エラー:", error.message);
  } finally {
    //最後に必ず行う処理,読み込み中の文字にdisplay:noneがついたclassを付与(＋0.3秒のラグ)
    setTimeout(() => {
      loadingText.classList.add("hide");
    }, 300);
  }
}

//画像取得をクリックした際にgetDog()を実行
getBtn.addEventListener("click", getDog);

//初期実行
getDog();
