import { useCallback, useEffect, useRef, useState } from 'react';
import { RESEND_COOLDOWN_SECONDS } from '../config/constants';

export function useResendCountdown(initialSeconds: number = RESEND_COOLDOWN_SECONDS) {
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => clear, [clear]);

  const start = useCallback(() => {
    setSeconds(initialSeconds);
    clear();
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clear();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }, [clear, initialSeconds]);

  return { seconds, start, clear } as const;
}


