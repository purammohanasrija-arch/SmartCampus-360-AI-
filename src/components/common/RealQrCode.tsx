import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface RealQrCodeProps {
  value: string;
  size?: number;
  className?: string;
  darkColor?: string;
  lightColor?: string;
  level?: 'L' | 'M' | 'Q' | 'H';
  margin?: number;
  showScanline?: boolean;
}

export function RealQrCode({
  value,
  size = 180,
  className = '',
  darkColor = '#020617',
  lightColor = '#ffffff',
  level = 'M',
  margin = 1,
  showScanline = false
}: RealQrCodeProps) {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    QRCode.toDataURL(value, {
      width: Math.max(size * 2, 256), // High DPI rendering for razor-sharp clarity
      margin,
      errorCorrectionLevel: level,
      color: {
        dark: darkColor,
        light: lightColor
      }
    })
      .then(url => {
        if (isMounted) {
          setDataUrl(url);
        }
      })
      .catch(err => {
        console.error('Failed to generate authentic QR code:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [value, size, darkColor, lightColor, level, margin]);

  return (
    <div 
      className={`relative inline-flex items-center justify-center overflow-hidden ${className}`}
      style={{ width: size, height: size }}
      title={`Scannable QR: ${value}`}
    >
      {dataUrl ? (
        <img 
          src={dataUrl} 
          alt={`QR Code: ${value}`}
          className="w-full h-full object-contain block select-none rounded-lg"
        />
      ) : (
        <div className="w-full h-full bg-slate-100 animate-pulse rounded-lg flex items-center justify-center text-[10px] text-slate-400 font-mono">
          Generating QR...
        </div>
      )}

      {showScanline && (
        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-lg shadow-cyan-400 animate-scan pointer-events-none" />
      )}
    </div>
  );
}
