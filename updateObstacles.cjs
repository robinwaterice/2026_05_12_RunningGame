const fs = require('fs');

let code = fs.readFileSync('src/components/ChameleonGame.tsx', 'utf8');

const regex = /const OBS_SHORT_1 = \[[\s\S]*?const OBS_TALL_2 = \[[\s\S]*?\];/;

const replacement = `const OBS_SHAPES = {
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
};`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/ChameleonGame.tsx', code);
