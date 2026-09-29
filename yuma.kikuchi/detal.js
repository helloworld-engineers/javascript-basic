// 全体の件数を取得するエンドポイント
const API_URL = `https://pokeapi.co/api/v2/pokemon`;

// 画像の取得
const IMAGE_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/{pokemonId}.png";

//非同期処理
async function getData() {
  try {
    const response = await fetch(`API_URL`);
    if (!response.ok) {
      // 失敗時、ここでエラーを投げる
      throw new Error(`HTTPエラー`);
    }
    // await: JSONの解析が完了するまで一時停止
    const data = await response.json();
    return data; // 結果を返す (この結果は外側のPromiseの resolve になる)
    // catch: 投げられたエラーを捕捉する
  } catch (error) {
    console.error(`非同期エラー:`, error.message);
    // return null; などのエラー後の処理
  }
}
