import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Sparkles, 
  Coffee, 
  Utensils, 
  Smile, 
  Calendar, 
  Check, 
  Clock, 
  ChevronRight, 
  Compass, 
  Moon, 
  Star, 
  Send,
  Instagram
} from 'lucide-react';
import SoundBox from './components/SoundBox';

interface HeartParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export default function App() {
  const [hasAgreed, setHasAgreed] = useState(false);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [noCount, setNoCount] = useState(0);
  const [noSassMessage, setNoSassMessage] = useState("No 😢");
  const [hearts, setHearts] = useState<HeartParticle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Date selection state
  const [selectedVibe, setSelectedVibe] = useState<'cafe' | 'dinner' | 'surprise'>('cafe');
  const [selectedTiming, setSelectedTiming] = useState<'weekend' | 'weekday' | 'asap'>('weekend');
  const [wantsCoffee, setWantsCoffee] = useState(true);
  const [wantsDessert, setWantsDessert] = useState(true);
  const [customNote, setCustomNote] = useState('');
  const [isLockedIn, setIsLockedIn] = useState(false);

  // Generate falling/floating hearts
  useEffect(() => {
    const generated: HeartParticle[] = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage x
      y: Math.random() * 50 + 100, // start below screen
      size: Math.random() * 20 + 12,
      delay: Math.random() * 5,
      duration: Math.random() * 4 + 5,
    }));
    setHearts(generated);
  }, []);

  const funnyMessages = [
    "No 😢",
    "Ese no es el botón del sí.",
    "Creo que te has equivocado de opción",
    "Buen intento! ✨",
    "Error 404: 'No' Option Not Found",
    "¿Se te ha ido el dedo? 🧐",
    "¡Este código no acepta no por respuesta!",
    "Dice la leyenda que nadie ha podido pulsar este botón antes.",
    "¡Acceso denegado!",
    "¿De veras dirás que no?",
  ];

  // Logic to jump the No button to a random safe position within parent container
  const handleNoInteraction = () => {
    // We want the button to jump and never leave the visible screen zone.
    // Since the button rests near the bottom of the card (~65% height),
    // we allow it to jump higher up (minY = -280) and only slightly down (maxY = 15).
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 640 : false;
    
    const maxX = isMobile ? 80 : 130;
    const minY = isMobile ? -220 : -300;
    const maxY = 20; // Limit downward jump so it never spills past the page footer

    const randomX = (Math.random() - 0.5) * 2 * maxX; // offset horizontally between -maxX and +maxX
    const randomY = minY + Math.random() * (maxY - minY); // jump up or slightly down

    setNoButtonPos({ x: randomX, y: randomY });
    setNoCount(prev => prev + 1);
    
    // Pick next sass message
    const msgIndex = (noCount + 1) % funnyMessages.length;
    setNoSassMessage(funnyMessages[msgIndex]);
  };

  const handleYes = () => {
    setHasAgreed(true);
    // Spawn quick mini-confetti/hearts locally
    if (window.AudioContext || (window as any).webkitAudioContext) {
      // Little happy trigger chime
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const notes = [523.25, 659.25, 783.99, 1046.50]; // Sweet chord arpeggio
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.1);
          gain.gain.setValueAtTime(0, audioCtx.currentTime + idx * 0.1);
          gain.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + idx * 0.1 + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.1 + 0.6);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(audioCtx.currentTime + idx * 0.1);
          osc.stop(audioCtx.currentTime + idx * 0.1 + 0.6);
        });
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      id="app-container" 
      className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-warm-cream px-4 py-8 select-none"
    >
      {/* Background Sweet Flying Hearts */}
      <div id="hearts-layer" className="absolute inset-0 overflow-hidden pointer-events-none">
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ y: '110vh', x: `${heart.x}vw`, opacity: 0 }}
            animate={{ 
              y: '-10vh',
              opacity: [0, 0.7, 0.7, 0],
              x: [
                `${heart.x}vw`, 
                `${heart.x + (heart.id % 2 === 0 ? 8 : -8)}vw`,
                `${heart.x}vw`
              ]
            }}
            transition={{
              duration: heart.duration,
              delay: heart.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute text-blush-rose"
            style={{ fontSize: heart.size }}
          >
            ♥
          </motion.div>
        ))}
      </div>

      {/* Floating Sparkling Dots */}
      <div id="sparkle-circle-1" className="absolute top-20 left-10 w-24 h-24 rounded-full bg-blush-soft/40 blur-2xl pointer-events-none" />
      <div id="sparkle-circle-2" className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-blush-mid/30 blur-2xl pointer-events-none" />

      {/* Music Box Widget */}
      <SoundBox />

      {/* Header Logo */}
      <header id="app-header" className="w-full max-w-lg mx-auto text-center z-10">
        <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-blush-mid/40 shadow-sm">
          <Heart className="w-3.5 h-3.5 text-blush-dark fill-blush-dark" />
          <span className="text-xs font-mono font-bold tracking-widest text-stone-700 uppercase">
            Top Secret Transmission
          </span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        </div>
      </header>

      {/* Main Interactive Invitation Area */}
      <main id="app-main" className="flex-grow flex items-center justify-center py-6 z-10 w-full max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {!hasAgreed ? (
            /* PHASE 1: THE BIG PROPOSAL (With escaping No button) */
            <motion.div
              key="proposal-card"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="w-full bg-white border border-blush-mid/50 rounded-3xl p-6 md:p-8 shadow-xl text-center relative"
            >
              {/* Cute Cover Art Illustration */}
              <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }} 
                  transition={{ repeat: Infinity, duration: 2 }} 
                  className="absolute inset-0 bg-blush-soft rounded-full"
                />
                <motion.div
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="z-10"
                >
                  <Heart className="w-12 h-12 text-blush-dark fill-blush-mid" />
                </motion.div>
                <div className="absolute top-1 right-2 bg-amber-200 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full rotate-12 shadow-sm font-mono">
                  HOLA!
                </div>
              </div>

              {/* Title & Romantic Jargon */}
              <h1 className="font-serif text-3xl md:text-3xl text-stone-800 font-bold mb-3 tracking-tight">
                Hola guapa... :)
              </h1>
              <p className="text-stone-600 text-sm leading-relaxed mb-8 font-sans max-w-xs mx-auto">
                He hecho esto a casi las 4 de la mañana, no me lo tengas en cuenta...
              </p>

              <div className="bg-blush-soft/50 rounded-2xl p-5 mb-10 border border-blush-mid/30">
                <h2 className="text-lg font-serif font-bold text-blush-dark">
                  ¿Quedamos para pasar un día inolvidable? ☕🍰
                </h2>
                <p className="text-[11px] text-stone-500 font-mono mt-1">
                  (Prometo intentar no morirme de vergüenza)
                </p>
              </div>

              {/* Buttons Area */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative min-h-[140px]">
                
                {/* YES - Warm, comforting, STATIC button */}
                <motion.button
                  id="yes-date-btn"
                  onClick={handleYes}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-yes w-full sm:w-44 py-3.5 bg-blush-dark hover:bg-[#a05249] text-white font-semibold rounded-2xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer z-10"
                >
                  <Check className="w-4 h-4" />
                  <span>¡Sí, claro que sí! ♥</span>
                </motion.button>

                {/* NO - THE MOVING ESCAPE button */}
                <motion.button
                  id="no-date-btn"
                  onMouseEnter={handleNoInteraction}
                  onClick={handleNoInteraction}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    handleNoInteraction();
                  }}
                  animate={{ x: noButtonPos.x, y: noButtonPos.y }}
                  transition={{ type: "spring", stiffness: 220, damping: 18 }}
                  className="relative w-full sm:w-44 py-3.5 bg-zinc-100 hover:bg-zinc-200 text-stone-600 font-medium rounded-2xl border border-stone-200 shadow-sm transition-colors text-xs tracking-wide cursor-pointer select-none"
                  style={{ touchAction: 'none' }}
                >
                  {noSassMessage}
                </motion.button>

              </div>

              {/* Counter Sassy Indicator footer */}
              {noCount > 0 && (
                <p className="text-[11px] font-mono text-blush-dark/80 mt-4 transition-all animate-bounce">
                  Ha intentado escabullirse {noCount} veces{noCount > 1 ? 's' : ''}! 🚫
                </p>
              )}
            </motion.div>
          ) : (
            /* PHASE 2: YES CELEBRATION & THE MENU CUSTOMIZER */
            <motion.div
              key="planning-card"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 90 }}
              className="w-full bg-white border border-blush-mid/50 rounded-3xl p-6 shadow-xl relative"
            >
              {!isLockedIn ? (
                <>
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Sparkles className="w-6 h-6 text-amber-500 fill-amber-100" />
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-stone-800">
                      ¿Has dicho que sí? No me lo creo. 😍 🎉
                    </h2>
                    <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                      Vamos a montar algo para el recuerdo.
                    </p>
                  </div>

                  {/* Vibe Selection Options */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-400 mb-2">
                        1. ¿Que quieres que hagamos?
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => setSelectedVibe('cafe')}
                          className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                            selectedVibe === 'cafe'
                              ? 'bg-blush-soft border-blush-rose text-blush-dark shadow-sm'
                              : 'border-stone-100 bg-stone-50/50 hover:bg-stone-50 text-stone-600'
                          }`}
                        >
                          <Coffee className="w-4 h-4 mx-auto mb-1 text-blush-dark" />
                          <span className="text-[11px] block font-medium">Una bebida, donde quieras</span>
                        </button>
                        <button
                          onClick={() => setSelectedVibe('dinner')}
                          className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                            selectedVibe === 'dinner'
                              ? 'bg-blush-soft border-blush-rose text-blush-dark shadow-sm'
                              : 'border-stone-100 bg-stone-50/50 hover:bg-stone-50 text-stone-600'
                          }`}
                        >
                          <Utensils className="w-4 h-4 mx-auto mb-1 text-blush-dark" />
                          <span className="text-[11px] block font-medium">Comida y/o cena</span>
                        </button>
                        <button
                          onClick={() => setSelectedVibe('surprise')}
                          className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                            selectedVibe === 'surprise'
                              ? 'bg-blush-soft border-blush-rose text-blush-dark shadow-sm'
                              : 'border-stone-100 bg-stone-50/50 hover:bg-stone-50 text-stone-600'
                          }`}
                        >
                          <Compass className="w-4 h-4 mx-auto mb-1 text-blush-dark" />
                          <span className="text-[11px] block font-medium">¡Aventura sorpresa!</span>
                        </button>
                      </div>
                    </div>

                    {/* Timing Options */}
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-400 mb-2">
                        2. ¿Cuando?
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => setSelectedTiming('weekend')}
                          className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                            selectedTiming === 'weekend'
                              ? 'bg-blush-soft border-blush-rose text-blush-dark shadow-sm'
                              : 'border-stone-100 bg-stone-50/50 hover:bg-stone-50 text-stone-600'
                          }`}
                        >
                          <Calendar className="w-4 h-4 mx-auto mb-1" />
                          <span className="text-[11px] block font-medium">Un día de fin de semana</span>
                        </button>
                        <button
                          onClick={() => setSelectedTiming('weekday')}
                          className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                            selectedTiming === 'weekday'
                              ? 'bg-blush-soft border-blush-rose text-blush-dark shadow-sm'
                              : 'border-stone-100 bg-stone-50/50 hover:bg-stone-50 text-stone-600'
                          }`}
                        >
                          <Clock className="w-4 h-4 mx-auto mb-1" />
                          <span className="text-[11px] block font-medium">Un día de semana</span>
                        </button>
                        <button
                          onClick={() => setSelectedTiming('asap')}
                          className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                            selectedTiming === 'asap'
                              ? 'bg-blush-soft border-blush-rose text-blush-dark shadow-sm'
                              : 'border-stone-100 bg-stone-50/50 hover:bg-stone-50 text-stone-600'
                          }`}
                        >
                          <Smile className="w-4 h-4 mx-auto mb-1" />
                          <span className="text-[11px] block font-medium">Cuanto antes! ✨</span>
                        </button>
                      </div>
                    </div>

                    {/* Fun request box */}
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-400 mb-2">
                        3. Peticiones especiales / Comentarios? (Optional) (Pero no tan opcional)
                      </label>
                      <textarea
                        value={customNote}
                        onChange={(e) => setCustomNote(e.target.value)}
                        placeholder="Escribe algo que te encantaría que hiciesemos, yo me apunto con mucho gusto..."
                        className="w-full text-xs p-3 border border-stone-200 rounded-xl focus:border-blush-rose focus:ring-1 focus:ring-blush-rose outline-none resize-none h-16 text-stone-700 bg-warm-cream/30"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    id="lock-plan-btn"
                    onClick={() => setIsLockedIn(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-6 py-3.5 bg-blush-dark hover:bg-[#a05249] text-white font-semibold rounded-2xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm"
                  >
                    <span>Send Date Request to My phone 💌</span>
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </>
              ) : (
                /* PHASE 3: FINAL CONFIRMATION & Humorous copy action */
                <motion.div
                  key="confirmed-screen"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center p-4 space-y-6"
                >
                  <div className="w-16 h-16 bg-gradient-to-tr from-rose-100 to-blush-soft rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <Send className="w-6 h-6 text-blush-dark animate-pulse" />
                  </div>

                  <div>
                    <h3 className="font-serif text-2xl font-bold text-stone-800">
                      Ordenes recibidas! Obtendrás respuesta en un plazo de 6 a 8 semanas. 🧾✨
                    </h3>
                    <p className="text-xs text-stone-500 mt-2 max-w-xs mx-auto">
                      Aquí están las opciones que ha elegido, certificadas oficialmente:
                    </p>
                  </div>

                  <div className="bg-stone-50 border border-stone-100 rounded-2xl p-4 text-left space-y-2.5 font-mono text-xs text-stone-700 max-w-sm mx-auto">
                    <p>✨ <strong className="text-stone-900">Selección de plan:</strong> {selectedVibe === 'cafe' ? 'Bebida ☕' : selectedVibe === 'dinner' ? 'Comida y/o cena 🍽️' : '¡Aventura sorpresa! 🔮'}</p>
                    <p>📅 <strong className="text-stone-900">Fechas:</strong> {selectedTiming === 'weekend' ? 'Un día de fin de semana' : selectedTiming === 'weekday' ? 'Un día de semana' : 'Cuanto antes! ⚡'}</p>
                    {customNote.trim() && (
                      <p className="border-t border-stone-200/60 pt-2 text-stone-600 italic">
                        &ldquo;{customNote}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="space-y-3 pt-2">
                    <p className="text-xs text-stone-500 max-w-xs mx-auto">
                      Hazle una captura de pantalla a esto y envíamelo (a nadie más, que vergüenza!) así podemos empezar a planearlo! :) 📅
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
                      <motion.button
                        id="copy-text-btn"
                        onClick={() => {
                          const summary = `Date Choice:\n- Vibe: ${selectedVibe === 'cafe' ? 'Bebida ☕' : selectedVibe === 'dinner' ? 'Comida y/o cena 🍽️' : '¡Aventura sorpresa! 🔮'}\n- Timing: ${selectedTiming === 'weekend' ? 'Un día de fin de semana 📅' : selectedTiming === 'weekday' ? 'Un día de semana ⏰' : 'Cuanto antes! ⚡'}\n- Note: ${customNote || 'None'}`;
                          navigator.clipboard.writeText(summary);
                          alert("¡¡Las opciones se han copiado al portapapeles, ya puedes enviármelas!! 💌");
                        }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full sm:w-auto px-4 py-2.5 bg-stone-950 text-white font-medium rounded-xl text-xs hover:bg-stone-800 transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        Copiar opciones
                      </motion.button>

                      <motion.button
                        id="share-instagram-btn"
                        onClick={() => {
                          const summary = `Date Choice:\n- Vibe: ${selectedVibe === 'cafe' ? 'Bebida ☕' : selectedVibe === 'dinner' ? 'Comida y/o cena 🍽️' : '¡Aventura sorpresa! 🔮'}\n- Timing: ${selectedTiming === 'weekend' ? 'Un día de fin de semana 📅' : selectedTiming === 'weekday' ? 'Un día de semana ⏰' : 'Cuanto antes! ⚡'}\n- Note: ${customNote || 'None'}`;
                          navigator.clipboard.writeText(summary);
                          alert("¡Copiado! Ahora se abrirá Instagram para que puedas pegarlo y enviármelo por Direct Message 💌");
                          window.open("https://www.instagram.com/direct/inbox/", "_blank");
                        }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:opacity-90 text-white font-medium rounded-xl text-xs transition-opacity shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Instagram className="w-3.5 h-3.5" />
                        <span>Compartir en Instagram</span>
                      </motion.button>
                      
                      <button 
                        onClick={() => setIsLockedIn(false)}
                        className="w-full sm:w-auto px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 font-medium rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        Edit Options
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Page Footer */}
      <footer id="app-footer" className="w-full text-center z-10 pt-4">
        <p className="text-[10px] font-mono text-stone-400">
          Hecho con mucho cariño. :)
        </p>
      </footer>
    </div>
  );
}
