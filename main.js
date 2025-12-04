// 言語ごとのテキスト
const translations = {
  ja: {
    title: "お世話合戦",
    introLead: "日常の「ちょっとめんどくさいお世話」を、キャラクターといっしょに楽しめるかを試すゲームです。",
    introBody1: "このアプリは、生活の中の小さな行動（歩く、水を飲む、身だしなみを整えるなど）と、キャラクターへの「お世話」がつながるように設計された研究プロジェクトの一部です。",
    introBody2: "どのキャラクターを選ぶか、どんな名前をつけるか、どのお世話を選ぶかといった記録は、あとでまとめて分析されます。個人が特定される情報は集めません。",
    introBody3: "内容に同意してくれたら、「ゲームをはじめる」ボタンを押してスタートしてください。",
    startButton: "ゲームをはじめる",

    charTitle: "お世話合戦 キャラクターをえらぶ",
    charLead: "いっしょにお世話をしていくキャラクターを、1人えらんでください。",

    healthName: "けんこうタイプ",
    healthDesc: "からだに気をつけているキャラ。歩いたり、水を飲んだりするのが好き。",
    foodName: "たべるの大好きタイプ",
    foodDesc: "おいしいものが大好き。おにぎりもお菓子もニコニコ食べちゃう。",
    fashionName: "おしゃれタイプ",
    fashionDesc: "服やアクセサリーが好き。今日のコーデを考えるのが楽しみ。",

    nameLabel: "えらんだキャラクターに、名前をつけてください。",
    namePlaceholder: "キャラクターの名前（12文字まで）",
    yoroshikuneButton: "よろしくね！"
  },
  en: {
    title: "Osewa Battle",
    introLead: "This game explores whether small everyday \"care\" tasks can feel fun when you do them with a character.",
    introBody1: "The app is part of a research project that connects daily actions (walking, drinking water, getting dressed, etc.) with caring for a character.",
    introBody2: "Your choices—such as which character you choose, what name you give, and which care tasks you select—may be analysed later, but no personally identifiable information will be collected.",
    introBody3: "If you agree with this, please press the “Start game” button.",
    startButton: "Start game",

    charTitle: "Choose your care character",
    charLead: "Pick one character to take care of together.",

    healthName: "Health type",
    healthDesc: "Cares about body condition. Likes walking and drinking water.",
    foodName: "Food lover type",
    foodDesc: "Loves tasty food. Rice balls and snacks both make them happy.",
    fashionName: "Fashion type",
    fashionDesc: "Loves clothes and accessories. Enjoys choosing today’s outfit.",

    nameLabel: "Give a name to your character.",
    namePlaceholder: "Character name (up to 12 letters)",
    yoroshikuneButton: "Let’s go!"
  }
};

let currentLang = localStorage.getItem("osewa_lang") || "ja";

document.addEventListener("DOMContentLoaded", () => {
  const introScreen = document.getElementById("intro-screen");
  const charScreen = document.getElementById("char-screen");

  const startButton = document.getElementById("start-button");
  const langButtons = document.querySelectorAll(".lang-button");

  const characterCards = document.querySelectorAll(".character-card");
  const nameArea = document.getElementById("name-area");
  const nameInput = document.getElementById("pet-name-input");
  const yoroshikuneButton = document.getElementById("yoroshikune-button");

  let selectedCharacterId = null;
  let selectedCharacterImage = null;

  function applyTranslations() {
    const dict = translations[currentLang] || translations.ja;

    document.title = dict.title || "お世話合戦";

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    document.querySelectorAll("[data-i18n-label]").forEach((el) => {
      const key = el.getAttribute("data-i18n-label");
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (dict[key]) {
        el.placeholder = dict[key];
      }
    });
  }

  function updateLangButtons() {
    langButtons.forEach((btn) => {
      if (btn.dataset.lang === currentLang) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  updateLangButtons();
  applyTranslations();

  langButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      if (!translations[lang]) return;
      currentLang = lang;
      localStorage.setItem("osewa_lang", currentLang);
      updateLangButtons();
      applyTranslations();
    });
  });

  startButton.addEventListener("click", () => {
    introScreen.classList.add("hidden");
    charScreen.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  characterCards.forEach((card) => {
    card.addEventListener("click", () => {
      characterCards.forEach((c) => c.classList.remove("selected"));
      card.classList.add("selected");

      selectedCharacterId = card.dataset.id;
      const img = card.querySelector("img");
      selectedCharacterImage = img ? img.getAttribute("src") : null;

      nameArea.classList.remove("hidden");
      updateYoroshikuneButton();
    });
  });

  nameInput.addEventListener("input", () => {
    updateYoroshikuneButton();
  });

  function updateYoroshikuneButton() {
    const hasName = nameInput.value.trim().length > 0;
    if (selectedCharacterId && hasName) {
      yoroshikuneButton.disabled = false;
    } else {
      yoroshikuneButton.disabled = true;
    }
  }

  yoroshikuneButton.addEventListener("click", () => {
    const name = nameInput.value.trim();
    if (!name || !selectedCharacterId) return;

    localStorage.setItem("osewa_character_id", selectedCharacterId);
    localStorage.setItem("osewa_character_name", name);
    localStorage.setItem("osewa_lang", currentLang);
    if (selectedCharacterImage) {
      localStorage.setItem("osewa_character_image", selectedCharacterImage);
    }

    window.location.href = "osewa_game.html";
  });
});
