const textBox = document.getElementById("textBox");
const searchBtn = document.getElementById("searchBtn");
const result = document.getElementById("result");
const notHistory = document.querySelector(".notHistory");
const loadingText = document.querySelector(".loading-text");

//テキストボックスの非活性化
searchBtn.disabled = true;
textBox.addEventListener("input", () => {
  if (textBox.value.trim() === "") {
    searchBtn.disabled = true;
  }
  if (textBox.value.trim() !== "") {
    searchBtn.disabled = false;
  }
});

//APIを取得し入力された数字をurlに代入させる
const allGetAPI = async () => {
  loadingText.textContent = "読み込み中";
  const pokeNum = textBox.value;
  const ALL_API = `https://pokeapi.co/api/v2/pokemon/${pokeNum}`;
  try {
    const response = await fetch(ALL_API);
    if (!response.ok) {
      throw new Error("見つかりません");
    }
    const data = await response.json();
    loadingText.textContent = "";
    notHistory.style.display = "none";
    const pokename = `ID:${data.id}  ${data.name}`;
    const pokeID = document.createElement("li");
    pokeID.textContent = pokename;
    result.prepend(pokeID);
  } catch {
    loadingText.textContent = "";
    alert(`ID${pokeNum}というポケモンは存在しません`);
  }
};

//クリック時に関数を走らせる
searchBtn.addEventListener("click", () => {
  allGetAPI();
});
