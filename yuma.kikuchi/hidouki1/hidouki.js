const API_URL = "https://dog.ceo/api/breeds/image/random";
const img = document.getElementById("img");
const imgBtn = document.getElementById("imgBtn");

// 非同期処理
const getImg = () => {
  img.textContent = "ローディング中です！";
  fetch(API_URL)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const dataMessage = data.message;
      img.innerHTML = `<img  class="dog" src = ${dataMessage} alt="犬の画像"/> `;
    })
    .catch((error) => {
      alert(`失敗です`);
    });
};
getImg();
// 画像を取得を押すと画像が変わる
imgBtn.addEventListener("click", () => {
  getImg();
});
