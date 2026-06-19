const newNext = document.getElementById("next");
const newPageNum = document.getElementById("pageNum");
const newPokemonData = document.getElementById("pokemonData");
const newPrevious = document.getElementById("previous");
const searchBtn = document.getElementById("search");
const inputText = document.getElementById("inputId");
const newPokemonSearch = document.getElementById("pokemonSearch");
const newSearchError = document.getElementById("searchError");
const newSearchHistory = document.getElementById("searchHistory");
const searchLoading = document.getElementById("searchLoading");
const API_URL = `https://pokeapi.co/api/v2/pokemon`;

// 全体の件数を取得するエンドポイント
let offset = 0;
let limit = 20;
let currentPage = 1;
let pageMax = 0;

// ページネーションを表示する関数
async function pagenation(offset, limit) {
  try {
    newPokemonData.textContent = "ローディング中";
    const response = await fetch(`${API_URL}?offset=${offset}&limit=${limit}`);
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }
    const result = await response.json();
    const total = result.count;
    pageMax = Math.ceil(total / limit);
    let range = [];
    for (let i = 1; i <= pageMax; i++) {
      if (
        i === 1 ||
        i === pageMax ||
        i === currentPage ||
        i === currentPage - 1 ||
        i === currentPage + 1
      ) {
        range.push(i);
      } else if (range[range.length - 1] !== "...") {
        range.push("...");
      }
    }
    // ページの作成
    newPageNum.innerHTML = "";
    for (let i = 0; i < range.length; i++) {
      const newPage = document.createElement("div");
      newPage.textContent = `${range[i]}`;
      newPage.style.border = "1px solid #000000";
      newPage.style.padding = "10px";
      newPageNum.appendChild(newPage);
    }
    // １回目のfetchの配列の中の要素分ループ
    const data = result.results;
    let pokeData = [];
    for (let i = 0; i < data.length; i++) {
      // pokeAPIの中のURLをfetch
      const url = data[i].url;
      const responseData = await fetch(url);
      if (!responseData.ok) {
        throw new Error("Failed to fetch");
      }
      //pokeAPIのurlからポケモンの情報を取得
      const resultData = await responseData.json();
      const pokemonImage = resultData.sprites.front_default;
      const pokemonName = resultData.name;
      const pokemonHeight = resultData.height;
      const pokeWight = resultData.weight;
      const pokeId = resultData.id;
      const pokeType = resultData.types;
      const dataBase = {
        id: pokeId,
        name: pokemonName,
        weight: pokeWight,
        types: pokeType,
        height: pokemonHeight,
        image: pokemonImage,
      };
      pokeData.push(dataBase);
    }

    // ポケモンのイメージ画像を出力する
    newPokemonData.innerHTML = "";
    for (let i = 0; i < pokeData.length; i++) {
      const createImage = document.createElement("img");
      createImage.src = pokeData[i].image;

      const createData = document.createElement("div");
      createData.style.display = "flex";
      createData.style.backgroundColor = "#f8f8f8";

      const createStatus = document.createElement("div");
      createStatus.style.display = "flex";
      createStatus.style.flexDirection = "column";

      const createName = document.createElement("div");
      const createHeightWeight = document.createElement("div");
      const createId = document.createElement("div");
      const createType = document.createElement("div");

      // 配列で受け取ったタイプの処理
      let typesArray = [];
      for (let j = 0; j < pokeData[i].types.length; j++) {
        const typeName = pokeData[i].types[j].type.name;
        typesArray.push(typeName);
      }

      createName.textContent = pokeData[i].name;
      createHeightWeight.textContent = `高さ: ${pokeData[i].height}/重さ: ${pokeData[i].weight}kg`;
      createId.textContent = `ID: ${pokeData[i].id}`;
      createType.textContent = `タイプ: ${typesArray.join(", ")}`;

      newPokemonData.appendChild(createData);
      createData.appendChild(createImage);
      createData.appendChild(createStatus);
      createStatus.appendChild(createName);
      createStatus.appendChild(createId);
      createStatus.appendChild(createType);
      createStatus.appendChild(createHeightWeight);
    }
  } catch (error) {
    newPokemonData.innerHTML = "<p>ポケモンの取得に失敗しました</p>";
  }
}
pagenation(offset, limit);

// 次へボタンを押した時の処理
newNext.addEventListener("click", () => {
  if (currentPage === pageMax) {
    return;
  }
  offset += 20;
  currentPage++;
  pagenation(offset, limit);
});

// 前へボタンを押した時の処理
newPrevious.addEventListener("click", () => {
  if (currentPage === 1) {
    return;
  }
  offset -= 20;
  currentPage--;
  pagenation(offset, limit);
});

// 検索ボタンを押した時の処理
let pokemonHistory = [];
searchBtn.addEventListener("click", () => {
  const searchId = inputText.value;
  const searchResult = `${API_URL}/${searchId}/`;
  newSearchError.innerHTML = "";
  if (searchId === "") {
    return;
  }
  async function pokemonSearch() {
    try {
      searchLoading.textContent = "検索中...";
      newSearchError.textContent = "";
      const searchResponse = await fetch(searchResult);
      if (!searchResponse.ok) {
        throw new Error("Failed to fetch");
      }
      const search = await searchResponse.json();
      const result = {
        id: search.id,
        name: search.name,
      };
      pokemonHistory.unshift(result);
      newSearchHistory.innerHTML = "";
      pokemonHistory.forEach((pokemon) => {
        const resultHistory = document.createElement("div");
        resultHistory.textContent = `ID: ${pokemon.id} ${pokemon.name}`;
        newSearchHistory.appendChild(resultHistory);
      });
    } catch (error) {
      newSearchError.textContent = `ID: ${searchId} というポケモンは存在しません`;
    } finally {
      searchLoading.textContent = "";
    }
  }
  pokemonSearch();
});
