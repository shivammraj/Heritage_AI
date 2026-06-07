import React, { useState } from 'react';
import { Camera, HelpCircle, MapPin, Loader2 } from 'lucide-react';

interface Props {
  src?: string;
  alt?: string;
  theme: string;
  className?: string;
  fallbackIcon?: 'camera' | 'question' | 'map';
  aspectRatio?: string;
}

const THEME_GRADIENT: Record<string, string> = {
  spirit:       'linear-gradient(135deg, #2D1B4E 0%, #8B2A1F 100%)',
  food:         'linear-gradient(135deg, #0F3D2A 0%, #7A5A10 100%)',
  festival:     'linear-gradient(135deg, #6B1A10 0%, #1A0A2E 100%)',
  nature:       'linear-gradient(135deg, #0A2D1E 0%, #12091E 100%)',
  architecture: 'linear-gradient(135deg, #12091E 0%, #5A4010 100%)',
};

export default function MysteryImage({
  src,
  alt = 'Cultural mystery artwork',
  theme,
  className = '',
  fallbackIcon = 'question',
  aspectRatio = '1/1',
}: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const gradient = THEME_GRADIENT[theme] ?? THEME_GRADIENT.spirit;

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  const showFallback = error || !src;

  return (
    <div
      className={`relative overflow-hidden w-full ${className}`}
      style={{
        aspectRatio,
        background: '#12091E',
        borderRadius: 'inherit',
      }}
    >
      {/* Fallback Graphic */}
      {showFallback ? (
        <div
          className="w-full h-full flex flex-col items-center justify-center p-4"
          style={{ background: gradient }}
        >
          {fallbackIcon === 'camera' && (
            <Camera className="text-chalk/20" size={48} />
          )}
          {fallbackIcon === 'map' && (
            <MapPin className="text-chalk/20" size={48} />
          )}
          {fallbackIcon === 'question' && (
            <span className="font-fraunces italic select-none text-chalk/15" style={{ fontSize: 72 }}>
              ?
            </span>
          )}
        </div>
      ) : (
        <>
          {/* Shimmer loading indicator */}
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-ink">
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(90deg, transparent 0%, rgba(232,160,32,0.07) 50%, transparent 100%)',
                }}
                className="animate-shimmer"
              />
              <Loader2 className="animate-spin text-turmeric/40" size={24} />
            </div>
          )}
          <img
            src={src}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              loading ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ display: 'block' }}
            loading="lazy"
          />
        </>
      )}
    </div>
  );
}
