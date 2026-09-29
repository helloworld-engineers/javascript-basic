//変数宣言
const loadingElement = document.getElementById("loading");
const contentsElement = document.querySelector(".contents");
const API_URL = `https://pokeapi.co/api/v2/pokemon/`;
// HTMLに導入するための変数
const name = document.getElementById("");
// 詳細データを取得する非同期関数
async function getPokemonDetail() {
  loadingElement.style.display = "block";
  contentsElement.style.display = "none";
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTPエラー`);
    }
    const data = await response.json();
    // 各ポケモンデータを関数で
    displayPokemonDetail(data);
    loadingElement.style.display = "none";
    contentsElement.style.display = "block";
  } catch (error) {
    console.error("非同期エラー:", error.message);
  }
}
