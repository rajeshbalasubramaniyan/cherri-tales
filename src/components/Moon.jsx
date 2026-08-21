import { motion } from 'framer-motion'

export default function Moon({ size = 120 }) {
  return (
    <motion.div
      className="relative"
      style={{ width: size, height: size }}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 0 35px rgba(245,240,225,0.5)) drop-shadow(0 0 70px rgba(245,240,225,0.2))' }}
      >
        <defs>
          <mask id="crescentMask">
            <circle cx="60" cy="60" r="50" fill="white" />
            <circle cx="78" cy="50" r="42" fill="black" />
          </mask>
          <radialGradient id="moonGlow" cx="40%" cy="40%">
            <stop offset="0%" stopColor="#FFFEF5" />
            <stop offset="60%" stopColor="#F5F0E1" />
            <stop offset="100%" stopColor="#E8DFC8" />
          </radialGradient>
        </defs>
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="url(#moonGlow)"
          mask="url(#crescentMask)"
        />
      </svg>
    </motion.div>
  )
}
