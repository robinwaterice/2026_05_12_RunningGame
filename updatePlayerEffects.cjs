const fs = require('fs');
let code = fs.readFileSync('src/components/ChameleonGame.tsx', 'utf8');

const replacement = `    // 玩家物件
    const player = {
      x: 50,
      y: 350 - 64,
      width: 80, // 20 * 4
      height: 64, // 16 * 4
      spriteKey: SPRITE_KEYS[Math.floor(Math.random() * SPRITE_KEYS.length)],
      velocityY: 0,
      gravity: 0.8,
      isJumping: false,
      jumpTime: 0,

      draw() {
        const pSize = 4;
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

        drawSprite(ctx, currentSprite, this.x, this.y, pSize, colorMap);
        ctx.globalAlpha = baseAlpha;

        // 新增角色特色特效
        if (frames % 4 === 0) {
          if (this.spriteKey === 'trex') {
            // 嘴巴噴火
            for(let i=0; i<2; i++) {
               particles.push({
                 x: this.x + this.width - 5, y: this.y + 15,
                 vx: Math.random() * 5 + 5, vy: (Math.random() - 0.5) * 3,
                 color: Math.random() > 0.5 ? '#E74C3C' : '#F1C40F',
                 life: 1.0, maxLife: Math.random() * 10 + 10, size: Math.random() * 4 + 3
               });
            }
          }
          else if (this.spriteKey === 'knight') {
            // 揮動刀子 (刀光特效)
            if (frames % 12 === 0 || frames % 12 === 4) {
               particles.push({
                 x: this.x + this.width + (frames%12)*3, y: this.y + 10 + (frames%12)*2,
                 vx: 2, vy: 2,
                 color: '#FFFFFF',
                 life: 1.0, maxLife: 8, size: Math.random() * 3 + 2
               });
            }
          }
          else if (this.spriteKey === 'bird') {
            // 拍動翅膀 (掉落羽毛)
            particles.push({
              x: this.x + 20, y: this.y + 30,
              vx: -3, vy: Math.random() * 2 + 1,
              color: '#FFFFFF',
              life: 1.0, maxLife: 20, size: Math.random() * 3 + 1
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
                x: this.x + this.width, y: this.y + 30,
                vx: 12, vy: 0,
                color: '#BDC3C7',
                life: 1.0, maxLife: 30, size: 5
              });
            }
          }
          else if (this.spriteKey === 'alien') {
            // 飛碟尾跡
            particles.push({
              x: this.x + this.width/2 + (Math.random()-0.5)*20, y: this.y + this.height - 10,
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
          else if (this.spriteKey === 'knight') { effectColor = '#BDC3C7'; }
          else if (this.spriteKey === 'bird') { effectColor = '#F1C40F'; }
          else if (this.spriteKey === 'robot') { effectColor = '#00FFFF'; }
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
    };`;

const startIndex = code.indexOf('    // 玩家物件\n    const player = {');
const endIndex = code.indexOf('    let obstacles: Obstacle[] = [];');

if (startIndex !== -1 && endIndex !== -1) {
    code = code.slice(0, startIndex) + replacement + "\n\n" + code.slice(endIndex);
    fs.writeFileSync('src/components/ChameleonGame.tsx', code);
    console.log("Player updated successfully");
} else {
    console.log("Failed to find boundaries");
}
