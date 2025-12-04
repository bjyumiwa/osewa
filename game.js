// ゲーム全体のシーン数
const TOTAL_ROUNDS = 10;

document.addEventListener("DOMContentLoaded", function () {
  // 言語
  let currentLangGame = localStorage.getItem("osewa_lang") || "ja";

  // DOM 要素
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

  // キャラ情報を localStorage から取得
  const characterId = localStorage.getItem("osewa_character_id");
  const characterName = localStorage.getItem("osewa_character_name") || "???";
  const characterImage = localStorage.getItem("osewa_character_image") || "";

  if (!characterId) {
    // 直接アクセスされた場合はトップへ
    window.location.href = "index.html";
    return;
  }

  // キャラのタイプ名（2言語）
  const typeLabels = {
    health: { ja: "けんこうタイプ", en: "Health type" },
    food: { ja: "たべるの大好きタイプ", en: "Food lover type" },
    fashion: { ja: "おしゃれタイプ", en: "Fashion type" }
  };

  // シーン定義
  const scenePool = [
    {
      id: "morning_clothes",
      titleJa: "朝：きょうの服をえらぶ",
      descJa: "どちらの服を着せる？",
      titleEn: "Morning: Choose today’s clothes",
      descEn: "Which outfit will you put on?",
      options: [
        { id: "comfy", icon: "🩳", labelJa: "動きやすい服", labelEn: "Comfy clothes" },
        { id: "cute", icon: "👗", labelJa: "かわいい服", labelEn: "Cute outfit" }
      ]
    },
    {
      id: "meal",
      titleJa: "昼：ごはんをえらぶ",
      descJa: "どちらを食べさせる？",
      titleEn: "Meal: Choose food",
      descEn: "Which will you let them eat?",
      options: [
        { id: "onigiri", icon: "🍙", labelJa: "おにぎり", labelEn: "Rice ball" },
        { id: "snack", icon: "🍪", labelJa: "お菓子", labelEn: "Snacks" }
      ]
    },
    {
      id: "outing",
      titleJa: "外出：出かけかたをえらぶ",
      descJa: "どうやって行こう？",
      titleEn: "Going out: Choose how to go",
      descEn: "How will you go?",
      options: [
        { id: "walk", icon: "🚶", labelJa: "歩いて行く", labelEn: "Walk" },
        { id: "ride", icon: "🚌", labelJa: "乗り物に乗る", labelEn: "Take transport" }
      ]
    },
    {
      id: "shopping",
      titleJa: "買い物：どっちを買う？",
      descJa: "今日はどちらをプレゼントする？",
      titleEn: "Shopping: What to buy?",
      descEn: "Which will you gift today?",
      options: [
        { id: "book", icon: "📘", labelJa: "本", labelEn: "Book" },
        { id: "ring", icon: "💍", labelJa: "指輪", labelEn: "Ring" }
      ]
    }
  ];

  // キャラごとの好み
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

  // リアクション
  const reactionProfiles = {
    good: { delta: 2, jaMain: "大よろこび！", jaSub: "とっても満足そう。", enMain: "Delighted!", enSub: "They look really happy." },
    ok:   { delta: 1, jaMain: "うれしそう。", jaSub: "いい感じのお世話かもしれませんね。", enMain: "Looks happy.", enSub: "Seems like a nice choice." },
    bad:  { delta: 0, jaMain: "ちょっとがっかり…", jaSub: "次は好みに合わせてみてもいいかもしれません。", enMain: "A little disappointed...", enSub: "Maybe try their taste next time." }
  };

  // 画面テキスト
  const gameTranslations = {
    ja: {
      heroTitle: function (name) { return name + "とのお世話合戦"; },
      heroSub: "10シーン分のお世話をえらんで、どれだけハートを集められるか試してみましょう。",
      heartLabel: "ハート",
      roundIndicator: function (current, total) { return current + " / " + total; },
      heartBar: function (hearts) { return "いまのハート：" + hearts; },
      nextButton: "つぎへ",
      resultTitle: function (name) { return name + "との1日のミニ版が終わりました。"; },
      resultSummary: "このキャラクターにとって「うれしいお世話」はどんな選択だったでしょうか。自分の好みとキャラの好みが食い違った場面も、あとで少し振り返ってみてもおもしろいかもしれませんね。",
      resultHearts: function (hearts) { return "今日あつまったハート：" + hearts + " コ"; },
      resultNote: "※この記録は研究用ログとして活用される予定です（個人が特定される形では保存されません）。",
      playAgain: "もう一度あそぶ",
      backToTop: "キャラを選び直す"
    },
    en: {
      heroTitle: function (name) { return "Osewa Battle with " + name; },
      heroSub: "Make 10 small care choices and see how many hearts you can collect.",
      heartLabel: "Hearts",
      roundIndicator: function (current, total) { return current + " / " + total; },
      heartBar: function (hearts) { return "Current hearts: " + hearts; },
      nextButton: "Next",
      resultTitle: function (name) { return "Your mini-day with " + name + " is over."; },
      resultSummary: "Which choices became “good care” for this character? It might be interesting to reflect later on the moments when your own preference differed from theirs.",
      resultHearts: function (hearts) { return "Hearts collected today: " + hearts; },
      resultNote: "Logs may be used for research, but will not be stored in a personally identifiable way.",
      playAgain: "Play again",
      backToTop: "Choose another character"
    }
  };

  // 状態
  let hearts = 0;
  let currentRoundIndex = 0;
  const choiceLog = [];

  // シーン列（4つをぐるぐる回して10回ぶん）
  const rounds = [];
  for (let i = 0; i < TOTAL_ROUNDS; i++) {
    rounds.push(scenePool[i % scenePool.length]);
  }

  // キャラ表示
  if (characterImage) {
    petImage.src = characterImage;
  }
  petName.textContent = characterName;
  if (typeLabels[characterId]) {
    petType.textContent = typeLabels[characterId][currentLangGame];
  }

  // 言語関連
  function getDict() {
    return gameTranslations[currentLangGame] || gameTranslations.ja;
  }

  function updateLangButtons() {
    langButtons.forEach(function (btn) {
      if (btn.dataset.lang === currentLangGame) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  function updateStatusUI() {
    const dict = getDict();
    heartCount.textContent = hearts;
    heartBarText.textContent = dict.heartBar(hearts);
    roundIndicator.textContent = dict.roundIndicator(currentRoundIndex + 1, TOTAL_ROUNDS);
  }

  function renderScene() {
    const scene = rounds[currentRoundIndex];
    const dict = getDict();
    const isJa = currentLangGame === "ja";

    sceneTitle.textContent = isJa ? scene.titleJa : scene.titleEn;
    sceneDesc.textContent = isJa ? scene.descJa : scene.descEn;

    const optA = scene.options[0];
    const optB = scene.options[1];

    choiceAIcon.textContent = optA.icon;
    choiceALabel.textContent = isJa ? optA.labelJa : optA.labelEn;
    choiceBIcon.textContent = optB.icon;
    choiceBLabel.textContent = isJa ? optB.labelJa : optB.labelEn;

    // 選択状態リセット
    choiceAButton.classList.remove("selected");
    choiceBButton.classList.remove("selected");
    reactionMain.textContent = "";
    reactionSub.textContent = "";
    nextButton.disabled = true;

    // ステータス更新
    updateStatusUI();

    // ヘッダーなど
    heroTitle.textContent = dict.heroTitle(characterName);
    heroSub.textContent = dict.heroSub;
    heartCountLabel.textContent = dict.heartLabel;
    nextButtonLabel.textContent = dict.nextButton;
  }

  function showResultScreen() {
    const dict = getDict();

    playScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");

    resultTitle.textContent = dict.resultTitle(characterName);
    resultSummary.textContent = dict.resultSummary;
    resultHearts.textContent = dict.resultHearts(hearts);
    resultNote.textContent = dict.resultNote;

    // ログを保存（必要ならあとで取り出せる）
    const sessionData = {
      characterId: characterId,
      characterName: characterName,
      hearts: hearts,
      choiceLog: choiceLog
    };
    localStorage.setItem("osewa_lastSession", JSON.stringify(sessionData));
  }

  function handleChoice(optionIndex) {
    const scene = rounds[currentRoundIndex];
    const choice = scene.options[optionIndex];
    const prefsByScene = preferenceMap[characterId] || {};
    const prefs = prefsByScene[scene.id] || {};
    const prefKey = prefs[choice.id] || "ok";
    const profile = reactionProfiles[prefKey] || reactionProfiles.ok;
    const dict = getDict();
    const isJa = currentLangGame === "ja";

    hearts += profile.delta;

    reactionMain.textContent = isJa ? profile.jaMain : profile.enMain;
    reactionSub.textContent = isJa ? profile.jaSub : profile.enSub;

    updateStatusUI();
    nextButton.disabled = false;

    choiceLog.push({
      round: currentRoundIndex + 1,
      sceneId: scene.id,
      optionId: choice.id,
      preference: prefKey,
      delta: profile.delta,
      totalHearts: hearts,
      timestamp: new Date().toISOString()
    });
  }

  // 初期表示
  updateLangButtons();
  renderScene();

  // 言語切り替え
  langButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const lang = btn.dataset.lang;
      if (!gameTranslations[lang]) return;
      currentLangGame = lang;

      // タイプ名も更新
      if (typeLabels[characterId]) {
        petType.textContent = typeLabels[characterId][currentLangGame];
      }

      localStorage.setItem("osewa_lang", currentLangGame);
      updateLangButtons();
      renderScene();
    });
  });

  // 選択肢のクリック
  choiceAButton.addEventListener("click", function () {
    choiceAButton.classList.add("selected");
    choiceBButton.classList.remove("selected");
    handleChoice(0);
  });

  choiceBButton.addEventListener("click", function () {
    choiceBButton.classList.add("selected");
    choiceAButton.classList.remove("selected");
    handleChoice(1);
  });

  // 「つぎへ」ボタン
  nextButton.addEventListener("click", function () {
    if (currentRoundIndex < TOTAL_ROUNDS - 1) {
      currentRoundIndex += 1;
      renderScene();
    } else {
      showResultScreen();
    }
  });

  // もう一度あそぶ
  playAgainButton.addEventListener("click", function () {
    hearts = 0;
    currentRoundIndex = 0;
    choiceLog.length = 0;
    playScreen.classList.remove("hidden");
    resultScreen.classList.add("hidden");
    renderScene();
  });

  // キャラ選び直し
  backToTopButton.addEventListener("click", function () {
    window.location.href = "index.html";
  });
});
