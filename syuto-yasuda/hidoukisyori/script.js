// DogAPIから犬の画像を表示する関数
async function getDate() {
  const API_URL = "https://dog.ceo/api/breeds/image/random";
  const newBtn = document.getElementById("btn");
  const newLoading = document.getElementById("loading");
  try {
    newLoading.style.display = "flex";

    const response = await fetch(API_URL);
    if (!response.ok) {
      console.log("error");
    }
    const date = await response.json();
    const result = document.getElementById("dogEvent");
    result.innerHTML = `<img src=${date.message} class="dogSize" >`;
  } catch (error) {
    console.error(error.message);
  } finally {
    newLoading.style.display = "none";
  }
}
getDate();

// ボタンを押した時の処理
const newBtn = document.getElementById("btn");
newBtn.addEventListener("click", () => {
  getDate();
});
