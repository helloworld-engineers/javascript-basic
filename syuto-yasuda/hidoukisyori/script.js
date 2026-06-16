const newBtn = document.getElementById("btn");
const newLoading = document.getElementById("loading");
const API_URL = "https://dog.ceo/api/breeds/image/random";
const result = document.getElementById("dogEvent");

// DogAPIから犬の画像を表示する関数
async function getDogImage() {
  try {
    newLoading.style.display = "block";
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }
    const dogData = await response.json();
    result.innerHTML = `<img src="${dogData.message}" class="dogSize" >`;
  } catch (error) {
    result.innerHTML = "<p>画像の取得に失敗しました</p>";
  } finally {
    newLoading.style.display = "none";
  }
}
getDogImage();

// ボタンを押した時の処理
newBtn.addEventListener("click", () => {
  getDogImage();
});
