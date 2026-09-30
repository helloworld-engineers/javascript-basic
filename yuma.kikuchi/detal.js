//変数宣言
const loadingElement = document.getElementById("loading");
const contentsElement = document.querySelector(".contents");
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const idPoke = urlParams.get("id");
const API_URL = `https://pokeapi.co/api/v2/pokemon/${idPoke}/`;
const JP_HEIGHT = 10;
const JP_WEIGHT = 10;
const message = document.getElementById("message");
// HTMLに導入するための変数
const pokeName = document.getElementById("pokemon-name");
const pokeId = document.getElementById("pokemon-id");
const pokeImg = document.getElementById("pokemon-image");
const pokeTypes = document.getElementById("pokemon-types");
const pokeHeight = document.getElementById("pokemon-height");
const pokeWeight = document.getElementById("pokemon-weight");
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
    message.textContent = error.message;
  }
}
function displayPokemonDetail(data) {
  pokeName.textContent = data.name;
  pokeId.textContent = "ID: " + data.id;
  pokeImg.src = data.sprites.front_default;
  for (let i = 0; i < data.types.length; i++) {
    const typeListItem = document.createElement("li");
    typeListItem.textContent = data.types[i].type.name;
    pokeTypes.appendChild(typeListItem);
  }
  // kg,mにするために割る10
  pokeHeight.textContent = `${data.height / JP_HEIGHT} m`;
  pokeWeight.textContent = `${data.weight / JP_WEIGHT} kg`;
}
getPokemonDetail();
