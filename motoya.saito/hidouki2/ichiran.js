const loading = document.querySelector(".loading");
const LIMIT = 20;
const totalPokemon = 1351;
const pageCount = Math.ceil(totalPokemon / LIMIT);
let currentPage = 1;
const delta = 2;
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
      loading.textContent = "";
      const pokemonList = document.getElementById("pokemonList");
      pokemonList.innerHTML = "";
      data.results.forEach((pokemon) => {
        const li = document.createElement("li");
        const pokeUrl = document.createElement("a");
        const urlSpirit = pokemon.url.split(`/`);
        const pokeID = urlSpirit[urlSpirit.length - 2];
        pokeUrl.textContent = `ID.${pokeID}${pokemon.name}`;
        pokeUrl.href = `detail.html?ID=${pokeID}`;
        li.appendChild(pokeUrl);
        pokemonList.appendChild(li);
      });
      renderingPN();
    });
};
getAPI();
//ページネーションの作成
const renderingPN = () => {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";
  let left = currentPage - delta;
  let right = currentPage + delta + 1;
  let isEllipsisRendered = false;
  for (let i = 1; i <= pageCount; i++) {
    const button = document.createElement(`button`);
    if (i === 1 || i === pageCount || (i >= left && i < right)) {
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
