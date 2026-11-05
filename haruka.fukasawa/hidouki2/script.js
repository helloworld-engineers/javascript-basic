// 共通
const API_URL = 'https://pokeapi.co/api/v2';
const LIMIT = 20; // 1ページあたりの表示件数

// fetch → ステータス確認 → JSON変換 までをまとめた共通関数
async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    const error = new Error(`HTTPエラー! ステータス: ${response.status}`);
    error.status = response.status; // 404判定などに使う
    throw error;
  }
  return response.json();
}

// ローディング表示の切り替え
function setLoading(el, isLoading) {
  el.style.display = isLoading ? 'block' : 'none';
}

// 一覧画面
let currentOffset = 0; // 現在の取得開始位置

const listView = document.getElementById('listView');
const pokemonListEl = document.getElementById('pokemonList');
const listLoadingEl = document.getElementById('listLoading');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageNumSpan = document.getElementById('pageNum');

// ポケモン一覧を取得して表示する
async function fetchPokemonList(offset) {
  // 現在のoffsetをセッションストレージに保存する（詳細から戻ったとき用）
  sessionStorage.setItem('pokemonOffset', offset);

  setLoading(listLoadingEl, true);
  pokemonListEl.innerHTML = '';

  try {
    const data = await fetchJson(`${API_URL}/pokemon?limit=${LIMIT}&offset=${offset}`);
    displayPokemonList(data.results);
    setupPagination(data.count, offset);
  } catch (error) {
    console.error('ポケモンの取得に失敗しました:', error);
    alert('ポケモンの取得に失敗しました。');
  } finally {
    setLoading(listLoadingEl, false);
  }
}

// ポケモン一覧を描画する
function displayPokemonList(pokemons) {
  pokemons.forEach(pokemon => {
    const list = document.createElement('li');
    const link = document.createElement('a');

    // 詳細も index.html で表示するので、クエリだけ付ける(詳細への切り替え ← ?name=)
    link.href = `index.html?name=${pokemon.name}`;
    link.textContent = pokemon.name;

    list.appendChild(link);
    pokemonListEl.appendChild(list);
  });
}

// ページネーションのボタン状態と番号を更新する
function setupPagination(totalCount, offset) {
  const currentPage = Math.floor(offset / LIMIT) + 1;
  const totalPages = Math.ceil(totalCount / LIMIT);

  pageNumSpan.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    // 現在ページの前後以外は「...」で省略
    if (i !== 1 && i !== totalPages && Math.abs(i - currentPage) > 4) {
      if (i === 5 || i === totalPages - 3) {
        const dot = document.createElement('span');
        dot.textContent = '...';
        dot.style.padding = '0 4px';
        pageNumSpan.appendChild(dot);
      }
      continue;
    }

    const pageBtn = document.createElement('button');
    pageBtn.textContent = i;
    pageBtn.className = 'pageLink';

    if (i === currentPage) {
      pageBtn.classList.add('current');
      pageBtn.disabled = true;
    } else {
      pageBtn.addEventListener('click', () => {
        currentOffset = (i - 1) * LIMIT;
        fetchPokemonList(currentOffset);
      });
    }
    pageNumSpan.appendChild(pageBtn);
  }

  prevBtn.className = 'pageLink prev';
  nextBtn.className = 'pageLink next';

  prevBtn.disabled = offset === 0;
  nextBtn.disabled = (offset + LIMIT) >= totalCount;
}

prevBtn.addEventListener('click', () => {
  if (currentOffset >= LIMIT) {
    currentOffset -= LIMIT;
    fetchPokemonList(currentOffset);
  }
});

nextBtn.addEventListener('click', () => {
  currentOffset += LIMIT;
  fetchPokemonList(currentOffset);
});

// 検索機能
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const searchLoadingEl = document.getElementById('searchLoading');
const errorMessageEl = document.getElementById('errorMessage');
const historyContainer = document.getElementById('historyContainer');

// 履歴データ（新しいものが先頭）
const searchHistory = [];

// 入力が空ならボタンを非活性にする
function updateSearchBtnState() {
  searchBtn.disabled = searchInput.value.trim() === '';
}

searchInput.addEventListener('input', updateSearchBtnState);

searchBtn.addEventListener('click', () => {
  const pokemonId = searchInput.value.trim();
  if (!pokemonId) return;

  errorMessageEl.textContent = '';
  searchPokemonById(pokemonId);
});

// 日本語名を取得する（取れなければ英名(fallbackName)を返す）
async function fetchJapaneseName(speciesUrl, fallbackName) {
  try {
    const species = await fetchJson(speciesUrl);
    const ja =
      species.names.find(n => n.language.name === 'ja-Hrkt') ??
      species.names.find(n => n.language.name === 'ja');
    return ja ? ja.name : fallbackName;
  } catch (error) {
    console.error('日本語名の取得に失敗しました:', error);
    return fallbackName;
  }
}

// IDでポケモンを検索する
async function searchPokemonById(id) {
  setLoading(searchLoadingEl, true);
  searchBtn.disabled = true;

  try {
    const data = await fetchJson(`${API_URL}/pokemon/${id}`);
    const name = await fetchJapaneseName(data.species.url, data.name);

    // 成功時のみ履歴の先頭に追加
    searchHistory.unshift({ id: data.id, name });
    renderHistory();

    searchInput.value = '';
  } catch (error) {
    // 存在しないID（404）の場合は履歴に反映しない
    if (error.status === 404) {
      errorMessageEl.textContent = `ID ${id} というポケモンは存在しません`;
    } else {
      console.error(error);
      errorMessageEl.textContent = 'データの取得に失敗しました。';
    }
  } finally {
    setLoading(searchLoadingEl, false);
    updateSearchBtnState(); // 入力状態に合わせてボタンを戻す
  }
}

// 履歴を描画する
function renderHistory() {
  historyContainer.innerHTML = '';

  // 履歴なしの場合は「履歴なし」を表示
  if (searchHistory.length === 0) {
    const noHistoryEl = document.createElement('div');
    noHistoryEl.className = 'noHistory';
    noHistoryEl.textContent = '履歴なし';
    historyContainer.appendChild(noHistoryEl);
    return;
  }

  searchHistory.forEach(item => {
    const itemEl = document.createElement('div');
    itemEl.className = 'historyItem';
    itemEl.textContent = `ID: ${item.id} ${item.name}`;
    historyContainer.appendChild(itemEl);
  });
}

// 詳細画面
const detailView = document.getElementById('detailView');
const detailLoadingEl = document.getElementById('detailLoading');

async function fetchPokemonDetail(name) {
  setLoading(detailLoadingEl, true);

  try {
    const data = await fetchJson(`${API_URL}/pokemon/${encodeURIComponent(name)}`);
    displayDetail(data);
  } catch (error) {
    console.error(error);
    alert('詳細情報の取得に失敗しました。');
  } finally {
    setLoading(detailLoadingEl, false);
  }
}

function displayDetail(data) {
  document.getElementById('pokemonTitle').textContent = data.name;
  document.getElementById('pokemonImage').src = data.sprites.front_default;
  document.getElementById('pokemonId').textContent = `ID: ${data.id}`;

  // 高さ・重さは10分の1で m / kg になる
  document.getElementById('pokemonHeight').textContent = `高さ: ${data.height / 10} m`;
  document.getElementById('pokemonWeight').textContent = `重さ: ${data.weight / 10} kg`;

  const types = data.types.map(t => t.type.name).join(', ');
  document.getElementById('pokemonTypes').textContent = `タイプ: ${types}`;
}


function init() {
  const pokemonName = new URLSearchParams(window.location.search).get('name');

  if (pokemonName) {
    listView.hidden = true;
    detailView.hidden = false;
    fetchPokemonDetail(pokemonName);
    return;
  }

  // 一覧画面に戻った際に、前回開いていたページを表示
  const savedOffset = sessionStorage.getItem('pokemonOffset');
  currentOffset = savedOffset !== null ? parseInt(savedOffset, 10) : 0;

  fetchPokemonList(currentOffset);
  renderHistory(); // 初期表示は「履歴なし」
}

init();