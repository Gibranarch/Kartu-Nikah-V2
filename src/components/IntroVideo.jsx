import { useEffect, useRef } from 'react';
import './IntroVideo.css';

/**
 * Intro video section – rendered INLINE in the phone screen scroll flow.
 * The video starts when `isOpened` becomes true.
 * It is muted, plays inline, and fires `onEnded` when finished.
 * Users can scroll past it at any time.
 */
export default function IntroVideo({ src, isOpened, onEnded }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isOpened) {
      video.play().catch(() => {
        // Autoplay may be blocked – ignore silently
      });
    }
  }, [isOpened]);

  const handleEnded = () => {
    if (onEnded) onEnded();
  };

  return (
    <section className="intro-video-section" aria-label="Video intro undangan">
      <video
        ref={videoRef}
        className="intro-video-player"
        src={src}
        muted
        playsInline
        preload="auto"
        onEnded={handleEnded}
      />
    </section>
  );
}
