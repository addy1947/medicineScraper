import React from 'react';

export default function MedicinePlaceholder({ className = "w-12 h-12" }) {
  return (
    <svg 
      className={className}
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle cx="32" cy="32" r="32" fill="#F3F4F6"/>
      
      {/* Pill/Capsule */}
      <g transform="translate(16, 20)">
        {/* Left half of capsule (darker) */}
        <path 
          d="M8 4 C8 1.79086 9.79086 0 12 0 L16 0 L16 24 L12 24 C9.79086 24 8 22.2091 8 20 L8 4 Z" 
          fill="#EF4444"
        />
        
        {/* Right half of capsule (lighter) */}
        <path 
          d="M16 0 L20 0 C22.2091 0 24 1.79086 24 4 L24 20 C24 22.2091 22.2091 24 20 24 L16 24 L16 0 Z" 
          fill="#FCA5A5"
        />
        
        {/* Center line */}
        <line x1="16" y1="0" x2="16" y2="24" stroke="#DC2626" strokeWidth="0.5"/>
        
        {/* Small decorative circles on left half */}
        <circle cx="12" cy="8" r="1.5" fill="#DC2626" opacity="0.6"/>
        <circle cx="12" cy="12" r="1.5" fill="#DC2626" opacity="0.6"/>
        <circle cx="12" cy="16" r="1.5" fill="#DC2626" opacity="0.6"/>
      </g>
    </svg>
  );
}
