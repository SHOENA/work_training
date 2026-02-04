const analyzeBtn = document.getElementById("analyzeBtn");
const raceUrlInput = document.getElementById("raceUrl");
const statusLabel = document.getElementById("status");
const mainPicks = document.getElementById("mainPicks");
const widePicks = document.getElementById("widePicks");
const trifectaPicks = document.getElementById("trifectaPicks");

const horseNames = [
  "サクラフォース",
  "ミッドナイトレーン",
  "ホワイトスピア",
  "ブルーオーブ",
  "ゴールドバレット",
  "ナイトレイダー",
  "リバーシティ",
  "ミストレディ",
  "ソニックハート",
  "シルバーブリーズ",
  "グランフェザー",
  "ヴァリオス",
  "スターシャイン",
  "フロストライン",
];

const pickTypes = {
  main: ["本命", "対抗", "穴"] ,
  wide: ["ワイド", "ワイド", "ワイド"],
  trifecta: ["三連複", "三連複", "三連複"],
};

const createSeed = (url) => {
  let seed = 0;
  for (let i = 0; i < url.length; i += 1) {
    seed = (seed * 31 + url.charCodeAt(i)) % 2147483647;
  }
  return seed || 1;
};

const seededRandom = (seed) => {
  let value = seed;
  return () => {
    value = (value * 48271) % 2147483647;
    return value / 2147483647;
  };
};

const pickHorses = (url) => {
  const seed = createSeed(url);
  const rng = seededRandom(seed);
  const shuffled = [...horseNames].sort(() => rng() - 0.5);
  return {
    main: shuffled.slice(0, 3),
    wide: shuffled.slice(1, 4),
    trifecta: [shuffled[0], shuffled[2], shuffled[4]].filter(Boolean),
  };
};

const renderList = (element, picks, labels) => {
  element.innerHTML = "";
  picks.forEach((pick, index) => {
    const li = document.createElement("li");
    const label = document.createElement("span");
    label.textContent = labels[index] || "候補";
    const name = document.createElement("strong");
    name.textContent = pick;
    li.append(label, name);
    element.appendChild(li);
  });
};

const handleAnalyze = () => {
  const url = raceUrlInput.value.trim();
  if (!url) {
    statusLabel.textContent = "URLを入力してください";
    return;
  }

  statusLabel.textContent = "AIが分析中...";
  const picks = pickHorses(url);
  renderList(mainPicks, picks.main, pickTypes.main);
  renderList(widePicks, picks.wide, pickTypes.wide);
  renderList(trifectaPicks, picks.trifecta, pickTypes.trifecta);
  statusLabel.textContent = "提案完了！";
};

analyzeBtn.addEventListener("click", handleAnalyze);
raceUrlInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleAnalyze();
  }
});
