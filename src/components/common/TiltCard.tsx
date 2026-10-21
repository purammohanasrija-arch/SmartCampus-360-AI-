import React, { useRef, useState, useCallback, useEffect } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // Maximum tilt angle in degrees (subtle default ~7-8 deg)
  perspective?: number; // CSS perspective distance in pixels
  scale?: number; // Hover zoom scale (default 1.02)
  glare?: boolean; // Dynamic light reflection sheen
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function TiltCard({
  children,
  className = '',
  maxTilt = 8,
  perspective = 1000,
  scale = 1.02,
  glare = true,
  onClick,
  style = {}
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<string>('');
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [glareState, setGlareState] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0
  });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Subtle, high-fidelity rotation calculations
      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      setTransformStyle(
        `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`
      );

      if (glare) {
        setGlareState({
          x: (x / rect.width) * 100,
          y: (y / rect.height) * 100,
          opacity: 0.18
        });
      }
    },
    [maxTilt, perspective, scale, glare, prefersReducedMotion]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle(`perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
    setGlareState(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transformStyle: 'preserve-3d',
        transition: isHovered
          ? 'transform 0.12s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.12s ease-out'
          : 'transform 0.4s cubic-bezier(0.2, 1, 0.3, 1), box-shadow 0.4s ease-out',
        ...style
      }}
      className={`relative group ${className}`}
    >
      {/* Card Content with 3D context preserved for nested layers */}
      <div 
        style={{ transformStyle: 'preserve-3d' }} 
        className="w-full h-full relative"
      >
        {children}

        {/* Dynamic Light Reflection Sheen (confined within card border radius) */}
        {glare && (
          <div
            className="absolute inset-0 pointer-events-none rounded-[inherit] transition-opacity duration-300 z-10"
            style={{
              opacity: glareState.opacity,
              background: `radial-gradient(circle 320px at ${glareState.x}% ${glareState.y}%, rgba(255, 255, 255, 0.4), rgba(168, 85, 247, 0.15) 30%, transparent 75%)`,
            }}
          />
        )}
      </div>
    </div>
  );
}

/**
 * ParallaxLayer: Floats nested elements at specified Z-depth relative to parent card plane.
 * As the parent TiltCard rotates, higher z elements exhibit realistic physical parallax.
 */
interface ParallaxLayerProps {
  children: React.ReactNode;
  z?: number; // Translation along Z-axis in pixels (e.g. 10 for text, 24 for numbers, 35 for badges)
  className?: string;
  style?: React.CSSProperties;
}

export function ParallaxLayer({
  children,
  z = 16,
  className = '',
  style = {}
}: ParallaxLayerProps) {
  return (
    <div
      style={{
        transform: `translateZ(${z}px)`,
        transformStyle: 'preserve-3d',
        ...style
      }}
      className={`transition-transform duration-150 ease-out ${className}`}
    >
      {children}
    </div>
  );
}
