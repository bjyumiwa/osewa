import React, { useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';

type GameState = 'character-select' | 'playing' | 'result';
type Emotion = 'neutral' | 'happy' | 'very_happy' | 'sad';

type CharacterId = 'health' | 'foodie' | 'fashion';

type SceneOption = {
  id: string;
  label: string;
  emoji: string;
  type: 'outfit' | 'food' | 'transport' | 'shopping';
};

type Scene = {
  id: string;
  title: string;
  question: string;
  options: SceneOption[];
};

const characters = {
  health: {
    id: 'health' as CharacterId,
    name: 'ヘルシーちゃん',
    color: 'bg-green-400',
    description: '健康第一！運動と栄養を大切にするキャラ',
    preferences: {
      outfit: 'sporty',
      food: 'healthy',
      transport: 'walk',
      shopping: 'book',
    },
  },
  foodie: {
    id: 'foodie' as CharacterId,
    name: 'グルメくん',
    color: 'bg-blue-400',
    description: '食べることが大好き！美味しいものに目がないキャラ',
    preferences: {
      outfit: 'comfy',
      food: 'tasty',
      transport: 'ride',
      shopping: 'food',
    },
  },
  fashion: {
    id: 'fashion' as CharacterId,
    name: 'ファッショにゃん',
    color: 'bg-pink-400',
    description: 'おしゃれ命！見た目にこだわるキャラ',
    preferences: {
      outfit: 'stylish',
      food: 'cafe',
      transport: 'ride',
      shopping: 'accessory',
    },
  },
} as const;

const scenes: Scene[] = [
  {
    id: 'morning',
    title: '朝：今日の服装',
    question: 'どんな服を着る？',
    options: [
      { id: 'sporty', label: '動きやすい服', emoji: '👟', type: 'outfit' },
      { id: 'stylish', label: 'おしゃれな服', emoji: '👗', type: 'outfit' },
    ],
  },
  {
    id: 'breakfast',
    title: '朝食タイム',
    question: '何を食べる？',
    options: [
      { id: 'healthy', label: 'おにぎり', emoji: '🍙', type: 'food' },
      { id: 'tasty', label: 'お菓子', emoji: '🍰', type: 'food' },
    ],
  },
  {
    id: 'commute',
    title: '外出',
    question: 'どうやって行く？',
    options: [
      { id: 'walk', label: '歩いて行く', emoji: '🚶', type: 'transport' },
      { id: 'ride', label: '乗り物に乗る', emoji: '🚗', type: 'transport' },
    ],
  },
  {
    id: 'shopping',
    title: 'お買い物',
    question: '何を買う？',
    options: [
      { id: 'book', label: '本', emoji: '📚', type: 'shopping' },
      { id: 'accessory', label: '指輪', emoji: '💍', type: 'shopping' },
    ],
  },
];

// 画像パス（public/char/ 以下）
const characterImages: Record<CharacterId, Record<Emotion, string>> = {
  foodie: {
    neutral: '/char/bluecalm.png',
    happy: '/char/bluejoy.png',
    very_happy: '/char/bluejoy.png',
    sad: '/char/blue sad.png',
  },
  health: {
    neutral: '/char/green sleep.png',
    happy: '/char/greenjoy.png',
    very_happy: '/char/greenjoy.png',
    sad: '/char/greensad.png',
  },
  fashion: {
    neutral: '/char/pink sleep.png',
    happy: '/char/pinkcalm.png',
    very_happy: '/char/pinkcalm.png',
    sad: '/char/pinksad.png',
  },
};

const characterThumbnails: Record<CharacterId, string> = {
  health: '/char/greenjoy.png',
  foodie: '/char/bluejoy.png',
  fashion: '/char/pinkcalm.png',
};

const OsewaGassen: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('character-select');
  const [selectedCharacter, setSelectedCharacter] =
    useState<(typeof characters)[CharacterId] | null>(null);
  const [currentScene, setCurrentScene] = useState(0);
  const [hearts, setHearts] = useState(0);
  const [emotion, setEmotion] = useState<Emotion>('neutral');
  const [logs, setLogs] = useState<any[]>([]);
  const [sceneStartTime, setSceneStartTime] = useState(Date.now());

  const handleCharacterSelect = (charId: CharacterId) => {
    const char = characters[charId];
    setSelectedCharacter(char);
    setGameState('playing');
    setSceneStartTime(Date.now());
    setEmotion('neutral');
    setLogs([
      {
        event: 'character_selected',
        character_id: charId,
        timestamp: new Date().toISOString(),
        selection_time: 0,
      },
    ]);
  };

  const handleChoice = (option: SceneOption) => {
    if (!selectedCharacter) return;
    const scene = scenes[currentScene];
    const decisionTime = (Date.now() - sceneStartTime) / 1000;

    const charPref = selectedCharacter.preferences[option.type];
    const isMatch = charPref === option.id;

    let heartChange = 0;
    let newEmotion: Emotion = 'neutral';

    if (isMatch) {
      heartChange = 2;
      newEmotion = 'very_happy';
    } else {
      if (selectedCharacter.id === 'health' && option.id === 'walk') heartChange = 2;
      else if (selectedCharacter.id === 'foodie' && (option.id === 'tasty' || option.id === 'cafe')) heartChange = 2;
      else if (selectedCharacter.id === 'fashion' && (option.id === 'stylish' || option.id === 'accessory')) heartChange = 2;
      else heartChange = 0;

      newEmotion = heartChange > 0 ? 'happy' : 'sad';
    }

    const newHearts = hearts + heartChange;
    setHearts(newHearts);
    setEmotion(newEmotion);

    const log = {
      scene_id: scene.id,
      scene_number: currentScene + 1,
      presented_option_A: scene.options[0].id,
      presented_option_B: scene.options[1].id,
      character_preference: charPref,
      player_choice: option.id,
      timestamp: new Date().toISOString(),
      decision_time: decisionTime,
      is_conflict: !isMatch,
      heart_change: heartChange,
      total_hearts: newHearts,
      character_reaction: newEmotion,
    };

    setLogs((prev) => [...prev, log]);

    setTimeout(() => {
      if (currentScene < scenes.length - 1) {
        setCurrentScene((prev) => prev + 1);
        setEmotion('neutral');
        setSceneStartTime(Date.now());
      } else {
        setGameState('result');
      }
    }, 1500);
  };

  const resetGame = () => {
    setGameState('character-select');
    setSelectedCharacter(null);
    setCurrentScene(0);
    setHearts(0);
    setEmotion('neutral');
    setLogs([]);
    setSceneStartTime(Date.now());
  };

  const getCharacterImage = () => {
    if (!selectedCharacter) return '';
    const id = selectedCharacter.id as CharacterId;
    return characterImages[id][emotion] || characterImages[id].neutral;
  };

  // キャラクター選択
  if (gameState === 'character-select') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-100 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4 text-purple-800">
            お世話合戦
          </h1>
          <p className="text-center text-gray-700 mb-8">
            お世話するキャラクターを選んでね！
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.values(characters).map((char) => (
              <div
                key={char.id}
                onClick={() => handleCharacterSelect(char.id)}
                className="bg-white rounded-lg p-6 cursor-pointer hover:shadow-xl transition-all transform hover:scale-105"
              >
                <div className="w-full h-48 mb-4 flex items-center justify-center">
                  <img
                    src={characterThumbnails[char.id]}
                    alt={char.name}
                    className="max-h-48 object-contain drop-shadow-lg"
                  />
                </div>
                <h3 className="text-xl font-bold text-center mb-2">{char.name}</h3>
                <p className="text-sm text-gray-600 text-center">
                  {char.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // プレイ中
  if (gameState === 'playing' && selectedCharacter) {
    const scene = scenes[currentScene];

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-green-100 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg p-4 mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{selectedCharacter.name}</h2>
              <p className="text-sm text-gray-600">
                シーン {currentScene + 1} / {scenes.length}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="text-red-500" fill="currentColor" />
              <span className="text-2xl font-bold">{hearts}</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-8 mb-6">
            <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
              <img
                src={getCharacterImage()}
                alt={selectedCharacter.name}
                className="w-48 h-48 object-contain drop-shadow-2xl"
              />
              {emotion === 'very_happy' && (
                <div className="absolute -top-4 -right-4">
                  <Sparkles className="w-12 h-12 text-yellow-400" />
                </div>
              )}
              {emotion === 'sad' && (
                <div className="absolute bottom-2 text-3xl">😢</div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold mb-2">{scene.title}</h3>
            <p className="text-lg mb-6">{scene.question}</p>

            <div className="grid grid-cols-2 gap-4">
              {scene.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option)}
                  className="bg-gradient-to-br from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg p-6 transform hover:scale-105 transition-all"
                >
                  <div className="text-4xl mb-2">{option.emoji}</div>
                  <div className="font-bold">{option.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 結果画面
  if (gameState === 'result' && selectedCharacter) {
    const maxHearts = scenes.length * 2;
    const score = Math.round((hearts / maxHearts) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-orange-100 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">お世話完了！</h2>

            <div className="w-32 h-32 mx-auto mb-6 flex items-center justify-center">
              <img
                src={getCharacterImage()}
                alt={selectedCharacter.name}
                className="w-32 h-32 object-contain drop-shadow-xl"
              />
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Heart className="text-red-500" fill="currentColor" />
                <span className="text-4xl font-bold">{hearts}</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">
                スコア: {score}点
              </p>
            </div>

            <div className="mb-6 p-4 bg-purple-50 rounded-lg max-h-48 overflow-y-auto text-sm text-left">
              <h3 className="font-bold mb-2">今日のお世話記録</h3>
              {logs
                .filter((log) => log.scene_id)
                .map((log, idx) => (
                  <div key={idx} className="mb-1">
                    {scenes[idx]?.title}: {log.player_choice}
                    {log.is_conflict ? '（好みと違った）' : ' ✨'}
                  </div>
                ))}
            </div>

            <div className="space-y-4">
              <button
                onClick={resetGame}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-bold hover:from-purple-600 hover:to-pink-600"
              >
                もう一度遊ぶ
              </button>

              <button
                onClick={() => console.log('ログデータ:', logs)}
                className="w-full bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-300"
              >
                ログデータを確認（コンソール）
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default OsewaGassen;
