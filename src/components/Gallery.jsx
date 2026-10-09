
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import './Gallery.css';

export default function Gallery({ images = [] }) {
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [lightboxHost, setLightboxHost] = useState(null);

  useEffect(() => {
    setLightboxHost(document.querySelector('.phone-container'));
  }, []);

  const openLightbox = (idx) => setLightboxIdx(idx);
  const closeLightbox = () => setLightboxIdx(null);

  const prev = () => {
    setLightboxIdx((i) => (i - 1 + images.length) % images.length);
  };

  const next = () => {
    setLightboxIdx((i) => (i + 1) % images.length);
  };

  useEffect(() => {
    if (lightboxIdx === null) return;

    const isMobile = window.matchMedia('(max-width: 640px)').matches;
    const previousOverflow = document.body.style.overflow;

    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };

    window.addEventListener('keydown', onKey);

    // Hanya kunci body pada mobile.
    // Pada desktop, scroll dikelola oleh phone-screen.
    if (isMobile) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', onKey);

      if (isMobile) {
        document.body.style.overflow = previousOverflow;
      }
    };
  }, [lightboxIdx, images.length]);

  if (!images.length) return null;

  const lightbox = lightboxIdx !== null && (
    <div
      className="lightbox-overlay"
      onClick={closeLightbox}
      role="dialog"
      aria-modal="true"
      aria-label="Galeri foto"
    >
      <button
        type="button"
        className="lightbox-close"
        onClick={(e) => {
          e.stopPropagation();
          closeLightbox();
        }}
        aria-label="Tutup"
      >
        <X size={22} strokeWidth={2} />
      </button>

      <button
        type="button"
        className="lightbox-nav lightbox-nav--prev"
        onClick={(e) => {
          e.stopPropagation();
          prev();
        }}
        aria-label="Foto sebelumnya"
      >
        <ChevronLeft size={26} />
      </button>

      <img
        src={images[lightboxIdx]}
        alt={`Foto pernikahan ${lightboxIdx + 1}`}
        className="lightbox-img"
        onClick={(e) => e.stopPropagation()}
        draggable="false"
      />

      <button
        type="button"
        className="lightbox-nav lightbox-nav--next"
        onClick={(e) => {
          e.stopPropagation();
          next();
        }}
        aria-label="Foto berikutnya"
      >
        <ChevronRight size={26} />
      </button>

      <p
        className="lightbox-counter"
        onClick={(e) => e.stopPropagation()}
      >
        {lightboxIdx + 1} / {images.length}
      </p>
    </div>
  );

  return (
    <section className="section gallery-section">
      <h2 className="section-title">Galeri</h2>

      <div className="gallery-grid">
        {images.map((src, idx) => (
          <button
            key={idx}
            type="button"
            className="gallery-item"
            onClick={() => openLightbox(idx)}
            aria-label={`Buka foto ${idx + 1}`}
            id={`gallery-item-${idx}`}
          >
            <img
              src={src}
              alt={`Foto pernikahan ${idx + 1}`}
              loading="lazy"
            />
            <div
              className="gallery-item__overlay"
              aria-hidden="true"
            />
          </button>
        ))}
      </div>

      {lightbox && lightboxHost
        ? createPortal(lightbox, lightboxHost)
        : null}
    </section>
  );
}