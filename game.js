// 1プレイあたりのシーン数
const TOTAL_ROUNDS = 10;

// シーン定義（4種類をぐるぐる使う）
const scenePool = [
  {
    id: "morning_clothes",
    titleJa: "朝：きょうの服をえらぶ",
    descJa: "どちらの服を着せる？",
    titleEn: "Morning: Choose today’s clothes",
    descEn: "Which outfit will you put on?",
    options: [
      {
        id: "comfy",
        icon: "🩳",
        labelJa: "動きやすい服",
        labelEn: "Comfy clothes"
      },
      {
        id: "cute",
        icon: "👗",
        labelJa: "かわいい服",
        labelEn: "Cute outfit"
      }
    ]
  },
  {
    id: "meal",
    titleJa: "昼：ごはんをえらぶ",
    descJa: "どちらを食べさせる？",
    titleEn: "Meal: Choose food",
    descEn: "Which will you let them eat?",
    options: [
      {
        id: "onigiri",
        icon: "🍙",
        labelJa: "おにぎり",
        labelEn: "Rice ball"
      },
      {
        id: "snack",
        icon: "🍪",
        labelJa: "お菓子",
        labelEn: "Snacks"
      }
    ]
  },
  {
    id: "outing",
    titleJa: "外出：出かけかたをえらぶ",
    descJa: "どうやって行こう？",
    titleEn: "Going out: Choose how to go",
    descEn: "How will you go?",
    options: [
      {
        id: "walk",
        icon: "🚶",
        labelJa: "歩いて行く",
        labelEn: "Walk"
      },
      {
        id: "ride",
        icon: "🚌",
        labelJa: "乗り物に乗る",
        labelEn: "Take transport"
      }
    ]
  },
  {
    id: "shopping",
    titleJa: "買い物：どっちを買う？",
    descJa: "今日はどちらをプレゼントする？",
    titleEn: "Shopping: What to buy?",
    descEn: "Which will you gift today?",
    options: [
      {
        id: "book",
        icon: "📘",
        labelJa: "本",
        labelEn: "Book"
      },
      {
        id: "ring",
        icon: "💍",
        labelJa: "指輪",
        labelEn: "Ring"
      }
    ]
  }
];

// キャラごとの好みマップ
// good: 大よろこび（+2） / ok: そこそこ（+1） / bad: ちょっとがっかり（+0）
const preferenceMap = {
  health: {
    morning_clothes: { comfy: "good", cute: "ok" },
    meal: { onigiri: "good", snack: "bad" },
    outing: { walk: "good", ride: "bad" },
    shopping: { book: "good", ring: "ok" }
  },
  food: {
    morning_clothes: { comfy: "ok", cute: "ok" },
    meal: { onigiri: "ok", snack: "good" },
    outing: { walk: "ok", ride: "good" },
    shopping: { book: "ok", ring: "ok" }
  },
  fashion: {
    morning_clothes: { comfy: "ok", cute: "good" },
    meal: { onigiri: "ok", snack: "ok" },
    outing: { walk: "ok", ride: "ok" },
    shopping: { book: "bad", ring: "good" }
  }
};

// リアクション文言
const reactionProfiles = {
  good: {
    jaMain: "大よろこび！",
    jaSub: "とっても満足そう。",
    enMain: "Delighted!",
    enSub: "They look really happy.",
    delta: 2
  },
  ok: {
    jaMain: "うれしそう。",
    jaSub: "いい感じのお世話かもしれませんね。",
    enMain: "Looks happy.",
    enSub: "Seems like a nice choice.",
    delta: 1
  },
  bad: {
    jaMain: "ちょっとがっかり…",
    jaSub: "次は好みに合わせてみてもいいかもしれません。",
    enMain: "A little disappointed...",
    enSub: "Maybe try their taste next time.",
    delta: 0
  }
};

// ゲーム画面用の翻訳
const gameTranslations = {
  ja: {
    heroTitle: (name) => `${name}とのお世話合戦`,
    heroSub:
      "10シーン分のお世話をえらんで、どれだけハートを集められるか試してみましょう。",
    heartLabel: "ハート",
    roundIndicator: (current, total) => `${current} / ${total}`,
    heartBar: (hearts) => `いまのハート：${hearts}`,
    nextButton: "つぎへ",
    resultTitle: (name) => `${name}との1日のミニ版が終わりました。`,
    resultSummary:
      "このキャラクターにとって「うれしいお世話」はどんな選択だったでしょうか。自分の好みとキャラの好みが食い違った場面も、あとで少し振り返ってみてもおもしろいかもしれませんね。",
    resultHearts: (hearts) => `今日あつまったハート：${hearts} コ`,
    resultNote:
      "※この記録は研究用ログとして活用される予定です（個人が特定される形では保存されません）。",
    playAgain: "もう一度あそぶ",
    backToTop: "キャラを選び直す"
  },
  en: {
    heroTitle: (name) => `Osewa Battle with ${name}`,
    heroSub:
      "Make 10 small care choices and see how many hearts you can collect.",
    heartLabel: "Hearts",
    roundIndicator: (current, total) => `${current} / ${total}`,
    heartBar: (hearts) => `Current hearts: ${hearts}`,
    nextButton: "Next",
    resultTitle: (name) => `Your mini-day with ${name} is over.`,
    resultSummary:
      "Which choices became “good care” for this character? It might be interesting to reflect later on the moments when your own preference differed from theirs.",
    resultHearts: (hearts) => `Hearts collected today: ${hearts}`,
    resultNote:
      "※Logs may be used for research, but will not be stored in a personally identifiable way.",
    playAgain: "Play again",
    backToTop: "Choose another character"
  }
};

let currentLangGame = localStorage.getItem("osewa_lang") || "ja";

document.addEventListener("DOMContentLoaded", () => {
  const langButtons = document.querySelectorAll(".lang-button");

  const playScreen = document.getElementById("play-screen");
  const resultScreen = document.getElementById("result-screen");

  const heroTitle = document.getElementById("hero-title");
  const heroSub = document.getElementById("hero-sub");
  const heartCount = document.getElementById("heart-count");
  const heartCountLabel = document.getElementById("heart-count-label");
  const roundIndicator = document.getElementById("round-indicator");
  const heartBarText = document.getElementById("heart-bar-text");

  const petImage = document.getElementById("pet-image");
  const petName = document.getElementById("pet-name");
  const petType = document.getElementById("pet-type");

  const sceneTitle = document.getElementById("scene-title");
  const sceneDesc = document.getElementById("scene-desc");

  const choiceAButton = document.getElementById("choice-a");
  const choiceBButton = document.getElementById("choice-b");
  const choiceAIcon = document.getElementById("choice-a-icon");
  const choiceBIcon = document.getElementById("choice-b-icon");
  const choiceALabel = document.getElementById("choice-a-label");
  const choiceBLabel = document.getElementById("choice-b-label");

  const reactionMain = document.getElementById("reaction-main");
  const reactionSub = document.getElementById("reaction-sub");

  const nextButton = document.getElementById("next-button");
  const nextButtonLabel = document.getElementById("next-button-label");

  const resultTitle = document.getElementById("result-title");
  const resultSummary = document.getElementById("result-summary");
  const resultHearts = document.getElementById("result-hearts");
  const resultNote = document.getElementById("result-note");
  const playAgainButton = document.getElementById("play-again-button");
  const backToTopButton = document.getElementById("back-to-top-button");

  // キャラ情報
  const characterId = localStorage.getItem("osewa_character_id");
  const characterName = localStorage.getItem("osewa_character_name") || "???";
  const characterImage = localStorage.getItem("osewa_character_image") || "";

  if (!characterId) {
    // 直接アクセスされた場合はトップへ
    window.location.href = "index.html";
    return;
  }

  // キャラ表示
  if (characterImage) {
    petImage.src = characterImage;
  }
  petName.textContent = characterName;
  const typeLabels = {
    health: { ja: "けんこうタイプ", en: "Health type" },
    food: { ja: "たべるの大好きタイプ", en: "Food lover type" },
    fashion: { ja: "おしゃれタイプ", en: "Fashion type" }
  };
  petType.textContent =
    (typeLabels[characterId] && typeLabels[characterId][currentLangGame]) ||
    "";

  // ラウンドシーケンス（4シーンを繰り返して10回ぶん）
  const rounds = [];
  for (let i = 0; i < TOTAL_ROUNDS; i++) {
    const scene = scenePool[i % scenePool.length];
    rounds.push(scene);
  }

  let currentRoundIndex = 0;
  let hearts = 0;
  let selectedOptionId = null;

  // ログ用（研究に使えるようにしておく）
  const choiceLog = [];

  function updateLangButtons() {
    langButtons.forEach((btn) => {
      if (btn.dataset.lang === currentLangGame) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  function applyGameTranslations() {
    const dict =
      gameTranslations[currentLangGame] || gameTranslations["ja"];

    document.title =
      currentLangGame === "ja"
        ? "お世話合戦｜ゲーム"
        : "Osewa Battle | Game";

    heroTitle.textContent = dict.heroTitle(characterName);
    heroSub.textContent = dict.heroSub;

    heartCountLabel.textContent = dict.heartLabel;
    roundIndicator.textContent = dict.roundIndicator(
      currentRoundIndex + 1,
      TOTAL_ROUNDS
    );
    heartBarText.textContent = dict.heartBar(hearts);

    nextButtonLabel.textContent = dict.nextButton;

    // ペットタイプ表示も言語に合わせる
    if (typeLabels[characterId]) {
      petType.textContent = typeLabels[characterId][currentLangGame];
    }

    // 結果画面（ラウンド終了後に使う）
    resultTitle.textContent = dict.resultTitle(characterName);
    resultSummary.textContent = dict.resultSummary;
    resultHearts.textContent = dict.resultHearts(hearts);
    resultNote.textContent = dict.resultNote;

    playAgainButton.textContent = dict.playAgain;
    backToTopButton.textContent = dict.backToTop;

    // 現在のシーンのタイトル・選択肢も更新
    renderScene();
  }

  function renderScene() {
    const scene = rounds[currentRoundIndex];
    if (!scene) return;

    const isJa = currentLangGame === "ja";

    sceneTitle.textContent = isJa ? scene.titleJa : scene.titleEn;
    sceneDesc.textContent = isJa ? scene.descJa : scene.descEn;

    const [optA, optB] = scene.options;

    choiceAIcon.textContent = optA.icon;
    choiceBIcon.textContent = optB.icon;
    choiceALabel.textContent = isJa ? optA.labelJa : optA.labelEn;
    choiceBLabel.textContent = isJa ? optB.labelJa : optB.labelEn;

    // 選択状態リセット
    selectedOptionId = null;
    choiceAButton.classList.remove("selected");
    choiceBButton.classList.remove("selected");
    reactionMain.textContent = "";
    reactionSub.textContent = "";
    nextButton.disabled = true;

    // ステータス
    const dict =
      gameTranslations[currentLangGame] || gameTranslations["ja"];
    roundIndicator.textContent = dict.roundIndicator(
      currentRoundIndex + 1,
      TOTAL_ROUNDS
    );
    heartCount.textContent = hearts;
    heartBarText.textContent = dict.heartBar(hearts);
  }

  function handleChoice(optionId) {
    const scene = rounds[currentRoundIndex];
    const prefForChar =
      (preferenceMap[characterId] &&
        preferenceMap[characterId][scene.id]) ||
      {};
    const prefKey = prefForChar[optionId] || "ok"; // データがなければ中くらい扱い

    const profile = reactionProfiles[prefKey] || reactionProfiles["ok"];
    hearts += profile.delta;

    const isJa = currentLangGame === "ja";

    reactionMain.textContent = isJa ? profile.jaMain : profile.enMain;
    reactionSub.textContent = isJa ? profile.jaSub : profile.enSub;

    heartCount.textContent = hearts;
    const dict =
      gameTranslations[currentLangGame] || gameTranslations["ja"];
    heartBarText.textContent = dict.heartBar(hearts);

    // ログ追加
    choiceLog.push({
      round: currentRoundIndex + 1,
      sceneId: scene.id,
      optionId,
      preference: prefKey,
      delta: profile.delta,
      totalHearts: hearts,
      timestamp: new Date().toISOString()
    });

    nextButton.disabled = false;
  }

  function finishGame() {
    playScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");

    const dict =
      gameTranslations[currentLangGame] || gameTranslations["ja"];
    resultTitle.textContent = dict.resultTitle(characterName);
    resultSummary.textContent = dict.resultSummary;
    resultHearts.textContent = dict.resultHearts(hearts);
    resultNote.textContent = dict.resultNote;

    // ログを localStorage に保存（上書きでシンプルに）
    const sessionData = {
      characterId,
      characterName,
      hearts,
      choiceLog
    };
    localStorage.setItem(
      "osewa_lastSession",
      JSON.stringify(sessionData)
    );
  }

  // 言語切り替え
  updateLangButtons();
  renderScene();
  applyGameTranslations(); // 初期テキスト

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

  // 選択ボタン
  choiceAButton.addEventListener("click", () => {
    const scene = rounds[currentRoundIndex];
    const opt = scene.options[0];
    selectedOptionId = opt.id;
    choiceAButton.classList.add("selected");
    choiceBButton.classList.remove("selected");
    handleChoice(selectedOptionId);
  });

  choiceBButton.addEventListener("click", () => {
    const scene = rounds[currentRoundIndex];
    const opt = scene.options[1];
    selectedOptionId = opt.id;
    choiceBButton.classList.add("selected");
    choiceAButton.classList.remove("selected");
    handleChoice(selectedOptionId);
  });

  // つぎへボタン
  nextButton.addEventListener("click", () => {
    if (currentRoundIndex < TOTAL_ROUNDS - 1) {
      currentRoundIndex += 1;
      renderScene();
    } else {
      finishGame();
    }
  });

  // もう一度あそぶ
  playAgainButton.addEventListener("click", () => {
    hearts = 0;
    currentRoundIndex = 0;
    choiceLog.length = 0;

    playScreen.classList.remove("hidden");
    resultScreen.classList.add("hidden");
    renderScene();
    applyGameTranslations();
  });

  // キャラ選び直し
  backToTopButton.addEventListener("click", () => {
    window.location.href = "index.html";
  });
});
