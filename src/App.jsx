import { useState, useEffect, useRef } from 'react';
import Cover from './components/Cover';
import IntroVideo from './components/IntroVideo';
import Introduction from './components/Introduction';
import Quote from './components/Quote';
import BrideSection from './components/BrideSection';
import Countdown from './components/Countdown';
import EventSection from './components/EventSection';
import Gallery from './components/Gallery';
import Cashless from './components/Cashless';
import Wishes from './components/Wishes';
import Footer from './components/Footer';
import MusicPlayer from './components/MusicPlayer';
import { weddingData, getGuestName } from './data/weddingData';
import './App.css';

function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [isIntroFinished, setIsIntroFinished] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef(null);
  const phoneScreenRef = useRef(null);

  // Read guest name from URL ?tamu= param
  const guestName = getGuestName();

  // Merge URL guest name into data object (non-destructive)
  const resolvedData = { ...weddingData, guest: guestName };

  // Audio setup
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = true;
    audio.volume = 0.5;
  }, []);

  // Scroll lock: lock phone screen before opening, unlock after
  useEffect(() => {
    const screen = phoneScreenRef.current;
    if (!screen) return;
    screen.style.overflowY = isOpened ? 'auto' : 'hidden';
  }, [isOpened]);

  const handleOpen = () => {
    setIsOpened(true);
    const audio = audioRef.current;
    if (audio) {
      audio.play()
        .then(() => setIsMusicPlaying(true))
        .catch(() => setIsMusicPlaying(false));
    }
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMusicPlaying) {
      audio.pause();
      setIsMusicPlaying(false);
    } else {
      audio.play()
        .then(() => setIsMusicPlaying(true))
        .catch(() => { });
    }
  };

  const handleVideoEnded = () => {
    // Only informational – no navigation, no page switch
    setIsIntroFinished(true);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={weddingData.audio}
        preload="none"
      />

      <div
        className="desktop-bg"
        aria-hidden="true"
      />

      <div className="phone-wrapper">
        <div className="phone-container">

          <div
            className="phone-screen"
            ref={phoneScreenRef}
            role="main"
          >
            {!isOpened ? (
              <Cover
                onOpen={handleOpen}
                data={resolvedData}
              />
            ) : (
              <>
                <IntroVideo
                  src={weddingData.introVideo}
                  isOpened={isOpened}
                  onEnded={handleVideoEnded}
                />

                <div className="invitation-sections">
                  <Introduction data={resolvedData} />
                  <Quote />
                  <BrideSection data={resolvedData} />
                  <Countdown
                    date={weddingData.date}
                    data={resolvedData}
                  />
                  <EventSection
                    events={weddingData.events}
                  />
                  <Gallery
                    images={weddingData.gallery}
                  />
                  <Cashless
                    accounts={weddingData.cashless}
                  />
                  <Wishes
                    initialWishes={weddingData.initialWishes}
                  />
                  <Footer data={resolvedData} />
                </div>
              </>
            )}
          </div>

          <img
            src="/images/iphone-silver.webp"
            alt=""
            className="phone-frame-img"
            aria-hidden="true"
            draggable="false"
          />

          {isOpened && (
            <MusicPlayer
              isPlaying={isMusicPlaying}
              onToggle={toggleMusic}
              hasAudio={!!weddingData.audio}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default App;
