const API_URL = "https://dog.ceo/api/breeds/image/random";

const btn = document.getElementById("btn");
const img = document.getElementById("dogimg");
const statusText = document.getElementById("status");

//画像取得関数
async function fetchDog() {
  try {
    //loading
    statusText.textContent = "読み込み中・・・";
    btn.disabled = true;
    if (data.message) {
      img.src = data.message;
      statusText.textContent = "表示中";
    } else {
      throw new Error("画像が取得できませんでした");
    }
    const res = await fetch(API_URL);
    const data = await res.json();

    //showing
    img.src = data.message;
    statusText.textContent = "表示中";
  } catch (error) {
    //error
    console.error(error);
    statusText.textContent = "エラーが発生中";
  } finally {
    btn.disabled = false;
  }
}

//ボタン押すと
btn.addEventListener("click", fetchDog);

//初回表示
fetchDog();
