import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useLanguage } from '../i18n';

const socket = io('/');

export default function TvView() {
  const [state, setState] = useState('idle'); // idle, name_entered, roulette, result
  const [resultData, setResultData] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [activeIndices, setActiveIndices] = useState([]);
  const [winnerIndex, setWinnerIndex] = useState(-1);
  const { t, lang, setLang } = useLanguage();
  const intervalRef = useRef(null);

  // Ref array for grid items
  const gridRefs = useRef([]);
  // Ref for winner index to access in socket closure safely
  const targetIdxRef = useRef(-1);
  const [winnerRect, setWinnerRect] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    socket.on('NAME_ENTERED', (userData) => {
      setPlayerName(userData.name);
      setState('name_entered');
    });

    socket.on('ROULETTE_SPIN', () => {
      setState('roulette');
      
      const duration = 10000; // 10 seconds exactly
      const startIdx = Math.floor(Math.random() * 25);
      const targetIdx = Math.floor(Math.random() * 25);
      
      targetIdxRef.current = targetIdx; // Store immediately for SHOW_RESULT

      let stepsNeeded = (targetIdx - startIdx) % 25;
      if (stepsNeeded < 0) stepsNeeded += 25;
      
      const totalSteps = stepsNeeded + 100; 

      const startTime = performance.now();
      const easeOutQuint = (t) => 1 - Math.pow(1 - t, 5);

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        let progress = elapsed / duration;
        
        if (progress >= 1) {
          progress = 1;
        }

        const currentEasedProgress = easeOutQuint(progress);
        const currentStep = Math.floor(currentEasedProgress * totalSteps);
        
        const activeIdx = (startIdx + currentStep) % 25;
        
        setActiveIndices([activeIdx]);

        if (progress < 1) {
          intervalRef.current = requestAnimationFrame(animate);
        } else {
          setWinnerIndex(targetIdx);
        }
      };

      if (intervalRef.current) cancelAnimationFrame(intervalRef.current);
      intervalRef.current = requestAnimationFrame(animate);
    });

    socket.on('SHOW_RESULT', (data) => {
      if (intervalRef.current) cancelAnimationFrame(intervalRef.current);
      
      setResultData(data);
      setWinnerIndex(targetIdxRef.current); // Force winner index in case animation was cut off
      setActiveIndices([]); // Clear any leftover active indices from the roulette animation
      setState('winner_pulse');
      
      // Measure rect before transition
      const winnerEl = gridRefs.current[targetIdxRef.current];
      if (winnerEl) {
        const rect = winnerEl.getBoundingClientRect();
        setWinnerRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        });
      }
      
      // Pulse for 2 seconds, then show the big flipping result screen
      setTimeout(() => {
        setState('result');
      }, 2000);
    });

    socket.on('RESET_STATE', () => {
      if (intervalRef.current) cancelAnimationFrame(intervalRef.current);
      setState('idle');
      setResultData(null);
      setPlayerName('');
      setActiveIndices([]);
      setWinnerIndex(-1);
      setWinnerRect(null);
      setIsAnimating(false);
    });

    socket.on('LANGUAGE_UPDATED', (data) => {
      setLang(data.lang);
    });

    return () => {
      if (intervalRef.current) cancelAnimationFrame(intervalRef.current);
      socket.off('NAME_ENTERED');
      socket.off('ROULETTE_SPIN');
      socket.off('SHOW_RESULT');
      socket.off('RESET_STATE');
      socket.off('LANGUAGE_UPDATED');
    };
  }, [setLang]);

  // Trigger FLIP animation when entering 'result' state
  useEffect(() => {
    if (state === 'result' && winnerRect) {
      // Short delay to ensure the element renders at initial position first
      const t = setTimeout(() => {
        setIsAnimating(true);
      }, 50);
      return () => clearTimeout(t);
    } else {
      setIsAnimating(false);
    }
  }, [state, winnerRect]);

  const bigVinylStyle = isAnimating ? {
    position: 'fixed',
    top: '55%',
    left: '50%',
    width: '70vh',
    height: '70vh',
    transform: 'translate(-50%, -50%)',
    transition: 'all 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    zIndex: 1000,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  } : {
    position: 'fixed',
    top: `${winnerRect?.top || 0}px`,
    left: `${winnerRect?.left || 0}px`,
    width: `${winnerRect?.width || 0}px`,
    height: `${winnerRect?.height || 0}px`,
    transform: 'none',
    transition: 'none',
    zIndex: 1000,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };

  const enableFullscreen = () => {
    // Temporarily disabled for testing
    // if (!document.fullscreenElement) {
    //   document.documentElement.requestFullscreen().catch(() => {});
    // }
  };

  // Helper to render the 5x5 grid
  const renderGrid = () => {
    const records = [];
    for (let i = 0; i < 25; i++) {
      let isGolden = state === 'idle';
      let isActive = activeIndices.includes(i);
      let isPulse = state === 'winner_pulse' && winnerIndex === i;
      // In result state, we hide the winning grid item because the big vinyl covers it and grows
      let isHidden = state === 'result' && winnerIndex === i;

      let classes = 'record-disc ';
      
      if (isPulse) {
        classes += 'record-bg-gold pulse-crazy';
      } else if (isGolden || isActive) {
        classes += 'record-bg-gold glowing';
      } else {
        classes += 'record-bg-dark';
      }

      records.push(
        <div key={i} className="record-container" ref={el => gridRefs.current[i] = el} style={{ opacity: isHidden ? 0 : 1 }}>
          <div className={classes}>
            <div className="record-center" style={{ width: '35%', height: '35%' }}></div>
          </div>
        </div>
      );
    }
    return records;
  };

  const renderHeader = () => (
    <div className="fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', marginTop: '2rem', marginBottom: '2rem', zIndex: 20 }}>
      <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" height="60" />
      <div style={{ borderLeft: '2px solid rgba(255,255,255,0.3)', height: '50px' }}></div>
      <div style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 'bold', textAlign: 'left', lineHeight: '1.2' }}>
        <span style={{ color: 'var(--mc-orange)', fontSize: '1.8rem' }}>{t('tv_years_1')}</span> {t('tv_years_2').split('\n')[0]}<br/>{t('tv_years_2').split('\n')[1]}
      </div>
    </div>
  );

  const renderFooter = () => (
    <div className="fade-in" style={{ position: 'absolute', bottom: '2rem', left: '0', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', zIndex: 20 }}>
      {state !== 'result' && (
        <span style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '2px', textTransform: 'uppercase' }}>
          {t('tv_footer')}
        </span>
      )}
      <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" height="30" />
    </div>
  );

  return (
    <div className="fullscreen-view" onClick={enableFullscreen} style={{ cursor: 'pointer', position: 'relative', justifyContent: 'flex-start', overflow: 'hidden' }}>
      
      {/* Header is always visible on TV */}
      {renderHeader()}

      {state === 'idle' && (
        <div className="fade-in" style={{ textAlign: 'center', marginBottom: '3rem', zIndex: 20 }}>
          <h1 style={{ fontSize: '5rem', color: '#fff', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '4px', fontFamily: 'Outfit' }}>
            {t('tv_main_title_1')}
          </h1>
          <h1 className="title" style={{ fontSize: '5.5rem', letterSpacing: '6px', marginBottom: 0 }}>
            {t('tv_main_title_2')}
          </h1>
        </div>
      )}

      {/* Grid stays visible during result to show background */}
      <div className={`records-grid fade-in`} style={{ marginBottom: '5rem', opacity: state === 'result' ? 0.3 : 1, transition: 'opacity 1s' }}>
        {renderGrid()}
      </div>

      {/* Footer is always visible on TV */}
      {renderFooter()}

      {state === 'name_entered' && (
        <div className="tv-overlay fade-in">
          <h1 style={{ fontSize: '6rem', color: '#fff', fontWeight: 900, textShadow: '0 0 40px #000', fontFamily: 'Outfit', lineHeight: 1.2 }}>
            {t('tv_welcome_1', { name: playerName }).split('\n')[0]}<br/>
            {t('tv_welcome_1', { name: playerName }).split('\n')[1]}<br/>
            <span style={{ color: 'var(--mc-orange)' }}>{t('tv_welcome_1_highlight')}</span>
          </h1>
          <h2 style={{ fontSize: '3rem', marginTop: '2rem', color: '#fff', textShadow: '0 0 20px #000', fontFamily: 'Outfit' }}>
            {t('tv_welcome_2')}
          </h2>
        </div>
      )}

      {state === 'roulette' && (
        <div className="tv-overlay">
          <h1 className="title" style={{ fontSize: '8rem', letterSpacing: '5px', textShadow: '0 0 50px rgba(255,95,0,0.5)' }}>
            {t('ipad_btn_start')}
          </h1>
        </div>
      )}

      {state === 'result' && resultData && (
        <>
          <div className="confetti fade-in"></div>
          {/* Dimmer overlay for background */}
          <div className="tv-overlay fade-in" style={{ backgroundColor: 'rgba(0,0,0,0.7)', pointerEvents: 'none' }}></div>
          
          <h1 className="fade-in title" style={{ position: 'fixed', top: '10%', left: '50%', transform: 'translateX(-50%)', fontSize: '3.5rem', letterSpacing: '4px', zIndex: 1001, fontWeight: 900, whiteSpace: 'nowrap' }}>
            <span style={{ color: '#fff' }}>{t('tv_main_title_1')}</span> {t('tv_main_title_3')}
          </h1>
          
          <div style={bigVinylStyle}>
            {/* The golden face that scales up and FADES OUT */}
            <div className="record-bg-gold" style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '50%',
              opacity: isAnimating ? 0 : 1, transition: 'opacity 0.8s ease-in-out',
              display: 'flex', justifyContent: 'center', alignItems: 'center'
            }}>
               <div className="record-center" style={{ width: '35%', height: '35%' }}></div>
            </div>

            {/* The dark iPad-style face that FADES IN (this is the "reverse side") */}
            <div className="record-bg-dark-ipad" style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '50%',
              opacity: isAnimating ? 1 : 0, transition: 'opacity 0.8s ease-in-out',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              animation: isAnimating ? 'spin 15s linear infinite' : 'none'
            }}>
               <div className="record-center" style={{ width: '35%', height: '35%' }}></div>
            </div>

            {/* The result content that fades in on top of the dark record */}
            <div style={{
              position: 'relative', zIndex: 2,
              opacity: isAnimating ? 1 : 0, transition: 'opacity 0.8s ease-in-out 0.8s',
              width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
              justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '3rem', color: '#fff',
              background: isAnimating ? 'radial-gradient(circle, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0) 80%)' : 'none',
              borderRadius: '50%'
            }}>
              {resultData.type === 'prize' ? (
                <>
                  <div style={{ width: '200px', height: '200px', background: 'linear-gradient(135deg, #222, #111)', borderRadius: '20px', border: '1px solid #444', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem', boxShadow: '0 0 30px rgba(0,0,0,0.5)' }}>
                    <span style={{ color: 'var(--mc-orange)', fontSize: '1.5rem', fontFamily: 'Outfit' }}>PRIZE IMAGE</span>
                  </div>
                  
                  <h2 style={{ fontSize: '2.5rem', fontWeight: 400, fontFamily: 'Outfit', lineHeight: 1.3 }}>
                    {t('result_win_1', { name: resultData.userData.name })}<br/>{t('result_win_2')}<br/>
                    <span style={{ color: 'var(--mc-orange)', fontWeight: 900, fontSize: '3.5rem', marginTop: '1rem', display: 'block' }}>
                      {lang === 'uk' ? resultData.prize.name_uk : resultData.prize.name_en}
                    </span>
                  </h2>
                </>
              ) : (
                <>
                  <svg width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="var(--mc-orange)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '2rem' }}>
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="2" x2="12" y2="4"></line>
                    <line x1="12" y1="20" x2="12" y2="22"></line>
                    <line x1="20" y1="12" x2="22" y2="12"></line>
                    <line x1="2" y1="12" x2="4" y2="12"></line>
                  </svg>
                  
                  <h2 style={{ fontSize: '2.5rem', fontWeight: 400, fontFamily: 'Outfit', lineHeight: 1.3, letterSpacing: '1px' }}>
                    {t('result_lose_1', { name: resultData.userData.name })}<br/>
                    {t('result_lose_2')}<br/>{t('result_lose_3')}
                  </h2>
                  
                  <div style={{ width: '40px', height: '2px', background: 'var(--mc-orange)', margin: '2rem auto' }}></div>
                  
                  <h3 style={{ fontSize: '2.5rem', fontWeight: 400, fontFamily: 'Outfit', color: 'var(--mc-orange)', maxWidth: '500px', lineHeight: 1.4 }}>
                    {t(`result_no_prize_${resultData.messageIndex}`)}
                  </h3>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
