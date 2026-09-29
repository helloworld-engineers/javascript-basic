const IMAGE_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/{pokemonId}.png";
const loading = document.getElementById("loading");
const mainContent = document.querySelectorAll(".contents");
const LIMIT = 1;
function getApiUrl(page) {
  const offset = (page - 1) * LIMIT;
  return `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${offset}`;
}
// 非同期処理（async/await)
async function getData(page) {
  // loading.style.display = "block";
  // mainContent.style.display = "none";
  // try...catch（外側のcatchで一元的に捕捉）
  try {
    const response = await fetch(getApiUrl(page));
    if (!response.ok) {
      throw new Error(`HTTPエラー`);
    }
    const data = await response.json();
    // ポケモン一覧を表示
    displayData(data.results);
    updatePagination(data.count, page);
  } catch (error) {
    console.error(`非同期エラー:`, error.message);
  } finally {
    // loading.style.display = "none";
    // mainContent.style.display = "block";
  }
}
// APIを表示する
function displayPokemonData(data) {
  // name
  document.getElementById("pokemon-name").textContent = data.name;
  // ID
  document.getElementById("pokemon-id").textContent = `ID: ${data.id}`;
  // 画像
  document.getElementById("pokemon-image").src = data.sprites.front_default;
}
