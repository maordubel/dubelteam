/** The signature motif: a hand-drawn red crack-thread. Used as divider, frame and progress. */
export function ThreadRule({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 24" preserveAspectRatio="none" className={`block h-6 w-full ${className}`} aria-hidden="true">
      <path
        d="M0 12 L80 10 L118 16 L170 9 L240 14 L290 6 L300 18 L312 8 L360 13 L430 10 L470 16 L540 11 L600 13"
        fill="none"
        stroke="var(--thread)"
        strokeWidth="2.5"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

/** A short knot of thread — end-of-chapter mark. */
export function ThreadKnot({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 40" className={`h-10 w-28 ${className}`} aria-hidden="true">
      <path
        d="M0 20 L34 18 L46 26 C 60 40, 74 2, 58 8 C 44 14, 66 34, 80 22 L120 20"
        fill="none"
        stroke="var(--thread)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
