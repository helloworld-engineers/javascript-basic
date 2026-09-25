const API_URL = 'https://dog.ceo/api/breeds/image/random';
const imgBtn =document.getElementById("imgBtn");
// 非同期処理
const getImg = () => {
    fetch(API_URL)
        .then((response) =>{
            return response.json();
    })
    .then((data) => {
        const dataMessage = data.message;
        img.src = dataMessage;
    })
    .catch((error) => {
      console.error(`失敗です`,error);
    });
};
getImg();
// 画像を取得を押すと画像が変わる
imgBtn.addEventListener("click", () => {
  getImg();
});
