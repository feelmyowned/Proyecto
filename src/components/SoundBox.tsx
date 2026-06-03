import React, { useRef, useState, useEffect } from 'react';
import { Music, VolumeX, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function SoundBox() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalIdRef = useRef<number | null>(null);
  const noteIndexRef = useRef(0);

  // Relaxing romantic chime sequence: C major 7, F major 7, G major, C major arpeggios
  const melody = [
    261.63, 329.63, 392.00, 493.88, // Cmaj7 (C4, E4, G4, B4)
    349.23, 440.00, 523.25, 659.25, // Fmaj7 (F4, A4, C5, E5)
    392.00, 493.88, 587.33, 783.99, // G6 (G4, B4, D5, G5)
    523.25, 659.25, 783.99, 1046.50, // C5, E5, G5, C6
  ];

  const playChime = (freq: number, duration = 1.8) => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    // Ensure context is running (fixes browser suspension policies)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    try {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      // Warm, sweet music box vibe: use triangle wave instead of simple harsh sine
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Soft low-pass filter to make it warmer, less piercing
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, ctx.currentTime);

      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.05); // quick fade in
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration); // smooth natural decay

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio play exception:', e);
    }
  };

  const startMusic = () => {
    if (!audioCtxRef.current) {
      // Lazy initialize AudioContext on user interaction
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtxClass();
    }
    
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    setIsPlaying(true);

    // Warm melody player loop
    let idx = 0;
    noteIndexRef.current = 0;

    const playNext = () => {
      const freq = melody[noteIndexRef.current];
      // Play note with natural decay
      playChime(freq, 1.8);
      // Advance
      noteIndexRef.current = (noteIndexRef.current + 1) % melody.length;
    };

    // Play initial note immediately
    playNext();

    // Loop notes ever 750ms for a steady romantic music box pace
    const timer = window.setInterval(playNext, 750);
    intervalIdRef.current = timer;
  };

  const stopMusic = () => {
    setIsPlaying(false);
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  };

  // Safe cleanup
  useEffect(() => {
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <div id="soundbox-root" className="fixed top-4 right-4 z-50">
      <motion.button
        id="soundbox-toggle-btn"
        onClick={togglePlayback}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm backdrop-blur-md transition-all text-xs font-medium tracking-wide ${
          isPlaying 
            ? 'bg-blush-soft border-blush-rose text-blush-dark' 
            : 'bg-white/80 border-stone-200 text-stone-600'
        }`}
      >
        {isPlaying ? (
          <>
            <Volume2 id="volume-icon" className="w-3.5 h-3.5 animate-pulse" />
            <span id="playing-text" className="font-mono">Music Box: On</span>
          </>
        ) : (
          <>
            <VolumeX id="mute-icon" className="w-3.5 h-3.5" />
            <span id="stopped-text" className="font-mono">Music Box: Off</span>
          </>
        )}
      </motion.button>
    </div>
  );
}
