import React, { useRef, useEffect } from "react";

interface AnimatedBackgroundProps {
  type?: 'lines' | 'waves' | 'shapes';
  className?: string;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ type = 'lines', className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener("resize", handleResize);

    // Animation: Lines & Particles
    const drawLines = () => {
      // Particle and line setup
      const particles: { x: number; y: number; vx: number; vy: number }[] = [];
      const PARTICLE_COUNT = 40;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
        });
      }
      function draw() {
        ctx.clearRect(0, 0, width, height);
        // Draw lines between close particles
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          for (let j = i + 1; j < PARTICLE_COUNT; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
              ctx.strokeStyle = "rgba(80, 120, 255, 0.15)";
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
        // Draw particles
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          ctx.beginPath();
          ctx.arc(particles[i].x, particles[i].y, 2.5, 0, 2 * Math.PI);
          ctx.fillStyle = "rgba(80, 120, 255, 0.25)";
          ctx.fill();
        }
        // Move particles
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          particles[i].x += particles[i].vx;
          particles[i].y += particles[i].vy;
          if (particles[i].x < 0 || particles[i].x > width) particles[i].vx *= -1;
          if (particles[i].y < 0 || particles[i].y > height) particles[i].vy *= -1;
        }
        animationFrameId = requestAnimationFrame(draw);
      }
      draw();
      return () => cancelAnimationFrame(animationFrameId);
    };

    // Animation: Waves
    const drawWaves = () => {
      let t = 0;
      function draw() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          for (let x = 0; x <= width; x += 2) {
            const y =
              height / 2 +
              Math.sin(x * 0.008 + t + i) * 20 +
              Math.sin(x * 0.02 + t * 0.7 + i * 2) * 10 +
              i * 30;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = `rgba(80, 120, 255, ${0.08 + i * 0.07})`;
          ctx.lineWidth = 2 + i;
          ctx.stroke();
        }
        t += 0.015;
        animationFrameId = requestAnimationFrame(draw);
      }
      draw();
      return () => cancelAnimationFrame(animationFrameId);
    };

    // Animation: Floating Shapes
    const drawShapes = () => {
      const shapes: { x: number; y: number; r: number; vx: number; vy: number; color: string }[] = [];
      const COLORS = [
        "rgba(80,120,255,0.18)",
        "rgba(120,80,255,0.18)",
        "rgba(80,255,200,0.18)",
        "rgba(255,180,80,0.18)"
      ];
      for (let i = 0; i < 22; i++) {
        shapes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: 6 + Math.random() * 8,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          color: COLORS[Math.floor(Math.random() * COLORS.length)]
        });
      }
      function draw() {
        ctx.clearRect(0, 0, width, height);
        for (const s of shapes) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, 2 * Math.PI);
          ctx.shadowColor = s.color.replace('0.18', '0.7');
          ctx.shadowBlur = 18;
          ctx.fillStyle = s.color;
          ctx.fill();
          ctx.restore();
          s.x += s.vx;
          s.y += s.vy;
          if (s.x < -s.r) s.x = width + s.r;
          if (s.x > width + s.r) s.x = -s.r;
          if (s.y < -s.r) s.y = height + s.r;
          if (s.y > height + s.r) s.y = -s.r;
        }
        animationFrameId = requestAnimationFrame(draw);
      }
      draw();
      return () => cancelAnimationFrame(animationFrameId);
    };

    let cleanup: (() => void) | undefined;
    if (type === 'lines') cleanup = drawLines();
    else if (type === 'waves') cleanup = drawWaves();
    else if (type === 'shapes') cleanup = drawShapes();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (cleanup) cleanup();
    };
  }, [type]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
};

export default AnimatedBackground;

// BlockchainLoader: Blockchain-inspired loading animation
export const BlockchainLoader: React.FC<{ text?: string; show?: boolean }> = ({ text = "Securing with Blockchain...", show = true }) => {
  // Animate entry/exit with slide-in-left and slide-out-right
  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-transform duration-700 ease-in-out
        ${show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
      style={{ transform: show ? 'translateX(0)' : 'translateX(100vw)' }}
    >
      <svg width="180" height="60" viewBox="0 0 180 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glass" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix in="blur" type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.25 0" result="bluralpha" />
            <feMerge>
              <feMergeNode in="bluralpha" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g>
          <rect x="10" y="20" width="30" height="20" rx="5" fill="#3b82f6" filter="url(#glass)" opacity="0.7">
            <animate attributeName="x" values="10;50;90;130;90;50;10" dur="5s" repeatCount="indefinite" />
          </rect>
          <rect x="50" y="20" width="30" height="20" rx="5" fill="#6366f1" filter="url(#glass)" opacity="0.7">
            <animate attributeName="x" values="50;90;130;90;50;10;50" dur="5s" repeatCount="indefinite" />
          </rect>
          <rect x="90" y="20" width="30" height="20" rx="5" fill="#a21caf" filter="url(#glass)" opacity="0.7">
            <animate attributeName="x" values="90;130;90;50;10;50;90" dur="5s" repeatCount="indefinite" />
          </rect>
          <rect x="130" y="20" width="30" height="20" rx="5" fill="#06b6d4" filter="url(#glass)" opacity="0.7">
            <animate attributeName="x" values="130;90;50;10;50;90;130" dur="5s" repeatCount="indefinite" />
          </rect>
          {/* Connecting lines */}
          <line x1="40" y1="30" x2="50" y2="30" stroke="#64748b" strokeWidth="3" strokeDasharray="6 4">
            <animate attributeName="x1" values="40;80;120;80;40" dur="5s" repeatCount="indefinite" />
            <animate attributeName="x2" values="50;90;130;90;50" dur="5s" repeatCount="indefinite" />
          </line>
          <line x1="80" y1="30" x2="90" y2="30" stroke="#64748b" strokeWidth="3" strokeDasharray="6 4">
            <animate attributeName="x1" values="80;120;80;40;80" dur="5s" repeatCount="indefinite" />
            <animate attributeName="x2" values="90;130;90;50;90" dur="5s" repeatCount="indefinite" />
          </line>
          <line x1="120" y1="30" x2="130" y2="30" stroke="#64748b" strokeWidth="3" strokeDasharray="6 4">
            <animate attributeName="x1" values="120;80;40;80;120" dur="5s" repeatCount="indefinite" />
            <animate attributeName="x2" values="130;90;50;90;130" dur="5s" repeatCount="indefinite" />
          </line>
        </g>
      </svg>
      <div className="mt-8 text-xl font-semibold text-gray-800 dark:text-gray-100 animate-pulse">
        {text}
      </div>
    </div>
  );
};

// CircularRotatingLoader: Boxes rotate smoothly around a circle
export const CircularRotatingLoader: React.FC<{ text?: string }> = ({ text = "Loading..." }) => {
  const boxCount = 6;
  const radius = 32;
  const centerX = 50;
  const centerY = 50;
  const boxSize = 16;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glass-circ" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix in="blur" type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.25 0" result="bluralpha" />
            <feMerge>
              <feMergeNode in="bluralpha" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {Array.from({ length: boxCount }).map((_, i) => {
          // Animate angle from 0 to 360deg
          const angle = (i * (360 / boxCount));
          return (
            <rect
              key={i}
              width={boxSize}
              height={boxSize}
              rx={5}
              fill="#3b82f6"
              filter="url(#glass-circ)"
              opacity="0.7"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from={`${angle} ${centerX} ${centerY}`}
                to={`${angle + 360} ${centerX} ${centerY}`}
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="x"
                values={Array.from({ length: boxCount + 1 }).map((_, j) =>
                  (centerX + radius * Math.cos((2 * Math.PI * (i + j / boxCount)))).toFixed(2)
                ).join(';')}
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="y"
                values={Array.from({ length: boxCount + 1 }).map((_, j) =>
                  (centerY + radius * Math.sin((2 * Math.PI * (i + j / boxCount)))).toFixed(2)
                ).join(';')}
                dur="2s"
                repeatCount="indefinite"
              />
            </rect>
          );
        })}
      </svg>
      <div className="mt-8 text-xl font-semibold text-gray-800 dark:text-gray-100 animate-pulse">
        {text}
      </div>
    </div>
  );
};

// CircularSequentialLoader: Boxes light up in sequence around a circle
export const CircularSequentialLoader: React.FC<{ text?: string }> = ({ text = "Loading..." }) => {
  const boxCount = 8;
  const radius = 32;
  const centerX = 50;
  const centerY = 50;
  const boxSize = 14;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glass-circ2" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix in="blur" type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.25 0" result="bluralpha" />
            <feMerge>
              <feMergeNode in="bluralpha" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {Array.from({ length: boxCount }).map((_, i) => {
          const angle = (2 * Math.PI * i) / boxCount;
          const x = centerX + radius * Math.cos(angle) - boxSize / 2;
          const y = centerY + radius * Math.sin(angle) - boxSize / 2;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={boxSize}
              height={boxSize}
              rx={4}
              fill="#06b6d4"
              filter="url(#glass-circ2)"
              opacity="0.4"
            >
              <animate
                attributeName="opacity"
                values={Array.from({ length: boxCount }).map((_, j) => (j === i ? 1 : 0.4)).concat(1).join(';')}
                keyTimes={Array.from({ length: boxCount + 1 }).map((_, j) => (j / boxCount).toFixed(2)).join(';')}
                dur="1.2s"
                repeatCount="indefinite"
              />
            </rect>
          );
        })}
      </svg>
      <div className="mt-8 text-xl font-semibold text-gray-800 dark:text-gray-100 animate-pulse">
        {text}
      </div>
    </div>
  );
}; 