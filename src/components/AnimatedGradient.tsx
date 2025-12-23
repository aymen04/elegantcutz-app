import { useEffect, useState } from 'react';

interface AnimatedGradientProps {
  className?: string;
  speed?: number;
  height?: string;
}

export function AnimatedGradient({ 
  className = '', 
  speed = 0.002,
  height = 'h-96'
}: AnimatedGradientProps) {
  const [gradient, setGradient] = useState('linear-gradient(to right, rgb(62,35,255), rgb(60,255,60))');

  const colors = [
    [62, 35, 255],    // Violet
    [60, 255, 60],    // Vert
    [255, 35, 98],    // Rouge
    [45, 175, 230],   // Bleu
    [255, 0, 255],    // Magenta
    [255, 128, 0],    // Orange
  ];

  let step = 0;
  let colorIndices = [0, 1, 2, 3];

  useEffect(() => {
    const updateGradient = () => {
      const c0_0 = colors[colorIndices[0]];
      const c0_1 = colors[colorIndices[1]];
      const c1_0 = colors[colorIndices[2]];
      const c1_1 = colors[colorIndices[3]];

      const istep = 1 - step;
      const r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
      const g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
      const b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
      const color1 = `rgb(${r1},${g1},${b1})`;

      const r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
      const g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
      const b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
      const color2 = `rgb(${r2},${g2},${b2})`;

      setGradient(`linear-gradient(to right, ${color1}, ${color2})`);

      step += speed;
      if (step >= 1) {
        step = step % 1;
        colorIndices[0] = colorIndices[1];
        colorIndices[2] = colorIndices[3];

        // Pick two new target color indices
        colorIndices[1] = (colorIndices[1] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;
        colorIndices[3] = (colorIndices[3] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;
      }
    };

    const interval = setInterval(updateGradient, 10);
    return () => clearInterval(interval);
  }, [speed]);

  return (
    <div 
      className={`absolute inset-0 ${height} ${className}`}
      style={{
        background: gradient,
        opacity: 0.1,
        zIndex: 0,
      }}
    />
  );
}
