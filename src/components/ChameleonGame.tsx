import React, { useRef, useEffect, useState } from 'react';

type Obstacle = {
  x: number;
  y: number;
  width: number;
  height: number;
  type: number;
};

type Coin = {
  x: number;
  y: number;
  radius: number;
  frameOffset: number;
};

type ColorItem = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  spriteKey: string;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  maxLife: number;
  size: number;
};

// --- PIXEL ART SPRITES ---
const SPRITE_SETS: Record<string, { run1: string[], run2: string[], jump: string[], colorMap: Record<string, string> }> = {
  chameleon: {
    run1: [
      "             XXXX   ",
      "            XH111X  ",
      "           XHH1W11X ",
      "           XH1WBB1X ",
      "           XX1111D1X",
      "       XXXXXX111DD1X",
      "     XXH111111DDD11X",
      "    XH11111111DD111X",
      "   X111XXXXXXXXXDDXX",
      "  X11DX       XDDX  ",
      "  X1D1X      XXDDX  ",
      "  X11DX      X1D1X  ",
      "   XX        XXXX   ",
      "            XX  XX  ",
      "            XX  XX  "
    ],
    run2: [
      "             XXXX   ",
      "            XH111X  ",
      "           XHH1W11X ",
      "           XH1WBB1X ",
      "           XX1111D1X",
      "       XXXXXX111DD1X",
      "     XXH111111DDD11X",
      "    XH11111111DD111X",
      "   X111XXXXXXXXXDDXX",
      "  X111X       XDDX  ",
      "  X11DX      XXDDX  ",
      "   XXX       X11DX  ",
      "   X X        XXX   ",
      "  XX XX        X X  ",
      "  XX XX       XX XX "
    ],
    jump: [
      "             XXXX   ",
      "            XH111X  ",
      "           XHH1W11X ",
      "           XH1WBB1X ",
      "           XX1111D1X",
      "       XXXXXX111DD1X",
      "     XXH111111DDD11X",
      "    XH11111111DD111X",
      "   X111XX  XXXX DDXX",
      "  X11DX  XX    XXX  ",
      "  X1D1X             ",
      "   XXX              ",
      "                    ",
      "                    ",
      "                    "
    ],
    colorMap: { 'X': '#1a261f', '1': '#2ecc71', 'D': 'rgba(0,0,0,0.25)', 'H': 'rgba(255,255,255,0.3)', 'W': '#ffffff', 'B': '#000000' }
  },
  robot: {
    run1: [
      "       XXXXX        ",
      "      XDD11WX       ",
      "      XDDBB1X       ",
      "     XXX111XXX      ",
      "     X X111X X      ",
      "     X X111X X      ",
      "    XX X111X XX     ",
      "       X111X        ",
      "      XX111XX       ",
      "      X     X       ",
      "      X     X       ",
      "     XX     XX      ",
      "                    ",
      "                    ",
      "                    "
    ],
    run2: [
      "       XXXXX        ",
      "      XDD11WX       ",
      "      XDDBB1X       ",
      "     XXX111XXX      ",
      "    XX X111X XX     ",
      "    X  X111X  X     ",
      "    X  X111X  X     ",
      "       X111X        ",
      "      XX111XX       ",
      "       X   X        ",
      "       X   X        ",
      "      XX   XX       ",
      "                    ",
      "                    ",
      "                    "
    ],
    jump: [
      "       XXXXX        ",
      "      XDD11WX       ",
      "      XDDBB1X       ",
      "     XXX111XXX      ",
      "      X X111X X     ",
      "        X111X       ",
      "       XX111XX      ",
      "      XX     XX     ",
      "      X       X     ",
      "      X       X     ",
      "      XX     XX     ",
      "        H   H       ",
      "       H     H      ",
      "                    ",
      "                    "
    ],
    colorMap: { 'X': '#2c3e50', '1': '#95a5a6', 'D': '#7f8c8d', 'W': '#ecf0f1', 'B': '#e74c3c', 'H': '#f1c40f' }
  },
  dog: {
    run1: [
      "                    ",
      "                    ",
      "                    ",
      "      XXXX          ",
      "     X1WW1X         ",
      "     X1B11X         ",
      "   XXX1111XXXX      ",
      "  X11111111111X     ",
      "  X11111111111X   X ",
      "  X111XXXXXXX1X  X  ",
      "  X111X     X1XX    ",
      "   XXX       XXX    ",
      "                    ",
      "                    ",
      "                    "
    ],
    run2: [
      "                    ",
      "                    ",
      "                    ",
      "      XXXX          ",
      "     X1WW1X         ",
      "     X1B11X         ",
      "   XXX1111XXXX      ",
      "  X11111111111X     ",
      "  X11111111111XX    ",
      "  X111XXXXXXX11X    ",
      "  X  11X     X11X   ",
      "   XXX        XX    ",
      "                    ",
      "                    ",
      "                    "
    ],
    jump: [
      "                    ",
      "                    ",
      "      XXXX          ",
      "     X1WW1X         ",
      "     X1B11X         ",
      "   XXX1111XXXX      ",
      "  X11111111111X     ",
      "  X11111111111X   X ",
      "   X11XXXXXXX1X  X  ",
      "   X11X      X1X    ",
      "    XX        XX    ",
      "                    ",
      "                    ",
      "                    ",
      "                    "
    ],
    colorMap: { 'X': '#3e2723', '1': '#d7ccc8', 'W': '#ffffff', 'B': '#000000' }
  },
  ufo: {
    run1: [
      "                    ",
      "       XXXXXX       ",
      "     XXWWWWWWXX     ",
      "    XWWWWWWWWWWX    ",
      "   XWBBBBBBBBBBWX   ",
      "  XX111111111111XX  ",
      " X11X11X11X11X11X1X ",
      " X1111111111111111X ",
      "  XXXXXXXXXXXXXXXX  ",
      "      W      W      ",
      "       W    W       ",
      "                    ",
      "                    ",
      "                    ",
      "                    "
    ],
    run2: [
      "                    ",
      "       XXXXXX       ",
      "     XXWWWWWWXX     ",
      "    XWWWWWWWWWWX    ",
      "   XWBBBBBBBBBBWX   ",
      "  XX111111111111XX  ",
      " X111XX11XX11XX111X ",
      " X1111111111111111X ",
      "  XXXXXXXXXXXXXXXX  ",
      "     W        W     ",
      "      W      W      ",
      "                    ",
      "                    ",
      "                    ",
      "                    "
    ],
    jump: [
      "       XXXXXX       ",
      "     XXWWWWWWXX     ",
      "    XWWWWWWWWWWX    ",
      "   XWBBBBBBBBBBWX   ",
      "  XX111111111111XX  ",
      " X11X11X11X11X11X1X ",
      " X1111111111111111X ",
      "  XXXXXXXXXXXXXXXX  ",
      "    W          W    ",
      "     W        W     ",
      "      W      W      ",
      "       W    W       ",
      "                    ",
      "                    ",
      "                    "
    ],
    colorMap: { 'X': '#2c3e50', '1': '#8e44ad', 'W': '#3498db', 'B': '#ecf0f1' }
  }
};

const SPRITE_KEYS = Object.keys(SPRITE_SETS);

const CACTUS_SPRITE_1 = [
  "   X    ",
  "  X1X   ",
  "  X1X X ",
  "X X1XX1X",
  "X1X1X11X",
  "XX11X1XX",
  " XX1XX  ",
  "  X1X   ",
  "  X1X   ",
  "  X1X   ",
  " X111X  ",
  " X111X  "
];

const CACTUS_SPRITE_2 = [
  "    X   ",
  "   X1X  ",
  " X X1X  ",
  "X1XX1X X",
  "X11X1X1X",
  "XX1X11XX",
  "  XX1XX ",
  "   X1X  ",
  "   X1X  ",
  "   X1X  ",
  "  X111X ",
  "  X111X "
];

const COIN_FRAMES = [
  [
    "  XXXX  ",
    " X1111X ",
    "X11XX11X",
    "X1X11X1X",
    "X1X11X1X",
    "X11XX11X",
    " X1111X ",
    "  XXXX  "
  ],
  [
    "   XX   ",
    "  X11X  ",
    "  X11X  ",
    "  X11X  ",
    "  X11X  ",
    "  X11X  ",
    "  X11X  ",
    "   XX   "
  ]
];

const BOX_SPRITE = [
  " XXXXXXXX ",
  "X11111111X",
  "X1XXXXXX1X",
  "X1X1111X1X",
  "X1X1WW1X1X",
  "X1X1WW1X1X",
  "X1X1111X1X",
  "X1XXXXXX1X",
  "X11111111X",
  " XXXXXXXX "
];

const CLOUD_SPRITE = [
  "      XXXXX      ",
  "    XXX111XX     ",
  "  XXX111111XXX   ",
  " XX1111111111XX  ",
  " X111111111111XX ",
  " X1111111111111X ",
  " X1111111111111X ",
  "  XXXXXXXXXXXXX  "
];

const drawSprite = (
  ctx: CanvasRenderingContext2D,
  sprite: string[],
  x: number,
  y: number,
  pixelSize: number,
  colorMap: Record<string, string>,
  flipX: boolean = false
) => {
  for (let r = 0; r < sprite.length; r++) {
    for (let c = 0; c < sprite[r].length; c++) {
      const char = sprite[r][c];
      if (char !== ' ') {
        const px = flipX ? x + (sprite[r].length - 1 - c) * pixelSize : x + c * pixelSize;
        const py = y + r * pixelSize;
        
        if ((char === 'D' || char === 'H') && colorMap['1'] && colorMap[char]) {
          ctx.fillStyle = colorMap['1'];
          ctx.fillRect(px, py, pixelSize, pixelSize);
          ctx.fillStyle = colorMap[char];
          ctx.fillRect(px, py, pixelSize, pixelSize);
        } else if (colorMap[char]) {
          ctx.fillStyle = colorMap[char];
          ctx.fillRect(px, py, pixelSize, pixelSize);
        }
      }
    }
  }
};

const ChameleonGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('chameleonHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const highScoreRef = useRef(highScore);

  // 重新開始遊戲
  const handleRestart = () => {
    setIsGameOver(false);
  };

  useEffect(() => {
    if (isGameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    // --- 遊戲狀態變數 ---
    let frames = 0;
    let score = 0;
    let distance = 0;
    let coinsCollected = 0;
    let gameSpeed = 5;
    let gameOverFlag = false;
    let isSpaceDown = false;

    let nextObstacleFrame = 120;
    let nextCoinFrame = 90;
    let nextColorFrame = 350;
    
    // 背景裝飾
    let clouds: {x: number, y: number, speed: number}[] = [
      {x: 100, y: 50, speed: 0.5},
      {x: 400, y: 80, speed: 0.3},
      {x: 700, y: 30, speed: 0.7}
    ];

    let particles: Particle[] = [];

    const createParticles = (x: number, y: number, color: string, count: number = 10) => {
      for (let i = 0; i < count; i++) {
        particles.push({
          x, y,
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 10,
          color,
          life: 1.0,
          maxLife: Math.random() * 20 + 10,
          size: Math.random() * 4 + 2
        });
      }
    };

    // 玩家物件
    const player = {
      x: 50,
      y: 350 - 45,
      width: 60, // 20 * 3
      height: 45, // 15 * 3
      spriteKey: SPRITE_KEYS[Math.floor(Math.random() * SPRITE_KEYS.length)],
      velocityY: 0,
      gravity: 0.8,
      isJumping: false,
      jumpTime: 0,

      draw() {
        const pSize = 3;
        const spriteData = SPRITE_SETS[this.spriteKey];
        const colorMap = spriteData.colorMap;

        let currentSprite = spriteData.run1;
        if (this.isJumping) {
          currentSprite = spriteData.jump;
        } else {
          // 動畫切換
          if (Math.floor(frames / 6) % 2 === 0) {
            currentSprite = spriteData.run1;
          } else {
            currentSprite = spriteData.run2;
          }
        }

        drawSprite(ctx, currentSprite, this.x, this.y, pSize, colorMap);
      },

      update() {
        this.velocityY += this.gravity;
        this.y += this.velocityY;

        // 地板高度 350
        if (this.y + this.height > 350) {
          this.y = 350 - this.height;
          this.velocityY = 0;
          this.isJumping = false;
        }
        this.draw();
      },

      startJump() {
        if (!this.isJumping) {
          this.velocityY = -10; // 小跳躍
          this.isJumping = true;
          this.jumpTime = frames;
          // 跳躍特效
          createParticles(this.x + this.width / 2, this.y + this.height, 'white', 5);
        }
      },

      holdJump() {
        if (this.isJumping && this.velocityY < 0 && frames - this.jumpTime < 13) {
           this.velocityY -= 0.6; // 在最初幾幀按住時，給予額外向上推力
        }
      }
    };

    let obstacles: Obstacle[] = [];
    let coins: Coin[] = [];
    let colorItems: ColorItem[] = [];

    // --- 生成與繪製函數 ---
    const handleObstacles = () => {
      // 減少生成頻率
      if (frames >= nextObstacleFrame) {
        const type = Math.random() > 0.5 ? 1 : 2;
        const width = 8 * 3; // 24
        const height = (Math.random() > 0.5 ? 10 : 12) * 3; // 30 of 36
        obstacles.push({ x: canvas.width, y: 350 - height, width, height, type });
        
        const currentSpawnRate = Math.max(50, 120 - Math.floor(score / 30));
        nextObstacleFrame = frames + currentSpawnRate + Math.floor(Math.random() * 40);
      }

      for (let i = 0; i < obstacles.length; i++) {
        const obs = obstacles[i];
        obs.x -= gameSpeed;

        const colorMap = {
          'X': '#1e3822',
          '1': '#2d8244' // 綠色仙人掌
        };
        drawSprite(ctx, obs.type === 1 ? CACTUS_SPRITE_1 : CACTUS_SPRITE_2, obs.x, obs.y, 3, colorMap);

        // 碰撞偵測 (碰到障礙物) - 縮小一點 hitbox 比較友善
        const hitboxShrinkX = 15;
        const hitboxShrinkY = 10;
        if (
          player.x + hitboxShrinkX < obs.x + obs.width - 5 &&
          player.x + player.width - hitboxShrinkX > obs.x + 5 &&
          player.y + hitboxShrinkY < obs.y + obs.height - 5 &&
          player.y + player.height - hitboxShrinkY > obs.y + 5
        ) {
          gameOverFlag = true;
        }
      }
      obstacles = obstacles.filter(obs => obs.x + obs.width > 0);
    };

    const handleCoins = () => {
      if (frames >= nextCoinFrame) {
        // 金幣高度降低，有時候出現在地上
        const coinY = 350 - (Math.random() * 120 + 20);
        coins.push({ x: canvas.width, y: coinY, radius: 12, frameOffset: Math.floor(Math.random() * 10) });
        nextCoinFrame = frames + 50 + Math.floor(Math.random() * 40);
      }

      for (let i = 0; i < coins.length; i++) {
        const coin = coins[i];
        coin.x -= gameSpeed;

        const isSpinFrame = Math.floor((frames + coin.frameOffset) / 8) % 4 === 0;
        const sprite = isSpinFrame ? COIN_FRAMES[1] : COIN_FRAMES[0];
        
        const colorMap = {
          'X': '#d35400',
          '1': '#f1c40f'
        };
        drawSprite(ctx, sprite, coin.x - 12, coin.y - 12, 3, colorMap);

        // 吃到金幣偵測
        const distX = Math.abs(coin.x - (player.x + player.width / 2));
        const distY = Math.abs(coin.y - (player.y + player.height / 2));
        if (distX < (player.width / 2 + coin.radius) && distY < (player.height / 2 + coin.radius)) {
          coinsCollected++;
          createParticles(coin.x, coin.y, '#f1c40f', 8);
          coins.splice(i, 1);
          i--;
        }
      }
      coins = coins.filter(coin => coin.x + coin.radius * 2 > 0);
    };

    const handleColorItems = () => {
      if (frames >= nextColorFrame) {
        const randomKey = SPRITE_KEYS[Math.floor(Math.random() * SPRITE_KEYS.length)];
        const randomColor = SPRITE_SETS[randomKey].colorMap['1'] || '#fff';
        colorItems.push({ x: canvas.width, y: 350 - (Math.random() * 60 + 30), width: 30, height: 30, color: randomColor, spriteKey: randomKey });
        nextColorFrame = frames + 400 + Math.floor(Math.random() * 200);
      }

      for (let i = 0; i < colorItems.length; i++) {
        const item = colorItems[i];
        item.x -= gameSpeed;

        const colorMap = {
          'X': '#000000',
          '1': item.color, // preview color
          'W': '#ffffff'
        };
        
        // 道具上下浮動
        const floatY = Math.sin((frames * 0.1) + i) * 5;
        drawSprite(ctx, BOX_SPRITE, item.x, item.y + floatY, 3, colorMap);

        // 吃到變身道具
        if (
          player.x < item.x + item.width &&
          player.x + player.width > item.x &&
          player.y < item.y + item.height + floatY &&
          player.y + player.height > item.y + floatY
        ) {
          player.spriteKey = item.spriteKey;
          createParticles(item.x + 15, item.y + 15, item.color, 25);
          colorItems.splice(i, 1);
          i--;

          // 吃到道具小小加分
          score += 50;
        }
      }
      colorItems = colorItems.filter(item => item.x + item.width > 0);
    };

    const updateParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2; // gravity for particles
        p.life -= 1 / p.maxLife;

        if (p.life <= 0) {
          particles.splice(i, 1);
          i--;
          continue;
        }

        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
      ctx.globalAlpha = 1.0;
    };

    const drawEnvironment = () => {
      // 漸層天空
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#5D9CEC');
      grad.addColorStop(1, '#E6FAFC');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 雲朵
      clouds.forEach(cloud => {
        cloud.x -= cloud.speed + (gameSpeed * 0.1);
        if (cloud.x < -100) cloud.x = canvas.width + Math.random() * 100;
        
        drawSprite(ctx, CLOUD_SPRITE, cloud.x, cloud.y, 4, {
          'X': 'rgba(255, 255, 255, 0.4)',
          '1': 'rgba(255, 255, 255, 0.8)'
        });
      });

      // 遠景山脈 (簡單色塊多邊形)
      ctx.fillStyle = '#A0C488';
      ctx.beginPath();
      ctx.moveTo(0, 350);
      for(let i=0; i<canvas.width + 100; i+=100) {
        ctx.lineTo(i - ((frames * gameSpeed * 0.2) % 100), 350 - 50 - Math.sin(i*0.05)*30);
      }
      ctx.lineTo(canvas.width, 350);
      ctx.fill();

      // 地板主體
      ctx.fillStyle = '#654321'; // 深褐色土地
      ctx.fillRect(0, 350, canvas.width, 50);

      // 地板草皮
      ctx.fillStyle = '#2ecc71';
      ctx.fillRect(0, 350, canvas.width, 10);
      
      // 地板斑點(速度感)
      ctx.fillStyle = '#4e3419';
      for (let i = 0; i < canvas.width + 40; i += 40) {
        ctx.fillRect(i - ((frames * gameSpeed) % 40), 365, 8, 8);
        ctx.fillRect(i + 20 - ((frames * gameSpeed) % 40), 380, 12, 6);
      }
    };

    const drawScore = () => {
      ctx.fillStyle = "#333";
      ctx.font = "bold 20px monospace";
      score = Math.floor(distance / 10) + (coinsCollected * 100);
      
      const displayHighScore = Math.max(highScoreRef.current, score);

      // 文字陰影
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillText(`SCORE: ${score}`, 22, 32);
      ctx.fillText(`COINS: ${coinsCollected}`, 22, 56);
      ctx.fillText(`HI: ${displayHighScore}`, canvas.width - 150 + 2, 32);

      ctx.fillStyle = "#333";
      ctx.fillText(`SCORE: ${score}`, 20, 30);
      ctx.fillText(`COINS: ${coinsCollected}`, 20, 54);
      
      ctx.fillStyle = "#e74c3c";
      ctx.fillText(`HI: ${displayHighScore}`, canvas.width - 150, 30);
    };

    // --- 遊戲主迴圈 ---
    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isSpaceDown) {
        player.holdJump();
      }

      drawEnvironment();
      updateParticles();
      player.update();
      handleObstacles();
      handleColorItems();
      handleCoins(); // 金幣在最上層
      drawScore();

      frames++;
      
      // 難度隨分數增加
      gameSpeed = Math.min(16, 5 + score / 400); 
      distance += gameSpeed;

      if (!gameOverFlag) {
        animationId = requestAnimationFrame(gameLoop);
      } else {
        if (score > highScoreRef.current) {
          highScoreRef.current = score;
          setHighScore(score);
          localStorage.setItem('chameleonHighScore', score.toString());
        }

        // 遊戲結束特效
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        setFinalScore(score);
        setIsGameOver(true);
      }
    };

    // --- 事件監聽器 ---
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        if (!e.repeat) {
           e.preventDefault();
           isSpaceDown = true;
           player.startJump();
        }
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
           isSpaceDown = false;
      }
    };

    const handlePointerDown = (e: Event) => {
      e.preventDefault();
      isSpaceDown = true;
      player.startJump();
    };
    
    const handlePointerUp = (e: Event) => {
       isSpaceDown = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('mousedown', handlePointerDown as EventListener);
    canvas.addEventListener('mouseup', handlePointerUp as EventListener);
    canvas.addEventListener('touchstart', handlePointerDown as EventListener, { passive: false });
    canvas.addEventListener('touchend', handlePointerUp as EventListener);

    // 啟動遊戲
    gameLoop();

    // --- 清除 Effect ---
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('mousedown', handlePointerDown as EventListener);
      canvas.removeEventListener('mouseup', handlePointerUp as EventListener);
      canvas.removeEventListener('touchstart', handlePointerDown as EventListener);
      canvas.removeEventListener('touchend', handlePointerUp as EventListener);
      cancelAnimationFrame(animationId);
    };
  }, [isGameOver]);

  return (
    <div className="flex flex-col items-center justify-center font-mono w-full px-4">
      <div className="mb-6 text-center">
        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-sky-500 tracking-tighter drop-shadow-sm mb-2">
          PIXEL CHAMELEON
        </h2>
        <p className="text-neutral-500 font-medium">按 空白鍵 或 點擊畫面 跳躍</p>
      </div>
      
      <div className="relative group max-w-full">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={400} 
          className="relative max-w-full w-full h-auto bg-white shadow-2xl rounded-xl ring-1 ring-black/5 [image-rendering:pixelated] cursor-pointer"
          style={{ aspectRatio: '2 / 1' }}
        />
        
        {isGameOver && (
          <div className="absolute inset-0 bg-neutral-900/80 backdrop-blur-sm flex flex-col justify-center items-center text-white rounded-xl z-20 animate-in fade-in duration-300">
            <h1 className="text-5xl font-black text-rose-500 tracking-widest mb-2 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]">
              GAME OVER
            </h1>
            <div className="bg-white/10 px-6 py-3 rounded-lg border border-white/20 mb-8 backdrop-blur-md">
              <h3 className="text-2xl font-bold text-center">最終分數: <span className="text-yellow-400">{finalScore}</span></h3>
              {finalScore >= highScore && finalScore > 0 && (
                 <p className="text-emerald-400 font-bold text-center mt-2 animate-pulse">NEW HIGH SCORE!</p>
              )}
            </div>
            <button 
              onClick={handleRestart}
              className="px-8 py-3 text-lg font-bold bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white rounded-full shadow-[0_4px_0_rgb(4,120,87)] active:shadow-none active:translate-y-[4px] transition-all"
            >
              再玩一次
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 flex gap-6 text-neutral-600 bg-white px-6 py-4 rounded-xl shadow-sm border border-neutral-100 font-medium text-sm w-full max-w-3xl justify-center flex-wrap">
        <span className="flex items-center gap-2 text-rose-500 font-bold bg-rose-50 px-2 py-1 rounded">
          長按跳得更高
        </span>
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-400 rounded-full shadow-inner block"></div> 
          收集金幣
        </span>
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 bg-sky-400 rounded-[4px] block border-2 border-black/80"></div> 
          吃方塊變身
        </span>
        <span className="flex items-center gap-2">
          <div className="w-4 h-6 bg-emerald-700 rounded-sm block border border-black/50 overflow-hidden">
            <div className="w-full h-1/2 bg-emerald-600 mt-1"></div>
          </div> 
          避開仙人掌
        </span>
      </div>
    </div>
  );
};

export default ChameleonGame;
