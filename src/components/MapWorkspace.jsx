import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Upload, Map } from 'lucide-react';

// Simple sample SVG representing multiple regions. You can replace by uploading a proper J&K districts SVG.
const sampleSVG = `
<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .district { fill:#0f172a; stroke:#22c55e; stroke-width:2; opacity:0.25; transition:opacity .5s ease, transform .5s ease; }
      .district.active { opacity:1; }
      .label { font-family: Inter, system-ui, Arial; fill:#cbd5e1; font-size:12px; }
    </style>
  </defs>
  <rect x="0" y="0" width="800" height="500" fill="#020617" />
  <g id="map">
    <g id="district-1"><rect class="district" x="60" y="60" width="140" height="110" rx="8" /><text class="label" x="70" y="120">District 1</text></g>
    <g id="district-2"><rect class="district" x="220" y="70" width="160" height="120" rx="8" /><text class="label" x="230" y="130">District 2</text></g>
    <g id="district-3"><rect class="district" x="400" y="60" width="160" height="110" rx="8" /><text class="label" x="410" y="120">District 3</text></g>
    <g id="district-4"><rect class="district" x="580" y="80" width="140" height="120" rx="8" /><text class="label" x="590" y="140">District 4</text></g>

    <g id="district-5"><rect class="district" x="90" y="210" width="160" height="120" rx="8" /><text class="label" x="100" y="270">District 5</text></g>
    <g id="district-6"><rect class="district" x="270" y="220" width="160" height="120" rx="8" /><text class="label" x="280" y="280">District 6</text></g>
    <g id="district-7"><rect class="district" x="450" y="220" width="160" height="120" rx="8" /><text class="label" x="460" y="280">District 7</text></g>
    <g id="district-8"><rect class="district" x="630" y="230" width="120" height="120" rx="8" /><text class="label" x="640" y="290">District 8</text></g>

    <g id="district-9"><rect class="district" x="180" y="360" width="180" height="100" rx="8" /><text class="label" x="190" y="420">District 9</text></g>
    <g id="district-10"><rect class="district" x="400" y="360" width="200" height="100" rx="8" /><text class="label" x="410" y="420">District 10</text></g>
  </g>
</svg>`;

function extractDistrictElements(root) {
  if (!root) return [];
  const candidates = root.querySelectorAll('g[id], [data-name]');
  return Array.from(candidates);
}

export default function MapWorkspace({ currentIndex, isPlaying, durationSec, onCountChange, captureRef }) {
  const containerRef = useRef(null);
  const svgHostRef = useRef(null);
  const [svgContent, setSvgContent] = useState(sampleSVG);
  const [count, setCount] = useState(0);

  // Expose capture element to parent
  useEffect(() => {
    if (captureRef) {
      captureRef.current = containerRef.current;
    }
  }, [captureRef]);

  // Load SVG content into the host div
  useEffect(() => {
    if (!svgHostRef.current) return;
    svgHostRef.current.innerHTML = svgContent;
    const rootSVG = svgHostRef.current.querySelector('svg');
    const groups = extractDistrictElements(rootSVG);
    setCount(groups.length);
    if (onCountChange) onCountChange(groups.length);
  }, [svgContent, onCountChange]);

  // Apply active class based on currentIndex
  useEffect(() => {
    const rootSVG = svgHostRef.current?.querySelector('svg');
    if (!rootSVG) return;
    const groups = extractDistrictElements(rootSVG);
    groups.forEach((g, idx) => {
      const districtShape = g.querySelector('.district') || g;
      if (idx <= currentIndex) {
        districtShape.classList.add('active');
      } else {
        districtShape.classList.remove('active');
      }
    });
  }, [currentIndex]);

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setSvgContent(text);
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-6">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-300">
          <Map size={18} />
          <span className="text-sm">Preview</span>
          <span className="text-xs text-slate-500">{count} regions</span>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-700 bg-slate-800/60 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800">
          <Upload size={14} />
          <span>Upload SVG</span>
          <input type="file" accept=".svg" className="hidden" onChange={onUpload} />
        </label>
      </div>

      <div
        ref={containerRef}
        className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow"
      >
        {/* Decorative grid */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:20px_20px]" />

        {/* SVG host */}
        <div
          ref={svgHostRef}
          className="absolute inset-0 flex items-center justify-center p-4"
        />

        {/* Status */}
        <div className="absolute bottom-3 right-3 rounded-md bg-black/50 px-2 py-1 text-[11px] text-white/80 backdrop-blur">
          {isPlaying ? 'Playing' : 'Paused'} • {durationSec}s
        </div>
      </div>
    </section>
  );
}
