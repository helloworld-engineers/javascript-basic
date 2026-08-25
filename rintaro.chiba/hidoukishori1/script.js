//APIのURLを指定
const API_URL = "https://dog.ceo/api/breeds/image/random";
//HTML要素の取得(画像取得ボタン,imgタグ自体,ロード中に文字を表示するための場所)
const getBtn = document.getElementById("getBtn");
const img = document.getElementById("image");
const loadingText = document.getElementById("loadingText");

//犬の画像を取得する関数
const getDog = async () => {
  img.classList.add("hide");
  loadingText.classList.remove("hide");
  loadingText.textContent = "読み込み中…";
  try {
    // await: fetchが完了するまで一時停止,responseに
    const response = await fetch(API_URL);
    //HTTPステータスが200~299ではない場合
    if (!response.ok) {
      throw new Error("HTTPエラー");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    //エラーが起こった際にアラートを表示
    alert("非同期エラー");
  } finally {
    loadingText.classList.add("hide");
    img.classList.remove("hide");
  }
};

//画像取得をクリックした際にgetDog()を実行
getBtn.addEventListener("click", async () => {
  const data = await getDog();
  img.src = data.message;
});

//初期実行
window.onload = async () => {
  const data = await getDog();
  img.src = data.message;
};
