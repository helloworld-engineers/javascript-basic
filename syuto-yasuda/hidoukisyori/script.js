const newBtn = document.getElementById("btn");
const newLoading = document.getElementById("loading");
const API_URL = "https://dog.ceo/api/breeds/image/random";

// DogAPIから犬の画像を表示する関数
async function getDogImage() {
  try {
    newLoading.style.display = "block";
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }
    const dogDate = await response.json();
    const result = document.getElementById("dogEvent");
    result.innerHTML = `<img src="${dogDate.message}" class="dogSize" >`;
  } catch (error) {
    console.error(error.message);
  } finally {
    newLoading.style.display = "none";
  }
}
getDogImage();

// ボタンを押した時の処理
newBtn.addEventListener("click", () => {
  getDogImage();
});
