import { useEffect, useRef, useState } from 'react';

export function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Détecter si c'est un appareil tactile
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouch(isTouchDevice);

    if (isTouchDevice) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let isVisible = true;

    // Position du pointeur avec interpolation
    const pointer = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };

    // Position cible (position réelle de la souris)
    const target = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };

    const params = {
      pointsNumber: 20,
      widthFactor: 0.4,
      spring: 0.45,
      friction: 0.52,
    };

    // Points de la traînée
    const trail: { x: number; y: number; dx: number; dy: number }[] = [];
    for (let i = 0; i < params.pointsNumber; i++) {
      trail.push({
        x: pointer.x,
        y: pointer.y,
        dx: 0,
        dy: 0,
      });
    }

    const setupCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    const handleMouseMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      isVisible = true;
    };

    const handleMouseLeave = () => {
      isVisible = false;
    };

    const handleMouseEnter = () => {
      isVisible = true;
    };

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!isVisible) {
        animationId = requestAnimationFrame(update);
        return;
      }

      // Interpolation douce vers la cible
      pointer.x += (target.x - pointer.x) * 0.35;
      pointer.y += (target.y - pointer.y) * 0.35;

      // Mise à jour des points de la traînée
      trail.forEach((p, pIdx) => {
        const prev = pIdx === 0 ? pointer : trail[pIdx - 1];
        const spring = pIdx === 0 ? params.spring * 0.5 : params.spring;

        p.dx += (prev.x - p.x) * spring;
        p.dy += (prev.y - p.y) * spring;
        p.dx *= params.friction;
        p.dy *= params.friction;
        p.x += p.dx;
        p.y += p.dy;
      });

      // Dessiner la traînée
      ctx.strokeStyle = '#f59e0b';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (let i = 1; i < trail.length; i++) {
        const p0 = trail[i - 1];
        const p1 = trail[i];

        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineWidth = params.widthFactor * (params.pointsNumber - i);
        ctx.stroke();
      }

      // Dessiner le point principal (curseur)
      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();

      animationId = requestAnimationFrame(update);
    };

    // Setup initial
    setupCanvas();

    // Event listeners
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('resize', setupCanvas);

    // Démarrer l'animation
    update();

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('resize', setupCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Ne pas afficher sur les appareils tactiles
  if (isTouch) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
    />
  );
}
