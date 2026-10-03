'use client';

import { useRouter } from 'next/navigation';
import Onboarding from '@/components/Onboarding';
import { useProgress } from '@/lib/useProgress';

export default function WelcomePage() {
  const router = useRouter();
  const { refresh } = useProgress();

  return (
    <Onboarding
      onFinish={() => {
        refresh();
        router.push('/');
      }}
    />
  );
}