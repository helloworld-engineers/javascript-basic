//ポケモン詳細ブロック要素の取得
const pokemonDetail = document.getElementById("pokemonDetail");
// ページボタンの要素取得
const pageNum = document.getElementById("pageNum");
const beforeButton = document.getElementById("beforeBtn");
const nextButton = document.getElementById("nextBtn");

//検索欄要素の取得
const searchId = document.getElementById("searchId");
const searchBtn = document.getElementById("searchBtn");
const searchLoading = document.getElementById("searchLoading");
const errorMessage = document.getElementById("errorMsg");
const searchLog = document.getElementById("searchLog");

//読み込み中…のテキスト要素
const loadingText = document.getElementById("loadingText");

// 全体の件数を取得するエンドポイント
const API_URL = `https://pokeapi.co/api/v2/pokemon`;

//1回で取得する件数
const LIMIT = 20;
//現在のページ(初期値=1)
let currentPage = 1;
//開始位置(初期値offset=0)
let offset = 0;
//総ページ数(getPageCountで取得後に更新される)
let totalPageCount = 0;

//常に表示する先頭ページ番号
const FIRST_PAGE = 1;
//先頭付近とみなす境界のページ数
const EDGE_PAGE_THRESHOLD = 7;
//現在ページの前後に表示するページ数
const PAGE_DISPLAY_RANGE = 5;
//高さ(dm)をm表記に変換する際、小数第1位まで保持するための係数
const HEIGHT_ROUND_FACTOR = 10;
//高さの単位をdmからmに変換する係数
const HEIGHT_UNIT_DIVISOR = 100;
//重さの単位をhgからkgに変換する係数
const WEIGHT_UNIT_DIVISOR = 10;

//エラーメッセージの文字色
const ERROR_COLOR = "#f11414";
//現在のページボタンの背景色
const CURRENT_PAGE_COLOR = "#ABE1FA";

//総数1351÷20=68ページを算出
const getPageCount = async (offset) => {
  const response = await fetch(API_URL + `?offset=${offset}`);
  const allData = await response.json();
  const count = allData.count;
  const pageCount = Math.ceil(count / LIMIT);
  return pageCount;
};

//非活性の...ボタンを作成する関数
const createEllipsis = () => {
  const pageBtn = document.createElement("button");
  pageBtn.type = "button";
  pageBtn.textContent = "...";
  pageBtn.disabled = true;
  pageNum.appendChild(pageBtn);
};

//ページングの表示条件をチェックする関数
const createButtons = async (currentPage) => {
  const pageCount = await getPageCount(offset);
  totalPageCount = pageCount;
  pageNum.innerHTML = "";
  if (currentPage <= EDGE_PAGE_THRESHOLD) {
    createButton(FIRST_PAGE);
    reloadCardList(FIRST_PAGE);
    for (let i = FIRST_PAGE + 1; i <= currentPage + PAGE_DISPLAY_RANGE; i++) {
      createButton(i);
      reloadCardList(i);
    }
    createEllipsis();
    createButton(pageCount);
    reloadCardList(pageCount);
    return;
  }
  if (
    EDGE_PAGE_THRESHOLD + 1 <= currentPage &&
    currentPage <= pageCount - PAGE_DISPLAY_RANGE - 1
  ) {
    createButton(FIRST_PAGE);
    reloadCardList(FIRST_PAGE);
    createEllipsis();
    for (
      let i = currentPage - PAGE_DISPLAY_RANGE;
      i <= currentPage + PAGE_DISPLAY_RANGE;
      i++
    ) {
      createButton(i);
      reloadCardList(i);
    }
    createEllipsis();
    createButton(pageCount);
    reloadCardList(pageCount);
    return;
  }
  if (pageCount - PAGE_DISPLAY_RANGE - 1 <= currentPage) {
    createButton(FIRST_PAGE);
    reloadCardList(FIRST_PAGE);
    createEllipsis();
    for (let i = currentPage - PAGE_DISPLAY_RANGE; i <= pageCount; i++) {
      createButton(i);
      reloadCardList(i);
    }
  }
};

//ページ数をクラス名にしたボタンを1つ作成する関数
const createButton = (i) => {
  const pageBtn = document.createElement("button");
  pageBtn.type = "button";
  pageBtn.classList.add(`page${i}`);
  pageBtn.textContent = i;
  pageNum.appendChild(pageBtn);
  if (i === currentPage) {
    pageBtn.style.backgroundColor = CURRENT_PAGE_COLOR;
  }
};

//ページボタンをクリックした際に現在地を引数にカードリストを更新する関数
const reloadCardList = (i) => {
  const page = document.querySelector(`.page${i}`);
  page.addEventListener("click", () => {
    currentPage = i;
    offset = (currentPage - 1) * LIMIT;
    createCardList();
    createButtons(currentPage);
  });
};

//ポケモン20匹のデータを取得する
const getDataAll = async (offset) => {
  loadingText.textContent = "読み込み中…";
  loadingText.classList.remove("hide");
  const response = await fetch(API_URL + `?offset=${offset}`);
  const allData = await response.json();
  return allData;
};

//1匹の詳細情報を取得するasync関数
const getPokemonDetail = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("HTTPエラー");
  }
  return await response.json();
};

//全体のデータ取得＋詳細情報取得を実行しリスト化する関数
const getPokemonList = async () => {
  try {
    const allData = await getDataAll(offset);
    const pokemonList = await Promise.all(
      allData.results.map((pokemon) => {
        return getPokemonDetail(pokemon.url);
      }),
    );
    return pokemonList;
  } finally {
    loadingText.classList.add("hide");
  }
};

//pokemonList(1匹の情報群)から必要な詳細だけをリスト化する関数
const createDetailList = (pokemondetail) => {
  const pokemonImage = pokemondetail.sprites.front_default;
  const pokemonName = pokemondetail.name;
  const pokemonId = pokemondetail.id;
  const pokemonType = pokemondetail.types
    .map((types) => types.type.name)
    .join("+");
  const pokemonHeight = pokemondetail.height;
  const pokemonWeight = pokemondetail.weight;

  let infoList = [
    pokemonImage,
    `${pokemonName}`,
    `id：${pokemonId}`,
    `タイプ：${pokemonType}`,
    `高さ：${Math.floor(pokemonHeight * HEIGHT_ROUND_FACTOR) / HEIGHT_UNIT_DIVISOR}m`,
    `重さ：${pokemonWeight / WEIGHT_UNIT_DIVISOR}kg`,
  ];
  return infoList;
};

//1匹のカードを作成する関数
const createCard = (area, array, isSearched) => {
  //Detailカードの大枠
  const cardBox = document.createElement("div");
  cardBox.classList.add("cardBox");
  if (isSearched) {
    area.prepend(cardBox);
  }
  if (!isSearched) {
    area.appendChild(cardBox);
  }
  //画像枠の追加(大枠直下)
  const imageCard = document.createElement("div");
  imageCard.classList.add("imageCard");
  cardBox.appendChild(imageCard);
  //画像の追加
  const detailImage = document.createElement("img");
  detailImage.src = array[0];
  imageCard.appendChild(detailImage);
  //情報枠の追加(大枠直下)
  const InfoCard = document.createElement("div");
  InfoCard.classList.add("infoCard");
  cardBox.appendChild(InfoCard);
  //情報の追加(5要素分)
  for (let j = 1; j <= array.length - 1; j++) {
    const detailText = document.createElement("p");
    detailText.textContent = array[j];
    InfoCard.appendChild(detailText);
  }
};

//APIでデータを取得、リストoffset分のループでカードを作成
const createCardList = async () => {
  pokemonDetail.innerHTML = "";
  const pokemonList = await getPokemonList();
  for (let i = 0; i <= pokemonList.length - 1; i++) {
    createCard(pokemonDetail, createDetailList(pokemonList[i]), false);
  }
};

//検索テキストBOXに入力されていないとき非活性(初期値=true)
searchBtn.disabled = true;
searchId.addEventListener("input", () => {
  searchBtn.disabled = searchId.value.trim() === "";
});
//検索ボタンをクリックしたときにapi取得をして履歴欄にカードを追加
searchBtn.addEventListener("click", async () => {
  errorMessage.textContent = "";
  searchLoading.classList.remove("hide");
  const id = searchId.value.trim();

  if (!id) {
    searchLoading.classList.add("hide");
    errorMessage.textContent = "idを入力してください";
    errorMessage.style.color = ERROR_COLOR;
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error("id not found");
    }
    const data = await response.json();
    createCard(searchLog, createDetailList(data), true);
  } catch (error) {
    errorMessage.textContent = "そのidは存在しません";
    errorMessage.style.color = ERROR_COLOR;
  } finally {
    searchId.value = "";
    searchLoading.classList.add("hide");
    searchBtn.disabled = true;
  }
});

//前へボタンのイベント処理
beforeButton.addEventListener("click", () => {
  if (currentPage !== 1) {
    currentPage = currentPage - 1;
    offset = (currentPage - 1) * LIMIT;
    createCardList();
    createButtons(currentPage);
  }
});

//次へボタンのイベント処理
nextButton.addEventListener("click", () => {
  if (currentPage !== totalPageCount) {
    currentPage = currentPage + 1;
    offset = (currentPage - 1) * LIMIT;
    createCardList();
    createButtons(currentPage);
  }
});

//初期実行
window.onload = async () => {
  createButtons(currentPage);
  createCardList();
};
