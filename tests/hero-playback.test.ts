import { describe, expect, it } from "vitest";
import {
  HERO_BASE_PLAYBACK_RATE,
  HERO_CITY_PLAYBACK_RATE,
  HERO_CITY_START_SECONDS,
  HERO_CONSULTATION_END_SECONDS,
  HERO_CONSULTATION_PLAYBACK_RATE,
  HERO_CONSULTATION_START_SECONDS,
  heroPlaybackRateAt,
  syncHeroPlaybackRate,
} from "../src/utils/heroPlayback";

describe("hero segmented playback", () => {
  it("keeps the approved playback speed for each scene group", () => {
    expect(HERO_BASE_PLAYBACK_RATE).toBe(0.7);
    expect(HERO_CONSULTATION_PLAYBACK_RATE).toBe(1.2);
    expect(HERO_CITY_PLAYBACK_RATE).toBe(0.6);
  });

  it.each([
    [Number.NaN, HERO_BASE_PLAYBACK_RATE],
    [-1, HERO_BASE_PLAYBACK_RATE],
    [0, HERO_BASE_PLAYBACK_RATE],
    [HERO_CONSULTATION_START_SECONDS - 0.001, HERO_BASE_PLAYBACK_RATE],
    [HERO_CONSULTATION_START_SECONDS, HERO_CONSULTATION_PLAYBACK_RATE],
    [3.5, HERO_CONSULTATION_PLAYBACK_RATE],
    [HERO_CONSULTATION_END_SECONDS - 0.001, HERO_CONSULTATION_PLAYBACK_RATE],
    [HERO_CONSULTATION_END_SECONDS, HERO_CITY_PLAYBACK_RATE],
    [HERO_CITY_START_SECONDS + 0.5, HERO_CITY_PLAYBACK_RATE],
    [7.666667, HERO_CITY_PLAYBACK_RATE],
    [Number.POSITIVE_INFINITY, HERO_BASE_PLAYBACK_RATE],
  ])("uses the expected rate at %s seconds", (currentTime, expectedRate) => {
    expect(heroPlaybackRateAt(currentTime)).toBe(expectedRate);
  });

  it("updates a media element only to the rate for its current scene", () => {
    const video = { currentTime: 4, playbackRate: HERO_BASE_PLAYBACK_RATE };
    expect(syncHeroPlaybackRate(video)).toBe(HERO_CONSULTATION_PLAYBACK_RATE);
    expect(video.playbackRate).toBe(HERO_CONSULTATION_PLAYBACK_RATE);

    video.currentTime = 6.5;
    expect(syncHeroPlaybackRate(video)).toBe(HERO_CITY_PLAYBACK_RATE);
    expect(video.playbackRate).toBe(HERO_CITY_PLAYBACK_RATE);

    video.currentTime = 0;
    expect(syncHeroPlaybackRate(video)).toBe(HERO_BASE_PLAYBACK_RATE);
    expect(video.playbackRate).toBe(HERO_BASE_PLAYBACK_RATE);
  });
});
