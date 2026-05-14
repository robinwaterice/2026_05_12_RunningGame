const fs = require('fs');
let code = fs.readFileSync('src/components/ChameleonGame.tsx', 'utf8');

code = code.replace(
  /size: number;\n\};/,
  'size: number;\n  gravity?: number;\n};'
);

code = code.replace(
  /p\.vy \+= 0\.2; \/\/ gravity for particles/,
  'p.vy += 0.2 * (p.gravity !== undefined ? p.gravity : 1); // gravity for particles'
);

// update player effects to use gravity where needed
code = code.replace(
  /vx: 12, vy: 0,\n\s*color: '#BDC3C7',\n\s*life: 1.0, maxLife: 30, size: 5/,
  "vx: 12, vy: 0,\n                color: '#BDC3C7',\n                life: 1.0, maxLife: 30, size: 5, gravity: 0"
);

code = code.replace(
  /vx: -3, vy: Math.random\(\) \* 2 \+ 1,\n\s*color: '#FFFFFF',\n\s*life: 1.0, maxLife: 20, size: Math.random\(\) \* 3 \+ 1/,
  "vx: -3, vy: Math.random() * 0.5 + 0.5,\n              color: '#FFFFFF',\n              life: 1.0, maxLife: 20, size: Math.random() * 3 + 1, gravity: 0.2"
);

code = code.replace(
  /vx: Math.random\(\) \* 5 \+ 5, vy: \(Math.random\(\) - 0.5\) \* 3,\n\s*color: Math.random\(\) > 0.5 \? '#E74C3C' : '#F1C40F',\n\s*life: 1.0, maxLife: Math.random\(\) \* 10 \+ 10, size: Math.random\(\) \* 4 \+ 3/,
  "vx: Math.random() * 5 + 5, vy: (Math.random() - 0.5) * 3,\n                 color: Math.random() > 0.5 ? '#E74C3C' : '#F1C40F',\n                 life: 1.0, maxLife: Math.random() * 10 + 10, size: Math.random() * 4 + 3, gravity: 0.1"
);

fs.writeFileSync('src/components/ChameleonGame.tsx', code);
console.log('Gravity update applied');
