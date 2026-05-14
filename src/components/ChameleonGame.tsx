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
  gravity?: number;
  isLightning?: boolean;
};

// --- PIXEL ART SPRITES ---
const SPRITE_SETS: Record<string, { run1: string[], run2: string[], jump: string[], colorMap: Record<string, string> }> = {
  trex: {
    run1: [
      "                    ",
      "           XXXXXXX  ",
      "          X1111111X ",
      "         X111WWW111X",
      "         X111WBBW11X",
      "         X1111WW111X",
      "         X11111XXXXX",
      "         X11111X    ",
      "  XXX    X11111XXXX ",
      " X11XX  XX11111111X ",
      " X111XXXX111112221X ",
      " X1111111111122221X ",
      "  X1111111111111XX  ",
      "   XXXXXXXXXXXXX    ",
      "        X1X X1X     ",
      "        XXX XXX     "
    ],
    run2: [
      "                    ",
      "           XXXXXXX  ",
      "          X1111111X ",
      "         X111WWW111X",
      "         X111WBBW11X",
      "         X1111WW111X",
      "         X11111XXXXX",
      "         X11111X    ",
      "  XXX    X11111XXXX ",
      " X11XX  XX11111111X ",
      " X111XXXX111112221X ",
      " X1111111111122221X ",
      "  X1111111111111XX  ",
      "   XXXXXXXXXXXXX    ",
      "             X1X    ",
      "            XXX     "
    ],
    jump: [
      "                    ",
      "           XXXXXXX  ",
      "          X1111111X ",
      "         X111WWW111X",
      "         X111WBBW11X",
      "         X1111WW111X",
      "         X11111XXXXX",
      "         X11111X    ",
      "  XXX    X11111XXXX ",
      " X11XX  XX11111111X ",
      " X111XXXX111112221X ",
      " X1111111111122221X ",
      "  X1111111111111XX  ",
      "   XXXXXXX  XXXX    ",
      "       XXX          ",
      "                    "
    ],
    colorMap: { 'X': '#145A32', '1': '#2ECC71', '2': '#58D68D', 'W': '#FFFFFF', 'B': '#000000' }
  },
                dino: {
    run1: [
      "                    ",
      "             XXXXXXX",
      "            XX111W1X",
      "            X1B11W1X",
      "            X111111X",
      "            X111111X",
      "            XXX1111X",
      "      XXXXXX  X11XXX",
      "    XXX1111XXXX111X ",
      "   XX111111111111X  ",
      "  XX111111111XXXXX  ",
      " XX11111111XX       ",
      " X11111XXXX1X       ",
      "  X11XXX  X1XX      ",
      "   X2X     X2X      ",
      "   XXX     XXX      "
    ],
    run2: [
      "                    ",
      "             XXXXXXX",
      "            XX111W1X",
      "            X1B11W1X",
      "            X111111X",
      "            X111111X",
      "            XXX1111X",
      "      XXXXXX  X11XXX",
      "    XXX1111XXXX111X ",
      "   XX111111111111X  ",
      "  XX111111111XXXXX  ",
      " XX11111111XX       ",
      " X11111XXXX         ",
      "  X1111X            ",
      "   X22XX            ",
      "   XXXX             "
    ],
    jump: [
      "                    ",
      "             XXXXXXX",
      "            XX111W1X",
      "            X1B11W1X",
      "            X111111X",
      "            X111111X",
      "            XXX1111X",
      "      XXXXXX  X11XXX",
      "    XXX1111XXXX111X ",
      "   XX111111111111X  ",
      "  XX111111111XXXXX  ",
      " XX11111111XX       ",
      " X11111XXXX1X       ",
      "  X1111X  XX2XX     ",
      "   XX2XX   XXXX     ",
      "   XXXX             "
    ],
    colorMap: { 'X': '#196F3D', '1': '#2ECC71', 'W': '#FFFFFF', '2': '#E67E22', 'B': '#000000' }
  },
  bird: {
    run1: [
      "                    ",
      "       XXXXXXX      ",
      "     XX1111111X     ",
      "    X111111W111X    ",
      "    X111111WBB11X   ",
      "    X11111111111XXX ",
      "  XXX111111111YYYYYX",
      "  X22XX11111111YYYYX",
      " X2222X11111221XXXXX",
      " X22222X112221XX    ",
      "  XXXXXXX11221X     ",
      "      XXXXXXX       ",
      "       XYX XYX      ",
      "       YXY YXY      ",
      "                    ",
      "                    "
    ],
    run2: [
      "                    ",
      "       XXXXXXX      ",
      "     XX1111111X     ",
      " X  X111111W111X    ",
      " XX X111111WBB11X   ",
      " X2X111111111111XXX ",
      " X22XX11111111YYYYYX",
      "  X222XX1111111YYYYX",
      "   X2222X111221XXXXX",
      "    XXXXX12221XX    ",
      "     XXXX11221X     ",
      "      XXXXXXX       ",
      "         XYX        ",
      "         YXY        ",
      "                    ",
      "                    "
    ],
    jump: [
      "    XX              ",
      "   X22XXXXXXXX      ",
      "  X222X1111111X     ",
      " X2222X1111W111X    ",
      "  XXXXX1111WBB11X   ",
      "      X111111111XXX ",
      "   XXX11111111YYYYYX",
      "   X11XX1111111YYYYX",
      "   X11X11111221XXXXX",
      "    XXXX1112221XX   ",
      "      XX112221X     ",
      "      XXXXXXX       ",
      "       XYX XYX      ",
      "       YXY YXY      ",
      "                    ",
      "                    "
    ],
    colorMap: { 'X': '#1A5276', '1': '#3498DB', '2': '#85C1E9', 'Y': '#F1C40F', 'W': '#FFFFFF', 'B': '#000000' }
  },
          robot: {
    run1: [
      "                    ",
      "      XXXXXXXX      ",
      "     X11111111X     ",
      "    X1G111111G1X    ",
      "   X111111111111X   ",
      "   X111RRRRRR111X   ",
      "   X111111111111X   ",
      "   XXXXXXXXXXXXXX   ",
      "    X1111111111X    ",
      "  XXXX11111111XXXX  ",
      " X111XX111111XX111X ",
      " X222X X1111X X222X ",
      " XXXX  XXXXXX  XXXX ",
      "       X11XX11X     ",
      "       X22XXXXX     ",
      "       XXXX         "
    ],
    run2: [
      "                    ",
      "      XXXXXXXX      ",
      "     X11111111X     ",
      "    X1G111111G1X    ",
      "   X111111111111X   ",
      "   X111RRRRRR111X   ",
      "   X111111111111X   ",
      "   XXXXXXXXXXXXXX   ",
      "    X1111111111X    ",
      "  XXXX11111111XXXX  ",
      " X111XX111111XX111X ",
      " X222X X1111X X222X ",
      " XXXX  XXXXXX  XXXX ",
      "       X11XX11X     ",
      "       XXXXX22X     ",
      "           XXXX     "
    ],
    jump: [
      "                    ",
      "      XXXXXXXX      ",
      "     X11111111X     ",
      "    X1G111111G1X    ",
      "   X111111111111X   ",
      "   X11RRRRRRRR11X   ",
      "   X111111111111X   ",
      "   XXXXXXXXXXXXXX   ",
      "    X1111111111X    ",
      "  XXXX11111111XXXX  ",
      " X111XX111111XX111X ",
      " X222X X1111X X222X ",
      " XXXX  XXXXXX  XXXX ",
      "       X11XX11X     ",
      "       XFFXXFFX     ",
      "       XXXXXXXX     "
    ],
    colorMap: { 'X': '#1C2833', '1': '#BDC3C7', '2': '#E67E22', 'G': '#2ECC71', 'F': '#F1C40F', 'R': '#E74C3C' }
  },
  ninja: {
    run1: [
      "                    ",
      "      XXXXXXXX      ",
      "     X11111111X     ",
      "     X11111111X     ",
      "     XRRRRRRRRX     ",
      "     X22BB2BB2X     ",
      "     X22222222X     ",
      "     X11111111X     ",
      "  XXXXX111111XXXXX  ",
      "  X11XXX1111XXX11X  ",
      "  X111X11RR11X111X  ",
      "  XXXXX111111XXXXX  ",
      "      X111111X      ",
      "      XXXXXXXX      ",
      "      XX1  1XX      ",
      "      XXX  XXX      "
    ],
    run2: [
      "                    ",
      "      XXXXXXXX      ",
      "     X11111111X     ",
      "     X11111111X     ",
      "     XRRRRRRRRX     ",
      "     X22BB2BB2X     ",
      "     X22222222X     ",
      "     X11111111X     ",
      "  XXXXX111111XXXXX  ",
      "  X11XXX1111XXX11X  ",
      "  X111X11RR11X111X  ",
      "  XXXXX111111XXXXX  ",
      "      X111111X      ",
      "      XXXXXXXX      ",
      "           X1X      ",
      "           XXX      "
    ],
    jump: [
      "                    ",
      "      XXXXXXXX      ",
      "     X11111111X     ",
      "     X11111111X     ",
      "     XRRRRRRRRX     ",
      "     X22BB2BB2X     ",
      "     X22222222X     ",
      "     X11111111X     ",
      "  XXXXX111111XXXXX  ",
      "  X11XXX1111XXX11X  ",
      "  X111X11RR11X111X  ",
      "  XXXXX111111XXXXX  ",
      "      X111111X      ",
      "      XXXXXXXX      ",
      "     XX1X  X1XX     ",
      "     XXXX  XXXX     "
    ],
    colorMap: { 'X': '#000000', '1': '#2C3E50', '2': '#F5CBA7', 'R': '#E74C3C', 'B': '#000000' }
  },
  alien: {
    run1: [
      "        XXXX        ",
      "      XX1111XX      ",
      "     X11111111X     ",
      "    X1WWWWWWWW1X    ",
      "    XWB11WW11BWX    ",
      "    XWBB1WW1BBWX    ",
      "    XWWWWWWWWWWX    ",
      "     XX111111XX     ",
      "   XXXXX2222XXXXX   ",
      "  XX333333333333XX  ",
      " X3333333333333333X ",
      "X333443344334433443X",
      "X333333333333333333X",
      " XX33333333333333XX ",
      "   XXXXX    XXXXX   ",
      "     XX      XX     "
    ],
    run2: [
      "        XXXX        ",
      "      XX1111XX      ",
      "     X11111111X     ",
      "    X1WWWWWWWW1X    ",
      "    XWB11WW11BWX    ",
      "    XWBB1WW1BBWX    ",
      "    XWWWWWWWWWWX    ",
      "     XX111111XX     ",
      "   XXXXX2222XXXXX   ",
      "  XX333333333333XX  ",
      " X3333333333333333X ",
      "X333443344334433443X",
      "X333333333333333333X",
      " XX33333333333333XX ",
      "     XX      XX     ",
      "   XXXXX    XXXXX   "
    ],
    jump: [
      "        XXXX        ",
      "      XX1111XX      ",
      "     X11111111X     ",
      "    X1WWWWWWWW1X    ",
      "    XWB11WW11BWX    ",
      "    XWBB1WW1BBWX    ",
      "    XWWWWWWWWWWX    ",
      "     XX111111XX     ",
      "   XXXXX2222XXXXX   ",
      "  XX333333333333XX  ",
      " X3333333333333333X ",
      "X333443344334433443X",
      "X333333333333333333X",
      " XX33333333333333XX ",
      "   X X X    X X X   ",
      "                    "
    ],
    colorMap: { 'X': '#000000', '1': '#9b59b6', '2': '#BDC3C7', '3': '#7F8C8D', '4': '#F1C40F', 'W': '#ecf0f1', 'B': '#000000' }
  },
    ghost: {
    run1: [
      "                    ",
      "        XXXXX       ",
      "      XX11111XX     ",
      "     X111111111X    ",
      "    X11WW111WW11X   ",
      "    X11BB111BB11X   ",
      "    X11WWWWWWW11X   ",
      "    X11WBBBBBW11X   ",
      "    X11WWWWWWW11X   ",
      "    X11111111111X   ",
      "    X11111111111X   ",
      "    X11111111111X   ",
      "    X11XX111XX11X   ",
      "    X1XX X1XX X1X   ",
      "    X X  XXX  X X   ",
      "                    "
    ],
    run2: [
      "                    ",
      "        XXXXX       ",
      "      XX11111XX     ",
      "     X111111111X    ",
      "    X11WW111WW11X   ",
      "    X11BB111BB11X   ",
      "    X11WWWWWWW11X   ",
      "    X11WBBBBBW11X   ",
      "    X11WWWWWWW11X   ",
      "    X11111111111X   ",
      "    X11111111111X   ",
      "    X11111111111X   ",
      "    XX11XX1XX11XX   ",
      "     X1XX XXX XX1X  ",
      "      XX   X   XX   ",
      "                    "
    ],
    jump: [
      "                    ",
      "        XXXXX       ",
      "      XX11111XX     ",
      "     X111111111X    ",
      "    X11WW111WW11X   ",
      "    X11BB111BB11X   ",
      "    X11WWWWWWW11X   ",
      "    X11WBBBBBW11X   ",
      "    X11WWWWWWW11X   ",
      "    X11111111111X   ",
      "    X11111111111X   ",
      "    X11111111111X   ",
      "    X11XX111XX11X   ",
      "    X1XX X1XX X1X   ",
      "    X X  XXX  X X   ",
      "                    "
    ],
    colorMap: { 'X': '#000000', '1': '#9b59b6', 'W': '#ecf0f1', 'B': '#000000' }
  }
};

const SPRITE_KEYS = Object.keys(SPRITE_SETS);

const OBS_SHAPES = {
  grass: {
    short: [
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
    ],
    tall: [
      "   XX   ",
      "  X11X  ",
      "  X11X  ",
      "  X11X  ",
      "  X11X X",
      "X X11XX1X",
      "X1X11X11X",
      "XX11111XX",
      " XX111X ",
      "  X11X  ",
      "  X11X  ",
      "  X11X  ",
      "  X11X  ",
      "  X11X  ",
      " X1111X "
    ]
  },
  desert: {
    short: [
      "        ",
      "        ",
      "        ",
      "   XX   ",
      "  X11X  ",
      " X1111X ",
      "X111111X",
      "X111111X",
      "X111111X",
      "XXXXXXXX"
    ],
    tall: [
      "   XX   ",
      "  X11X  ",
      " X1111X ",
      " X1111X ",
      " X1111X ",
      "X111111X",
      "X111111X",
      "X111111X",
      "X111111X",
      "X111111X",
      "X111111X",
      "X111111X",
      "X111111X",
      "X111111X",
      "XXXXXXXX"
    ]
  },
  neon: {
    short: [
      " XXXXXX ",
      " X1111X ",
      " X1111X ",
      " X1111X ",
      " X1111X ",
      " X1111X ",
      " X1111X ",
      " X1111X ",
      " X1111X ",
      " XXXXXX "
    ],
    tall: [
      " XXXXXX ",
      " X1111X ",
      " X1111X ",
      " X1111X ",
      " X1111X ",
      " X1111X ",
      " X1111X ",
      " X1111X ",
      " X1111X ",
      " X1111X ",
      " X1111X ",
      " X1111X ",
      " X1111X ",
      " X1111X ",
      " XXXXXX "
    ]
  },
  ice: {
    short: [
      "   XX   ",
      "  X11X  ",
      "  X11X  ",
      " X1111X ",
      " X1111X ",
      "X111111X",
      "X111111X",
      "X1X11X1X",
      "X11XX11X",
      "XXXXXXXX"
    ],
    tall: [
      "   XX   ",
      "  X11X  ",
      "  X11X  ",
      "  X11X  ",
      "  X11X  ",
      " X1111X ",
      " X1111X ",
      " X1111X ",
      " X1111X ",
      "X111111X",
      "X111111X",
      "X111111X",
      "X1X11X1X",
      "X11XX11X",
      "XXXXXXXX"
    ]
  }
};

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
    let gameSpeed = 3.5;
    let gameOverFlag = false;
    let isSpaceDown = false;

    let nextObstacleFrame = 120;
    let nextCoinFrame = 90;
    let nextColorFrame = 175;
    let colorBag: string[] = [];
    
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
      y: 350 - 51.2,
      width: 64, // 20 * 3.2
      height: 51.2, // 16 * 3.2
      spriteKey: SPRITE_KEYS[Math.floor(Math.random() * SPRITE_KEYS.length)],
      velocityY: 0,
      gravity: 0.8,
      isJumping: false,
      jumpTime: 0,

      draw() {
        const pSize = 3.2;
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

        let baseAlpha = ctx.globalAlpha;
        if (this.spriteKey === 'ghost') {
           // 幽靈透明化與實體化
           ctx.globalAlpha = 0.3 + 0.7 * Math.abs(Math.sin(frames / 10));
        }

        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        
        let scaleX = 1;
        let scaleY = 1;
        let rotation = 0;
        
        if (this.spriteKey === 'dino') {
           scaleX = 1.2;
           scaleY = 1.2;
        }
        
        if (this.isJumping) {
          const t = frames - this.jumpTime;
          
          if (this.spriteKey === 'ninja') {
             // 忍者前空翻
             rotation = (t * 0.15) % (Math.PI * 2);
          } else if (this.spriteKey === 'trex') {
             // 暴龍伸展
             scaleY = 1 + Math.sin(t * 0.2) * 0.2;
             scaleX = 1 - Math.sin(t * 0.2) * 0.1;
          } else if (this.spriteKey === 'bird') {
             // 小鳥拍動縮放
             scaleY = 1 + Math.sin(t * 0.5) * 0.2;
          } else if (this.spriteKey === 'dino') {
             // 騎士後仰
             rotation = -0.3 + Math.sin(t * 0.1) * 0.1;
             scaleX = 1.2;
             scaleY = 1.2;
          } else if (this.spriteKey === 'robot') {
             // 機器人抖動
             ctx.translate(Math.random() * 4 - 2, Math.random() * 4 - 2);
          } else if (this.spriteKey === 'alien') {
             // 外星人盤旋傾斜
             rotation = Math.sin(t * 0.1) * 0.2;
          } else if (this.spriteKey === 'ghost') {
             // 幽靈閃爍放大
             scaleX = 1 + Math.sin(t * 0.3) * 0.3;
             scaleY = 1 + Math.sin(t * 0.3) * 0.3;
          }
        }
        
        ctx.rotate(rotation);
        ctx.scale(scaleX, scaleY);
        
        // drawSprite centers inside the translate so we pass negative half sizes
        drawSprite(ctx, currentSprite, -(currentSprite[0].length * pSize) / 2, -(currentSprite.length * pSize) / 2, pSize, colorMap);
        ctx.restore();
        
        ctx.globalAlpha = baseAlpha;

        // 新增角色特色特效
        if (frames % 4 === 0) {
          if (this.spriteKey === 'trex') {
            // 嘴巴噴火
            for(let i=0; i<2; i++) {
               particles.push({
                 x: this.x + this.width - 5, y: this.y + 12,
                 vx: Math.random() * 5 + 5, vy: (Math.random() - 0.5) * 3,
                 color: Math.random() > 0.5 ? '#E74C3C' : '#F1C40F',
                 life: 1.0, maxLife: Math.random() * 10 + 10, size: Math.random() * 4 + 3, gravity: 0.1
               });
            }
          }
          else if (this.spriteKey === 'dino') {
            // 揮動刀子 (刀光特效)
            if (frames % 12 === 0 || frames % 12 === 4) {
               particles.push({
                 x: this.x + this.width + (frames%12)*2, y: this.y + 8 + (frames%12)*1.5,
                 vx: 2, vy: 2,
                 color: '#FFFFFF',
                 life: 1.0, maxLife: 8, size: Math.random() * 3 + 2
               });
            }
          }
          else if (this.spriteKey === 'bird') {
            // 拍動翅膀 (掉落羽毛)
            particles.push({
              x: this.x + 16, y: this.y + 24,
              vx: -3, vy: Math.random() * 0.5 + 0.5,
              color: '#FFFFFF',
              life: 1.0, maxLife: 20, size: Math.random() * 3 + 1, gravity: 0.2
            });
          }
          else if (this.spriteKey === 'robot') {
            // 發出閃電
            if (Math.random() > 0.5) {
              particles.push({
                x: this.x + Math.random()*this.width, y: this.y + Math.random()*this.height,
                vx: (Math.random() - 0.5) * 5, vy: (Math.random() - 0.5) * 5,
                color: '#00FFFF',
                life: 1.0, maxLife: 5, size: Math.random() * 4 + 2
              });
            }
          }
          else if (this.spriteKey === 'ninja') {
            // 射出飛鏢
            if (frames % 16 === 0) {
              particles.push({
                x: this.x + this.width, y: this.y + 24,
                vx: 12, vy: 0,
                color: '#BDC3C7',
                life: 1.0, maxLife: 30, size: 5, gravity: 0
              });
            }
          }
          else if (this.spriteKey === 'alien') {
            // 飛碟尾跡
            particles.push({
              x: this.x + this.width/2 + (Math.random()-0.5)*16, y: this.y + this.height - 8,
              vx: -3, vy: Math.random() * 3 + 2,
              color: '#2ECC71',
              life: 1.0, maxLife: 15, size: Math.random() * 4 + 2
            });
          }
        }
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
          this.velocityY = -11; // 小跳躍
          this.isJumping = true;
          this.jumpTime = frames;
          // 特色跳躍特效
          let effectColor = '#FFFFFF';
          if (this.spriteKey === 'trex') { effectColor = '#E74C3C'; }
          else if (this.spriteKey === 'dino') { effectColor = '#BDC3C7'; }
          else if (this.spriteKey === 'bird') { effectColor = '#F1C40F'; }
          else if (this.spriteKey === 'robot') {
            effectColor = '#00FFFF';
            for(let i=0; i<4; i++) {
               particles.push({
                 x: this.x + this.width / 2 + (Math.random() - 0.5) * 40,
                 y: this.y + this.height / 2 + (Math.random() - 0.5) * 40,
                 vx: (Math.random() - 0.5) * 3,
                 vy: (Math.random() - 0.5) * 3,
                 color: '#00FFFF',
                 life: 1.0, maxLife: 15, size: 2, gravity: 0,
                 isLightning: true
               });
            }
          }
          else if (this.spriteKey === 'ninja') { effectColor = '#34495E'; }
          else if (this.spriteKey === 'alien') { effectColor = '#9b59b6'; }

          createParticles(this.x + this.width / 2, this.y + this.height, effectColor, 12);
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
        obsKey: 'grass',
        coinC: { 'X': '#d35400', '1': '#f1c40f' } // Gold
      },
      { // 1: 沙漠
        sky: ['#FF7E5F', '#FEB47B'], bgObj: 'sun',
        mountain: '#D38D5F',
        ground: '#C28253', groundTop: '#E6A875', groundSpot: ['#A4653A', '#B57348'],
        obsC: { 'X': '#5C4033', '1': '#8f9779' }, // Olive
        obsKey: 'desert',
        coinC: { 'X': '#7f8c8d', '1': '#ecf0f1' } // Silver
      },
      { // 2: 霓虹之夜
        sky: ['#141A30', '#2B2F4C'], bgObj: 'star',
        mountain: '#1D2235',
        ground: '#0B0D17', groundTop: '#FF2A6D', groundSpot: ['#1A1C29', '#21263A'],
        obsC: { 'X': '#05D9E8', '1': '#01FFE1' }, // Neon Blue
        obsKey: 'neon',
        coinC: { 'X': '#D1F2A5', '1': '#EFFCB9' } // Neon Green
      },
      { // 3: 冰雪仙境
        sky: ['#83a4d4', '#b6fbff'], bgObj: 'snow',
        mountain: '#FFFFFF',
        ground: '#a0b0b9', groundTop: '#FFFFFF', groundSpot: ['#889ca6', '#728892'],
        obsC: { 'X': '#2980B9', '1': '#6DD5FA' }, // Ice
        obsKey: 'ice',
        coinC: { 'X': '#c0392b', '1': '#ff4d4d' } // Ruby
      }
    ];

    // --- 生成與繪製函數 ---
    const handleObstacles = () => {
      const theme = THEMES[currentLevel];
      // 減少生成頻率
      if (frames >= nextObstacleFrame) {
        const isTall = Math.random() > 0.4;
        const shapes = OBS_SHAPES[theme.obsKey as keyof typeof OBS_SHAPES];
        const spriteArray = isTall ? shapes.tall : shapes.short;
        const scale = 3.6;
        const height = spriteArray.length * scale;
        const width = spriteArray[0].length * scale;
        obstacles.push({ x: canvas.width, y: 350 - height, width, height, spriteArray });
        
        const currentSpawnRate = Math.max(50, 120 - Math.floor(score / 30));
        nextObstacleFrame = frames + currentSpawnRate + Math.floor(Math.random() * 80) + (Math.random() > 0.8 ? 60 : 0);
      }

      for (let i = 0; i < obstacles.length; i++) {
        const obs = obstacles[i];
        obs.x -= gameSpeed;

        drawSprite(ctx, obs.spriteArray, obs.x, obs.y, 3.6, theme.obsC);

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
        if (colorBag.length === 0) {
           colorBag = [...SPRITE_KEYS].sort(() => Math.random() - 0.5);
        }
        const randomKey = colorBag.pop()!;
        const randomColor = SPRITE_SETS[randomKey].colorMap['1'] || '#fff';
        colorItems.push({ x: canvas.width, y: 350 - (Math.random() * 60 + 30), width: 30, height: 30, color: randomColor, spriteKey: randomKey });
        nextColorFrame = frames + 200 + Math.floor(Math.random() * 100);
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
        p.vy += 0.2 * (p.gravity !== undefined ? p.gravity : 1); // gravity for particles
        p.life -= 1 / p.maxLife;

        if (p.life <= 0) {
          particles.splice(i, 1);
          i--;
          continue;
        }

        ctx.globalAlpha = p.life;
        if (p.isLightning) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            let lx = p.x;
            let ly = p.y;
            for(let step = 0; step < 3; step++) {
               lx += Math.random()*20 - 10;
               ly += Math.random()*20 - 10;
               ctx.lineTo(lx, ly);
            }
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 2;
            ctx.stroke();
        } else {
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.size, p.size);
        }
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

    // --- 遊戲主迴圈 ---
    let lastTime = 0;
    const FPS = 60;
    const frameInterval = 1000 / FPS;

    const gameLoop = (timestamp?: number) => {
      const currentTimestamp = timestamp || performance.now();
      
      if (!lastTime) lastTime = currentTimestamp;
      const deltaTime = currentTimestamp - lastTime;

      if (deltaTime < frameInterval) {
        if (!gameOverFlag) {
          animationId = requestAnimationFrame(gameLoop);
        }
        return;
      }
      
      lastTime = currentTimestamp - (deltaTime % frameInterval);

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
      gameSpeed = 3.5 + (score / 400); 
      distance += gameSpeed;

      const newLevel = Math.floor(score / 1000) % THEMES.length;
      if (newLevel !== currentLevel) {
        currentLevel = newLevel;
        levelTransitionFrames = 120; // 顯示兩秒升級提示
      }

      if (levelTransitionFrames > 0) {
         ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, levelTransitionFrames / 30)})`;
         ctx.font = "bold 40px monospace";
         ctx.textAlign = "center";
         const levelNames = ["草原", "沙漠", "霓虹之夜", "冰雪仙境"];
         ctx.fillText(`STAGE ${Math.floor(score / 1000) + 1}: ${levelNames[currentLevel]}`, canvas.width / 2, canvas.height / 3);
         ctx.textAlign = "left";
         levelTransitionFrames--;
      }

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
