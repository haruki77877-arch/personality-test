// =====================
// 16問（質問中は“タイプ名”を一切使わない）
// scoreA/scoreB は "t1"〜"t8" のキーだけ
// =====================
const QUESTIONS = [
  { text:"冷蔵庫に余り物？", A:"ありがち", B:"ないがち", scoreA:["t2","t6"], scoreB:["t1","t4"] },
  { text:"トイレットペーパーは", A:"めっちゃ使う", B:"節約しがち", scoreA:["t2"], scoreB:["t1","t5"] },
  { text:"納豆は", A:"かき混ぜまくる", B:"2,3回しか混ぜない", scoreA:["t3","t8"], scoreB:["t4"] },
  { text:"廊下を", A:"よく走っていた", B:"ほとんど走ったことがない", scoreA:["t3"], scoreB:["t4","t1"] },

  { text:"ちょんまげの人を見ると", A:"見ちゃう", B:"見ちゃわない", scoreA:["t2","t6"], scoreB:["t1"] },
  { text:"サンタさんを信じていたのは", A:"18歳まで", B:"19歳まで", scoreA:["t2"], scoreB:["t4","t5"] },
  { text:"カップラーメンを待っているときは", A:"のぞきたくなる", B:"歌って待つ", scoreA:["t8","t3"], scoreB:["t7","t1"] },
  { text:"しゃべりたくない人には", A:"あごで対応", B:"ひじで対応", scoreA:["t7"], scoreB:["t4","t5"] },

  { text:"遅刻しそうになったら", A:"パンはくわえたまま", B:"ご飯一気食い", scoreA:["t6"], scoreB:["t1","t5"] },
  { text:"風呂は", A:"広い", B:"狭い", scoreA:["t2"], scoreB:["t4"] },
  { text:"クリーピーナッツは", A:"くりのほうが好き", B:"ピーナッツのほうが好き", scoreA:["t3"], scoreB:["t8"] },
  { text:"校長先生は", A:"ハゲていた", B:"ハゲかかっていた", scoreA:["t7"], scoreB:["t1","t3"] },

  { text:"アウトドアだけど？", A:"囲碁が好き", B:"将棋が好き", scoreA:["t5"], scoreB:["t2"] },
  { text:"スマートフォンを略すと？", A:"スマフォ", B:"スマフォン", scoreA:["t8"], scoreB:["t7"] },
  { text:"球技と言えば", A:"ラグビー", B:"卓球", scoreA:["t1","t4"], scoreB:["t2","t6"] },
  { text:"ババ抜きは", A:"ばばあがやるもの", B:"じじいがやるもの", scoreA:["t5","t4"], scoreB:["t6"] }
];

// =====================
// 結果（ここが“初めて”タイプ名・画像を持つ）
// 質問中は参照しない。renderResult()で初めて参照する。
// =====================
function getResultsDefinition(){
  return {
    t1: { name:"デッカ", title:"とにかくでかい", desc:"でかいから力仕事が得意だよ！。", img:"assets/t1.png" },
    t2: { name:"エドちゃん", title:"めっちゃグッド", desc:"どんな修羅場もグーで乗り越えちゃう！。", img:"assets/t2.png" },
    t3: { name:"たっぴー", title:"単体だとさみしいな", desc:"一人だと何もできないから、誰かに頼ろう！。", img:"assets/t3.png" },
    t4: { name:"えいとちゃん", title:"香水買いがち", desc:"香水いっぱい買っていい匂い！。", img:"assets/t4.png" },
    t5: { name:"はまやんねん", title:"バズーカだぜ！", desc:"とりあえずわけの分からない単語を並べよう！。", img:"assets/t5.png" },
    t6: { name:"エレキテルちゃん", title:"とにかくダメなのよ", desc:"うーん、ダメなのよ。", img:"assets/t6.png" },
    t7: { name:"あやまん日本", title:"くらえ！ぽいぴー！", desc:"ぽいぽいぽいぽぽいぽいぽぴ。", img:"assets/t7.png" },
    t8: { name:"ゆっってぃー", title:"わかわかちこちこ", desc:"細かいことは全く気にしないよ！。", img:"assets/t8.png" }
  };
}

// =====================
// 状態
// =====================
let index = 0;
let answers = []; // 'A' or 'B'
let scores = initScores();

// =====================
// DOM
// =====================
const $start = document.getElementById("screen-start");
const $quiz = document.getElementById("screen-quiz");
const $result = document.getElementById("screen-result");

const $btnStart = document.getElementById("btn-start");
const $btnBack = document.getElementById("btn-back");
const $btnRestart = document.getElementById("btn-restart");

const $qnum = document.getElementById("qnum");
const $qtext = document.getElementById("qtext");
const $choiceA = document.getElementById("choice-a");
const $choiceB = document.getElementById("choice-b");
const $progress = document.getElementById("progress-bar");

const $rtype = document.getElementById("rtype");
const $rimg = document.getElementById("rimg");
const $rtitle = document.getElementById("rtitle");
const $rdesc = document.getElementById("rdesc");
const $scores = document.getElementById("scores");
const $btnAgain = document.getElementById("btn-again");
const $btnShare = document.getElementById("btn-share");

// =====================
// utils
// =====================
function initScores(){
  return { t1:0,t2:0,t3:0,t4:0,t5:0,t6:0,t7:0,t8:0 };
}
function show(el){ el.classList.remove("hidden"); }
function hide(el){ el.classList.add("hidden"); }
function resetAll(){ index=0; answers=[]; scores=initScores(); }

function applyAnswer(choice, qIndex){
  const q = QUESTIONS[qIndex];
  const keys = choice === "A" ? q.scoreA : q.scoreB;
  for(const k of keys) scores[k] += 1;
}
function rollbackAnswer(choice, qIndex){
  const q = QUESTIONS[qIndex];
  const keys = choice === "A" ? q.scoreA : q.scoreB;
  for(const k of keys) scores[k] -= 1;
}

function renderQuestion(){
  const q = QUESTIONS[index];
  $qnum.textContent = `Q${index+1} / ${QUESTIONS.length}`;
  $qtext.textContent = q.text;
  $choiceA.textContent = `A：${q.A}`;
  $choiceB.textContent = `B：${q.B}`;
  $progress.style.width = `${(index / QUESTIONS.length) * 100}%`;
}

// 同点のときの優先順位（キーで管理）
const TIE_PRIORITY = ["t4","t1","t7","t8","t5","t3","t2","t6"];

function computeResultKey(){
  const entries = Object.entries(scores).sort((a,b)=> b[1]-a[1]);
  const max = entries[0][1];
  const tied = entries.filter(([_,v])=> v===max).map(([k])=>k);

  for(const p of TIE_PRIORITY){
    if(tied.includes(p)) return p;
  }
  return entries[0][0];
}

function renderResult(){
  $progress.style.width = "100%";

  // ここで初めてタイプ定義（名前/画像）を生成して参照する
  const RESULTS = getResultsDefinition();

  const key = computeResultKey();
  const info = RESULTS[key];

  // ここで初めて「診断名」と「画像」が画面に出る
  $rtype.textContent = `あなたは「${info.name}」タイプ`;
  $rimg.src = info.img;
  $rimg.alt = `${info.name}の画像`;
  $rtitle.textContent = info.title;
  $rdesc.textContent = info.desc;

  $scores.textContent = JSON.stringify(scores, null, 2);
}

// =====================
// transitions
// =====================
function startQuiz(){
  hide($start); hide($result); show($quiz);
  renderQuestion();
}
function finishQuiz(){
  hide($quiz); show($result);
  renderResult();
}

// =====================
// events
// =====================
$btnStart.addEventListener("click", ()=>{
  resetAll();
  startQuiz();
});

$choiceA.addEventListener("click", ()=>{
  answers.push("A");
  applyAnswer("A", index);
  index++;
  if(index >= QUESTIONS.length) finishQuiz();
  else renderQuestion();
});

$choiceB.addEventListener("click", ()=>{
  answers.push("B");
  applyAnswer("B", index);
  index++;
  if(index >= QUESTIONS.length) finishQuiz();
  else renderQuestion();
});

$btnBack.addEventListener("click", ()=>{
  if(index <= 0) return;
  index--;
  const prev = answers.pop();
  rollbackAnswer(prev, index);
  renderQuestion();
});

$btnRestart.addEventListener("click", ()=>{
  resetAll();
  renderQuestion();
});

$btnAgain.addEventListener("click", ()=>{
  resetAll();
  hide($result);
  startQuiz();
});

$btnShare.addEventListener("click", async ()=>{
  const RESULTS = getResultsDefinition();
  const key = computeResultKey();
  const info = RESULTS[key];

  const text =
`診断結果：${info.name}
${info.title}

スコア：${JSON.stringify(scores)}`;

  try{
    await navigator.clipboard.writeText(text);
    $btnShare.textContent = "コピーしました！";
    setTimeout(()=> $btnShare.textContent = "結果をコピー", 1200);
  }catch{
    alert("コピーに失敗しました。ブラウザ設定を確認してください。");
  }
});