import React, { useEffect, useRef, useState } from 'react';
import HeroCover from './components/HeroCover';
import MapWorkspace from './components/MapWorkspace';
import TimelineControls from './components/TimelineControls';
import ExportPanel from './components/ExportPanel';

function App() {
  const [started, setStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [durationSec, setDurationSec] = useState(12);
  const [progressIndex, setProgressIndex] = useState(-1);
  const [total, setTotal] = useState(0);
  const captureRef = useRef(null);

  // Auto-scroll to workspace when starting
  const handleGetStarted = () => {
    setStarted(true);
    setTimeout(() => {
      document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  // Animation loop: advance by equal steps across total duration
  useEffect(() => {
    if (!isPlaying || total === 0) return;
    const stepMs = Math.max(50, Math.floor((durationSec * 1000) / total));
    const id = setInterval(() => {
      setProgressIndex((idx) => {
        const next = idx + 1;
        if (next >= total) {
          clearInterval(id);
          setIsPlaying(false);
          return total - 1;
        }
        return next;
      });
    }, stepMs);
    return () => clearInterval(id);
  }, [isPlaying, durationSec, total]);

  const onPlay = () => {
    if (total === 0) return;
    // If at end, reset
    setProgressIndex((idx) => (idx >= total - 1 ? -1 : idx));
    setIsPlaying(true);
  };
  const onPause = () => setIsPlaying(false);
  const onReset = () => {
    setIsPlaying(false);
    setProgressIndex(-1);
  };

  const onCountChange = (count) => {
    setTotal(count);
    setProgressIndex(-1);
  };

  // Recording hooks
  const onStartRecording = () => {
    // Start from beginning for a clean take
    setProgressIndex(-1);
    setIsPlaying(true);
  };
  const onStopRecording = () => {
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <HeroCover onGetStarted={handleGetStarted} />

      <main id="workspace" className="py-10">
        <MapWorkspace
          currentIndex={Math.max(0, progressIndex)}
          isPlaying={isPlaying}
          durationSec={durationSec}
          onCountChange={onCountChange}
          captureRef={captureRef}
        />

        <TimelineControls
          isPlaying={isPlaying}
          onPlay={onPlay}
          onPause={onPause}
          onReset={onReset}
          durationSec={durationSec}
          onDurationChange={setDurationSec}
          progress={Math.max(0, progressIndex)}
          total={total}
        />

        <ExportPanel
          captureRef={captureRef}
          onStartRecording={onStartRecording}
          onStopRecording={onStopRecording}
          isPlaying={isPlaying}
        />

        <div className="mx-auto mt-8 w-full max-w-6xl px-6 text-xs text-slate-400">
          Tip: Upload a proper SVG of Jammu & Kashmir districts to replace the sample layout. Each district should be grouped with a unique id for best results.
        </div>
      </main>

      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        Built for educational map animations • WebM export supported via in-browser recording
      </footer>
    </div>
  );
}

export default App;
