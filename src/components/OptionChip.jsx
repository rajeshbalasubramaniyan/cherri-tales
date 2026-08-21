import { motion } from 'framer-motion'

export default function OptionChip({ emoji, label, selected, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium
        transition-colors cursor-pointer border-2
        ${selected
          ? 'bg-purple/40 border-purple-glow text-white shadow-[0_0_15px_rgba(167,139,250,0.3)]'
          : 'bg-night-lighter/50 border-night-lighter/50 text-purple-glow/80 hover:border-purple/40'
        }
      `}
    >
      <span className="text-xl">{emoji}</span>
      <span>{label}</span>
    </motion.button>
  )
}
