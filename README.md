<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Running Game (像素跑酷)

這是一個基於 React 與 HTML5 Canvas 開發的 2D 橫向卷軸跑酷遊戲。玩家在遊戲中需要抓準時機跳躍閃避障礙物、收集金幣，並不斷挑戰自己的最高分紀錄！

## 🌟 遊戲特色 (Features)

* **🎨 多樣化的像素角色 (Multiple Pixel Characters)**
  內建多款精心設計的像素風格角色，包含暴龍、恐龍騎士、飛鳥、機器人、忍者、外星人以及幽靈等，增添遊戲趣味。
* **✨ 專屬動畫與特效 (Unique Animations & Effects)**
  每個角色在跳躍與奔跑時，都會觸發與其設定相符的專屬動畫與物理回饋（例如：忍者華麗的前空翻、幽靈的半透明閃爍、外星人的盤旋傾斜等）。
* **🌈 多重環境與障礙物 (Dynamic Environments)**
  遊戲地圖會隨機生成草地、沙漠、霓虹、冰原等多種風格的障礙物，讓每一次的跑酷過程都有不同的視覺體驗。
* **💨 流暢的粒子系統 (Particle System)**
  遊戲內建精美的 Canvas 粒子系統，在玩家進行跳躍、吃金幣等動作時，會產生生動的粒子視覺回饋。
* **🏆 自動記錄最高分 (High Score Tracking)**
  系統會自動計算您的奔跑距離與金幣數量，並將最高分安全地儲存在瀏覽器的 `LocalStorage` 中，讓您能不斷挑戰自我極限。
* **⚡ 現代化技術棧 (Modern Tech Stack)**
  使用 Vite + React 19 構建，UI 介面採用 Tailwind CSS 進行排版，保證了極快的啟動速度與順暢的遊戲體驗。

## 🚀 如何在本地端執行 (Run Locally)

**環境需求:** Node.js

1. 安裝專案依賴套件:
   ```bash
   npm install
   ```
2. 啟動本地開發伺服器:
   ```bash
   npm run dev
   ```
3. 開啟終端機顯示的網址（通常為 `http://localhost:3000`），即可開始遊玩！

## 🌐 部署至 GitHub Pages (Deployment)

本專案已配置好 GitHub Actions 部署腳本。只要將程式碼推送到 `main` 或 `master` 分支，GitHub 就會自動編譯專案並將遊戲發布至您的 GitHub Pages 上。
