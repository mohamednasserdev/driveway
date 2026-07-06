import { useState, useEffect } from 'react';

/**
 * Hook بيعمل counter animation من 0 للرقم المطلوب
 */
const useCounter = (target, duration = 1500) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!target) return;

    const startTime = Date.now();
    const startValue = 0;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function للحركة الناعمة
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(startValue + (target - startValue) * eased));

      if (progress === 1) clearInterval(timer);
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration]);

  return count;
};

export default useCounter;