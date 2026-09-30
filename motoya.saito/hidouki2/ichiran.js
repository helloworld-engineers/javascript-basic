const loading = document.querySelector(".loading");
const LIMIT = 20;
// const totalPokemon = 1351;
const paginationContainer = document.getElementById("pagination");
let currentPage = 1;
const delta = 2;
const pokemonList = document.getElementById("pokemonList");
//描画した一覧画面を表示する関数
const renderPokemonList = (pokeData) => {
  pokeData.forEach((data) => {
    const li = document.createElement("li");
    const pokeUrl = document.createElement("a");
    const urlSpirit = data.url.split(`/`);
    const pokeID = urlSpirit[urlSpirit.length - 2];
    pokeUrl.textContent = `ID.${pokeID}${data.name}`;
    pokeUrl.href = `detail.html?ID=${pokeID}`;
    li.appendChild(pokeUrl);
    pokemonList.appendChild(li);
  });
};
//   const li = document.createElement("li");
//   const pokeUrl = document.createElement("a");
//   const urlSpirit = pokeData.url.split(`/`);
//   const pokeID = urlSpirit[urlSpirit.length - 2];
//   pokeUrl.textContent = `ID.${pokeID}${pokeData.name}`;
//   pokeUrl.href = `detail.html?ID=${pokeID}`;
//   li.appendChild(pokeUrl);
//   pokemonList.appendChild(li);
// };
//POKEAPIから情報取得、一覧表示
const getAPI = () => {
  loading.textContent = "Loading...";
  let offset = (currentPage - 1) * LIMIT;
  const API_URL = `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${offset}`;
  fetch(API_URL)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      const totalpokemon = data.count;
      const pokemonTable = data.results;
      const pageCount = Math.ceil(totalpokemon / LIMIT);
      loading.textContent = "";
      pokemonList.innerHTML = "";
      console.log();
      renderPokemonList(pokemonTable);
      // data.results.forEach((pokemon) => {
      //   renderPokemonList(pokemon);
      // });
      renderingPN(pageCount);
    });
};
getAPI();
//ページネーションの作成
const renderingPN = (totalPokemon) => {
  paginationContainer.innerHTML = "";
  let left = currentPage - delta;
  let right = currentPage + delta + 1;
  let isEllipsisRendered = false;
  for (let i = 1; i <= totalPokemon; i++) {
    const button = document.createElement(`button`);
    if (i === 1 || i === totalPokemon || (i >= left && i < right)) {
      isEllipsisRendered = false;
      button.textContent = i;
      button.addEventListener("click", () => {
        currentPage = i;
        getAPI();
      });
      paginationContainer.appendChild(button);
    } else if (!isEllipsisRendered) {
      const syouryaku = document.createElement("span");
      syouryaku.textContent = "...";
      paginationContainer.appendChild(syouryaku);
      isEllipsisRendered = true;
    }
  }
};
