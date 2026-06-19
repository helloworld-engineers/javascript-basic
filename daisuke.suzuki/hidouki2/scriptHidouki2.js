// 全体の件数を取得するエンドポイント
const API_URL = "https://pokeapi.co/api/v2/pokemon";

//検索
const inputIdEl = document.getElementById("inputId");
const searchBtnEl = document.getElementById("searchBtn");
const statusText = document.getElementById("status");

//情報
const nameEl = document.getElementById("pokemonName");
const imgEl = document.getElementById("pokemonImg");
const idEl = document.getElementById("pokemonId");
const typesEl = document.getElementById("pokemonTypes");
const heightEl = document.getElementById("pokemonHeight");
const weightEl = document.getElementById("pokemonWeight");

//履歴
const historyEl = document.getElementById("searchHistory");
const noHistoryText = document.getElementById("noHistory");

//一覧
let countAll = 0;
const limit = 20;
let currentPage = 1;
const maxVisiblePages = 5;
const SIDE_RANGE = 1; // 現在ページの左右に何個出すか
const EDGE_THRESHOLD = 2; // 省略(...)を出す境界
const listEl = document.getElementById("list");
const prevBtnEl = document.getElementById("prevBtn");
const nextBtnEl = document.getElementById("nextBtn");
const pageText = document.getElementById("page");

//////////履歴//////////
//履歴取得
function getHistory() {
  return JSON.parse(localStorage.getItem("history")) || [];
}

//履歴保存
function saveHistory(item) {
  let history = getHistory();
  if (!history.find((h) => h.id === item.id)) {
    history.unshift(item);
    localStorage.setItem("history", JSON.stringify(history));
  }
}

//履歴表示
function renderHistory() {
  const history = getHistory();

  if (history.length === 0) {
    noHistoryText.style.display = "block";
    return;
  }
  noHistoryText.style.display = "none";

  history.forEach((h) => {
    const li = document.createElement("li");

    li.textContent = `ID: ${h.id} ${h.name}`;

    historyEl.appendChild(li);
  });
}
//////////////////////////////

//////////検索////////////////
//入力チェック
inputIdEl.addEventListener("input", () => {
  searchBtnEl.disabled = inputIdEl.value === "";
});

//基本と詳細情報取得及び表示
async function searchPokemon() {
  const id = inputIdEl.value;
  try {
    imgEl.style.display = "block";
    statusText.style.display = "block";
    statusText.textContent = "loading...";
    statusText.className = "loading";
    searchBtnEl.disabled = true;

    //要素取得
    const res = await fetch(`${API_URL}/${id}/`);
    if (!res.ok) throw new Error();
    const data = await res.json();

    //情報を表示
    nameEl.textContent = data.name;
    idEl.textContent = `ID: ${data.id}`;
    imgEl.src = data.sprites.front_default;
    typesEl.textContent =
      "タイプ: " + data.types.map((typeInfo) => typeInfo.type.name).join(",");
    const height = data.height / 10;
    const weight = data.weight / 10;
    heightEl.textContent = "高さ: " + height + "m";
    weightEl.textContent = "重さ: " + weight + "kg";

    statusText.textContent = "SUCCESS!";

    saveHistory({
      id: data.id,
      name: data.name,
    });

    renderHistory();
  } catch (error) {
    // エラー表示
    statusText.textContent = `ID ${id} というポケモンは存在しません`;
  } finally {
    searchBtnEl.disabled = false;
  }
}

//検索ボタンにてイベント実施
searchBtnEl.addEventListener("click", () => {
  searchPokemon();
});
//////////////////////////////

///////////////一覧//////////////
function renderList(pokemons) {
  listEl.innerHTML = "";

  pokemons.forEach((p) => {
    const div = document.createElement("div");
    const types = p.types.map((t) => t.type.name).join(", ");

    div.className = "card List";

    div.innerHTML = `
      <img src="${p.sprites.front_default}" class="list-img">
      <div class="info">
        <p><strong>${p.name}</strong></p>
        <p>ID: ${p.id}</p>
        <p>タイプ: ${types}</p>
        <p>高さ: ${p.height / 10}m / 重さ: ${p.weight / 10}kg</p>
      </div>
    `;
    listEl.appendChild(div);
  });
}

async function fetchList(page) {
  const offset = (page - 1) * limit;
  statusText.textContent = "loading...";
  statusText.className = "loading";

  //要素取得
  const res = await fetch(`${API_URL}?offset=${offset}&limit=${limit}`);
  if (!res.ok) throw new Error();
  const data = await res.json();

  countAll = data.count;
  const details = await Promise.all(
    data.results.map((pokemon) =>
      fetch(pokemon.url).then((item) => item.json()),
    ),
  );
  renderList(details);
  renderPageNumbers();
  updateButtons();
}
////////////////////////////////////

//////////ページネーション//////////
function updateButtons() {
  const totalPages = Math.ceil(countAll / limit);

  prevBtnEl.disabled = currentPage === 1;
  nextBtnEl.disabled = currentPage === totalPages;
}

prevBtnEl.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
  }
  fetchList(currentPage);
});

nextBtnEl.addEventListener("click", () => {
  if (currentPage < Math.ceil(countAll / limit)) {
    currentPage++;
  }
  fetchList(currentPage);
});

function renderPageNumbers() {
  const totalPages = Math.ceil(countAll / limit);

  let pages = [];

  //...がいらない場合
  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    if (currentPage > EDGE_THRESHOLD + 1) pages.push("...");
    for (let i = currentPage - SIDE_RANGE; i <= currentPage + SIDE_RANGE; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i);
      }
    }
    if (currentPage < totalPages - EDGE_THRESHOLD) pages.push("...");

    pages.push(totalPages);
  }

  pageText.innerHTML = pages
    .map((p) => {
      if (p === "...") {
        return `<span class="dots">...</span>`;
      }

      if (p === currentPage) {
        return `<span class="page active">${p}</span>`;
      }

      return `<span class="page">${p}</span>`;
    })
    .join("");
}

//////////////////////////////////
//////////初期表示/////////////
renderHistory();
fetchList(currentPage);
