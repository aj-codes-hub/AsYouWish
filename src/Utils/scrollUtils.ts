// utils/scrollUtils.ts
export const smoothScrollTo = (
  targetId: string, 
  offset: number = 65, 
  duration: number = 1200  // ✅ 1.2 seconds - Slow scroll
) => {
  const target = document.getElementById(targetId);
  if (!target) return;

  const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime: number | null = null;

  const easeInOutCubic = (t: number): number => {
    return t < 0.5 
      ? 4 * t * t * t 
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const animation = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const easeProgress = easeInOutCubic(progress);

    window.scrollTo(0, startPosition + distance * easeProgress);

    if (progress < 1) {
      requestAnimationFrame(animation);
    }
  };

  requestAnimationFrame(animation);
};