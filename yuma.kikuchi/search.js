// 変数宣言
const search = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const searchForm = document.getElementById("search-form");
const message = document.getElementById("message");
const noHistory = document.getElementById("no-history");
const historyElement = document.getElementById("history-list");
// 初期画面は検索ボタンが非活性。文字がある時は活性
search.addEventListener("input", () => {
  if (search.value.trim() === "") {
    searchBtn.disabled = true;
  } else {
    searchBtn.disabled = false;
  }
});
// API取得
async function getData(pokemonId) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonId}`,
    );
    if (!response.ok) {
      throw new Error(`ID ${pokemonId} というポケモンは存在しません`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    message.textContent = error.message;
  }
}
searchBtn.addEventListener("click", async () => {
  // ローディング表示
  message.textContent = "ローディング中...";
  const pokemonData = await getData(search.value);
  if (pokemonData) {
    message.textContent = "";
    addHistory(pokemonData.id, pokemonData.name);
  }
});
// 履歴画面
function addHistory(id, name) {
  if (noHistory) {
    noHistory.style.display = "none";
  }
  const li = document.createElement("li");
  li.textContent = `ID: ${id} ${name}`;
  historyElement.prepend(li);
}
