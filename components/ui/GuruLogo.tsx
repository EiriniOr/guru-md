interface Props {
  size?: number
  className?: string
}

export function GuruLogo({ size = 40, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Guru M.D. virus mascot"
    >
      {/* === SPIKES === */}
      {/* Top */}
      <ellipse cx="40" cy="8" rx="3" ry="6" fill="#4ade80" transform="rotate(0 40 40)" />
      {/* Top-right */}
      <ellipse cx="40" cy="8" rx="3" ry="6" fill="#4ade80" transform="rotate(45 40 40)" />
      {/* Right */}
      <ellipse cx="40" cy="8" rx="3" ry="6" fill="#4ade80" transform="rotate(90 40 40)" />
      {/* Bottom-right — shortened to make room for cane */}
      <ellipse cx="40" cy="8" rx="3" ry="5" fill="#4ade80" transform="rotate(135 40 40)" />
      {/* Bottom — shortened for beard area */}
      <ellipse cx="40" cy="8" rx="3" ry="4" fill="#4ade80" transform="rotate(180 40 40)" />
      {/* Bottom-left */}
      <ellipse cx="40" cy="8" rx="3" ry="4" fill="#4ade80" transform="rotate(225 40 40)" />
      {/* Left */}
      <ellipse cx="40" cy="8" rx="3" ry="6" fill="#4ade80" transform="rotate(270 40 40)" />
      {/* Top-left */}
      <ellipse cx="40" cy="8" rx="3" ry="6" fill="#4ade80" transform="rotate(315 40 40)" />

      {/* === BODY === */}
      <circle cx="40" cy="40" r="20" fill="#16a34a" />
      {/* Body sheen */}
      <ellipse cx="34" cy="33" rx="5" ry="3.5" fill="#22c55e" opacity="0.4" transform="rotate(-20 34 33)" />

      {/* === EYES === */}
      <ellipse cx="34" cy="37" rx="4" ry="4.5" fill="white" />
      <ellipse cx="46" cy="37" rx="4" ry="4.5" fill="white" />
      {/* Pupils */}
      <circle cx="35" cy="38" r="2.2" fill="#14532d" />
      <circle cx="47" cy="38" r="2.2" fill="#14532d" />
      {/* Eye shine */}
      <circle cx="36" cy="36.5" r="0.8" fill="white" />
      <circle cx="48" cy="36.5" r="0.8" fill="white" />

      {/* === EYEBROWS (old man) === */}
      <path d="M30 32 Q34 30 38 32" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M42 32 Q46 30 50 32" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" />

      {/* === NOSE === */}
      <ellipse cx="40" cy="43" rx="1.5" ry="1" fill="#14532d" />

      {/* === SMILE === */}
      <path d="M35 47 Q40 51 45 47" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" />

      {/* === BEARD === */}
      {/* Moustache */}
      <path d="M35 45.5 Q37.5 44 40 45 Q42.5 44 45 45.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      {/* Beard body - wavy strands */}
      <path d="M32 51 Q31 56 33 60 Q35 64 37 62 Q38 60 40 61 Q42 60 43 62 Q45 64 47 60 Q49 56 48 51"
        fill="white" opacity="0.9" />
      {/* Beard texture lines */}
      <path d="M36 53 Q36 57 37 60" stroke="#d1fae5" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d="M40 53 Q40 57 40 61" stroke="#d1fae5" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d="M44 53 Q44 57 43 60" stroke="#d1fae5" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.6" />

      {/* === WALKING CANE === */}
      {/* Cane shaft */}
      <line x1="55" y1="52" x2="66" y2="73" stroke="#a16207" strokeWidth="2.5" strokeLinecap="round" />
      {/* Cane handle (J-curve) */}
      <path d="M55 52 Q52 46 57 44" stroke="#a16207" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Cane tip */}
      <circle cx="66" cy="73" r="1.5" fill="#a16207" />
    </svg>
  )
}
