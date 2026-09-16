let saikoroImage1 = document.getElementById("saikoroimage1");
let saikoroImage2 = document.getElementById("saikoroimage2");
let p1score = document.getElementById("p1score");
let p2score = document.getElementById("p2score");
let roundcount = document.getElementById("roundcount");
const battleBtn = document.getElementById("battlebtn");
const resultBtn = document.getElementById("resultbtn");

let round = 0;
let p1 = 0;
let p2 = 0;
console.log(round.textContent);
battleBtn.addEventListener("click", () => {
  let saikoroRandom1 = Math.floor(Math.random() * 6) + 1;
  let saikoroRandom2 = Math.floor(Math.random() * 6) + 1;
  saikoroImage1.src = "./images/saikoro" + saikoroRandom1 + ".jpg";
  saikoroImage2.src = "./images/saikoro" + saikoroRandom2 + ".jpg";
  round++;
  roundcount.textContent = round;
  console.log(round);
  if (round >= 3) {
    battleBtn.disabled = true;
  }
  if (saikoroRandom1 > saikoroRandom2) {
    p1++;
    p1score.textContent = p1;
    console.log(p1);
  } else if (saikoroRandom1 < saikoroRandom2) {
    p2++;
    p2score.textContent = p2;
  } else if (saikoroRandom1 === saikoroRandom2) {
    return;
  }
});

if (round > 3) {
  resultBtn.disabled = false;
}
resultBtn.addEventListener("click", () => {
  if (p1 > p2) {
    alert("プレイヤー1の勝ち");
  } else if (p1 < p2) {
    alert("プレイヤー2の勝ち");
  } else if (p1 === p2) {
    alert("引き分け");
  }
});
