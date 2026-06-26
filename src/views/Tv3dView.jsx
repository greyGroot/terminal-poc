import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { io } from 'socket.io-client';
import { useLanguage } from '../i18n';

const socket = io('/');

// Dynamic texture drawer functions
const drawGoldRecord = (ctx, size) => {
  const cx = size / 2;
  const cy = size / 2;
  
  // 1. High-Contrast Conic Gradient (vibrant gold and copper from image reference)
  const conic = ctx.createConicGradient(Math.PI / 4, cx, cy);
  conic.addColorStop(0, '#8c4300');       // Rich deep copper-bronze shadow
  conic.addColorStop(35/360, '#ffa800');  // Saturated warm gold
  conic.addColorStop(75/360, '#fff0a6');  // Bright golden-white specular highlight
  conic.addColorStop(110/360, '#ffa800'); // Saturated warm gold
  conic.addColorStop(150/360, '#8c4300'); // Rich deep copper-bronze shadow
  conic.addColorStop(215/360, '#ffa800'); // Saturated warm gold
  conic.addColorStop(255/360, '#fff0a6'); // Bright golden-white specular highlight
  conic.addColorStop(290/360, '#ffa800'); // Saturated warm gold
  conic.addColorStop(330/360, '#8c4300'); // Rich deep copper-bronze shadow
  conic.addColorStop(1, '#8c4300');
  
  ctx.fillStyle = conic;
  ctx.fillRect(0, 0, size, size);
  
  // 2. High-definition record groove lines
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.22)';
  ctx.lineWidth = 1;
  for (let r = size * 0.18; r < size * 0.5; r += 3.5) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  // 3. Radial Gradient overlay for glowing orange-copper outer edge
  const radial = ctx.createRadialGradient(cx, cy, size * 0.15, cx, cy, size * 0.5);
  radial.addColorStop(0, 'rgba(0, 0, 0, 0)');
  radial.addColorStop(0.65, 'rgba(0, 0, 0, 0)');
  radial.addColorStop(0.9, 'rgba(0, 0, 0, 0.35)');
  radial.addColorStop(1, '#ff6600');
  
  ctx.fillStyle = radial;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.5, 0, Math.PI * 2);
  ctx.fill();

  drawCenterHole(ctx, size);
};

const drawDarkRecord = (ctx, size) => {
  const cx = size / 2;
  const cy = size / 2;
  
  // 1. Conic Gradient (dark record reflections)
  const conic = ctx.createConicGradient(0, cx, cy);
  conic.addColorStop(0, '#0a0a0a');
  conic.addColorStop(45/360, '#1f1f1f');
  conic.addColorStop(90/360, '#0a0a0a');
  conic.addColorStop(135/360, '#1f1f1f');
  conic.addColorStop(180/360, '#0a0a0a');
  conic.addColorStop(225/360, '#1f1f1f');
  conic.addColorStop(270/360, '#0a0a0a');
  conic.addColorStop(315/360, '#1f1f1f');
  conic.addColorStop(1, '#0a0a0a');
  
  ctx.fillStyle = conic;
  ctx.fillRect(0, 0, size, size);
  
  // 2. Grooves
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  for (let r = size * 0.18; r < size * 0.5; r += 4) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  drawCenterHole(ctx, size);
};

const drawDarkIpadRecord = (ctx, size) => {
  const cx = size / 2;
  const cy = size / 2;
  
  // 1. Conic Gradient (dark copper style)
  const conic = ctx.createConicGradient(Math.PI / 4, cx, cy);
  conic.addColorStop(0, '#0a0a0a');
  conic.addColorStop(45/360, '#2d1600'); // dark copper specular shine
  conic.addColorStop(90/360, '#0a0a0a');
  conic.addColorStop(135/360, '#2d1600');
  conic.addColorStop(180/360, '#0a0a0a');
  conic.addColorStop(225/360, '#2d1600');
  conic.addColorStop(270/360, '#0a0a0a');
  conic.addColorStop(315/360, '#2d1600');
  conic.addColorStop(1, '#0a0a0a');
  
  ctx.fillStyle = conic;
  ctx.fillRect(0, 0, size, size);
  
  // 2. High-definition record groove lines (visible light reflection)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  for (let r = size * 0.18; r < size * 0.5; r += 3.5) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  // 3. Radial Gradient overlay for outer shine
  const radial = ctx.createRadialGradient(cx, cy, size * 0.15, cx, cy, size * 0.5);
  radial.addColorStop(0, 'rgba(0, 0, 0, 0)');
  radial.addColorStop(0.65, 'rgba(0, 0, 0, 0)');
  radial.addColorStop(0.92, 'rgba(0, 0, 0, 0.5)');
  radial.addColorStop(1, 'rgba(255, 95, 0, 0.25)'); // subtle orange-copper edge
  
  ctx.fillStyle = radial;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.5, 0, Math.PI * 2);
  ctx.fill();

  drawCenterHole(ctx, size);
};

const drawCenterHole = (ctx, size) => {
  const cx = size / 2;
  const cy = size / 2;
  
  // Center deep solid black circle (clean contrast from image reference)
  ctx.fillStyle = '#030303';
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.35 / 2, 0, Math.PI * 2);
  ctx.fill();
  
  // Center pin (bright orange-gold dot matching image reference)
  const pinRadius = size * 0.022;
  ctx.fillStyle = '#ffa800';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, pinRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
};

const drawBumpMap = (ctx, size) => {
  const cx = size / 2;
  const cy = size / 2;
  
  // Fill background with neutral gray
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);
  
  // Draw Concentric ridges (alternating black and white heights)
  for (let r = size * 0.18; r < size * 0.5; r += 3) {
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.arc(cx, cy, r + 1.5, 0, Math.PI * 2);
    ctx.stroke();
  }
};

// 3D Record in the grid
function Record3D({ index, position, gameState, isActive, isPulse, isHidden, isDimmed, textures }) {
  const meshRef = useRef();
  const ringRef = useRef();
  const materialRef = useRef();
  const spinGroupRef = useRef();

  useFrame((state, delta) => {
    if (spinGroupRef.current) {
      // Rotate record horizontally (around vertical Y-axis)
      const speed = isPulse ? 3.0 : (isActive ? 2.5 : 1.5);
      spinGroupRef.current.rotation.y += delta * speed;
    }

    if (materialRef.current) {
      // Smoothly dim opacity of non-winning records in result state (0.45 for result screen visibility, 0.2 for welcome text contrast)
      const targetOpacity = isDimmed ? (gameState === 'name_entered' ? 0.2 : 0.45) : 1.0;
      materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, targetOpacity, delta * 5);
      materialRef.current.transparent = materialRef.current.opacity < 1.0;
    }

    if (ringRef.current) {
      // Pulse the scale and opacity of the glowing ring if active or pulsing
      if (isPulse || isActive) {
        const pulse = 1.0 + Math.sin(state.clock.getElapsedTime() * 12) * 0.05;
        ringRef.current.scale.set(pulse, pulse, 1);
        ringRef.current.material.opacity = 0.8 + Math.sin(state.clock.getElapsedTime() * 12) * 0.2;
      } else {
        ringRef.current.scale.set(1, 1, 1);
        ringRef.current.material.opacity = (gameState === 'idle' || gameState === 'name_entered') ? 0.35 : 0.0;
      }
    }
  });

  const isGold = (gameState === 'idle' || gameState === 'name_entered' || isActive || isPulse);
  const texture = isGold ? textures.gold : textures.dark;

  // Golden-copper emissive color mapping (avoiding neon red)
  const emissiveColor = isPulse ? '#ffd700' : (isActive ? '#ffbb44' : (isGold ? '#b87333' : '#110c05'));
  const emissiveIntensity = isPulse ? 2.5 : (isActive ? 1.5 : (isGold ? 0.35 : 0.05));

  return (
    <group position={position} visible={!isHidden}>
      {/* Local warm gold point light inside grid records when active or pulsing */}
      {(isActive || isPulse) && (
        <pointLight position={[0, 0, 0.45]} intensity={3.0} distance={1.8} color="#ffbb44" />
      )}

      <group ref={spinGroupRef}>
        {/* Glowing border ring */}
        <mesh ref={ringRef} position={[0, 0, -0.015]}>
          <ringGeometry args={[0.67, 0.7, 64]} />
          <meshBasicMaterial color="#ffbb44" transparent opacity={0.3} depthWrite={false} />
        </mesh>

        {/* Record Cylinder (rotated to face camera) */}
        <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.66, 0.66, 0.04, 64]} />
          <meshStandardMaterial
            ref={materialRef}
            map={texture}
            bumpMap={textures.bump}
            bumpScale={0.008}
            roughness={isGold ? 0.22 : 0.65}
            metalness={isGold ? 0.25 : 0.1} // matte non-metallic for dark background records
            emissive={new THREE.Color(emissiveColor)}
            emissiveIntensity={emissiveIntensity}
          />
        </mesh>
      </group>
    </group>
  );
}

// Detached winning record with fly & flip & result rendering
function WinnerRecord3D({ gridPosition, gameState, resultData, textures, lang, t }) {
  const groupRef = useRef();
  const vinylGroupRef = useRef();
  const ringRef = useRef();
  const startTimeRef = useRef(null);
  const initialYRotationRef = useRef(0);

  useFrame((state, delta) => {
    if (gameState === 'winner_pulse') {
      // Pulse animation in grid position
      const pulse = 1.0 + Math.sin(state.clock.getElapsedTime() * 10) * 0.06;
      groupRef.current.scale.set(pulse, pulse, pulse);
      groupRef.current.position.copy(gridPosition);
      
      // Rotate record horizontally (around Y-axis) during pulse state
      groupRef.current.rotation.y += delta * 2.5;
      groupRef.current.rotation.x = 0;
      groupRef.current.rotation.z = 0;

      if (vinylGroupRef.current) {
        // Local Z rotation of the grooves
        vinylGroupRef.current.rotation.z += delta * 1.5;
      }
      if (ringRef.current) {
        ringRef.current.material.opacity = 0.8 + Math.sin(state.clock.getElapsedTime() * 12) * 0.2;
      }
    } else if (gameState === 'result') {
      if (startTimeRef.current === null) {
        startTimeRef.current = state.clock.getElapsedTime();
        // Capture initial Y rotation when entering result state
        initialYRotationRef.current = groupRef.current.rotation.y % (Math.PI * 2);
      }
      
      const elapsed = state.clock.getElapsedTime() - startTimeRef.current;
      const duration = 1.2; // 1.2 seconds fly-and-flip
      const progress = Math.min(elapsed / duration, 1.0);

      // Elastic ease-out-back interpolation
      const easeOutBack = (x) => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
      };

      const tVal = easeOutBack(progress);

      // Interpolate position to center
      groupRef.current.position.x = THREE.MathUtils.lerp(gridPosition.x, 0, tVal);
      groupRef.current.position.y = THREE.MathUtils.lerp(gridPosition.y, -0.2, tVal);
      groupRef.current.position.z = THREE.MathUtils.lerp(gridPosition.z, 2.3, tVal);

      // Interpolate scale (approx 3.1x size)
      const currentScale = THREE.MathUtils.lerp(1.0, 3.1, tVal);
      groupRef.current.scale.set(currentScale, currentScale, currentScale);

      // Interpolate Y rotation (horizontal flip)
      // Transition from initial angle to nearest odd multiple of Math.PI to show backside
      const targetY = initialYRotationRef.current > Math.PI ? Math.PI * 3 : Math.PI;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(initialYRotationRef.current, targetY, tVal);

      // Spin the vinyl itself
      if (vinylGroupRef.current) {
        vinylGroupRef.current.rotation.z += delta * 0.45; // Slow spin for background grooves
      }

      if (ringRef.current) {
        // Glowing orange ring aura around the winner record
        ringRef.current.material.opacity = 0.9;
        const auraPulse = 1.0 + Math.sin(state.clock.getElapsedTime() * 2) * 0.02;
        ringRef.current.scale.set(auraPulse, auraPulse, 1);
      }
    } else {
      // Hidden / Reset state
      startTimeRef.current = null;
      groupRef.current.position.copy(gridPosition);
      groupRef.current.scale.set(0.001, 0.001, 0.001); // Shrink out of view
      groupRef.current.rotation.set(0, 0, 0);
    }
  });

  const isVisible = gameState === 'winner_pulse' || gameState === 'result';
  const showResultOverlay = gameState === 'result' && resultData;

  return (
    <group ref={groupRef} visible={isVisible}>
      {/* Majestic warm gold point light attached to the winning record */}
      {isVisible && (
        <pointLight 
          position={[0, 0, 0.65]} 
          intensity={gameState === 'result' ? 5.0 : 3.0} 
          distance={gameState === 'result' ? 5.5 : 2.0} 
          color="#ffaa00" 
        />
      )}

      {/* Outer Glow Aura Ring */}
      <mesh ref={ringRef} position={[0, 0, -0.015]}>
        <ringGeometry args={[0.67, 0.72, 64]} />
        <meshBasicMaterial color="#ffaa00" transparent opacity={0.0} depthWrite={false} />
      </mesh>

      {/* Rotating Vinyl Disc Group */}
      <group ref={vinylGroupRef}>
        {/* Front Face (Gold) */}
        <mesh position={[0, 0, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.66, 0.66, 0.02, 64]} />
          <meshStandardMaterial
            map={textures.gold}
            bumpMap={textures.bump}
            bumpScale={0.008}
            roughness={0.15}
            metalness={0.25} // moderate metalness for maximum gold vibrancy
            emissive={new THREE.Color('#ffd700')}
            emissiveIntensity={gameState === 'winner_pulse' ? 2.5 : 0.5}
          />
        </mesh>

        {/* Back Face (Black Vinyl) */}
        <mesh position={[0, 0, -0.01]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.66, 0.66, 0.02, 64]} />
          <meshStandardMaterial
            map={textures.dark}
            bumpMap={textures.bump}
            bumpScale={0.008}
            roughness={0.22}
            metalness={0.3}
            emissive={new THREE.Color('#000000')}
            emissiveIntensity={0.0}
          />
        </mesh>
      </group>

      {/* Non-spinning, flipping HTML Result Container */}
      <group rotation={[0, Math.PI, 0]} position={[0, 0, -0.022]} scale={[0.87, 0.87, 1]} visible={showResultOverlay}>
        <Html
          transform
          occlude
          distanceFactor={1.5}
          pointerEvents="none"
          style={{
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'transparent',
            border: '2.5px solid rgba(255, 95, 0, 0.95)', // Bright Mastercard Orange neon ring core
            boxShadow: '0 0 35px rgba(255, 95, 0, 0.9), 0 0 70px rgba(235, 0, 27, 0.55), inset 0 0 25px rgba(255, 95, 0, 0.4)', // Soft orange-red neon bloom
            overflow: 'hidden'
          }}
        >
          {resultData && (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              padding: '2.5rem',
              color: '#fff',
              boxSizing: 'border-box'
            }}>
              {resultData.type === 'prize' ? (
                <>
                  <div style={{ 
                    width: '120px', 
                    height: '120px', 
                    background: 'linear-gradient(135deg, #222, #111)', 
                    borderRadius: '16px', 
                    border: '1px solid #444', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    marginBottom: '1rem', 
                    boxShadow: '0 0 20px rgba(0,0,0,0.8)' 
                  }}>
                    <span style={{ color: 'var(--mc-orange)', fontSize: '0.9rem', fontWeight: 'bold' }}>PRIZE IMAGE</span>
                  </div>
                  
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 400, lineHeight: 1.25, margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.95)' }}>
                    {t('result_win_1', { name: resultData.userData.name })}<br/>{t('result_win_2')}<br/>
                    <span style={{ color: 'var(--mc-orange)', fontWeight: 900, fontSize: '1.9rem', marginTop: '0.4rem', display: 'block', textTransform: 'uppercase', textShadow: '0 0 15px rgba(255,95,0,0.6)' }}>
                      {lang === 'uk' ? resultData.prize.name_uk : resultData.prize.name_en}
                    </span>
                  </h2>
                </>
              ) : (
                <>
                  <svg width="90" height="90" viewBox="0 0 24 24" fill="none" stroke="var(--mc-orange)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem', filter: 'drop-shadow(0 0 8px rgba(255,95,0,0.5))' }}>
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="2" x2="12" y2="4"></line>
                    <line x1="12" y1="20" x2="12" y2="22"></line>
                    <line x1="20" y1="12" x2="22" y2="12"></line>
                    <line x1="2" y1="12" x2="4" y2="12"></line>
                  </svg>
                  
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 400, lineHeight: 1.25, letterSpacing: '0.5px', margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.95)' }}>
                    {t('result_lose_1', { name: resultData.userData.name })}<br/>
                    {t('result_lose_2')}<br/>{t('result_lose_3')}
                  </h2>
                  
                  <div style={{ width: '30px', height: '1.5px', background: 'var(--mc-orange)', margin: '0.8rem auto' }}></div>
                  
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--mc-orange)', maxWidth: '300px', lineHeight: 1.3, margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.95)' }}>
                    {t(`result_no_prize_${resultData.messageIndex}`)}
                  </h3>
                </>
              )}
            </div>
          )}
        </Html>
      </group>
    </group>
  );
}

// Grid Container to handle viewport calculations and rendering all records
function RecordsGrid3D({ gameState, activeIndices, winnerIndex, resultData, textures, lang, t }) {
  const { width, height } = useThree((state) => state.viewport);
  
  // Calculate responsive spacing and scale
  const gridScale = Math.min(width / 8.8, height / 8.8);
  const spacing = 1.6;

  // Grid coordinates mapping
  const getGridPosition = (i) => {
    const col = i % 5;
    const row = Math.floor(i / 5);
    const x = (col - 2) * spacing;
    const y = (2 - row) * spacing;
    return new THREE.Vector3(x, y, 0);
  };

  const records = [];
  for (let i = 0; i < 25; i++) {
    const isActive = activeIndices.includes(i);
    const isPulse = gameState === 'winner_pulse' && winnerIndex === i;
    const isHidden = (gameState === 'result' || gameState === 'winner_pulse') && winnerIndex === i;
    const isDimmed = (gameState === 'result' && winnerIndex !== i) || gameState === 'name_entered';

    records.push(
      <Record3D
        key={i}
        index={i}
        position={getGridPosition(i)}
        gameState={gameState}
        isActive={isActive}
        isPulse={isPulse}
        isHidden={isHidden}
        isDimmed={isDimmed}
        textures={textures}
      />
    );
  }

  // Get 3D coordinate for the winning record
  const winnerPosition = winnerIndex >= 0 ? getGridPosition(winnerIndex) : new THREE.Vector3(0, 0, 0);

  return (
    <group scale={[gridScale, gridScale, 1]}>
      {records}
      <WinnerRecord3D
        gridPosition={winnerPosition}
        gameState={gameState}
        resultData={resultData}
        textures={textures}
        lang={lang}
        t={t}
      />
    </group>
  );
}

// Confetti removed by user request

export default function Tv3dView() {
  const [state, setState] = useState('idle'); // idle, name_entered, roulette, winner_pulse, result
  const [resultData, setResultData] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [activeIndices, setActiveIndices] = useState([]);
  const [winnerIndex, setWinnerIndex] = useState(-1);
  const { t, lang, setLang } = useLanguage();
  const intervalRef = useRef(null);
  const targetIdxRef = useRef(-1);

  // Load and cache high fidelity canvas textures
  const textures = useMemo(() => {
    const createTexture = (drawFn) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      drawFn(ctx, 512);
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };
    
    const createBumpTexture = (drawFn) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      drawFn(ctx, 512);
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.NoColorSpace; // Data texture, keep linear
      return texture;
    };
    
    return {
      gold: createTexture(drawGoldRecord),
      dark: createTexture(drawDarkRecord),
      bump: createBumpTexture(drawBumpMap)
    };
  }, []);

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
      
      targetIdxRef.current = targetIdx;

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
      setWinnerIndex(targetIdxRef.current);
      setActiveIndices([]);
      setState('winner_pulse');
      
      // Pulse in grid position for 2 seconds, then flip & fly to center
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

  const enableFullscreen = () => {
    // Left empty/disabled for testing convenience
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

      {/* Header */}
      {renderHeader()}

      {/* Screen Title (Idle State) */}
      {state === 'idle' && (
        <div className="fade-in" style={{ textAlign: 'center', marginBottom: '2.5rem', zIndex: 20 }}>
          <h1 style={{ fontSize: '5rem', color: '#fff', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '4px', fontFamily: 'Outfit' }}>
            {t('tv_main_title_1')}
          </h1>
          <h1 className="title" style={{ fontSize: '5.5rem', letterSpacing: '6px', marginBottom: 0 }}>
            {t('tv_main_title_2')}
          </h1>
        </div>
      )}

      {/* Grid container overlaying the 3D Canvas */}
      <div style={{ 
        flex: 1, 
        width: '100%', 
        position: 'relative',
        zIndex: 5, 
        outline: 'none', 
        marginBottom: '6rem'
      }}>
        <Canvas camera={{ position: [0, 0, 13], fov: 28 }}>
          <ambientLight intensity={0.7} color="#fff5ea" />
          {/* Warm metallic point lights to emphasize Gold and Copper */}
          <pointLight position={[0, 4, 6]} intensity={1.5} color="#ffbb44" />
          <pointLight position={[-6, 6, 4]} intensity={2.5} color="#d4af37" /> {/* Warm Metallic Gold */}
          <pointLight position={[6, -6, 4]} intensity={2.0} color="#ffaa44" />  {/* Warm Metallic Copper-Orange */}
          <pointLight position={[0, 0, 3]} intensity={2.0} color="#e5983b" />   {/* Soft copper highlight in center */}
          
          {/* Warm sunset environment for realistic golden/copper reflections without cold white glares */}
          <Environment preset="sunset" />
          
          <RecordsGrid3D
            gameState={state}
            activeIndices={activeIndices}
            winnerIndex={winnerIndex}
            resultData={resultData}
            textures={textures}
            lang={lang}
            t={t}
          />
        </Canvas>
      </div>

      {/* Footer */}
      {renderFooter()}

      {/* Welcome Screen Overlay */}
      {state === 'name_entered' && (
        <div className="tv-overlay fade-in" style={{ zIndex: 30 }}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            padding: '4rem 6rem',
            borderRadius: '32px',
            border: '2px solid rgba(255, 95, 0, 0.35)',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.95), 0 0 50px rgba(255, 95, 0, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '85%',
            textAlign: 'center'
          }}>
            <h1 style={{ fontSize: '6rem', color: '#fff', fontWeight: 900, fontFamily: 'Outfit', lineHeight: 1.2, margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              {t('tv_welcome_1', { name: playerName }).split('\n')[0]}<br/>
              {t('tv_welcome_1', { name: playerName }).split('\n')[1]}<br/>
              <span style={{ color: 'var(--mc-orange)', textShadow: '0 0 20px rgba(255, 95, 0, 0.4)' }}>{t('tv_welcome_1_highlight')}</span>
            </h1>
            <h2 style={{ fontSize: '3rem', marginTop: '2.5rem', color: 'rgba(255, 255, 255, 0.9)', fontFamily: 'Outfit', fontWeight: 500, margin: '2.5rem 0 0 0' }}>
              {t('tv_welcome_2')}
            </h2>
          </div>
        </div>
      )}

      {/* Roulette State Overlay */}
      {state === 'roulette' && (
        <div className="tv-overlay">
          <h1 className="title" style={{ fontSize: '8rem', letterSpacing: '5px', textShadow: '0 0 50px rgba(255,95,0,0.5)' }}>
            {t('ipad_btn_start')}
          </h1>
        </div>
      )}

      {/* Winner Result Overlay (Title) */}
      {state === 'result' && resultData && (
        <>
          {/* Dimmer background overlay (text is high contrast) */}
          <div className="tv-overlay fade-in" style={{ backgroundColor: 'rgba(0,0,0,0.5)', pointerEvents: 'none', zIndex: 1 }} />
          
          <h1 className="fade-in title" style={{ position: 'fixed', top: '10%', left: '50%', transform: 'translateX(-50%)', fontSize: '3.5rem', letterSpacing: '4px', zIndex: 10, fontWeight: 900, whiteSpace: 'nowrap' }}>
            <span style={{ color: '#fff' }}>{t('tv_main_title_1')}</span> {t('tv_main_title_3')}
          </h1>
        </>
      )}
    </div>
  );
}
