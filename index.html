// main.js

// 1. キャラクターの情報（画像パスはあとで好きに変えてOK）
const characters = [
  {
    id: "health",
    name: "けんこうタイプ",
    description: "からだに気をつけているキャラ。歩いたり、水を飲んだりするのが好き。",
    image: "./char/health.png", // ここは実際の画像ファイル名に合わせて変えてください
  },
  {
    id: "food",
    name: "たべるの大好きタイプ",
    description: "おいしいものが大好き。おにぎりもお菓子もニコニコ食べちゃう。",
    image: "./char/food.png",
  },
  {
    id: "fashion",
    name: "おしゃれタイプ",
    description: "服やアクセサリーが好き。今日のコーデを考えるのが楽しみ。",
    image: "./char/fashion.png",
  },
];

// 2. ルート要素を取得
const root = document.getElementById("root");

// 3. 画面全体のコンテナをつくる
const container = document.createElement("div");
container.style.maxWidth = "900px";
container.style.margin = "0 auto";
container.style.padding = "20px";
container.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

// タイトル
const title = document.createElement("h1");
title.textContent = "お世話合戦 キャラクターをえらぶ";
title.style.textAlign = "center";
title.style.marginBottom = "10px";

// 説明
const intro = document.createElement("p");
intro.textContent = "いっしょにお世話をしていくキャラクターを、1人えらんでください。";
intro.style.textAlign = "center";
intro.style.marginBottom = "20px";

// 4. キャラカードを並べるエリア
const grid = document.createElement("div");
grid.style.display = "grid";
grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(240px, 1fr))";
grid.style.gap = "16px";

// 5. キャラごとのカードを作成
characters.forEach((chara) => {
  const card = document.createElement("button");
  card.style.display = "flex";
  card.style.flexDirection = "column";
  card.style.alignItems = "center";
  card.style.padding = "16px";
  card.style.borderRadius = "16px";
  card.style.border = "1px solid #ddd";
  card.style.backgroundColor = "white";
  card.style.cursor = "pointer";
  card.style.boxShadow = "0 2px 6px rgba(0,0,0,0.06)";
  card.style.transition = "transform 0.15s ease, box-shadow 0.15s ease";

  card.onmouseenter = () => {
    card.style.transform = "translateY(-2px)";
    card.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
  };
  card.onmouseleave = () => {
    card.style.transform = "none";
    card.style.boxShadow = "0 2px 6px rgba(0,0,0,0.06)";
  };

  // 画像
  const img = document.createElement("img");
  img.src = chara.image;
  img.alt = chara.name;
  img.style.width = "120px";
  img.style.height = "120px";
  img.style.objectFit = "contain";
  img.style.marginBottom = "8px";

  // キャラ名
  const nameEl = document.createElement("h2");
  nameEl.textContent = chara.name;
  nameEl.style.fontSize = "1.2rem";
  nameEl.style.margin = "4px 0";

  // 説明
  const descEl = document.createElement("p");
  descEl.textContent = chara.description;
  descEl.style.fontSize = "0.9rem";
  descEl.style.textAlign = "center";
  descEl.style.margin = "4px 0 0 0";

  // カードを組み立て
  card.appendChild(img);
  card.appendChild(nameEl);
  card.appendChild(descEl);

  // クリックしたときの動き
  card.addEventListener("click", () => {
    // 選んだキャラを localStorage に保存
    localStorage.setItem("osewa_selectedCharacter", JSON.stringify(chara));

    // ひとまずアラートで確認（あとで次の画面に飛ばす形に変えられます）
    alert(`「${chara.name}」をえらびました！`);

    // 次の画面を用意したら、ここで画面遷移させてもOKです
    // 例: window.location.href = "./stage1.html";
  });

  grid.appendChild(card);
});

// 6. すべて root に追加
container.appendChild(title);
container.appendChild(intro);
container.appendChild(grid);
root.innerHTML = ""; // もし何か入っていたら消す
root.appendChild(container);
