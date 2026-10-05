'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useProgress } from '@/lib/useProgress';

type World = {
  id: string;
  labelKey: string;
  color: string;
  glow: string;
  emojiFallback: string;
};

const WORLDS: World[] = [
  { id: 'colors', labelKey: 'map.worlds.colors', color: '#ffd600', glow: '#ffaa00', emojiFallback: '#ff6d00' },
  { id: 'sizes', labelKey: 'map.worlds.sizes', color: '#00e5ff', glow: '#00aaff', emojiFallback: '#22d3ee' },
];

const TRAIL = 'M 120 130 Q 300 70 480 130';

/**
 * The trail's geometry, in the SVG's own units. It runs from the first planet to
 * the last, and the rocket sits over its middle — so with the first planet open
 * the lit trail reaches the middle and with both open it reaches the second
 * planet. Widening the clip is how "one more world" becomes visible.
 */
const TRAIL_FROM = 120;
const TRAIL_TO = 480;

export default function MapScreen() {
  const { t } = useTranslation();
  const { progress } = useProgress();

  const openWorlds = WORLDS.filter((world) => progress.unlocked.worlds.includes(world.id)).length;
  const frontier =
    TRAIL_FROM + (Math.min(openWorlds, WORLDS.length) / WORLDS.length) * (TRAIL_TO - TRAIL_FROM);

  return (
    <main className="relative min-h-screen flex flex-col">
      <header className="flex items-start justify-between gap-4 p-6 pr-44 z-10">
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">
          {t('map.title')}
        </h1>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <div className="relative w-full max-w-3xl">
          <svg
            className="w-full h-auto overflow-visible"
            viewBox="0 0 600 220"
            role="img"
            aria-label={t('map.title')}
          >
            <defs>
              <linearGradient id="trail" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ffd600" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#00e5ff" stopOpacity="0.5" />
              </linearGradient>

              <clipPath id="trailReached">
                <rect x="0" y="0" width={frontier} height="220" className="trail-reveal" />
              </clipPath>
            </defs>

            {/* The whole road, faint: what is still ahead. */}
            <path
              d={TRAIL}
              stroke="url(#trail)"
              strokeWidth="4"
              strokeDasharray="14 12"
              fill="none"
              strokeLinecap="round"
              opacity="0.25"
            />

            {/* The road travelled, lit and flowing — it grows as worlds open. */}
            <g clipPath="url(#trailReached)">
              <path
                d={TRAIL}
                stroke="url(#trail)"
                strokeWidth="4"
                strokeDasharray="14 12"
                fill="none"
                strokeLinecap="round"
                className="rocket-trail"
              />
            </g>
          </svg>

          <div className="absolute inset-0">
            {WORLDS.map((world, index) => {
              const unlocked = progress.unlocked.worlds.includes(world.id);
              const positions = ['left-[6%] top-[28%]', 'right-[6%] top-[28%]'];

              return (
                <div key={world.id} className={`absolute ${positions[index]}`}>
                  {unlocked ? (
                    <Link
                      href={`/play/${world.id}`}
                      className="group flex flex-col items-center gap-3"
                    >
                      <img
                        src={`/assets/planets/${world.id}.svg`}
                        alt=""
                        className="w-28 h-28 md:w-32 md:h-32 rounded-full transition-transform duration-200 group-hover:scale-110 group-focus-visible:scale-110"
                        style={{ filter: `drop-shadow(0 0 24px ${world.glow})` }}
                      />
                      <span className="font-display text-xl font-extrabold text-white group-hover:text-planet-yellow transition-colors">
                        {t(world.labelKey)}
                      </span>
                    </Link>
                  ) : (
                    <div className="flex flex-col items-center gap-3 opacity-60">
                      <div
                        className="w-28 h-28 md:w-32 md:h-32 rounded-full grayscale brightness-50 flex items-center justify-center"
                        style={{ backgroundColor: world.emojiFallback }}
                        aria-hidden
                      >
                        <span className="text-4xl">🔒</span>
                      </div>
                      <span className="font-display text-xl font-extrabold text-space-300">
                        {t(world.labelKey)}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            <img
              src="/assets/rocket.svg"
              alt=""
              className="absolute left-1/2 top-[6%] w-8 h-16 -translate-x-1/2"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
