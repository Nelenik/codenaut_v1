'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { markOnboardingDone } from '@/lib/progress';
import { useProgress } from '@/lib/useProgress';

const TOTAL_STEPS = 3;

type Props = {
  onFinish: () => void;
};

export default function Onboarding({ onFinish }: Props) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);

  const finish = () => {
    markOnboardingDone();
    onFinish();
  };

  const next = () => (step === TOTAL_STEPS - 1 ? finish() : setStep((s) => s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 pt-24 pb-24">
      <div className="w-full max-w-2xl bg-space-800/80 border-2 border-space-600 rounded-3xl p-8 md:p-10 flex flex-col gap-6">
        <Step step={step} />

        <div className="flex items-center justify-between gap-4 mt-2">
          <button
            onClick={finish}
            className="px-5 py-3 rounded-full text-space-300 font-display font-semibold hover:text-white hover:bg-space-700 transition-colors"
          >
            {t('onboarding.skip')}
          </button>

          <div className="flex gap-2" aria-hidden>
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <span
                key={i}
                className={`w-3 h-3 rounded-full transition-colors ${i === step ? 'bg-planet-yellow' : 'bg-space-600'
                  }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            {step > 0 ? (
              <button
                onClick={back}
                className="px-5 py-3 rounded-full bg-space-700 text-white font-display font-bold hover:bg-space-600 transition-colors"
              >
                {t('onboarding.back')}
              </button>
            ) : null}
            <button
              onClick={next}
              className="px-6 py-3 rounded-full bg-planet-yellow text-space-900 font-display font-extrabold text-lg hover:bg-yellow-300 transition-colors"
            >
              {step === TOTAL_STEPS - 1 ? t('onboarding.start') : t('onboarding.next')}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function Step({ step }: { step: number }) {
  const { t } = useTranslation();

  if (step === 0) return <Welcome />;

  const key = `onboarding.step${step + 1}` as const;

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white text-balance">
        {t(`${key}.title`)}
      </h1>

      <div className="text-lg md:text-xl leading-relaxed text-space-100 flex flex-col gap-3">
        {(t(`${key}.body`, { returnObjects: true }) as unknown as string[]).map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>

      {step === 1 ? <TwoHelpers /> : null}
      {/* {step === 2 ? <CommandExample /> : null} */}
      {step === 2 ? <PlanetRow /> : null}
    </div>
  );
}

/**
 * The opening screen is the story text itself — the same string the book shows.
 * Writing it once means the greeting a child reads on their first minute cannot
 * drift away from the story they are told later.
 */
function Welcome() {
  const { t } = useTranslation();
  const { progress } = useProgress();

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-display text-3xl md:text-4xl font-extrabold text-planet-yellow text-balance">
        {t('story.greeting', { name: progress.playerName })}
      </h1>

      <div className="text-lg md:text-xl leading-relaxed text-space-100 whitespace-pre-line">
        {t('story.text')}
      </div>
    </div>
  );
}

/** Step 2 — HTML builds the parts, CSS repaints them. */
function TwoHelpers() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl bg-space-900/60 border-2 border-space-600 p-5 flex gap-3">
        <div className='flex flex-col items-center gap-3 w-1/2'>
          <span className="font-display font-extrabold text-lg text-planet-orange">
            {t('onboarding.step2.html')}
          </span>
          <span className="text-lg text-space-100 font-display text-center leading-snug max-w-[90%]">
            {t('onboarding.step2.htmlHint')}
          </span>
          <img src="/assets/builder.svg" alt="" className="w-1/2 mt-auto" />

        </div>
        <div className="w-1/2 flex flex-col items-center gap-1" aria-hidden>
          <p className="font-semibold">{t('onboarding.step2.rocket')}</p>
          <div className="**:p-2.5 **:border **:border-planet-orange **:border-dashed">
            <div >{t('onboarding.step2.rocketNose')}</div>
            <div>
              <div>{t('onboarding.step2.rocketWindow')}</div>
              <div>{t('onboarding.step2.rocketFin')}</div>
              <div>{t('onboarding.step2.rocketFin')}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-space-900/60 border-2 border-planet-yellow p-5 flex gap-3">
        <div className='flex flex-col items-center gap-3 w-1/2'>
          <span className="font-display font-extrabold text-lg text-planet-orange">
            {t('onboarding.step2.css')}
          </span>
          <span className="text-lg text-space-100 font-display text-center leading-snug max-w-[90%]">
            {t('onboarding.step2.cssHint')}
          </span>
          <img src="/assets/artist.svg" alt="" className="w-1/2 mt-auto" />

        </div>
        <div className="w-1/2 flex flex-col items-center gap-1" aria-hidden>
          <p className="font-semibold">{t('onboarding.step2.rocketFinal')}</p>
          <div className="">
            <div className="bg-planet-orange w-20.5 h-15 [clip-path:polygon(50%_0%,0%_100%,100%_100%)]"></div>
            <div className="relative h-39.5 rounded-[15px] bg-amber-50 border-2 border-planet-orange">
              <div className="absolute top-1/6 left-1/2 -translate-x-1/2 bg-blue-400 rounded-full w-10 h-10"></div>
              <div className="absolute bottom-0 w-6 h-12 bg-planet-orange -left-6"></div>
              <div className="absolute bottom-0 w-6 h-12 bg-planet-orange -right-6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Step 3 — the one line of CSS, with each part named. */
// function CommandExample() {
//   const { t } = useTranslation();
//   return (
//     <div className="mt-2 rounded-2xl bg-space-900/70 border-2 border-planet-yellow p-6 flex flex-col gap-5">
//       <div className="font-mono text-3xl md:text-4xl text-planet-lime">
//         <span className="text-planet-cyan">color</span>
//         <span className="text-planet-orange">:</span> blue
//         <span className="text-planet-orange">;</span>
//       </div>

//       <dl className="grid gap-3 sm:grid-cols-2">
//         <div className="rounded-xl bg-space-800 p-3 border-l-4 border-planet-cyan">
//           <dt className="font-display font-extrabold text-planet-cyan">
//             {t('onboarding.color')}
//           </dt>
//           <dd className="text-space-100">{t('onboarding.colorHint')}</dd>
//         </div>
//         <div className="rounded-xl bg-space-800 p-3 border-l-4 border-planet-cyan">
//           <dt className="font-display font-extrabold text-planet-cyan">blue</dt>
//           <dd className="text-space-100">{t('onboarding.blueHint')}</dd>
//         </div>
//         <div className="rounded-xl bg-space-800 p-3 border-l-4 border-planet-orange">
//           <dt className="font-display font-extrabold text-planet-orange">:</dt>
//           <dd className="text-space-100">{t('onboarding.colonHint')}</dd>
//         </div>
//         <div className="rounded-xl bg-space-800 p-3 border-l-4 border-planet-orange">
//           <dt className="font-display font-extrabold text-planet-orange">;</dt>
//           <dd className="text-space-100">{t('onboarding.semicolonHint')}</dd>
//         </div>
//       </dl>
//     </div>
//   );
// }

/** Step 4 — the worlds waiting ahead. */
function PlanetRow() {
  const { t } = useTranslation();
  const planets = [
    { color: '#ffd600', glow: '#ffaa00', label: 'map.worlds.colors' },
    { color: '#00e5ff', glow: '#00aaff', label: 'map.worlds.sizes' },
    { color: '#ff00e5', glow: '#ff4de0', label: 'onboarding.moreWorlds' },
  ];

  return (
    <div className="flex items-center justify-center gap-6 mt-2">
      {planets.map((p, i) => (
        <div key={p.label} className="flex flex-col items-center gap-2">
          <span
            className={`w-16 h-16 md:w-20 md:h-20 rounded-full ${i === 2 ? 'opacity-40' : ''}`}
            style={{ backgroundColor: p.color, filter: `drop-shadow(0 0 16px ${p.glow})` }}
          />
          <span className="font-display font-bold text-sm text-space-200 text-center max-w-24">
            {t(p.label)}
          </span>
        </div>
      ))}
    </div>
  );
}