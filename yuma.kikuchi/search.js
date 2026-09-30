// 変数宣言
const search = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const searchForm = document.getElementById("search-form");
const message = document.getElementById("message");
const noHistoryElement = document.getElementById("no-history");
const historyElement = document.getElementById("history-list");
// 空の場合はボタンを非活性
search.addEventListener("input", function () {
  if (search.length === "") {
    searchBtn.disabled = true;
  } else {
    searchBtn.disabled = false;
  }
});
// API取得
async function getData(pokemonId) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`,
    );
    if (!response.ok) {
      throw new Error(`ID ${pokemonId} というポケモンは存在しません`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("非同期エラー:", error.message);
    message.style.color = "red";
    message.textContent = error.message;
    return null;
  }
}
// // ローディング表示
//   message.style.color = "black";
//   message.textContent = "ローディング中...";
