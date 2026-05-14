const fs = require('fs');

const replacement = `const SPRITE_SETS: Record<string, { run1: string[], run2: string[], jump: string[], colorMap: Record<string, string> }> = {
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
  knight: {
    run1: [
      "     XXX            ",
      "    XPPPX   SSSSS   ",
      "   XPPPPPX S22222S  ",
      "   X11111X S22222S  ",
      "   X11111X  S222S   ",
      "   X1BWB1X   S2S    ",
      "   X11111X   XXX    ",
      "   XXX1XXX   X1X    ",
      "  X2222222X XX1XX   ",
      " XX1122211XXXX1XXXX ",
      " X1X12221X1X  X1X   ",
      "   X11111X    X1X   ",
      "   XXXXXXX    XXX   ",
      "    X1X X1X         ",
      "    XXX XXX         ",
      "                    "
    ],
    run2: [
      "     XXX            ",
      "    XPPPX           ",
      "   XPPPPPX          ",
      "   X11111X  SSSSS   ",
      "   X11111X S22222S  ",
      "   X1BWB1X S22222S  ",
      "   X11111X  S222S   ",
      "   XXX1XXX   S2S    ",
      "  X2222222X  XXX    ",
      " XX1122211XX X1X    ",
      " X1X12221X1XXX1XXXX ",
      "   X11111X    X1X   ",
      "   XXXXXXX    XXX   ",
      "     XX XX          ",
      "    XXX XXX         ",
      "                    "
    ],
    jump: [
      "     XXX    SSSSS   ",
      "    XPPPX  S22222S  ",
      "   XPPPPPX S22222S  ",
      "   X11111X  S222S   ",
      "   X11111X   S2S    ",
      "   X1BWB1X   XXX    ",
      "   X11111X   X1X    ",
      "   XXX1XXX  XX1XX   ",
      "  X2222222XXX 1XXXX ",
      " XX1122211XX  X1X   ",
      " X1X12221X1X  XXX   ",
      "   X11111X          ",
      "   XXXXXXX          ",
      "    X1XX1X          ",
      "                    ",
      "                    "
    ],
    colorMap: { 'X': '#2C3E50', '1': '#BDC3C7', '2': '#7F8C8D', 'P': '#E74C3C', 'W': '#FFFFFF', 'B': '#000000', 'S': '#95A5A6' }
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
      "        XXXX        ",
      "        X22X        ",
      "       XX22XX       ",
      "     XXX1111XXX     ",
      "    X1111111111X    ",
      "    X1B111111B1X    ",
      "    X1G111111G1X    ",
      "    X1111111111X    ",
      "   XX1111111111XX   ",
      " X X11X222222X11X X ",
      "XXX111X111111X111XXX",
      "   X111XXXXXX111X   ",
      "   XXXX      XXXX   ",
      "      X2X  X2X      ",
      "      XXX  XXX      ",
      "                    "
    ],
    run2: [
      "        XXXX        ",
      "        X22X        ",
      "       XX22XX       ",
      "     XXX1111XXX     ",
      "    X1111111111X    ",
      "    X1B111111B1X    ",
      "    X1G111111G1X    ",
      "    X1111111111X    ",
      "   XX1111111111XX   ",
      " X X11X222222X11X X ",
      "XXX111X111111X111XXX",
      "   X111XXXXXX111X   ",
      "   XXXX      XXXX   ",
      "          X2X       ",
      "          XXX       ",
      "                    "
    ],
    jump: [
      "        XXXX        ",
      "        X22X        ",
      "       XX22XX       ",
      "     XXX1111XXX     ",
      "    X1111111111X    ",
      "    X1B111111B1X    ",
      "    X1G111111G1X    ",
      "    X1111111111X    ",
      " X XX1111111111XX X ",
      "XXX111X222222X111XXX",
      "   X11X111111X11X   ",
      "   X111XXXXXX111X   ",
      "   XXXX      XXXX   ",
      "      X2X  X2X      ",
      "      XXX  XXX      ",
      "                    "
    ],
    colorMap: { 'X': '#17202A', '1': '#95A5A6', '2': '#F39C12', 'G': '#00FFFF', 'B': '#000000' }
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
      "      XXXXXXXXX     ",
      "   XXX111111111XXX  ",
      "  X111111111111111X ",
      " X11WW1111111WW1111X",
      " X11BB1111111BB1111X",
      " X111111WWWW1111111X",
      " X11111WBBBBW111111X",
      " X111111WWWW1111111X",
      " X11111111111111111X",
      " X11111111111111111X",
      " X11111111111111111X",
      " XXX111XXX111XXX111X",
      " X11X X111X X111X X1",
      " X  X  X  X  X  X  X",
      "                    "
    ],
    run2: [
      "                    ",
      "      XXXXXXXXX     ",
      "   XXX111111111XXX  ",
      "  X111111111111111X ",
      " X11WW1111111WW1111X",
      " X11BB1111111BB1111X",
      " X111111WWWW1111111X",
      " X11111WBBBBW111111X",
      " X111111WWWW1111111X",
      " X11111111111111111X",
      " X11111111111111111X",
      " X11111111111111111X",
      " XXX111XXX111XXX11XX",
      "  X11X X111X X111X  ",
      "   X  X  X  X  X  X ",
      "                    "
    ],
    jump: [
      "                    ",
      "      XXXXXXXXX     ",
      "   XXX111111111XXX  ",
      "  X111111111111111X ",
      " X11WW1111111WW1111X",
      " X11BB1111111BB1111X",
      " X111111WWWW1111111X",
      " X11111WBBBBW111111X",
      " X111111WWWW1111111X",
      " X11111111111111111X",
      " X11111111111111111X",
      " X11111111111111111X",
      " XXX111XXX111XXX111X",
      " X11X X111X X111X X1",
      " X  X  X  X  X  X  X",
      "                    "
    ],
    colorMap: { 'X': '#2C3E50', '1': '#ECF0F1', 'W': '#FFFFFF', 'B': '#000000' }
  }
};`;

let code = fs.readFileSync('src/components/ChameleonGame.tsx', 'utf8');

const startMarker = "const SPRITE_SETS: Record<string";
const startIndex = code.indexOf(startMarker);
const endMarker = "const OBS_SHAPES";
let endIndex = code.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  // Find the exact line before OBS_SHAPES
  endIndex = code.lastIndexOf(";", endIndex) + 1; // get to the end of SPRITE_KEYS if it's there
  if (endIndex < startIndex) {
      endIndex = code.indexOf("const OBS_SHAPES");
  }
  
  // Actually, let's just make it simpler by matching till SPRITE_KEYS
  const spriteKeysMarker = "const SPRITE_KEYS = Object.keys(SPRITE_SETS);";
  endIndex = code.indexOf(spriteKeysMarker);

  code = code.slice(0, startIndex) + replacement + "\n\n" + code.slice(endIndex);
  fs.writeFileSync('src/components/ChameleonGame.tsx', code);
  console.log("Success");
} else {
  console.log("Failed", startIndex, endIndex);
}
