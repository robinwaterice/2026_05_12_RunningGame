const fs = require('fs');

let code = fs.readFileSync('src/components/ChameleonGame.tsx', 'utf8');

const frogStr = `  frog: {
    run1: [
      "                    ",
      "                    ",
      "                    ",
      "                    ",
      "                    ",
      "      X      X      ",
      "     XWX    XWX     ",
      "    X1B1XXXX1B1X    ",
      "   X111111111111X   ",
      "   X111XXXXXX111X   ",
      "   X11XXRRRRXX11X   ",
      "    XX11XXXX11XX    ",
      "  XX111111111111XX  ",
      " XX11XX      XX11XX ",
      "                    "
    ],
    run2: [
      "                    ",
      "                    ",
      "                    ",
      "                    ",
      "                    ",
      "      X      X      ",
      "     XWX    XWX     ",
      "    X1B1XXXX1B1X    ",
      "   X111111111111X   ",
      "   X111XXXXXX111X   ",
      "   X11XXRRRRXX11X   ",
      "    XX11XXXX11XX    ",
      "  XX111111111111XX  ",
      "   X1X        X1X   ",
      "   XX          XX   "
    ],
    jump: [
      "                    ",
      "                    ",
      "                    ",
      "      X      X      ",
      "     XWX    XWX     ",
      "    X1B1XXXX1B1X    ",
      "   X111111111111X   ",
      "   X111XXXXXX111X   ",
      "   X11XXRRRRXX11X   ",
      "    XX11XXXX11XX    ",
      "   X111111111111X   ",
      "  X11X        X11X  ",
      " XXX            XXX ",
      "                    ",
      "                    "
    ],
    colorMap: { 'X': '#145a32', '1': '#2ecc71', 'W': '#ffffff', 'B': '#000000', 'R': '#e74c3c' }
  },`;

const ninjaStr = `  ninja: {
    run1: [
      "                    ",
      "       XXXXXX       ",
      "      X111111X      ",
      "     X1SSSS11X      ",
      "     X1SWS111X      ",
      "    XXRRRRRRXX      ",
      "   X1111111111X     ",
      "   X111RR11111X     ",
      "  X11X11111X11X     ",
      "  XXX X1111X XXX    ",
      "      X1111X        ",
      "     XX1111XX       ",
      "     X1X  X1X       ",
      "     X1X  X1X       ",
      "     XXX  XXX       "
    ],
    run2: [
      "                    ",
      "       XXXXXX       ",
      "      X111111X      ",
      "     X1SSSS11X      ",
      "     X1SWS111X      ",
      "    XXRRRRRRXX      ",
      "   X1111111111X     ",
      "   X111RR11111X     ",
      "  X11X11111X11X     ",
      "  XXX X1111X XXX    ",
      "      X1111X        ",
      "      X11111X       ",
      "      XX  X1X       ",
      "          XXX       ",
      "                    "
    ],
    jump: [
      "                    ",
      "       XXXXXX       ",
      "      X111111X      ",
      "     X1SSSS11X      ",
      "     X1SWS111X      ",
      "    XXRRRRRRXX      ",
      "   X1111111111X     ",
      "   X111RR11111X     ",
      "  X11X11111X11X     ",
      "  XXX X1111X XXX    ",
      "     XX1111XX       ",
      "    XX1    1XX      ",
      "    XXX    XXX      ",
      "                    ",
      "                    "
    ],
    colorMap: { 'X': '#000000', '1': '#2C3E50', 'S': '#F1C40F', 'R': '#E74C3C', 'W': '#FFFFFF' }
  },`;

const unicornStr = `  unicorn: {
    run1: [
      "         X          ",
      "        XYX         ",
      "       XYYX         ",
      "     XXX11X         ",
      "    X111W1X         ",
      "    X111B1X         ",
      "  XXX11111XXXXX     ",
      " XPP11111111111X    ",
      " XP111111111111XX   ",
      " X111XXXXXXXXX11X   ",
      " X111X       X11X   ",
      "  XXX        XXX    ",
      "                    ",
      "                    ",
      "                    "
    ],
    run2: [
      "         X          ",
      "        XYX         ",
      "       XYYX         ",
      "     XXX11X         ",
      "    X111W1X         ",
      "    X111B1X         ",
      "  XXX11111XXXXX     ",
      " XPP11111111111X    ",
      " XP111111111111X  X ",
      " X111XXXXXXXXX1X XX ",
      " X11X        X1XX   ",
      "  XX          XX    ",
      "                    ",
      "                    ",
      "                    "
    ],
    jump: [
      "         X          ",
      "        XYX         ",
      "     XXXYYX         ",
      "    X11111X         ",
      "    X111W1X         ",
      "    X111B1X         ",
      "  XXX11111XXXXX     ",
      " XPP11111111111X    ",
      " XP111111111111XX   ",
      " X111XXXXXX11X11X   ",
      "  XXX      XXXXX    ",
      "                    ",
      "                    ",
      "                    ",
      "                    "
    ],
    colorMap: { 'X': '#2c3e50', '1': '#ffffff', 'W': '#000000', 'B': '#3498db', 'Y': '#f1c40f', 'P': '#e74c3c' }
  }`;

const ghostStr = `  ghost: {
    run1: [
      "                    ",
      "       XXXX         ",
      "      X1111X        ",
      "     X111111X       ",
      "    X1B1111B1X      ",
      "    X11111111X      ",
      "    X111BB111X      ",
      "    X11111111X      ",
      "    X111111111X     ",
      "   X1111111111X     ",
      "   X1111111111X     ",
      "   X11X111X111X     ",
      "   X1X X1X X1XX     ",
      "   XX   X   XX      ",
      "                    "
    ],
    run2: [
      "                    ",
      "       XXXX         ",
      "      X1111X        ",
      "     X111111X       ",
      "    X1B1111B1X      ",
      "    X11111111X      ",
      "    X111BB111X      ",
      "    X11111111X      ",
      "    X111111111X     ",
      "   X1111111111X     ",
      "   X1111111111X     ",
      "   X111X111X11X     ",
      "   XX1X X1X X1X     ",
      "    XX   X   XX     ",
      "                    "
    ],
    jump: [
      "       XXXX         ",
      "      X1111X        ",
      "     X111111X       ",
      "    X1B1111B1X      ",
      "    X11111111X      ",
      "    X111BB111X      ",
      "    X11111111X      ",
      "    X111111111X     ",
      "   X1111111111X     ",
      "   X1111111111X     ",
      "   X11X111X111X     ",
      "   X1X X1X X1XX     ",
      "   XX   X   XX      ",
      "                    ",
      "                    "
    ],
    colorMap: { 'X': '#2C3E50', '1': '#ECF0F1', 'B': '#000000' }
  }`;

const catStr = `  cat: {
    run1: [
      "                    ",
      "                    ",
      "                    ",
      "   XX        XX     ",
      "  X11X      X11X    ",
      " X1111XXXXXX1111X   ",
      " X11111111111111X   ",
      " X1WWB111111BWW1X   ",
      " X1WBB11YY11BBW1X   ",
      "  X111111111111X    ",
      "  X111111111111X    ",
      "  XXXX111111XXXX  XX",
      "   X11XX11XX11X  X1X",
      "  X11X X11X X11XX1X ",
      "  XXXX XXXX XXXXXX  "
    ],
    run2: [
      "                    ",
      "                    ",
      "                    ",
      "   XX        XX     ",
      "  X11X      X11X    ",
      " X1111XXXXXX1111X   ",
      " X11111111111111X   ",
      " X1WWB111111BWW1X   ",
      " X1WBB11YY11BBW1X   ",
      "  X111111111111X    ",
      "  XXXX111111XXXX    ",
      "   X11XX11XX11X XX  ",
      "  X11X  XX  X11X11X ",
      "  XXXX      XXXXX   ",
      "                    "
    ],
    jump: [
      "                    ",
      "                    ",
      "   XX        XX     ",
      "  X11X      X11X    ",
      " X1111XXXXXX1111X   ",
      " X11111111111111X   ",
      " X1WWB111111BWW1X   ",
      " X1WBB11YY11BBW1X  X",
      "  X111111111111X  X1",
      "  X111111111111XXXX ",
      "  X111111111111X    ",
      "  XXXX111111XXXX    ",
      " X11X X11XX1X X11X  ",
      " XXXX XXXXXXX XXXX  ",
      "                    "
    ],
    colorMap: { 'X': '#34495E', '1': '#F39C12', 'W': '#FFFFFF', 'B': '#2C3E50', 'Y': '#E74C3C' }
  },`;

const knightStr = `  knight: {
    run1: [
      "      XXXXXX        ",
      "     X111111X       ",
      "     X1BBB11X       ",
      "    XRR111111X      ",
      "   XRRR111111X      ",
      "   XRRXXXXX1X       ",
      "    X222222X        ",
      "   X11222211X       ",
      "  X11X2222X11X      ",
      "  S1 X2222X 1S      ",
      "  SS X2222X SS      ",
      "  SS  X22X  SS      ",
      "       XX           ",
      "      X11X          ",
      "     XX  XX         "
    ],
    run2: [
      "      XXXXXX        ",
      "     X111111X       ",
      "     X1BBB11X       ",
      "    XRR111111X      ",
      "   XRRR111111X      ",
      "  XRRRXXXXX1X       ",
      "    X222222X        ",
      "   X11222211X       ",
      "  X11X2222X11X      ",
      "  S1 X2222X 1S      ",
      "  SS  X22X  SS      ",
      "  SS  X11X  SS      ",
      "      XXXX          ",
      "       X11X         ",
      "       XXXX         "
    ],
    jump: [
      "      XXXXXX        ",
      "     X111111X       ",
      "     X1BBB11X       ",
      "    XRR111111X      ",
      "  XRRRR111111X      ",
      "   XRRXXXXX1X       ",
      "    X222222X        ",
      "   X11222211X       ",
      "  X11X2222X11X      ",
      "  S1  X22X  1S      ",
      "  SS XX11XX SS      ",
      "  SS        SS      ",
      "                    ",
      "                    ",
      "                    "
    ],
    colorMap: { 'X': '#2C3E50', '1': '#95A5A6', '2': '#7F8C8D', 'R': '#C0392B', 'B': '#000000', 'S': '#BDC3C7' }
  },`;

code = code.replace(frogStr, ninjaStr);
code = code.replace(unicornStr, ghostStr);
code = code.replace(catStr, knightStr);

fs.writeFileSync('src/components/ChameleonGame.tsx', code);
console.log("Success");
