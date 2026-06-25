import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useLanguage } from '../i18n';

const socket = io('/');

export default function IpadView() {
  const [state, setState] = useState('locked'); // locked, input_name, ready_start, roulette, result
  const [name, setName] = useState('');
  const { t, lang, setLang } = useLanguage();

  useEffect(() => {
    socket.on('ROULETTE_SPIN', () => {
      setState('roulette');
    });

    socket.on('SHOW_RESULT', () => {
      setState('result');
    });

    socket.on('RESET_STATE', () => {
      setState('locked');
      setName('');
    });

    socket.on('LANGUAGE_UPDATED', (data) => {
      setLang(data.lang);
    });

    return () => {
      socket.off('ROULETTE_SPIN');
      socket.off('SHOW_RESULT');
      socket.off('RESET_STATE');
      socket.off('LANGUAGE_UPDATED');
    };
  }, [setLang]);

  const requestFullscreen = () => {
    // Temporarily disabled for testing
    // if (!document.fullscreenElement) {
    //   document.documentElement.requestFullscreen().catch(() => {});
    // }
  };

  const handleInitialStart = () => {
    requestFullscreen();
    setState('input_name');
  };

  const handleNameSubmit = () => {
    if (!name.trim()) return;
    socket.emit('NAME_ENTERED', { name });
    setState('ready_start');
  };

  const handleGameStart = () => {
    socket.emit('GAME_START', { name });
    // State will be updated via ROULETTE_SPIN event, but we can set it optimistically
    setState('roulette');
  };

  const handleReset = () => {
    socket.emit('RESET_STATE');
    setState('locked');
    setName('');
  };

  return (
    <div className="ipad-layout fade-in">
      <div className="ipad-panels">
        
        {/* Left Static Panel */}
        <div className="ipad-panel side">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1" style={{ marginBottom: '1.5rem', opacity: 0.8 }}>
            <path d="M4 8.242c3.518-2.529 8.482-2.529 12 0" />
            <path d="M6 11.242c2.518-1.529 5.482-1.529 8 0" />
            <path d="M8 14.242c1.518-.529 2.482-.529 4 0" />
            <circle cx="10" cy="18" r="1" />
          </svg>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.4', fontWeight: 600, letterSpacing: '1px', opacity: 0.8 }}>
            {t('ipad_side_left_1')}<br/>
            {t('ipad_side_left_2').split('MASTERCARD')[0]}<span style={{ color: 'var(--mc-orange)' }}>MASTERCARD</span><br/>
            {t('ipad_side_left_3')}
          </p>
        </div>

        {/* Center Interactive Panel */}
        <div className="ipad-panel center">
          
          {/* Language Selector visible only on first screen */}
          {state === 'locked' && (
            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10 }}>
              <select 
                value={lang} 
                onChange={(e) => {
                  setLang(e.target.value);
                  socket.emit('SET_LANGUAGE', e.target.value);
                }}
                style={{ background: 'rgba(0,0,0,0.5)', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', fontSize: '1rem', outline: 'none' }}
              >
                <option value="uk">UKR</option>
                <option value="en">ENG</option>
              </select>
            </div>
          )}

          {state === 'locked' && (
            <div className="fade-in" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 600, marginBottom: '1rem', lineHeight: 1.3 }}>
                {t('ipad_center_title_1')}<br/>{t('ipad_center_title_2')}
              </h2>
              <p style={{ color: 'var(--mc-orange)', fontSize: '1.8rem', marginBottom: '3rem' }}>
                {t('ipad_center_subtitle')}
              </p>
              <button className="mc-btn" onClick={handleInitialStart}>
                {t('ipad_btn_start')}
              </button>
            </div>
          )}

          {state === 'input_name' && (
            <div className="fade-in" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MC" height="40" style={{ marginBottom: '2rem' }} />
              <h2 style={{ fontSize: '1.8rem', fontWeight: 400, marginBottom: '2rem' }}>
                {t('ipad_enter_name')}
              </h2>
              <input 
                className="mc-input"
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="..."
                autoFocus
              />
              <button className="mc-btn" onClick={handleNameSubmit} disabled={!name.trim()}>
                {t('ipad_btn_continue')}
              </button>
            </div>
          )}

          {state === 'ready_start' && (
            <div className="fade-in" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 400, marginBottom: '1rem' }}>
                {t('ipad_ready_title_1').replace('СТАРТ', '').replace('START', '')} <span style={{ color: 'var(--mc-orange)', fontWeight: 600 }}>{lang === 'uk' ? 'СТАРТ' : 'START'}</span>,<br/>
                {t('ipad_ready_title_2')}
              </h2>
              <button className="mc-btn" onClick={handleGameStart} style={{ marginTop: '2rem', padding: '2rem 4rem', fontSize: '2.5rem' }}>
                {t('ipad_btn_play')}
              </button>
            </div>
          )}

          {(state === 'roulette' || state === 'result') && (
            <div className="fade-in" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', perspective: '1000px' }}>
              <div className={`ipad-vinyl-player ${state === 'result' ? 'dimmed' : ''}`}>
                
                {/* Decorative buttons on the player base */}
                <div style={{ position: 'absolute', bottom: '20px', left: '20px', width: '30px', height: '30px', borderRadius: '50%', border: '2px solid #333', background: '#111' }}></div>
                <div style={{ position: 'absolute', bottom: '25px', left: '60px', width: '10px', height: '10px', borderRadius: '50%', background: '#ff5500', boxShadow: '0 0 5px #ff5500' }}></div>
                
                {/* Glowing Platter */}
                <div className="ipad-platter">
                  {/* Vinyl Record */}
                  <div className={`ipad-vinyl-record ${state === 'roulette' ? 'spinning' : ''}`}>
                    <div className="ipad-vinyl-label"></div>
                  </div>
                </div>

                {/* Tonearm */}
                <div className={`ipad-tonearm ${state === 'roulette' ? 'playing' : ''}`}>
                  <svg width="120" height="200" viewBox="0 0 120 200" style={{ dropShadow: '0 20px 10px rgba(0,0,0,0.8)' }}>
                    {/* Base pivot */}
                    <circle cx="90" cy="40" r="25" fill="#111" stroke="#333" strokeWidth="2" />
                    <circle cx="90" cy="40" r="15" fill="url(#metallic-grad)" />
                    <circle cx="90" cy="40" r="5" fill="#000" />
                    
                    {/* Arm */}
                    <path d="M 90 40 L 70 140 L 30 180" fill="none" stroke="#222" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 90 40 L 70 140 L 30 180" fill="none" stroke="url(#metallic-grad)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                    
                    {/* Headshell / Needle */}
                    <g transform="translate(30, 180) rotate(45)">
                      <rect x="-10" y="-15" width="20" height="35" rx="3" fill="#111" stroke="#333" strokeWidth="1" />
                      <rect x="-5" y="15" width="10" height="5" fill="#ff5500" />
                    </g>

                    <defs>
                      <linearGradient id="metallic-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#888" />
                        <stop offset="50%" stopColor="#eee" />
                        <stop offset="100%" stopColor="#555" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

              </div>
              
              {state === 'result' && (
                <div className="fade-in" style={{ position: 'absolute', bottom: '3rem', zIndex: 20 }}>
                  <button className="mc-btn" onClick={handleReset} style={{ fontSize: '1.5rem', padding: '1.2rem 2rem', boxShadow: '0 0 30px rgba(255,95,0,0.6)' }}>
                    {t('ipad_btn_restart')}
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Static Panel */}
        <div className="ipad-panel side">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--mc-orange)" strokeWidth="1" style={{ marginBottom: '1.5rem' }}>
            <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
            <polyline points="3 7 12 13 21 7" />
          </svg>
          <p style={{ fontSize: '1.4rem', lineHeight: '1.5', fontWeight: 600, letterSpacing: '1px', opacity: 0.9 }}>
            {t('ipad_side_right_1')}<br/>
            {t('ipad_side_right_2')}
          </p>
        </div>

      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', paddingBottom: '1rem' }}>
        <span style={{ color: 'var(--mc-orange)', fontSize: '3rem', fontWeight: 900 }}>{t('ipad_years_1')}</span>
        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" height="40" />
        <span style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '1px' }}>{t('ipad_years_2')}</span>
      </div>
      
    </div>
  );
}
