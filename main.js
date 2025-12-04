// main.js

// 背景と全体のスタイル
document.body.style.margin = "0";
document.body.style.minHeight = "100vh";
document.body.style.fontFamily =
  "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

// やわらかいグラデーション背景
document.body.style.background =
  "linear-gradient(180deg, #fff7fb 0%, #f3f7ff 45%, #ffffff 100%)";

// 1. キャラクター情報
// 画像のパスは、プロジェクトのルールに合わせて「public/」から始めています。
const characters = [
  {
    id: "health",
    name: "けんこうタイプ",
    description:
      "からだに気をつけているキャラ。歩いたり、水を飲んだりするのが好き。",
    image: "public/char/greenjoy.png",
  },
  {
    id: "food",
    name: "たべるの大好きタイプ",
    description:
      "おいしいものが大好き。おにぎりもお菓子もニコニコ食べちゃう。",
    image: "public/char/bluejoy.png",
  },
  {
    id: "fashion",
    name: "おしゃれタイプ",
    description: "服やアクセサリーが好き。今日のコーデを考えるのが楽しみ。",
    image: "public/char/bluecalm.png",
  },
];

// 2. ルート要素を取得
const root = document.getElementById("root");

// 3. 画面全体のコンテナ
const container = document.createElement("div");
container.style.maxWidth = "980px";
container.style.margin = "0 auto";
container.style.padding = "32px 20px 40px";
container.style.minHeight = "100vh";
container.style.boxSizing = "border-box";

// 上部タイトルカード
const headerCard = document.createElement("div");
headerCard.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
headerCard.style.borderRadius = "24px";
headerCard.style.padding = "24px 16px";
headerCard.style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)";
headerCard.style.marginBottom = "24px";
headerCard.style.textAlign = "center";

const title = document.createElement("h1");
title.textContent = "お世話合戦 キャラクターをえらぶ";
title.style.margin = "0 0 8px 0";
title.style.fontSize = "1.8rem";

const intro = document.createElement("p");
intro.textContent =
  "いっしょにお世話をしていくキャラクターを、1人えらんでください。";
intro.style.margin = "0";
intro.style.fontSize = "0.95rem";
intro.style.color = "#555";

headerCard.appendChild(title);
headerCard.appendChild(intro);

// キャラカードエリア
const gridWrapper = document.createElement("div");
gridWrapper.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
gridWrapper.style.borderRadius = "24px";
gridWrapper.style.padding = "20px";
gridWrapper.style.boxShadow = "0 10px 30px rgba(0,0,0,0.08)";

const grid = document.createElement("div");
grid.style.display = "grid";
grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(240px, 1fr))";
grid.style.gap = "16px";

// キャラカード作成
characters.forEach((chara) => {
  const card = document.createElement("button");
  card.style.display = "flex";
  card.style.flexDirection = "column";
  card.style.alignItems = "center";
  card.style.padding = "18px 16px 20px";
  card.style.borderRadius = "20px";
  card.style.border = "1px solid #f0e8ff";
  card.style.background =
    "radial-gradient(circle at top, #fdf5ff 0, #ffffff 55%)";
  card.style.cursor = "pointer";
  card.style.boxShadow = "0 3px 10px rgba(0,0,0,0.04)";
  card.style.transition =
    "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease";

  card.onmouseenter = () => {
    card.style.transform = "translateY(-3px)";
    card.style.boxShadow = "0 8px 18px rgba(0,0,0,0.12)";
    card.style.borderColor = "#d8c2ff";
  };
  card.onmouseleave = () => {
    card.style.transform = "none";
    card.style.boxShadow = "0 3px 10px rgba(0,0,0,0.04)";
    card.style.borderColor = "#f0e8ff";
  };

  const img = document.createElement("img");
  img.src = chara.image;
  img.alt = chara.name;
  img.style.width = "120px";
  img.style.height = "120px";
  img.style.objectFit = "contain";
  img.style.marginBottom = "8px";
  img.style.borderRadius = "50%";
  img.style.backgroundColor = "#fff";
  img.style.padding = "8px";

  const nameEl = document.createElement("h2");
  nameEl.textContent = chara.name;
  nameEl.style.fontSize = "1.1rem";
  nameEl.style.margin = "8px 0 4px 0";

  const descEl = document.createElement("p");
  descEl.textContent = chara.description;
  descEl.style.fontSize = "0.88rem";
  descEl.style.textAlign = "center";
  descEl.style.margin = "0";
  descEl.style.color = "#444";

  card.appendChild(img);
  card.appendChild(nameEl);
  card.appendChild(descEl);

  card.addEventListener("click", () => {
    localStorage.setItem("osewa_selectedCharacter", JSON.stringify(chara));
    alert(`「${chara.name}」をえらびました！`);
    // ここで次の画面へ遷移させてもOK
    // window.location.href = "stage1.html";
  });

  grid.appendChild(card);
});

// 画面に追加
gridWrapper.appendChild(grid);
container.appendChild(headerCard);
container.appendChild(gridWrapper);

root.innerHTML = "";
root.appendChild(container);
