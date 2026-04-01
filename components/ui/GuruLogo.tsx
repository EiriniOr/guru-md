interface Props {
  size?: number
  className?: string
}

/**
 * Guru M.D. mascot — coronavirus particle with professor beard and walking cane.
 * ViewBox: 0 0 120 110
 * Body centre: (52, 46), radius 24
 * Spikes: 8 ball-tipped protein spikes (bottom two skipped for beard)
 * Cane extends from lower-right of body outward
 */
export function GuruLogo({ size = 44, className }: Props) {
  const C = { x: 52, y: 46 }   // body centre
  const BR = 24                  // body radius
  const SR = 13                  // spike shaft length
  const BALL = 4                 // spike ball radius

  // 8 spike angles (degrees, SVG convention: 0=right, 90=down, 270=up)
  // Skip 90° and 135° — beard area
  const spikes = [
    { a: 270, scale: 1 },   // straight up
    { a: 315, scale: 1 },   // upper-right
    { a: 0,   scale: 0.9 }, // right (slightly shorter — cane nearby)
    { a: 45,  scale: 0.6 }, // lower-right (short, cane area)
    { a: 180, scale: 1 },   // left
    { a: 225, scale: 1 },   // upper-left
  ]

  function toRad(deg: number) { return (deg * Math.PI) / 180 }
  function spikeEnd(a: number, scale: number) {
    const r = toRad(a)
    const ex = C.x + (BR + SR * scale) * Math.cos(r)
    const ey = C.y + (BR + SR * scale) * Math.sin(r)
    const sx = C.x + BR * Math.cos(r)
    const sy = C.y + BR * Math.sin(r)
    return { ex, ey, sx, sy }
  }

  return (
    <svg
      width={size}
      height={size * (110 / 120)}
      viewBox="0 0 120 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Guru M.D. — virus professor mascot"
    >
      {/* ── SPIKE SHAFTS (behind body) ── */}
      {spikes.map(({ a, scale }) => {
        const { ex, ey, sx, sy } = spikeEnd(a, scale)
        return (
          <line
            key={`shaft-${a}`}
            x1={sx} y1={sy} x2={ex} y2={ey}
            stroke="#15803d" strokeWidth="3.5" strokeLinecap="round"
          />
        )
      })}

      {/* ── BODY ── */}
      {/* Drop shadow */}
      <circle cx={C.x + 1.5} cy={C.y + 2} r={BR} fill="#052e16" opacity="0.35" />
      {/* Main body */}
      <circle cx={C.x} cy={C.y} r={BR} fill="#16a34a" />
      {/* Inner sheen ring */}
      <circle cx={C.x} cy={C.y} r={BR - 1} fill="none" stroke="#22c55e" strokeWidth="1.5" opacity="0.3" />
      {/* Highlight blob */}
      <ellipse cx={C.x - 8} cy={C.y - 10} rx={7} ry={5}
        fill="#4ade80" opacity="0.35" transform={`rotate(-30 ${C.x - 8} ${C.y - 10})`} />

      {/* ── SPIKE BALLS (in front of body) ── */}
      {spikes.map(({ a, scale }) => {
        const { ex, ey } = spikeEnd(a, scale)
        return (
          <g key={`ball-${a}`}>
            <circle cx={ex} cy={ey} r={BALL * scale} fill="#22c55e" />
            <circle cx={ex} cy={ey} r={BALL * scale} fill="none" stroke="#4ade80" strokeWidth="0.8" opacity="0.6" />
            {/* tiny shine on each ball */}
            <circle cx={ex - BALL * scale * 0.3} cy={ey - BALL * scale * 0.35}
              r={BALL * scale * 0.28} fill="white" opacity="0.4" />
          </g>
        )
      })}

      {/* ── EYEBROWS — bushy professor brows ── */}
      {/* Left brow — arched, thick */}
      <path d="M37 34 Q42 30.5 47 33.5"
        stroke="#f0fdf4" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      <path d="M37 34 Q42 30.5 47 33.5"
        stroke="white" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      {/* Right brow */}
      <path d="M57 33.5 Q62 30.5 67 34"
        stroke="#f0fdf4" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      <path d="M57 33.5 Q62 30.5 67 34"
        stroke="white" strokeWidth="1.4" strokeLinecap="round" fill="none" />

      {/* ── EYES ── */}
      {/* Left eye white */}
      <ellipse cx="42" cy="40" rx="5" ry="5.5" fill="white" />
      {/* Right eye white */}
      <ellipse cx="62" cy="40" rx="5" ry="5.5" fill="white" />
      {/* Left pupil */}
      <circle cx="43" cy="41" r="3" fill="#14532d" />
      {/* Right pupil */}
      <circle cx="63" cy="41" r="3" fill="#14532d" />
      {/* Iris detail */}
      <circle cx="43" cy="41" r="1.6" fill="#052e16" />
      <circle cx="63" cy="41" r="1.6" fill="#052e16" />
      {/* Eye shine */}
      <circle cx="44.5" cy="39.2" r="1.1" fill="white" />
      <circle cx="64.5" cy="39.2" r="1.1" fill="white" />
      {/* Lower shine */}
      <circle cx="42.5" cy="43" r="0.6" fill="white" opacity="0.5" />
      <circle cx="62.5" cy="43" r="0.6" fill="white" opacity="0.5" />

      {/* ── NOSE ── */}
      <ellipse cx="52" cy="47.5" rx="2" ry="1.4" fill="#14532d" opacity="0.7" />

      {/* ── MOUSTACHE ── */}
      <path d="M44 50.5 Q48 48.5 52 49.5 Q56 48.5 60 50.5"
        stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* ── SMILE ── */}
      <path d="M45 53 Q52 58.5 59 53"
        stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* ── BEARD ── */}
      {/* Beard base shape — wide bib flowing from chin */}
      <path
        d="M39 57
           Q35 60 33 65
           Q31 71 34 76
           Q36 80 40 81
           Q44 83 48 82
           Q53 81 57 79
           Q61 76 63 72
           Q65 67 63 62
           Q61 59 58 57
           Z"
        fill="white"
        opacity="0.95"
      />
      {/* Beard inner shading */}
      <path
        d="M41 59
           Q38 63 37 68
           Q36 73 39 77
           Q42 80 48 80
           Q54 80 58 76
           Q61 72 60 66
           Q59 61 57 59
           Z"
        fill="#f0fdf4"
        opacity="0.6"
      />
      {/* Beard strand lines */}
      <path d="M42 60 Q41 67 42 75" stroke="#d1fae5" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M48 61 Q47 68 48 78" stroke="#d1fae5" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M54 60 Q55 67 54 75" stroke="#d1fae5" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7" />
      {/* Wavy beard bottom */}
      <path d="M34 76 Q37 80 40 77 Q43 80 47 79 Q51 82 55 79 Q58 81 63 75"
        fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

      {/* ── WALKING CANE ── */}
      {/* Cane arm: starts from right side of body, goes out at angle */}
      {/* Shaft: from right-lower body area down-right */}
      <line x1="71" y1="55" x2="93" y2="90"
        stroke="#92400e" strokeWidth="3" strokeLinecap="round" />
      {/* Shaft highlight */}
      <line x1="71" y1="55" x2="93" y2="90"
        stroke="#d97706" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      {/* J-handle at top — curving back to the left */}
      <path d="M71 55 Q67 46 72 40 Q76 36 80 39"
        stroke="#92400e" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M71 55 Q67 46 72 40 Q76 36 80 39"
        stroke="#d97706" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.5" />
      {/* Handle grip end cap */}
      <circle cx="80" cy="39" r="2.5" fill="#92400e" />
      <circle cx="80" cy="39" r="1.2" fill="#d97706" />
      {/* Cane tip rubber tip */}
      <ellipse cx="93" cy="90" rx="2.5" ry="2" fill="#44403c" />
    </svg>
  )
}
