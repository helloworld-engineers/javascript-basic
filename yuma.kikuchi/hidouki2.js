// 宣言一覧
const loading = document.getElementById("loading");
const mainContent = document.getElementById("main");
const LIMIT = 20;
let nowPage = 1;
function getApiUrl(page) {
  const offset = (page - 1) * LIMIT;
  return `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${offset}`;
}
// 非同期処理（async/await)
async function getData(page = 1) {
  loading.style.display = "block";
  mainContent.style.display = "none";
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
    loading.style.display = "none";
    mainContent.style.display = "block";
  }
}
// ポケモンを一覧に表示する
function displayData(pokemonList) {
  const container = document.getElementById("pokemon-card");
  if (!container) return;
  container.innerHTML = "";
  //リスト表示
  const listElement = document.createElement("ul");
  listElement.className = "pokemon-list";
  pokemonList.forEach((pokemon) => {
    const listItem = document.createElement("li");
    const link = document.createElement("a");
    link.href = `detal.html?name=${pokemon.name}`;
    link.textContent = pokemon.name;
    listItem.appendChild(link);
    listElement.appendChild(listItem);
  });
  container.appendChild(listElement);
}
// 表示すべきページ番号
const surroundingPages = 2;
function getPageNumbers(currentPage, totalPages) {
  // 重複のない値を格納するからのset objectを作成
  const pages = new Set();
  pages.add(1);
  pages.add(totalPages);
  // 現在ページの前後2ページを追加
  for (
    let i = currentPage - surroundingPages;
    i <= currentPage + surroundingPages;
    i++
  ) {
    if (i > 1 && i < totalPages) {
      pages.add(i);
    }
  }
  return Array.from(pages).sort((a, b) => a - b);
}
//ページを与える
function renderPageButtons(currentPage, totalPages) {
  const container = document.getElementById("page-numbers");
  if (!container) return;
  // インナーHTMLで返す
  container.innerHTML = "";
  //初期画面
  const pages = getPageNumbers(currentPage, totalPages);
  let prev = 0;
  pages.forEach((page) => {
    // ページ間が2以上は "..." を入れる
    if (prev && page - prev > 1) {
      const dots = document.createElement("span");
      dots.textContent = "...";
      container.appendChild(dots);
    }
    // 数字ボタン
    const btn = document.createElement("button");
    btn.textContent = page;
    btn.className = `page-num-btn ${page === currentPage ? "active" : ""}`;
    // 数字ボタンを押した時のイベント
    btn.addEventListener("click", () => {
      currentPage = page;
      getData(currentPage);
    });
    container.appendChild(btn);
    prev = page;
  });
}
// ボタン変数宣言
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
// ページネーション
function updatePagination(totalCount, page) {
  const totalPages = Math.ceil(totalCount / LIMIT);
  // 数字ボタンの更新
  renderPageButtons(page, totalPages);
  // 前へ・次へボタンの無効
  prevBtn.disabled = page === 1;
  nextBtn.disabled = page === totalPages;
}
// 「前へ」ボタンクリック
prevBtn.addEventListener("click", () => {
  if (nowPage > 1) {
    nowPage--;
    getData(nowPage);
  }
});
// 「次へ」ボタンクリック
nextBtn.addEventListener("click", () => {
  nowPage++;
  getData(nowPage);
});
getData(nowPage);
