export const HERO_BASE_PLAYBACK_RATE = 0.7;
export const HERO_CONSULTATION_PLAYBACK_RATE = 1.2;
export const HERO_CITY_PLAYBACK_RATE = 0.6;
export const HERO_CONSULTATION_START_SECONDS = 2.75;
export const HERO_CONSULTATION_END_SECONDS = 6.25;
export const HERO_CITY_START_SECONDS = HERO_CONSULTATION_END_SECONDS;

export function heroPlaybackRateAt(currentTime: number) {
  if (!Number.isFinite(currentTime) || currentTime < 0) {
    return HERO_BASE_PLAYBACK_RATE;
  }

  if (
    currentTime >= HERO_CONSULTATION_START_SECONDS
    && currentTime < HERO_CONSULTATION_END_SECONDS
  ) {
    return HERO_CONSULTATION_PLAYBACK_RATE;
  }

  if (currentTime >= HERO_CITY_START_SECONDS) {
    return HERO_CITY_PLAYBACK_RATE;
  }

  return HERO_BASE_PLAYBACK_RATE;
}

export function syncHeroPlaybackRate(
  video: Pick<HTMLVideoElement, "currentTime" | "playbackRate">,
) {
  const nextRate = heroPlaybackRateAt(video.currentTime);
  if (video.playbackRate !== nextRate) video.playbackRate = nextRate;
  return nextRate;
}
