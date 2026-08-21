import { motion } from 'framer-motion'

export default function ParentSettings({ onClose, onOpenProfile, hasProfile }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-night-light border border-purple/30 rounded-2xl p-6 w-full max-w-md"
      >
        <h3 className="font-display text-2xl text-gold mb-4">
          Parent Settings
        </h3>

        <div className="space-y-4">
          <button
            onClick={onOpenProfile}
            className="w-full bg-night-lighter/40 border border-purple/10 rounded-xl p-4 cursor-pointer hover:border-purple/30 transition-colors text-left group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-moon/70 text-sm font-medium">
                  👨‍👧 Family Profile
                </p>
                <p className="text-purple-glow/40 text-xs mt-0.5">
                  {hasProfile ? 'Profile saved. Tap to update.' : 'Set up parent & child info'}
                </p>
              </div>
              <span className="text-purple-glow/30 group-hover:text-purple-glow/60 transition-colors">
                {hasProfile ? '✓' : '→'}
              </span>
            </div>
          </button>

          <div className="bg-night-lighter/40 rounded-xl p-4 border border-purple/10">
            <p className="text-moon/60 text-sm font-medium mb-1">About CHERRI TALES</p>
            <p className="text-purple-glow/40 text-xs">
              Stories are generated using AI, personalized from your child's imagination.
              No ads, no tracking, no third-party data sharing.
              All content is filtered for age-appropriateness.
            </p>
          </div>

          <div className="bg-night-lighter/40 rounded-xl p-4 border border-purple/10">
            <p className="text-moon/60 text-sm font-medium mb-1">Contact</p>
            <p className="text-purple-glow/40 text-xs">
              Questions or feedback? Email us at daydream@cherri.group
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple to-purple-light text-white font-medium text-sm py-2.5 rounded-full cursor-pointer"
          >
            Done
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
