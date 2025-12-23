import { useEffect, useRef } from 'react';

interface InteractiveBackgroundProps {
  className?: string;
}

export function InteractiveBackground({ className = '' }: InteractiveBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handlePointerMove = (e: PointerEvent) => {
      const { left: l, top: t, width: w, height: h } = container.getBoundingClientRect();
      const x = e.clientX - l - w / 2;
      const y = e.clientY - t - h / 2;
      container.style.setProperty('--posX', String(x));
      container.style.setProperty('--posY', String(y));
    };

    container.addEventListener('pointermove', handlePointerMove);
    return () => container.removeEventListener('pointermove', handlePointerMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-auto ${className}`}
      style={{
        '--posX': '0',
        '--posY': '0',
        backgroundImage: `
          linear-gradient(115deg, rgb(211 255 215 / 0.15), rgb(0 0 0)),
          radial-gradient(90% 100% at calc(50% + calc(var(--posX) * 1px)) calc(0% + calc(var(--posY) * 1px)), rgb(200 200 200 / 0.2), rgb(22 0 45 / 0.8)),
          radial-gradient(100% 100% at calc(80% - calc(var(--posX) * 1px)) calc(0% - calc(var(--posY) * 1px)), rgb(250 255 0 / 0.15), rgb(36 0 0 / 0.8)),
          radial-gradient(150% 210% at calc(100% + calc(var(--posX) * 1px)) calc(0% + calc(var(--posY) * 1px)), rgb(20 175 125 / 0.2), rgb(0 10 255 / 0.1)),
          radial-gradient(100% 100% at calc(100% - calc(var(--posX) * 1px)) calc(30% - calc(var(--posY) * 1px)), rgb(255 77 0 / 0.15), rgb(0 200 255 / 0.1)),
          linear-gradient(60deg, rgb(255 0 0 / 0.1), rgb(120 86 255 / 0.15))
        `,
        backgroundBlendMode: 'overlay, overlay, difference, difference, difference, normal',
      } as React.CSSProperties}
    />
  );
}
