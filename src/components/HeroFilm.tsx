import { useEffect, useRef, useState } from "react";
import heroPoster from "../assets/hero-gold-path-poster.jpg";
import heroVideo from "../assets/hero-one-take.mp4";

type NavigatorWithConnection = Navigator & {
  connection?: EventTarget & { saveData?: boolean };
};

type UserPlaybackChoice = "none" | "play" | "pause";

const HERO_PLAYBACK_RATE = 0.7;

export function HeroFilm() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [autoEligible, setAutoEligible] = useState(false);
  const [userChoice, setUserChoice] = useState<UserPlaybackChoice>("none");
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPresentedFrame, setHasPresentedFrame] = useState(false);
  const [autoPlayBlocked, setAutoPlayBlocked] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const wideScreen = window.matchMedia("(min-width: 769px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as NavigatorWithConnection).connection;

    const updatePlayback = () => {
      const canAutoPlay = wideScreen.matches && !reducedMotion.matches && connection?.saveData !== true;
      setAutoEligible(canAutoPlay);
      setAutoPlayBlocked(false);
    };

    updatePlayback();
    wideScreen.addEventListener("change", updatePlayback);
    reducedMotion.addEventListener("change", updatePlayback);
    connection?.addEventListener("change", updatePlayback);

    return () => {
      wideScreen.removeEventListener("change", updatePlayback);
      reducedMotion.removeEventListener("change", updatePlayback);
      connection?.removeEventListener("change", updatePlayback);
    };
  }, []);

  const shouldLoadVideo = !hasError && (autoEligible || userChoice !== "none");
  const shouldPlay = userChoice === "play" || (userChoice === "none" && autoEligible && !autoPlayBlocked);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;
    video.defaultPlaybackRate = HERO_PLAYBACK_RATE;
    video.playbackRate = HERO_PLAYBACK_RATE;

    if (!shouldPlay) {
      video.pause();
      return;
    }

    void video.play().catch(() => {
      setIsPlaying(false);
      if (userChoice === "none") setAutoPlayBlocked(true);
      else setUserChoice("pause");
    });
  }, [shouldLoadVideo, shouldPlay, userChoice]);

  const togglePlayback = () => {
    const playbackWasRequested = isPlaying || shouldPlay;
    if (playbackWasRequested) {
      setUserChoice("pause");
      videoRef.current?.pause();
      return;
    }

    setHasError(false);
    setUserChoice("play");
    const video = videoRef.current;
    if (video) {
      video.playbackRate = HERO_PLAYBACK_RATE;
      void video.play().catch(() => setUserChoice("pause"));
    }
  };

  const isLoading = shouldPlay && !isPlaying;
  const controlText = isPlaying ? "PAUSE FILM" : isLoading ? "LOADING" : "PLAY FILM";
  const controlLabel = isPlaying || isLoading ? "소개 영상 일시정지" : "소개 영상 재생";

  return (
    <>
      <div className={`hero-film ${hasPresentedFrame && shouldLoadVideo ? "is-ready" : ""}`} aria-hidden="true">
        <img
          className="hero-film-poster"
          src={heroPoster}
          alt=""
          width="1600"
          height="900"
          decoding="async"
          fetchPriority="high"
        />
        {shouldLoadVideo && (
          <video
            ref={videoRef}
            className="hero-film-video"
            autoPlay={shouldPlay}
            muted
            loop
            playsInline
            preload="metadata"
            poster={heroPoster}
            tabIndex={-1}
            disablePictureInPicture
            onLoadedMetadata={(event) => {
              event.currentTarget.defaultPlaybackRate = HERO_PLAYBACK_RATE;
              event.currentTarget.playbackRate = HERO_PLAYBACK_RATE;
            }}
            onPlaying={() => {
              setHasPresentedFrame(true);
              setIsPlaying(true);
            }}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            onError={() => {
              setHasError(true);
              setHasPresentedFrame(false);
              setIsPlaying(false);
            }}
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
        )}
      </div>
      {!hasError && (
        <button
          className={`hero-media-control ${shouldLoadVideo ? "is-compact" : "is-initial"}`}
          type="button"
          aria-label={controlLabel}
          aria-pressed={isPlaying}
          data-testid="hero-film-control"
          onClick={togglePlayback}
        >
          <span className="hero-media-control-icon" aria-hidden="true">
            <svg viewBox="0 0 20 20" focusable="false">
              {isPlaying || isLoading ? (
                <>
                  <rect x="5" y="4" width="3" height="12" rx="1" />
                  <rect x="12" y="4" width="3" height="12" rx="1" />
                </>
              ) : (
                <path d="M7 4.8v10.4L15.2 10 7 4.8Z" />
              )}
            </svg>
          </span>
          <span className="hero-media-control-label">{controlText}</span>
        </button>
      )}
    </>
  );
}
