import React, { useRef, useEffect, useState } from 'react';

type Obstacle = {
  x: number;
  y: number;
  width: number;
  height: number;
  spriteArray: string[];
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
  trex: {
    run1: [
      "                    ",
      "           XXXXXXX  ",
      "          X1111111X ",
      "         X111W11111X",
      "         X111B11111X",
      "         X11111XXXXX",
      "         X11111X    ",
      "  XX     X11111XXXX ",
      " X11XX  XX11111111X ",
      " X111XXXX11112221X  ",
      " X111111111122221X  ",
      "  X111111111111XX   ",
      "   XXXXXXXXXXXX     ",
      "        X1X X1X     ",
      "        XXX XXX     "
    ],
    run2: [
      "                    ",
      "           XXXXXXX  ",
      "          X1111111X ",
      "         X111W11111X",
      "         X111B11111X",
      "         X11111XXXXX",
      "         X11111X    ",
      "  XX     X11111XXXX ",
      " X11XX  XX11111111X ",
      " X111XXXX11112221X  ",
      " X111111111122221X  ",
      "  X111111111111XX   ",
      "   XXXXXXXXXXXX     ",
      "            X1X     ",
      "           XXX      "
    ],
    jump: [
      "                    ",
      "           XXXXXXX  ",
      "          X1111111X ",
      "         X111W11111X",
      "         X111B11111X",
      "         X11111XXXXX",
      "         X11111X    ",
      "  XX     X11111XXXX ",
      " X11XX  XX11111111X ",
      " X111XXXX11112221X  ",
      " X111111111122221X  ",
      "  X111111111111XX   ",
      "   XXXXXXX  XXX     ",
      "       XXX          ",
      "                    "
    ],
    colorMap: { 'X': '#145A32', '1': '#2ECC71', '2': '#58D68D', 'W': '#FFFFFF', 'B': '#000000' }
  },
  knight: {
    run1: [
      "        XX          ",
      "      XXPPXX        ",
      "     XPPPPPPX       ",
      "    XX111111XX      ",
      "   X1111111111X     ",
      "   X111BBWWBB1X     ",
      "   X111BBWWBB1X     ",
      "    XX111111XX      ",
      "   XXX222222XXX     ",
      " X X11X2222X11X X   ",
      "X1XX11X2222X11XX1X  ",
      "X1X XX111111XX X1X  ",
      "XXX   X11X11X  XXX  ",
      "      XXX XXX       ",
      "                    "
    ],
    run2: [
      "        XX          ",
      "      XXPPXX        ",
      "     XPPPPPPX       ",
      "    XX111111XX      ",
      "   X1111111111X     ",
      "   X111BBWWBB1X     ",
      "   X111BBWWBB1X     ",
      "    XX111111XX      ",
      "   XXX222222XXX     ",
      " X X11X2222X11X X   ",
      "X1XX11X2222X11XX1X  ",
      "X1X XX111111XX X1X  ",
      "XXX    X11XX   XXX  ",
      "       XXXX         ",
      "                    "
    ],
    jump: [
      "        XX          ",
      "      XXPPXX        ",
      "     XPPPPPPX       ",
      "    XX111111XX      ",
      "   X1111111111X     ",
      "   X111BBWWBB1X     ",
      "   X111BBWWBB1X     ",
      "    XX111111XX      ",
      " X XXX222222XXX X   ",
      "X1XX11X2222X11XX1X  ",
      "X1X XX111111XX X1X  ",
      "XXX   X11X11X  XXX  ",
      "      XXX XXX       ",
      "                    ",
      "                    "
    ],
    colorMap: { 'X': '#2C3E50', '1': '#BDC3C7', '2': '#7F8C8D', 'P': '#E74C3C', 'W': '#F1C40F', 'B': '#000000' }
  },
  bird: {
    run1: [
      "                    ",
      "      XXXXXXX       ",
      "    XX1111111X      ",
      "   X111111W111X     ",
      "   X111111B111X     ",
      "   X11111111111XXXX ",
      "  X11X11111111YYYYYX",
      " X11XX111111111YYYYX",
      " X11X111112211XXXXX ",
      "  X1111112221XX     ",
      "   XXXXX11221X      ",
      "      XXXXXXX       ",
      "       XYX XYX      ",
      "       YXY YXY      ",
      "                    "
    ],
    run2: [
      "                    ",
      "      XXXXXXX       ",
      "    XX1111111X      ",
      "   X111111W111X     ",
      "   X111111B111X     ",
      "   X11111111111XXXX ",
      "   XX 11111111YYYYYX",
      " X11XX111111111YYYYX",
      " X11X111112211XXXXX ",
      "  X 111112221XX     ",
      "    XXXX11221X      ",
      "      XXXXXXX       ",
      "        XYX         ",
      "        YXY         ",
      "                    "
    ],
    jump: [
      "                    ",
      "      XXXXXXX       ",
      "    XX1111111X      ",
      "   X111111W111X     ",
      "   X111111B111X     ",
      " XXX11111111111XXXX ",
      "X111XX11111111YYYYYX",
      "X11111X11111111YYYYX",
      " X1111X1112211XXXXX ",
      "  XXXX1112221XX     ",
      "      X11221X       ",
      "      XXXXXXX       ",
      "       XYX XYX      ",
      "       YXY YXY      ",
      "                    "
    ],
    colorMap: { 'X': '#1A5276', '1': '#3498DB', '2': '#85C1E9', 'Y': '#F1C40F', 'W': '#FFFFFF', 'B': '#000000' }
  },
  robot: {
    run1: [
      "        XXX         ",
      "        X2X         ",
      "       XX2XX        ",
      "     XXX111XXX      ",
      "    X111111111X     ",
      "    X111111111X     ",
      "    X1B11111B1X     ",
      "    X1G11111G1X     ",
      "    X111111111X     ",
      "   XX1X22222X1XX    ",
      " X X11X11111X11X X  ",
      "X1XX11X11111X11XX1X ",
      "XXX   XXXXXXX   XXX ",
      "      X2X X2X       ",
      "      XXX XXX       "
    ],
    run2: [
      "        XXX         ",
      "        X2X         ",
      "       XX2XX        ",
      "     XXX111XXX      ",
      "    X111111111X     ",
      "    X111111111X     ",
      "    X1B11111B1X     ",
      "    X1G11111G1X     ",
      "    X111111111X     ",
      "   XX1X22222X1XX    ",
      " X X11X11111X11X X  ",
      "X1XX11X11111X11XX1X ",
      "XXX   XXXXXXX   XXX ",
      "        X2X         ",
      "        XXX         "
    ],
    jump: [
      "        XXX         ",
      "        X2X         ",
      "       XX2XX        ",
      "     XXX111XXX      ",
      "    X111111111X     ",
      "    X111111111X     ",
      "    X1B11111B1X     ",
      "    X1G11111G1X     ",
      "    X111111111X     ",
      " X XX1X22222X1XX X  ",
      "X1XX11X11111X11XX1X ",
      "XXX   XXXXXXX   XXX ",
      "      X2X X2X       ",
      "      XXX XXX       ",
      "                    "
    ],
    colorMap: { 'X': '#17202A', '1': '#95A5A6', '2': '#F39C12', 'G': '#00FFFF', 'B': '#000000' }
  },
  ninja: {
    run1: [
      "                    ",
      "      XXXXXXX       ",
      "     X1111111X      ",
      "     XRRRRRRRX      ",
      "     X22B2B22X      ",
      "     X2222222X      ",
      "     X1111111X      ",
      "  XXX X11111X XXX   ",
      "  X1XXX11111XXX1X   ",
      "  X11X11R1R11X11X   ",
      "  XXX X11111X XXX   ",
      "      X11111X       ",
      "      XXXXXXX       ",
      "      X1X X1X       ",
      "      XXX XXX       "
    ],
    run2: [
      "                    ",
      "      XXXXXXX       ",
      "     X1111111X      ",
      "     XRRRRRRRX      ",
      "     X22B2B22X      ",
      "     X2222222X      ",
      "     X1111111X      ",
      "  XXX X11111X XXX   ",
      "  X1XXX11111XXX1X   ",
      "  X11X11R1R11X11X   ",
      "  XXX X11111X XXX   ",
      "      X11111X       ",
      "      XXXXXXX       ",
      "       X1X          ",
      "       XXX          "
    ],
    jump: [
      "      XXXXXXX       ",
      "     X1111111X      ",
      "     XRRRRRRRX      ",
      "     X22B2B22X      ",
      "     X2222222X      ",
      "     X1111111X      ",
      "  XXX X11111X XXX   ",
      "  X1XXX11111XXX1X   ",
      "  X11X11R1R11X11X   ",
      "  XXX X11111X XXX   ",
      "      X11111X       ",
      "      XXXXXXX       ",
      "     XX1X X1XX      ",
      "    XXX     XXX     ",
      "                    "
    ],
    colorMap: { 'X': '#000000', '1': '#2C3E50', '2': '#F5CBA7', 'R': '#E74C3C', 'B': '#000000' }
  },
  alien: {
    run1: [
      "                    ",
      "      XXXXXXX       ",
      "    XX1111111XX     ",
      "   X11111111111X    ",
      "  X11WWW111WWW11X   ",
      "  X1WBBBW1WBBBW1X   ",
      "  X1WBBBW1WBBBW1X   ",
      "  X11WWW111WWW11X   ",
      "   X11111111111X    ",
      "    X222111222X     ",
      "    XX2222222XX     ",
      "      X11111X       ",
      "     XX1X X1XX      ",
      "    XX X   X XX     ",
      "                    "
    ],
    run2: [
      "                    ",
      "      XXXXXXX       ",
      "    XX1111111XX     ",
      "   X11111111111X    ",
      "  X11WWW111WWW11X   ",
      "  X1WBBBW1WBBBW1X   ",
      "  X1WBBBW1WBBBW1X   ",
      "  X11WWW111WWW11X   ",
      "   X11111111111X    ",
      "    X222111222X     ",
      "    XX2222222XX     ",
      "      X11111X       ",
      "      XX1X1XX       ",
      "       X   X        ",
      "                    "
    ],
    jump: [
      "      XXXXXXX       ",
      "    XX1111111XX     ",
      "   X11111111111X    ",
      "  X11WWW111WWW11X   ",
      "  X1WBBBW1WBBBW1X   ",
      "  X1WBBBW1WBBBW1X   ",
      "  X11WWW111WWW11X   ",
      "   X11111111111X    ",
      "    X222111222X     ",
      "    XX2222222XX     ",
      "      X11111X       ",
      "     XX1X X1XX      ",
      "    XX X   X XX     ",
      "                    ",
      "                    "
    ],
    colorMap: { 'X': '#000000', '1': '#9b59b6', '2': '#8e44ad', 'W': '#ecf0f1', 'B': '#000000' }
  },
  ghost: {
    run1: [
      "                    ",
      "      XXXXXXX       ",
      "    XX1111111XX     ",
      "   X11111111111X    ",
      "  X11W111111W111X   ",
      "  X11B111111B111X   ",
      "  X11111WW111111X   ",
      "  X1111WBBW11111X   ",
      "  X11111WW111111X   ",
      "   X11111111111X    ",
      "   X11111111111X    ",
      "  XXXX11X111XXXX    ",
      "  X11X X1X X111X    ",
      "  X X   X   X XX    ",
      "                    "
    ],
    run2: [
      "                    ",
      "      XXXXXXX       ",
      "    XX1111111XX     ",
      "   X11111111111X    ",
      "  X11W111111W111X   ",
      "  X11B111111B111X   ",
      "  X11111WW111111X   ",
      "  X1111WBBW11111X   ",
      "  X11111WW111111X   ",
      "   X11111111111X    ",
      "   X11111111111X    ",
      "   XXXX11X11XXXX    ",
      "   X11X X1X X11X    ",
      "    XX   X   XX     ",
      "                    "
    ],
    jump: [
      "      XXXXXXX       ",
      "    XX1111111XX     ",
      "   X11111111111X    ",
      "  X11W111111W111X   ",
      "  X11B111111B111X   ",
      "  X11111WW111111X   ",
      "  X1111WBBW11111X   ",
      "  X11111WW111111X   ",
      "   X11111111111X    ",
      "   X11111111111X    ",
      "  XXXX11X111XXXX    ",
      "  X11X X1X X111X    ",
      "  X X   X   X XX    ",
      "                    ",
      "                    "
    ],
    colorMap: { 'X': '#2C3E50', '1': '#ECF0F1', 'W': '#FFFFFF', 'B': '#000000' }
  }
};

const SPRITE_KEYS = Object.keys(SPRITE_SETS);

const OBS_SHORT_1 = [
  "   XX   ",
  "  X11X  ",
  "  X11X X",
  "X X11XX1X",
  "X1X11X11X",
  "XX11111XX",
  " XX111X ",
  "  X11X  ",
  "  X11X  ",
  " X1111X "
];

const OBS_SHORT_2 = [
  "    XX  ",
  "   X11X ",
  " X X11X ",
  "X1XX11X ",
  "X11X11XX",
  "XX11111X",
  " XX11XX ",
  "  X11X  ",
  "  X11X  ",
  " X1111X "
];

const OBS_TALL_1 = [
  "   XX   ",
  "  X11X  ",
  "  X11X  ",
  "  X11X  ",
  "  X11X  ",
  "  X11X  ",
  "  X11X  ",
  "  X11X  ",
  "  X11X  ",
  "  X11X  ",
  "  X11X  ",
  "  X11X  ",
  "  X11X X",
  "X X11XX1X",
  "X1X11X11X",
  "X1X11X11X",
  "XX11111XX",
  " XX111X ",
  "  X11X  ",
  "  X11X  ",
  "  X11X  ",
  "  X11X  ",
  "  X11X  ",
  "  X11X  ",
  "  X11X  ",
  "  X11X  ",
  "  X11X  ",
  " X1111X ",
  " X1111X ",
  " X1111X "
];

const OBS_TALL_2 = [
  "   XX   ",
  "  X11X  ",
  "  X11X  ",
  "  X11X  ",
  "  X11X  ",
  "  X11X  ",
  "  X11X  ",
  "  X11X  ",
  "  X11X  ",
  "  X11X  ",
  "  X11X  ",
  " X X11X ",
  "X1XX11X ",
  "X11X11XX",
  "XX11111X",
  " XX11XX ",
  "  X11X  ",
  "  X11X  ",
  "  X11X  ",
  "  X11X  ",
  "  X11X  ",
  "  X11X  ",
  "  X11X  ",
  "  X11X  ",
  "  X11X  ",
  "  X11X  ",
  "  X11X  ",
  " X1111X ",
  " X1111X ",
  " X1111X "
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

    let currentLevel = 0;
    let levelTransitionFrames = 0;

    const THEMES = [
      { // 0: 草原
        sky: ['#5D9CEC', '#E6FAFC'], bgObj: 'cloud',
        mountain: '#A0C488',
        ground: '#654321', groundTop: '#2ecc71', groundSpot: ['#4e3419', '#5c3a21'],
        obsC: { 'X': '#1e3822', '1': '#2d8244' }, // Grass cactus
        coinC: { 'X': '#d35400', '1': '#f1c40f' } // Gold
      },
      { // 1: 沙漠
        sky: ['#FF7E5F', '#FEB47B'], bgObj: 'sun',
        mountain: '#D38D5F',
        ground: '#C28253', groundTop: '#E6A875', groundSpot: ['#A4653A', '#B57348'],
        obsC: { 'X': '#5C4033', '1': '#8f9779' }, // Olive
        coinC: { 'X': '#7f8c8d', '1': '#ecf0f1' } // Silver
      },
      { // 2: 霓虹之夜
        sky: ['#141A30', '#2B2F4C'], bgObj: 'star',
        mountain: '#1D2235',
        ground: '#0B0D17', groundTop: '#FF2A6D', groundSpot: ['#1A1C29', '#21263A'],
        obsC: { 'X': '#05D9E8', '1': '#01FFE1' }, // Neon Blue
        coinC: { 'X': '#D1F2A5', '1': '#EFFCB9' } // Neon Green
      },
      { // 3: 冰雪仙境
        sky: ['#83a4d4', '#b6fbff'], bgObj: 'snow',
        mountain: '#FFFFFF',
        ground: '#a0b0b9', groundTop: '#FFFFFF', groundSpot: ['#889ca6', '#728892'],
        obsC: { 'X': '#2980B9', '1': '#6DD5FA' }, // Ice
        coinC: { 'X': '#c0392b', '1': '#ff4d4d' } // Ruby
      }
    ];

    // --- 生成與繪製函數 ---
    const handleObstacles = () => {
      const theme = THEMES[currentLevel];
      // 減少生成頻率
      if (frames >= nextObstacleFrame) {
        const isTall = Math.random() > 0.4;
        const type = Math.random() > 0.5 ? 1 : 2;
        const spriteArray = isTall ? (type === 1 ? OBS_TALL_1 : OBS_TALL_2) : (type === 1 ? OBS_SHORT_1 : OBS_SHORT_2);
        const height = spriteArray.length * 3;
        const width = spriteArray[0].length * 3;
        obstacles.push({ x: canvas.width, y: 350 - height, width, height, spriteArray });
        
        const currentSpawnRate = Math.max(50, 120 - Math.floor(score / 30));
        nextObstacleFrame = frames + currentSpawnRate + Math.floor(Math.random() * 40);
      }

      for (let i = 0; i < obstacles.length; i++) {
        const obs = obstacles[i];
        obs.x -= gameSpeed;

        drawSprite(ctx, obs.spriteArray, obs.x, obs.y, 3, theme.obsC);

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

      const theme = THEMES[currentLevel];

      for (let i = 0; i < coins.length; i++) {
        const coin = coins[i];
        coin.x -= gameSpeed;

        const isSpinFrame = Math.floor((frames + coin.frameOffset) / 8) % 4 === 0;
        const sprite = isSpinFrame ? COIN_FRAMES[1] : COIN_FRAMES[0];
        
        drawSprite(ctx, sprite, coin.x - 12, coin.y - 12, 3, theme.coinC);

        // 吃到金幣偵測
        const distX = Math.abs(coin.x - (player.x + player.width / 2));
        const distY = Math.abs(coin.y - (player.y + player.height / 2));
        if (distX < (player.width / 2 + coin.radius) && distY < (player.height / 2 + coin.radius)) {
          coinsCollected++;
          createParticles(coin.x, coin.y, theme.coinC['1'], 8);
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
      const theme = THEMES[currentLevel];

      // 漸層天空
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, theme.sky[0]);
      grad.addColorStop(1, theme.sky[1]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 背景裝飾
      if (theme.bgObj === 'star') {
        for (let i = 0; i < 30; i++) {
          const starX = (i * 70 - frames * 0.2) % canvas.width;
          const sx = starX < 0 ? canvas.width + starX : starX;
          const starY = (i * 87) % 250;
          ctx.fillStyle = (frames + i * 10) % 60 < 30 ? 'white' : 'rgba(255,255,255,0.2)';
          ctx.fillRect(sx, starY, 3, 3);
        }
      } else if (theme.bgObj === 'snow') {
        for (let i = 0; i < 40; i++) {
          const snowX = (i * 40 - frames * 1.5) % canvas.width;
          const sx = snowX < 0 ? canvas.width + snowX : snowX;
          const snowY = (i * 50 + frames * 2) % 350;
          ctx.fillStyle = 'rgba(255,255,255,0.8)';
          ctx.beginPath();
          ctx.arc(sx, snowY, 2.5 + Math.sin(frames * 0.05 + i), 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        clouds.forEach((obj, idx) => {
          obj.x -= obj.speed + (gameSpeed * 0.1);
          if (obj.x < -100) obj.x = canvas.width + Math.random() * 100;
          
          if (theme.bgObj === 'cloud') {
            drawSprite(ctx, CLOUD_SPRITE, obj.x, obj.y, 4, {
              'X': 'rgba(255, 255, 255, 0.4)',
              '1': 'rgba(255, 255, 255, 0.8)'
            });
          } else if (theme.bgObj === 'sun' && idx === 0) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(obj.x + 50, 100, 60, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(obj.x + 50, 100, 45, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }

      // 遠景山脈 (簡單色塊多邊形)
      ctx.fillStyle = theme.mountain;
      ctx.beginPath();
      ctx.moveTo(0, 350);
      for(let i=0; i<canvas.width + 100; i+=100) {
        ctx.lineTo(i - ((frames * gameSpeed * 0.2) % 100), 350 - 50 - Math.sin(i*0.05)*30);
      }
      ctx.lineTo(canvas.width, 350);
      ctx.fill();

      // 地板主體
      ctx.fillStyle = theme.ground;
      ctx.fillRect(0, 350, canvas.width, 50);

      // 地板草皮
      ctx.fillStyle = theme.groundTop;
      ctx.fillRect(0, 350, canvas.width, 10);
      
      // 地板斑點(速度感)
      for (let i = 0; i < canvas.width + 40; i += 40) {
        ctx.fillStyle = theme.groundSpot[0];
        ctx.fillRect(i - ((frames * gameSpeed) % 40), 365, 8, 8);
        ctx.fillStyle = theme.groundSpot[1];
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

    let lastTimestamp = 0;
    const fpsInterval = 1000 / 60;

    // --- 遊戲主迴圈 ---
    const gameLoop = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaTime = timestamp - lastTimestamp;

      if (!gameOverFlag) {
        animationId = requestAnimationFrame(gameLoop);
      }

      if (deltaTime < fpsInterval) return;
      lastTimestamp = timestamp - (deltaTime % fpsInterval);

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
      
      // 難度與場景隨分數增加
      gameSpeed = Math.min(14, 4 + score / 800); 
      distance += gameSpeed;

      const newLevel = Math.min(Math.floor(score / 1000), THEMES.length - 1);
      if (newLevel !== currentLevel) {
        currentLevel = newLevel;
        levelTransitionFrames = 120; // 顯示兩秒升級提示
      }

      if (levelTransitionFrames > 0) {
         ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, levelTransitionFrames / 30)})`;
         ctx.font = "bold 40px monospace";
         ctx.textAlign = "center";
         const levelNames = ["草原", "沙漠", "霓虹之夜", "冰雪仙境"];
         ctx.fillText(`STAGE ${currentLevel + 1}: ${levelNames[currentLevel]}`, canvas.width / 2, canvas.height / 3);
         ctx.textAlign = "left";
         levelTransitionFrames--;
      }

      if (gameOverFlag) {
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
    animationId = requestAnimationFrame(gameLoop);

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
    <div className="flex flex-col items-center justify-center font-mono w-full px-2 sm:px-4">
      <div className="mb-4 sm:mb-6 text-center mt-4 sm:mt-0">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-sky-500 tracking-tighter drop-shadow-sm mb-1 sm:mb-2">
          PIXEL CHAMELEON
        </h2>
        <p className="text-neutral-500 font-medium text-xs sm:text-sm md:text-base">按 空白鍵 或 點擊畫面 跳躍</p>
        <div className="text-rose-400 font-bold text-xs mt-1 block sm:hidden animate-pulse">
          建議將手機橫放體驗更佳
        </div>
      </div>
      
      <div className="relative group w-full max-w-[800px]">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 pointer-events-none"></div>
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={400} 
          className="relative max-w-full w-full h-auto bg-white shadow-2xl rounded-xl ring-1 ring-black/5 [image-rendering:pixelated] cursor-pointer touch-none"
          style={{ aspectRatio: '2 / 1' }}
        />
        
        {isGameOver && (
          <div className="absolute inset-0 bg-neutral-900/80 backdrop-blur-sm flex flex-col justify-center items-center text-white rounded-xl z-20 animate-in fade-in duration-300">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-rose-500 tracking-widest mb-2 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]">
              GAME OVER
            </h1>
            <div className="bg-white/10 px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-white/20 mb-6 sm:mb-8 backdrop-blur-md">
              <h3 className="text-xl sm:text-2xl font-bold text-center">最終分數: <span className="text-yellow-400">{finalScore}</span></h3>
              {finalScore >= highScore && finalScore > 0 && (
                 <p className="text-emerald-400 font-bold text-center mt-1 sm:mt-2 animate-pulse text-sm sm:text-base">NEW HIGH SCORE!</p>
              )}
            </div>
            <button 
              onClick={handleRestart}
              className="px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg font-bold bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white rounded-full shadow-[0_4px_0_rgb(4,120,87)] active:shadow-none active:translate-y-[4px] transition-all"
            >
              再玩一次
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 sm:mt-8 flex gap-3 sm:gap-6 text-neutral-600 bg-white px-3 py-3 sm:px-6 sm:py-4 rounded-xl shadow-sm border border-neutral-100 font-medium text-xs sm:text-sm w-full max-w-[800px] justify-center flex-wrap">
        <span className="flex items-center gap-1 sm:gap-2 text-rose-500 font-bold bg-rose-50 px-2 py-1 rounded">
          長按跳得更高
        </span>
        <span className="flex items-center gap-1 sm:gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded-full shadow-inner block"></div> 
          收集金幣
        </span>
        <span className="flex items-center gap-1 sm:gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-sky-400 rounded-[4px] block border-2 border-black/80"></div> 
          吃方塊變身
        </span>
        <span className="flex items-center gap-1 sm:gap-2">
          <div className="w-3 h-4 sm:w-4 sm:h-6 bg-emerald-700 rounded-sm block border border-black/50 overflow-hidden">
            <div className="w-full h-1/2 bg-emerald-600 mt-1"></div>
          </div> 
          避開障礙物
        </span>
      </div>
    </div>
  );
};

export default ChameleonGame;
