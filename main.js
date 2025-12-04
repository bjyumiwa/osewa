// main.js （テスト用）

alert("main.js が読み込まれました");  // 最初にアラートで確認

const root = document.getElementById("root");

if (!root) {
  alert("root 要素が見つかりません");
} else {
  root.textContent = "テスト：main.js から描画しています。";
}
