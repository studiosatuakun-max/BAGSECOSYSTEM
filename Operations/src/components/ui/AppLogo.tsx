import React from 'react';

interface AppLogoProps {
  src?: string;
  size?: number;
  iconName?: string;
  className?: string;
  onClick?: () => void;
}

export default function AppLogo({
  size = 64,
  className = '',
  onClick,
}: AppLogoProps) {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-xl overflow-hidden shrink-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ width: size, height: size }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* ATEX-inspired hexagon logo mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="64" height="64" rx="14" fill="#0f172a" />
        {/* Outer hexagon */}
        <polygon
          points="32,8 52,19 52,45 32,56 12,45 12,19"
          stroke="#10b981"
          strokeWidth="1.5"
          fill="none"
          strokeLinejoin="round"
        />
        {/* Inner hexagon filled */}
        <polygon
          points="32,16 46,24 46,40 32,48 18,40 18,24"
          fill="#10b981"
          fillOpacity="0.18"
          stroke="#10b981"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        {/* Safety slash */}
        <line
          x1="22"
          y1="22"
          x2="44"
          y2="44"
          stroke="#f43f5e"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Center dot */}
        <circle cx="32" cy="32" r="3" fill="#34d399" />
      </svg>
    </div>
  );
}