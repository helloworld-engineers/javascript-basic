// 全体の件数を取得するエンドポイント
const API_URL = "https://pokeapi.co/api/v2/pokemon";

//検索
const inputedId = document.getElementById("pokemonId");
const srcBtn = document.getElementById("srcBtn");
const status = document.getElementById("status");

//情報
const nameE1 = document.getElementById("name");
const imgE1 = document.getElementById("pokeImg");
const idE1 = document.getElementById("pokeId");
const typesE1 = document.getElementById("types");
const heightE1 = document.getElementById("height");
const weightE1 = document.getElementById("weight");

//履歴
const historyE1 = document.getElementById("history");
const noHistoryText = document.getElementById("noHistory");

//一覧
const count = 1350;
const limit = 20;
let currentPage = 1;
const list = document.getElementById("list");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const pageText = document.getElementById("page");

//////////履歴//////////
//履歴取得
function getHistory() {
  return JSON.parse(localStorage.getItem("history")) || [];
}

//履歴保存
function saveHistory(item) {
  let history = getHistory();
  history.unshift(item);
  localStorage.setItem("history", JSON.stringify(history));
}

//履歴表示
function renderHistory() {
  const history = getHistory();

  historyE1.innerHTML = "";

  if (history.length === 0) {
    noHistoryText.style.display = "block";
    return;
  }
  noHistoryText.style.display = "none";

  history.forEach((h) => {
    const li = document.createElement("li");

    li.textContent = `ID: ${h.id} ${h.name}`;

    historyE1.appendChild(li);
  });
}
//////////////////////////////

//////////検索////////////////
//入力チェック
inputedId.addEventListener("input", () => {
  srcBtn.disabled = inputedId.value === "";
});

//基本と詳細情報取得及び表示
async function searchPokemon() {
  const id = inputedId.value;
  try {
    imgE1.style.display = "block";
    status.style.display = "block";
    status.textContent = "loading...";
    status.className = "loading";
    srcBtn.disabled = true;

    //要素取得
    const res = await fetch(`${API_URL}/${id}/`);
    if (!res.ok) throw new Error();
    const data = await res.json();

    //情報を表示
    nameE1.textContent = data.name;
    nameE1.style.fontSize = "20px"; // 単位の 'px' を追加
    nameE1.style.fontWeight = "bold"; // 文字を太くする
    nameE1.style.textTransform = "capitalize";
    idE1.textContent = `ID: ${data.id}`;
    imgE1.src = data.sprites.front_default;
    typesE1.textContent =
      "タイプ: " + data.types.map((typeInfo) => typeInfo.type.name).join(",");
    const height = data.height / 10;
    const weight = data.weight / 10;
    heightE1.textContent = "高さ: " + height + "m";
    weightE1.textContent = "重さ: " + weight + "kg";

    status.textContent = "SUCCESS!";

    saveHistory({
      id: data.id,
      name: data.name,
    });

    renderHistory();
  } catch (error) {
    // エラー表示
    status.textContent = `ID ${id} というポケモンは存在しません`;
  } finally {
    srcBtn.disabled = false;
    status.style.display = "none";
  }
}

//検索ボタンにてイベント実施
srcBtn.addEventListener("click", () => {
  searchPokemon();
});
//////////////////////////////

///////////////一覧//////////////
function renderList(pokemons) {
  list.innerHTML = "";

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
    list.appendChild(div);
  });
}

async function fetchList(page) {
  const offset = (page - 1) * limit;
  status.textContent = "loading...";
  status.className = "loading";

  //要素取得
  const res = await fetch(`${API_URL}?offset=${offset}&limit=${limit}`);
  if (!res.ok) throw new Error();
  const data = await res.json();

  const details = await Promise.all(
    data.results.map((pokemon) =>
      fetch(pokemon.url).then((item) => item.json()),
    ),
  );
  renderList(details);
  renderPageNumbers();
}
////////////////////////////////////

//////////ページネーション//////////
prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchList(currentPage);
  }
});

nextBtn.addEventListener("click", () => {
  if (currentPage <= Math.floor(count / limit)) {
    console.log(currentPage);
    currentPage++;
  }
  fetchList(currentPage);
});

function renderPageNumbers() {
  const totalPages = Math.ceil(count / limit);

  let pages = [];

  //...がいらない場合
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    if (currentPage > 3) pages.push("...");
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i);
      }
    }
    if (currentPage < totalPages - 2) pages.push("...");

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
