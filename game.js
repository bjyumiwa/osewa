// index.html と同じキーで翻訳を用意
const gameTranslations = {
  ja: {
    heroTitle: (name) => `${name}とのお世話合戦、スタート！`,
    heroSub:
      "このページでは、あなたの日常のちょっとした行動が「お世話」として記録されます。小さな行動でも、キャラクターには大きなプレゼントになるかもしれませんね。",
    missionButton: "今日のミッションを見る",
    missionTitle: "今日のミッション（例）",
    missions: [
      "水を一杯のむ",
      "5分だけ歩く or ストレッチする",
      "今日の気分を1行メモする"
    ],
    typeLabels: {
      health: "けんこうタイプ",
      food: "たべるの大好きタイプ",
      fashion: "おしゃれタイプ"
    }
  },
  en: {
    heroTitle: (name) => `Osewa Battle with ${name} starts!`,
    heroSub:
      "On this page, your small everyday actions will be recorded as “care” for your character. Even tiny actions may feel like a big gift for them.",
    missionButton: "Show today’s missions",
    missionTitle: "Today’s missions (sample)",
    missions: [
      "Drink a glass of water",
      "Walk or stretch for 5 minutes",
      "Write one line about how you feel today"
    ],
    typeLabels: {
      health: "Health type",
      food: "Food lover type",
      fashion: "Fashion type"
    }
  }
};

let currentLangGame = localStorage.getItem("osewa_lang") || "ja";

document.addEventListener("DOMContentLoaded", () => {
  const langButtons = document.querySelectorAll(".lang-button");

  const heroTitle = document.getElementById("hero-title");
  const heroSub = document.getElementById("hero-sub");
  const missionButton = document.getElementById("mission-button");
  const missionButtonLabel = document.getElementById("mission-button-label");
  const missionTitle = document.getElementById("mission-title");
  const missionList = document.getElementById("mission-list");

  const petImage = document.getElementById("pet-image");
  const petName = document.getElementById("pet-name");
  const petType = document.getElementById("pet-type");

  const characterId = localStorage.getItem("osewa_character_id");
  const characterName = localStorage.getItem("osewa_character_name") || "???";

  // 直接このページを開いた場合はトップに戻す
  if (!characterId) {
    window.location.href = "index.html";
    return;
  }

  // キャラ画像のパス
  const imageMap = {
    health: "char/health.png",
    food: "char/food.png",
    fashion: "char/fashion.png"
  };

  petImage.src = imageMap[characterId] || "";
  petName.textContent = characterName;

  function applyGameTranslations() {
    const dict = gameTranslations[currentLangGame] || gameTranslations.ja;

    document.title =
      currentLangGame === "ja" ? "お世話合戦｜ゲーム" : "Osewa Battle | Game";

    heroTitle.textContent = dict.heroTitle(characterName);
    heroSub.textContent = dict.heroSub;
    missionButtonLabel.textContent = dict.missionButton;
    missionTitle.textContent = dict.missionTitle;

    // ミッションリスト
    missionList.innerHTML = "";
    dict.missions.forEach((m) => {
      const li = document.createElement("li");
      li.textContent = m;
      missionList.appendChild(li);
    });

    // タイプ名
    petType.textContent = dict.typeLabels[characterId] || "";
  }

  function updateLangButtons() {
    langButtons.forEach((btn) => {
      if (btn.dataset.lang === currentLangGame) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  updateLangButtons();
  applyGameTranslations();

  // 言語切り替え
  langButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      if (!gameTranslations[lang]) return;
      currentLangGame = lang;
      localStorage.setItem("osewa_lang", currentLangGame);
      updateLangButtons();
      applyGameTranslations();
    });
  });

  // ミッションボタンは、今は「とくに動きなし」のプレースホルダー
  missionButton.addEventListener("click", () => {
    // 将来、今日のミッションをAPIから取る／ポップアップを出すなどするとよさそうですね。
    // とりあえず、上までスクロールするだけにしておきます。
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
