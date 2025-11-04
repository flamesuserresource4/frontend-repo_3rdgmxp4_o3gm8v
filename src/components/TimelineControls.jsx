import React from 'react';
import { Play, Pause, Timer, RotateCcw } from 'lucide-react';

export default function TimelineControls({ isPlaying, onPlay, onPause, onReset, durationSec, onDurationChange, progress, total }) {
  const pct = total > 0 ? Math.min(100, Math.round(((progress + 1) / total) * 100)) : 0;

  return (
    <div className="mx-auto mt-6 w-full max-w-6xl rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-slate-100">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          {isPlaying ? (
            <button onClick={onPause} className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-4 py-2 text-slate-900 hover:bg-white">
              <Pause size={16} />
              Pause
            </button>
          ) : (
            <button onClick={onPlay} className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600">
              <Play size={16} />
              Play
            </button>
          )}

          <button onClick={onReset} className="ml-2 inline-flex items-center gap-2 rounded-md border border-slate-700 px-3 py-2 hover:bg-slate-800">
            <RotateCcw size={16} />
            Reset
          </button>
        </div>

        <div className="flex flex-1 items-center gap-3 md:justify-center">
          <div className="h-2 w-full max-w-xl overflow-hidden rounded bg-slate-800">
            <div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} />
          </div>
          <span className="w-16 text-right text-xs text-slate-400">{pct}%</span>
        </div>

        <div className="flex items-center gap-2">
          <Timer size={16} className="text-slate-400" />
          <input
            type="range"
            min={4}
            max={60}
            step={1}
            value={durationSec}
            onChange={(e) => onDurationChange?.(Number(e.target.value))}
            className="w-40 accent-emerald-500"
          />
          <span className="text-xs text-slate-400">{durationSec}s</span>
        </div>
      </div>
    </div>
  );
}
