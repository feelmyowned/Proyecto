import React, { useEffect, useState } from 'react';

interface Heart {
  id: number;
  left: string;
  size: number;
  delay: string;
  duration: string;
  opacity: number;
  tilt: number;
}

export default function HeartsBackground() {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    // Generate 18 elegant, randomly styled drifting hearts
    const generated = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      // Random horizontal position across the viewport
      left: `${5 + Math.random() * 90}%`,
      // Size varies between small charming stars to medium hearts
      size: 10 + Math.random() * 24,
      // Staggered starter delays
      delay: `${Math.random() * 8}s`,
      // Slow float durations for organic, calming movement
      duration: `${10 + Math.random() * 12}s`,
      // Subtle transparency variants
      opacity: 0.2 + Math.random() * 0.4,
      // Random rotation slant
      tilt: Math.floor(Math.random() * 40 - 20)
    }));
    setHearts(generated);
  }, []);

  return (
    <div id="hearts-bg" className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <svg
          key={heart.id}
          id={`heart-particle-${heart.id}`}
          className="heart-particle fill-blush-rose"
          style={{
            left: heart.left,
            width: `${heart.size}px`,
            height: `${heart.size}px`,
            opacity: heart.opacity,
            animationDelay: heart.delay,
            animationDuration: heart.duration,
            transform: `rotate(${heart.tilt}deg)`
          }}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ))}

      {/* Decorative large golden-pink glowing radial blobs for depth */}
      <div id="glow-blob-1" className="absolute top-[20%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-orange-100/30 blur-[100px] pointer-events-none" />
      <div id="glow-blob-2" className="absolute bottom-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-blush-mid/20 blur-[90px] pointer-events-none" />
    </div>
  );
}
