const API_URL = 'https://dog.ceo/api/breeds/image/random';

// HTMLの要素を取得
const dogImage = document.getElementById('dogImage');
const fetchBtn = document.getElementById('fetchBtn');
const loadingEl = document.getElementById('loading');

// 画像を取得して表示する関数
function fetchDogImage() {
  // loadingEl が存在する場合のみ表示を切り替える（エラー防止）
  if (loadingEl) loadingEl.style.display = 'block';

  fetch(API_URL)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTPエラー! ステータス: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      dogImage.src = data.message;
    })
    .catch(error => {
      console.error('画像の取得に失敗しました:', error);
      alert('画像の取得に失敗しました。');
    })
    // finallyを使い、成功・失敗どちらでもローディングを消す
    .finally(() => {
      if (loadingEl) loadingEl.style.display = 'none';
    });
}

// ページが読み込まれた時に最初の画像を取得
fetchDogImage();

// ボタンがクリックされた時にも新しい画像を取得
fetchBtn.addEventListener('click', fetchDogImage);