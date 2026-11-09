// 初期設定
const ENCOUNTER_RATE = 0.4;     // エンカウント率 40%
const ESCAPE_RATE = 0.5;        // 逃げる成功率 50%
const FIRST_LEVEL_UP_EXP = 30;  // 最初のレベルアップに必要な経験値
const ADD_LEVEL_UP_EXP = 10;    // レベルが1上がるごとに増える必要経験値
const LEVEL_UP_BONUS = 20;      // レベルアップ時の HP・攻撃力の上昇値
const MESSAGE_DELAY = 500;      // ログの表示間隔（0.5秒）

// マップの端
const MAP_MIN = 0;
const MAP_MAX = 9;

// 主人公の画像
const MEMBER_IMAGE = [
  {id: 1, image: './images/hero.png'},
];

// 初期データ

// パーティーメンバーのデータ
const member = {
  name: '勇者',
  id: 1,
  hp: 100,
  maxHp: 100,  // HP全回復のときに使う
  attack: 10,
  level: 1,
  exp: 0,
  x: 5,  // 初期位置（村）
  y: 5,
};

// モンスターのデータ（マスタデータ：書き換えない）
const MONSTERS = [
  { name: 'スライム', id: 1, hp: 20, attack: 10, exp: 10, image: './images/slime.png' },
  { name: 'ドラゴン', id: 2, hp: 40, attack: 20, exp: 15, image: './images/doragon.png' },
  { name: 'メタルスライム', id: 3, hp: 20, attack: 10, exp: 30, image: './images/metal_slime.png' },
];

// エリアのデータ
const AREAS = [
  { name: '村', id: 1, image: './images/village.png' },
  { name: '草原', id: 2, image: './images/grassland.png' },
  { name: '砂漠', id: 3, image: './images/sand.png' },
  { name: '火山', id: 4, image: './images/volcano.png' },
  { name: '海', id: 5, image: './images/sea.png' },
];

// ゲームの状態
let mode = 'field';          // 'field'（移動中） / 'battle'（戦闘中） / 'gameover'
let isInactive = false;      // ログ表示中は操作を受け付けない
let currentMonster = null;   // 戦闘中のモンスター（マスタデータのコピー）
let currentAreaId = 0;       // 今いるエリアの id（0 はまだどこにもいない状態）

// HTMLの要素取得
const screen = document.getElementById('screen');
const hpText = document.getElementById('hp');
const attackText = document.getElementById('attack');
const levelText = document.getElementById('level');
const memberImg = document.getElementById('member-img');
const monsterImg = document.getElementById('monster-img');
const gameoverImg = document.getElementById('gameover-img');
const arrowUp = document.getElementById('arrow-up');
const arrowDown = document.getElementById('arrow-down');
const arrowLeft = document.getElementById('arrow-left');
const arrowRight = document.getElementById('arrow-right');
const arrows = document.querySelectorAll('.arrow');
const commands = document.getElementById('commands');
const fightBtn = document.getElementById('fight-btn');
const escapeBtn = document.getElementById('escape-btn');
const logArea = document.getElementById('log');

// 共通の関数

// id が一致するデータを配列から探して返す（エリアにもモンスターにも使える）
function findById(list, id) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      return list[i];
    }
  }
}

// 画面を表示する関数

// 左上のステータスを更新する
function updateStatus(member) {
  hpText.textContent = member.hp;
  attackText.textContent = member.attack;
  levelText.textContent = member.level;
}

// ゲーム開始時の画面を表示する
function initGame() {
  memberImg.src = MEMBER_IMAGE[0].image;
  updateStatus(member);
  updateStage();
  setMode('field');  // 戦う・逃げるボタンと GAME OVER 画像を隠し、方向キーを活性にする
}

// ログを更新する関数

// 指定した時間だけ待つ
function wait(ms) {
  return new Promise(function (resolve) {  // resolve = 押すと完了になるボタン
    setTimeout(resolve, ms);               // ms 後にボタンを押すよう予約
  });                                      // 「待ち」の Promise を返す
}

// ログに1行追加する（新しい文章が上）
function log(message) {
  const p = document.createElement('p');
  p.textContent = message;
  logArea.prepend(p);    // 一番上に追加
  logArea.scrollTop = 0; // 一番上までスクロール
}

// ログを表示して少し待つ（戦闘用）
async function say(message) {
  log(message);
  await wait(MESSAGE_DELAY);
}

// 現在のエリアを判定する関数

// 座標から現在いるエリアの id を判定する
function getAreaId(x, y) {
  if (x === 5 && y === 5) {
    return 1;  // 村（X:5 / Y:5 の1マスだけ）
  } else if (x <= 4 && y <= 5) {
    return 2;  // 草原（左下）
  } else if (x >= 5 && y <= 5) {
    return 3;  // 砂漠（右下）
  } else if (x >= 5 && y >= 6) {
    return 4;  // 火山（右上）
  } else {
    return 5;  // 海（左上）
  }
}

// 現在地に合わせて背景を切り替える
function updateStage() {
  const areaId = getAreaId(member.x, member.y);

  // エリアが変わった時だけ処理する
  if (areaId !== currentAreaId) {
    const area = findById(AREAS, areaId);  // id でエリアのデータを取り出す

    // 最初の表示の時はログを出さない
    if (currentAreaId !== 0) {
      log(area.name + 'に入った。');
    }
    screen.style.backgroundImage = `url(${area.image})`;
    currentAreaId = areaId;
  }
}

// 画面を切り替える関数

// 移動画面 / 戦闘画面 / GAME OVER画面を切り替える
function setMode(newMode) {
  mode = newMode;

  if (mode === 'field') {
    // 移動中：主人公を表示、方向キーは活性
    memberImg.hidden = false;
    monsterImg.hidden = true;
    gameoverImg.hidden = true;
    commands.hidden = true;
    updateArrows();
  } else if (mode === 'battle') {
    // 戦闘中：モンスターを表示、方向キーは非活性
    memberImg.hidden = true;
    monsterImg.hidden = false;
    gameoverImg.hidden = true;
    commands.hidden = false;
    setArrowsDisabled(true);
  } else if (mode === 'gameover') {
    // GAME OVER：GAME OVER画像だけ表示、ボタンは全て非活性
    memberImg.hidden = true;
    monsterImg.hidden = true;
    gameoverImg.hidden = false;
    commands.hidden = true;
    setArrowsDisabled(true);
    fightBtn.disabled = true;
    escapeBtn.disabled = true;
  }
}

// ログ表示中に戦う・逃げるボタンを非活性
function setInactive(inactive) {
  isInactive = inactive;
  fightBtn.disabled = inactive;
  escapeBtn.disabled = inactive;
}

// 戦闘画面に移る（出現するモンスターは引数でもらう）
async function startBattle(monster) {
  currentMonster = monster;  // 戦闘中のモンスターとして保存
  monsterImg.src = currentMonster.image;
  monsterImg.alt = currentMonster.name;

  if (!monster) throw new Error('モンスターが存在しません')
    setMode('battle');
    setInactive(true);
    await say(currentMonster.name + 'が現れた。');
    setInactive(false);
}

// 移動画面に戻る
function endBattle() {
  currentMonster = null;
  setMode('field');  // HPは戦闘時のまま。方向キーは updateArrows() で設定される
}

// 移動処理関数

// 方向キーを全部まとめて活性/非活性にする
function setArrowsDisabled(disabled) {
  for (let i = 0; i < arrows.length; i++) {
    arrows[i].disabled = disabled;
  }
}

// マップの端で、その方向の方向キーを非活性にする
function updateArrows() {
  arrowRight.disabled = member.x === MAP_MAX;
  arrowLeft.disabled = member.x === MAP_MIN;
  arrowUp.disabled = member.y === MAP_MAX;
  arrowDown.disabled = member.y === MAP_MIN;
}

// X / Y 座標で移動する
async function move(direction) {
  // 戦闘中・ログ表示中は動かない
  if (mode !== 'field' || isInactive) {
    return;
  }

  // 移動後の座標を計算する
  let nextX = member.x;
  let nextY = member.y;

  if (direction === '右') {
    nextX = nextX + 1;
  } else if (direction === '左') {
    nextX = nextX - 1;
  } else if (direction === '上') {
    nextY = nextY + 1;
  } else if (direction === '下') {
    nextY = nextY - 1;
  }

  // マップの外には出られない
  if (nextX < MAP_MIN || nextX > MAP_MAX || nextY < MAP_MIN || nextY > MAP_MAX) {
    return;
  }

  // 座標を更新する
  member.x = nextX;
  member.y = nextY;
  log(direction + '方向に進みました。');

  updateStage();
  updateArrows();

  // モンスターが出現するか判定する
  if (encounterCheck()) {
    const monster = pickMonster();  // 出現するモンスターを決める
    await startBattle(monster);     // そのモンスターで戦闘開始
  }
}

// エンカウント関数

// モンスターが出現するか決める（40%）
function encounterCheck() {
  return Math.random() < ENCOUNTER_RATE;
}

// モンスターのデータのコピーを作る
function copyMonster(masterMonster) {
  return {
    name: masterMonster.name,
    id: masterMonster.id,
    hp: masterMonster.hp,
    attack: masterMonster.attack,
    exp: masterMonster.exp,
    image: masterMonster.image,
  };
}

// 出現するモンスターを決める
// スライム(id:1) 65% / ドラゴン(id:2) 25% / メタルスライム(id:3) 10%
function pickMonster() {
  const random = Math.random() * 100;
  let monsterId;

  if (random < 65) {
    monsterId = 1;
  } else if (random < 90) {
    monsterId = 2;
  } else {
    monsterId = 3;
  }

  // id でマスタデータを取り出し、壊れないようにコピーを作って返す
  return copyMonster(findById(MONSTERS, monsterId));
}

// バトル関数

// 攻撃を受けた後のHPを計算する（受ける側のHP − 攻撃する側の攻撃力）
function calculateHP(hp, attack) {
  let result = hp - attack;
  if (result < 0) {
    result = 0;
  }
  return result;
}

// 生死判定をする
function isDie(hp) {
  return hp <= 0;
}

// 逃げられるか判定する（50%）
function isEscape() {
  return Math.random() < ESCAPE_RATE;
}

// 主人公が攻撃する
async function memberAttack() {
  currentMonster.hp = calculateHP(currentMonster.hp, member.attack);
  await say(member.name + 'の攻撃！' + currentMonster.name + 'に' + member.attack + 'ポイントのダメージを与えた。');
}

// モンスターが攻撃する
async function monsterAttack() {
  member.hp = calculateHP(member.hp, currentMonster.attack);
  updateStatus(member);  // 左上のHPを減らす
  await say(currentMonster.name + 'の攻撃！' + member.name + 'は' + currentMonster.attack + 'ポイントのダメージを受けた。');

  if (isDie(member.hp)) {
    await gameOver();
  }
}

// 戦うボタンを押した時（1ターン1攻撃、先攻は主人公）
async function fight() {
  if (mode !== 'battle' || isInactive) {
    return;
  }
  setInactive(true);

  await memberAttack();

  if (isDie(currentMonster.hp)) {
    await winBattle();
  } else {
    await monsterAttack();
  }

  // ゲームオーバーの時はボタンを非活性のままにする
  if (mode !== 'gameover') {
    setInactive(false);
  }
}

// 逃げるボタンを押した時（50%で成功、失敗したらモンスターの攻撃）
async function escape() {
  if (mode !== 'battle' || isInactive) {
    return;
  }
  setInactive(true);

  await say(member.name + 'は逃げ出した。');

  if (isEscape()) {
    await say('うまく逃げ切れた。');
    endBattle();
  } else {
    await say('しかし、回り込まれてしまった！');
    await monsterAttack();
  }

  if (mode !== 'gameover') {
    setInactive(false);
  }
}

// モンスターを倒した時
async function winBattle() {
  await say(currentMonster.name + 'を倒した。');

  member.exp = member.exp + currentMonster.exp;
  await say('経験値を' + currentMonster.exp + 'ポイント獲得した。');

  await checkLevelUp(member);
  endBattle();
}

// 全滅した時
async function gameOver() {
  await say('全滅しました。');
  setMode('gameover');
}

// レベルアップ関数

// 次のレベルアップに必要な経験値を計算する
// レベル1 → 30、レベル2 → 40、レベル3 → 50 ...
function getNextLevelExp(member) {
  return FIRST_LEVEL_UP_EXP + (member.level - 1) * ADD_LEVEL_UP_EXP;
}

// レベルアップするか判定する
async function checkLevelUp(member) {
  // 必要な経験値に届かなくなるまで繰り返す
  while (member.exp >= getNextLevelExp(member)) {
    member.exp = member.exp - getNextLevelExp(member);  // 余ったポイントは持ち越す
    member.level = member.level + 1;
    member.maxHp = member.maxHp + LEVEL_UP_BONUS;
    member.attack = member.attack + LEVEL_UP_BONUS;
    member.hp = member.maxHp;  // HP全回復
    updateStatus(member);

    await say('レベルが1上がった。');
    await say('HP / 攻撃力が' + LEVEL_UP_BONUS + 'アップした。');
    await say('HPが全回復した。');
  }
}

// イベント処理
for (let i = 0; i < arrows.length; i++) {
  arrows[i].addEventListener('click', function () {
    move(arrows[i].dataset.direction);
  });
}

fightBtn.addEventListener('click', fight);
escapeBtn.addEventListener('click', escape);

// ページを開いた最初の1回だけ実行(リロード時も同様)
initGame();