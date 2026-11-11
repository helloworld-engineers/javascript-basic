// 定数 / 変数をまとめたファイル
// HTMLに先に読み込ませる

// 初期設定(定数)
const ENCOUNTER_RATE = 0.4;     // エンカウント率 40%
const ESCAPE_RATE = 0.5;        // 逃げる成功率 50%
const FIRST_LEVEL_UP_EXP = 30;  // 最初のレベルアップに必要な経験値
const ADD_LEVEL_UP_EXP = 10;    // レベルアップごとに増える必要経験値
const LEVEL_UP_BONUS = 20;      // ステータス上昇値
const MESSAGE_DELAY = 500;      // ログ表示間隔
const JOIN_LEVEL = 3.           // 勇者レベル3になったら戦士追加

const MAP_MIN = 0;
const MAP_MAX = 9;

const partyMembersData = [
  {
    name: '勇者',
    id: 1,
    hp: 100,
    maxHp: 100,
    attack: 10,
    level: 1,
    exp: 0,
    image: './images/hero.png',
  },
  {
    name: '戦士',
    id: 2,
    hp: 80,
    maxHp: 80,
    attack: 15,
    level: 1,
    exp: 0,
    image: './images/warrior.png',
  }
];

// 最初は勇者だけ
const party = [partyMembersData[0]];

// 初期位置
const position = {x: 5, y: 5};

// モンスターのマスターデータ
const MONSTERS = [
  { name: 'スライム', id: 1, hp: 20, attack: 10, exp: 10, image: './images/slime.png' },
  { name: 'ドラゴン', id: 2, hp: 40, attack: 20, exp: 15, image: './images/doragon.png' },
  { name: 'メタルスライム', id: 3, hp: 20, attack: 10, exp: 30, image: './images/metal_slime.png' },
];

// エリアデータ
const AREAS = [
  { name: '村', id: 1, image: './images/village.png' },
  { name: '草原', id: 2, image: './images/grassland.png' },
  { name: '砂漠', id: 3, image: './images/sand.png' },
  { name: '火山', id: 4, image: './images/volcano.png' },
  { name: '海', id: 5, image: './images/sea.png' },
];

// ゲームの状態
let mode = 'field';     // 'field'（移動中） / 'battle'（戦闘中） / 'gameover'
let isInactive = false;     // ログ表示中は操作を受け付けない
let monster = null;     // 戦闘中のモンスター
let currentAreaId = 0;  // 今いるエリアのid
let currentStage = '';  // 今いるエリア
let currentMonster = null;  //戦闘中のモンスター（マスタデータのコピーを入れる

// HTML要素取得
const screen = document.getElementById('screen');
const partyImgs = document.getElementById('party-img');
const heroImg = document.getElementById('hero-img');
const warriorImg = document.getElementById('warrior-img');
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
const additionBtn = document.getElementById('addition-btn');
const logArea = document.getElementById('log');