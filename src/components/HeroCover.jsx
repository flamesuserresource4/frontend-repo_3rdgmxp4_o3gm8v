import React from 'react';
import Spline from '@splinetool/react-spline';
import { Map, Film } from 'lucide-react';

export default function HeroCover({ onGetStarted }) {
  return (
    <section className="relative h-[60vh] w-full overflow-hidden">
      {/* 3D Spline Background */}
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/6tUXqVcUA0xgJugv/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Gradient overlay - does not block pointer events */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="mx-auto max-w-4xl px-6 text-center text-white">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs backdrop-blur">
            <Map size={14} />
            <span>Jammu & Kashmir District Map Animator</span>
          </div>
          <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-6xl">
            Create a district-by-district animated video of J&K
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-white/80 md:text-base">
            Upload a vector map or use the built-in layout, customize timing, and export a smooth WebM video highlighting each district in sequence.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-5 py-3 text-sm font-medium text-white shadow hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <Film size={16} />
              Get started
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
