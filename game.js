// 1プレイあたりのシーン数
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

  // 10個のシーン定義
  const scenePool = [
    {
      id: "meal",
      titleJa: "ごはんをえらぶ",
      descJa: "きょうのメインはどっち？",
      titleEn: "Meal: Choose food",
      descEn: "What will be today’s main?",
      options: [
        { id: "onigiri", icon: "🍙", labelJa: "おにぎり", labelEn: "Rice ball" },
        { id: "snack", icon: "🍪", labelJa: "お菓子", labelEn: "Snacks" }
      ]
    },
    {
      id: "clothes",
      titleJa: "出かける服をえらぶ",
      descJa: "どんな服で出かけよう？",
      titleEn: "Clothes: Going-out outfit",
      descEn: "What will they wear today?",
      options: [
        { id: "comfy", icon: "🩳", labelJa: "うごきやすい服", labelEn: "Comfy clothes" },
        { id: "cute", icon: "👗", labelJa: "かわいい服", labelEn: "Cute outfit" }
      ]
    },
    {
      id: "transport",
      titleJa: "お出かけの手段",
      descJa: "どうやって行こう？",
      titleEn: "Going out: How to go",
      descEn: "How will you go?",
      options: [
        { id: "walk", icon: "🚶", labelJa: "歩いて行く", labelEn: "Walk" },
        { id: "ride", icon: "🚌", labelJa: "乗り物に乗る", labelEn: "Take transport" }
      ]
    },
    {
      id: "accessory",
      titleJa: "アクセサリーをえらぶ",
      descJa: "きょうのポイントアイテムは？",
      titleEn: "Accessory: Choose an item",
      descEn: "Which accessory will you choose?",
      options: [
        { id: "hat", icon: "👒", labelJa: "ぼうし", labelEn: "Hat" },
        { id: "ring", icon: "💍", labelJa: "指輪", labelEn: "Ring" }
      ]
    },
    {
      id: "drink",
      titleJa: "のみものをえらぶ",
      descJa: "ひと休みの一杯はどっち？",
      titleEn: "Drink: Choose a drink",
      descEn: "What will they drink?",
      options: [
        { id: "water", icon: "💧", labelJa: "お水", labelEn: "Water" },
        { id: "juice", icon: "🥤", labelJa: "ジュース", labelEn: "Juice" }
      ]
    },
    {
      id: "snack_time",
      titleJa: "おやつタイム",
      descJa: "きょうのおやつは？",
      titleEn: "Snack time",
      descEn: "What will today’s snack be?",
      options: [
        { id: "fruit", icon: "🍎", labelJa: "フルーツ", labelEn: "Fruit" },
        { id: "cake", icon: "🍰", labelJa: "ケーキ", labelEn: "Cake" }
      ]
    },
    {
      id: "rest",
      titleJa: "休み方をえらぶ",
      descJa: "どんなふうにひと休みする？",
      titleEn: "Rest: How to take a break",
      descEn: "How will they rest?",
      options: [
        { id: "stretch", icon: "🤸", labelJa: "ストレッチ", labelEn: "Stretch" },
        { id: "sofa", icon: "🛋️", labelJa: "ごろごろタイム", labelEn: "Chill on sofa" }
      ]
    },
    {
      id: "destination",
      titleJa: "お出かけ先をえらぶ",
      descJa: "きょうはどこに行く？",
      titleEn: "Destination: Where to go",
      descEn: "Where will you go today?",
      options: [
        { id: "park", icon: "🌳", labelJa: "こうえん", labelEn: "Park" },
        { id: "restaurant", icon: "🍽️", labelJa: "ファミレス", labelEn: "Family restaurant" }
      ]
    },
    {
      id: "room",
      titleJa: "お部屋のちょっとしたお世話",
      descJa: "どこからととのえる？",
      titleEn: "Room care",
      descEn: "What will you tidy up?",
      options: [
        { id: "desk", icon: "🪑", labelJa: "机をかたづける", labelEn: "Tidy desk" },
        { id: "clothes", icon: "👚", labelJa: "服をかける", labelEn: "Hang clothes" }
      ]
    },
    {
      id: "night",
      titleJa: "ねる前のひと工夫",
      descJa: "ねる前にどっちをする？",
      titleEn: "Before sleep",
      descEn: "What will they do before bed?",
      options: [
        { id: "night_stretch", icon: "🧘", labelJa: "ねる前ストレッチ", labelEn: "Stretch before bed" },
        { id: "late_snack", icon: "🍮", labelJa: "夜食タイム", labelEn: "Late-night snack" }
      ]
    }
  ];

  // キャラごとの「ハートの増え方」マップ
  // どの選択でも最低 +1、性格に合うと +2
  const pointMap = {
    health: {
      meal:        { onigiri: 2, snack: 1 },
      clothes:     { comfy: 2,   cute: 1 },
      transport:   { walk: 2,    ride: 1 },
      accessory:   { hat: 1,     ring: 1 },
      drink:       { water: 2,   juice: 1 },
      snack_time:  { fruit: 2,   cake: 1 },
      rest:        { stretch: 2, sofa: 1 },
      destination: { park: 2,    restaurant: 1 },
      room:        { desk: 2,    clothes: 2 },
      night:       { night_stretch: 2, late_snack: 1 }
    },
    food: {
      meal:        { onigiri: 1, snack: 2 },
      clothes:     { comfy: 1,   cute: 1 },
      transport:   { walk: 1,    ride: 2 },
      accessory:   { hat: 1,     ring: 1 },
      drink:       { water: 1,   juice: 2 },
      snack_time:  { fruit: 1,   cake: 2 },
      rest:        { stretch: 1, sofa: 2 },
      destination: { park: 1,    restaurant: 2 },
      room:        { desk: 1,    clothes: 1 },
      night:       { night_stretch: 1, late_snack: 2 }
    },
    fashion: {
      meal:        { onigiri: 1, snack: 1 },
      clothes:     { comfy: 1,   cute: 2 },
      transport:   { walk: 1,    ride: 1 },
      accessory:   { hat: 2,     ring: 2 },
      drink:       { water: 1,   juice: 1 },
      snack_time:  { fruit: 1,   cake: 1 },
      rest:        { stretch: 1, sofa: 1 },
      destination: { park: 1,    restaurant: 2 },
      room:        { desk: 1,    clothes: 2 },
      night:       { night_stretch: 2, late_snack: 1 }
    }
  };

  // 画面テキスト
  const gameTranslations = {
    ja: {
      heroTitle: function (name) { return name + "とのお世話合戦"; },
      heroSub: "毎日のちいさな行動を、キャラクターへの「お世話」としてえらんでいくミニゲームです。10この場面を通して、どんな1日になるか試してみましょう。",
      heartLabel: "ハート",
      roundIndicator: function (current, total) { return current + " / " + total; },
      heartBar: function (hearts) { return "いまのハート：" + hearts; },
      nextButton: "つぎへ",
      resultTitle: function (name) { return name + "との1日のミニ版が終わりました。"; },
      resultSummary: "このキャラクターにとって「うれしいお世話」はどんな選択だったでしょうか。自分の選び方のくせや、キャラとのちがいに気づいたら、あとで少しメモしてみてもおもしろいかもしれませんね。",
      resultHearts: function (hearts) { return "今日あつまったハート：" + hearts + " コ"; },
      resultNote: "※この記録は研究用ログとして活用される予定です（個人が特定される形では保存されません）。",
      playAgain: "もう一度あそぶ",
      backToTop: "キャラを選び直す"
    },
    en: {
      heroTitle: function (name) { return "Osewa Battle with " + name; },
      heroSub: "This mini-game lets you turn small everyday actions into “care” for your character. Make 10 choices and see what kind of day it becomes.",
      heartLabel: "Hearts",
      roundIndicator: function (current, total) { return current + " / " + total; },
      heartBar: function (hearts) { return "Current hearts: " + hearts; },
      nextButton: "Next",
      resultTitle: function (name) { return "Your mini-day with " + name + " is over."; },
      resultSummary: "Which choices felt like “good care” for this character? Noticing the gaps between your preferences and theirs might be an interesting reflection.",
      resultHearts: function (hearts) { return "Hearts collected today: " + hearts; },
      resultNote: "Logs may be used for research, but will not be stored in a personally identifiable way.",
      playAgain: "Play again",
      backToTop: "Choose another character"
    }
  };

  // 「いいね」「ありがとう」などの短いコメント（吹き出し用）
  const reactionTexts = {
    ja: {
      strong: {
        main: "すごくうれしい！",
        sub: "ありがとう"
      },
      soft: {
        main: "いいね、ありがとう。",
        sub: "とってもハッピー"
      }
    },
    en: {
      strong: {
        main: "I’m so happy!",
        sub: "thank you!."
      },
      soft: {
        main: "Nice, thank you!",
        sub: "I’m so happy!"
      }
    }
  };

  // 状態
  let hearts = 0;
  let currentRoundIndex = 0;
  const choiceLog = [];

  // 10シーンをそのまま順番に
  const rounds = scenePool.slice(0, TOTAL_ROUNDS);

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

    // ログを保存
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

    const charPoints = pointMap[characterId] || {};
    const scenePoints = charPoints[scene.id] || {};
    const delta = scenePoints[choice.id] || 1; // どの選択でも最低 1

    hearts += delta;
    updateStatusUI();
    nextButton.disabled = false;

    // コメント（吹き出し用）
    const langReactions = reactionTexts[currentLangGame] || reactionTexts.ja;
    const key = delta >= 2 ? "strong" : "soft";
    const reaction = langReactions[key];

    reactionMain.textContent = reaction.main;
    reactionSub.textContent = reaction.sub;

    choiceLog.push({
      round: currentRoundIndex + 1,
      sceneId: scene.id,
      optionId: choice.id,
      delta: delta,
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
