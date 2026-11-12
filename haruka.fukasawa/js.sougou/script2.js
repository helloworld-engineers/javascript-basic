// 関数 / そのほかの処理をまとめたファイル

// 共通処理
function findById(list, id) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      return list[i]; // 見つかったらそのオブジェクトデータを返す
    }
  }
  return null;
}

// 指定した時間だけ待つ(Promiseを返す)
function wait(ms) {
  return new Promise(function (resolve) {  // resolve = 押すと完了になるボタン
    setTimeout(resolve, ms);               // ms 後にボタンを押すよう予約
  });                                      // 「待ち」の Promise を返す
}

// ログに1行追加する(新しい文章が上)
function log(message) {
  const p = document.createElement('p');
  p.textContent = message;
  logArea.prepend(p);    // 一番上に追加
  logArea.scrollTop = 0; // 一番上までスクロール
}

// ログを表示して少し待つ(バトル用)
async function say(message) {
  log(message);
  await wait(MESSAGE_DELAY);
}

// 生きているメンバーだけを返す
function getAliveMembers(){
  return party.filter(member => member.hp > 0);
}

// 画面を表示する

// 左上のステータスをCSS（.member-status）の設計を活かして人数分縦に並べる
function updateStatus(members) {
  const statusArea = document.querySelector('.status');
  if (!statusArea) return;

  // 一旦中身をクリア
  statusArea.replaceChildren();

  members.forEach(member => {
    const memberDiv = document.createElement('div');
    memberDiv.className = 'member-status'; // CSSの枠スタイルを適用

    // 名前（HPが0なら戦闘不能と添える）
    const nameP = document.createElement('p');
    nameP.textContent = member.name;
    if (member.hp <= 0) {
      const deadSpan = document.createElement('span');
      deadSpan.className = 'dead';
      deadSpan.textContent = '（戦闘不能）';
      nameP.appendChild(deadSpan);
    }
    memberDiv.appendChild(nameP);

    // 各ステータスを1行ずつ追加
    const lines = [
      `HP:${member.hp}`,
      `攻撃力:${member.attack}`,
      `レベル:${member.level}`,
    ];
    lines.forEach(text => {
      const p = document.createElement('p');
      p.textContent = text;
      memberDiv.appendChild(p);
    });

    statusArea.appendChild(memberDiv);
  });
}

// ゲーム開始時の画面を表示する
function initGame() {
  heroImg.src = partyMembersData[0].image;     // 勇者の画像
  warriorImg.src = partyMembersData[1].image;  // 戦士の画像
  warriorImg.hidden = true;                    // 仲間になるまでは隠しておく
  additionBtn.hidden = true;                   // 戦士追加ボタンは最初は非表示
  gameoverImg.hidden = true;                   // ゲームオーバ画像非表示
  updateStatus(party);
  updateStage();
  setMode('field');
}

// マップ処理

// 座標から現在いるエリアを判定する
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

// 背景を切り替える
function updateStage() {
  const areaId = getAreaId(position.x, position.y);
  // エリアが変わった時だけ処理する
  if (areaId !== stage.currentAreaId) {
    const area = findById(AREAS, areaId);  // id でエリアのデータを取り出す

    // 最初の表示の時はログを出さない
    if (stage.currentAreaId !== 0) {
      log(area.name + 'に入った。');
    }
    screen.style.backgroundImage = `url(${area.image})`;
    stage.currentAreaId = areaId;
  }
}

// 画面の切り替え処理

// 移動画面 / 戦闘画面 / GAME OVER画面を切り替える
function setMode(newMode) {
  mode = newMode;

  partyImgs.hidden = mode !== 'field';
  monsterImg.hidden = mode !== 'battle';
  commands.hidden = mode !== 'battle';
  gameoverImg.hidden = mode !== 'gameover';

  if (mode === 'field') {
    // 移動中：パーティーを表示、方向キーは活性
    heroImg.hidden = false;
    warriorImg.hidden = !party.includes(partyMembersData[1]);
    updateArrows();
  } else if (mode === 'battle') {
    // 戦闘中：方向キーと追加ボタンは非活性
    additionBtn.disabled = true;
    setArrowsDisabled(true);
  } else if (mode === 'gameover') {
    // GAME OVER：パーティー画像や追加ボタンを隠し、全ボタンを非活性
    heroImg.hidden = true;
    warriorImg.hidden = true;
    additionBtn.hidden = true;
    setArrowsDisabled(true);
    fightBtn.disabled = true;
    escapeBtn.disabled = true;
  }
}

// ログ表示中にボタンを押せなくする
function setInactive(inactive) {
  isInactive = inactive;
  fightBtn.disabled = inactive;
  escapeBtn.disabled = inactive;
  additionBtn.disabled = inactive || mode !== 'field';
}

// バトル画面に移る
async function startBattle(monster) {
  currentMonster = monster;  // 戦闘中のモンスターとして保存
  monsterImg.src = currentMonster.image;
  monsterImg.alt = currentMonster.name;

  if (!monster) throw new Error('モンスターが存在しません');
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

// 方向キーを全部まとめて活性/非活性にする
function setArrowsDisabled(disabled) {
  for (let i = 0; i < arrows.length; i++) {
    arrows[i].disabled = disabled;
  }
}

// マップの端でその方向キーを非活性にする
function updateArrowsDisabled() {
  arrowRight.disabled = position.x === MAP_MAX;
  arrowLeft.disabled = position.x === MAP_MIN;
  arrowUp.disabled = position.y === MAP_MAX;
  arrowDown.disabled = position.y === MAP_MIN;
}

// X/Y座標で移動する
async function move(direction) {
  // 戦闘中・ログ表示中は動かない
  if (mode !== 'field' || isInactive) {
    return;
  }

  // 移動後の座標を計算する
  let nextX = position.x;
  let nextY = position.y;

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
  position.x = nextX;
  position.y = nextY;
  log(direction + '方向に進みました。');

  updateStage();
  updateArrows();

  // モンスターが出現するか判定する
  if (encounterCheck()) {
    const monster = pickMonster();  // 出現するモンスターを決める
    await startBattle(monster);     // そのモンスターで戦闘開始
  }
}

// バトル処理: エンカウント

// モンスターが出現するか決める（40%）
function encounterCheck() {
  return Math.random() < ENCOUNTER_RATE;
}

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
// 65% でスライム / 25% でドラゴン / 10% でメタルスライム
function pickMonster() {
  const random = Math.random() * RATE_MAX;
  let data;
  if (random < SLIME_RATE) {
    data = MONSTERS[0];  // スライム
  } else if (random < SLIME_RATE + DRAGON_RATE) {
    data = MONSTERS[1];  // ドラゴン
  } else {
    data = MONSTERS[2];  // メタルスライム
  }
  return copyMonster(data);
}

// 攻撃を受けた後のHPを計算する（0未満にはしない）
function calculateHP(hp, attack) {
  let result = hp - attack;
  if (result < 0) {
    result = 0;
  }
  return result;
}

// 勇者たちの攻撃処理
async function partyAttack() {
  const aliveMembers = getAliveMembers();

  for (const member of aliveMembers) {
    if (currentMonster.hp <= 0) break; // すでにモンスターを倒していたら中断

    currentMonster.hp = calculateHP(currentMonster.hp, member.attack);
    await say(member.name + 'の攻撃！' + currentMonster.name + 'に' + member.attack + 'ポイントのダメージを与えた。');
  }
}

// モンスターの攻撃処理
async function monsterAttack() {
  const aliveMembers = getAliveMembers();
  if (aliveMembers.length === 0) return;

  const target = aliveMembers[Math.floor(Math.random() * aliveMembers.length)];
  target.hp = calculateHP(target.hp, currentMonster.attack);
  updateStatus(party); // 左上のHPを減らす

  await say(currentMonster.name + 'の攻撃！' + target.name + 'は' + currentMonster.attack + 'ポイントのダメージを受けた。');

  if (target.hp <= 0) {
  await say(target.name + 'は倒れてしまった。');
  }

  // 全滅したかどうか判定
  if (getAliveMembers().length === 0) {
    await gameOver();
  }
}

// 戦うボタンを押した時
async function fight() {
  if (mode !== 'battle' || isInactive) {
    return;
  }
  setInactive(true);

  await partyAttack();

  if (currentMonster.hp <= 0) {
  await winBattle();
  } else {
  await monsterAttack();
  }

  if (mode !== 'gameover') {
    setInactive(false);
  }
}

// 逃げるボタンを押した時の処理
async function escape() {
  if (mode !== 'battle' || isInactive) {
    return;
  }
  setInactive(true);

  await say(party[0].name + 'たちは逃げ出した。');
  // 逃げられるか判定する（50%）
  if (Math.random() < ESCAPE_RATE) {
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

// バトルに勝った時の処理
async function winBattle() {
  await say(currentMonster.name + 'を倒した。');

  // 生きているメンバーにだけ経験値付与
  const aliveMembers = getAliveMembers();
  for (const member of aliveMembers) {
    member.exp += currentMonster.exp;
    await say(member.name + 'は経験値' + currentMonster.exp + 'ポイント獲得した。');
    await levelUp(member);
  }

  endBattle();
  updateJoinButton();  // 戦士追加ボタンを表示するか判定
}

// 全滅した時の処理
async function gameOver() {
  await say('全滅しました。');
  setMode('gameover');  // GAME OVER画像を表示、ボタンは全て非活性
}

// レベルアップ処理

// 次のレベルアップに必要な経験値（Lv1 → 30P、Lv2 → 40P、Lv3 → 50P …）
function getNextLevelExp(member) {
  return FIRST_LEVEL_UP_EXP + (member.level - 1) * ADD_LEVEL_UP_EXP;
}

// レベルアップ(必要な経験値に届かなくなるまで繰り返す)
async function levelUp(member) {
  while (member.exp >= getNextLevelExp(member)) {
    member.exp -= getNextLevelExp(member);  // 余ったポイントは持ち越す
    member.level += 1;
    member.maxHp += LEVEL_UP_BONUS;
    member.attack += LEVEL_UP_BONUS;
    member.hp = member.maxHp;               // HP全回復
    updateStatus(party);

    await say(`${member.name}のレベルが1上がった。`);
    await say(`HP / 攻撃力が${LEVEL_UP_BONUS}アップした。`);
    await say('HPが全回復した。');
  }
}

// 戦士を仲間にするボタン処理
async function updateJoinButton(){
  const hero = findById(party, 1);                         // 勇者のデータをパーティーから探す
  const hasWarrior = party.includes(partyMembersData[1]);  // すでに戦士がパーティーにいるかチェック
  // 勇者のレベルが3以上でまだ戦士がパーティーにいない時だけボタン表示
  if (hero && hero.level >= JOIN_LEVEL) {
    if (!hasWarrior) {
      additionBtn.hidden = false;
    }
  }

  additionBtn.disabled = isInactive || mode !== 'field';   // 操作ロック中、または移動画面以外にいる場合戦士追加ボタンは押せない
}

// 戦士を仲間にするボタンを押した時の処理
async function joinWarrior(){
  const warrior = partyMembersData[1]; // 戦士のデータ

  if (warrior && !party.includes(warrior)) {  // warrior データがある + party にまだ warrior が追加されていない場合
    party.push(warrior);         // データを配列に追加
    warriorImg.hidden = false;   // 画面中央の戦士画像を表示させる
    additionBtn.hidden = true;   // 用済みになったボタンは消す

    setInactive(true);
    updateStatus(party);              // 左上のステータス表示を2人分に切り替える
    await say(warrior.name + 'が仲間になった！');
    setInactive(false);
  }
}

// イベント処理
arrowUp.addEventListener('click', () => move('上'));
arrowLeft.addEventListener('click', () => move('左'));
arrowRight.addEventListener('click', () => move('右'));
arrowDown.addEventListener('click', () => move('下'));
fightBtn.addEventListener('click', fight);
escapeBtn.addEventListener('click', escape);
additionBtn.addEventListener('click', joinWarrior);

// ゲーム開始
initGame();