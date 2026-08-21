import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const RELATIONSHIPS = ['Mother', 'Father', 'Guardian', 'Grandparent', 'Other']

export default function FamilyProfile({ onSave, onClose, initialData }) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState(initialData || {
    guardian: { name: '', email: '', relationship: '' },
    child: { name: '', age: '', gender: '', birthDate: '' },
    consent: false,
  })

  const update = (section, field, value) => {
    setData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }))
  }

  const steps = [
    {
      title: "Parent / Guardian",
      subtitle: "We need an adult to keep things safe",
      content: (
        <div className="space-y-4">
          <div>
            <label className="text-purple-glow/50 text-xs block mb-1">Your Name</label>
            <input
              type="text"
              value={data.guardian.name}
              onChange={(e) => update('guardian', 'name', e.target.value)}
              placeholder="Your full name"
              maxLength={50}
              className="w-full bg-night-lighter/80 border border-purple/30 rounded-xl px-4 py-3 text-sm text-moon placeholder-purple-glow/30 focus:outline-none focus:border-purple-glow/60 transition-colors"
            />
          </div>
          <div>
            <label className="text-purple-glow/50 text-xs block mb-1">Email</label>
            <input
              type="email"
              value={data.guardian.email}
              onChange={(e) => update('guardian', 'email', e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-night-lighter/80 border border-purple/30 rounded-xl px-4 py-3 text-sm text-moon placeholder-purple-glow/30 focus:outline-none focus:border-purple-glow/60 transition-colors"
            />
          </div>
          <div>
            <label className="text-purple-glow/50 text-xs block mb-1">Relationship</label>
            <div className="flex flex-wrap gap-2">
              {RELATIONSHIPS.map(rel => (
                <button
                  key={rel}
                  onClick={() => update('guardian', 'relationship', rel)}
                  className={`px-4 py-2 rounded-full text-sm cursor-pointer transition-colors border ${
                    data.guardian.relationship === rel
                      ? 'bg-purple/30 border-purple-glow text-white'
                      : 'bg-night-lighter/50 border-purple/20 text-purple-glow/60 hover:border-purple/40'
                  }`}
                >
                  {rel}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
      valid: data.guardian.name.trim() && data.guardian.email.trim() && data.guardian.relationship,
    },
    {
      title: "About the Child",
      subtitle: "So we can make the experience just right",
      content: (
        <div className="space-y-4">
          <div>
            <label className="text-purple-glow/50 text-xs block mb-1">Child's Name</label>
            <input
              type="text"
              value={data.child.name}
              onChange={(e) => update('child', 'name', e.target.value)}
              placeholder="First name"
              maxLength={30}
              className="w-full bg-night-lighter/80 border border-purple/30 rounded-xl px-4 py-3 text-sm text-moon placeholder-purple-glow/30 focus:outline-none focus:border-purple-glow/60 transition-colors"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-purple-glow/50 text-xs block mb-1">Age</label>
              <select
                value={data.child.age}
                onChange={(e) => update('child', 'age', e.target.value)}
                className="w-full bg-night-lighter/80 border border-purple/30 rounded-xl px-4 py-3 text-sm text-moon focus:outline-none focus:border-purple-glow/60 transition-colors cursor-pointer"
              >
                <option value="">Select</option>
                {Array.from({ length: 10 }, (_, i) => i + 3).map(age => (
                  <option key={age} value={age}>{age} years</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-purple-glow/50 text-xs block mb-1">Gender</label>
              <select
                value={data.child.gender}
                onChange={(e) => update('child', 'gender', e.target.value)}
                className="w-full bg-night-lighter/80 border border-purple/30 rounded-xl px-4 py-3 text-sm text-moon focus:outline-none focus:border-purple-glow/60 transition-colors cursor-pointer"
              >
                <option value="">Select</option>
                <option value="girl">Girl</option>
                <option value="boy">Boy</option>
                <option value="other">Prefer not to say</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-purple-glow/50 text-xs block mb-1">Date of Birth</label>
            <input
              type="date"
              value={data.child.birthDate}
              onChange={(e) => update('child', 'birthDate', e.target.value)}
              className="w-full bg-night-lighter/80 border border-purple/30 rounded-xl px-4 py-3 text-sm text-moon focus:outline-none focus:border-purple-glow/60 transition-colors cursor-pointer"
            />
          </div>
        </div>
      ),
      valid: data.child.name.trim() && data.child.age,
    },
    {
      title: "Almost Done",
      subtitle: "One last thing to keep your little one safe",
      content: (
        <div className="space-y-4">
          <div className="bg-night-lighter/40 rounded-xl p-4 border border-purple/10 space-y-3">
            <p className="text-moon/70 text-sm">
              By setting up this family profile, you confirm that:
            </p>
            <ul className="text-purple-glow/50 text-xs space-y-2 ml-4 list-disc">
              <li>You are the parent or legal guardian of {data.child.name || 'the child'}</li>
              <li>You consent to {data.child.name || 'your child'} using CHERRI GROUP apps under your supervision</li>
              <li>You understand we store minimal data and never share it with third parties</li>
              <li>You can request deletion of all data at any time by emailing daydream@cherri.group</li>
            </ul>
          </div>

          <label className="flex items-start gap-3 cursor-pointer group">
            <div
              onClick={() => setData(prev => ({ ...prev, consent: !prev.consent }))}
              className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center cursor-pointer transition-colors ${
                data.consent
                  ? 'bg-purple border-purple-glow'
                  : 'border-purple/40 group-hover:border-purple-glow/60'
              }`}
            >
              {data.consent && (
                <svg width="12" height="10" viewBox="0 0 12 10" fill="white">
                  <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
                </svg>
              )}
            </div>
            <span
              onClick={() => setData(prev => ({ ...prev, consent: !prev.consent }))}
              className="text-moon/60 text-sm"
            >
              I am the parent/guardian and I consent to my child using CHERRI GROUP apps
            </span>
          </label>

          <div className="bg-purple/5 rounded-lg p-3 border border-purple/10">
            <p className="text-purple-glow/30 text-xs">
              CHERRI GROUP complies with COPPA (US), DPDP Act (India), and UK Age Appropriate Design Code.
              Your data stays in Firebase asia-south1 (Mumbai). No ads. No tracking. No third parties.
            </p>
          </div>
        </div>
      ),
      valid: data.consent,
    },
  ]

  const current = steps[step]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-night-light border border-purple/30 rounded-t-3xl sm:rounded-2xl p-6 w-full sm:max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="flex gap-1.5 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= step ? 'bg-purple-glow' : 'bg-night-lighter'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">👨‍👧</span>
          <h3 className="font-display text-xl text-gold">
            {current.title}
          </h3>
        </div>
        <p className="text-purple-glow/50 text-sm mb-6">
          {current.subtitle}
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {current.content}
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-3 mt-6">
          {step > 0 ? (
            <button
              onClick={() => setStep(s => s - 1)}
              className="px-5 py-2.5 rounded-full border border-purple/30 text-purple-glow/60 text-sm cursor-pointer hover:border-purple-glow/50 transition-colors"
            >
              Back
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-purple/30 text-purple-glow/60 text-sm cursor-pointer hover:border-purple-glow/50 transition-colors"
            >
              Later
            </button>
          )}
          <button
            onClick={() => {
              if (step < steps.length - 1) {
                setStep(s => s + 1)
              } else {
                onSave(data)
                onClose()
              }
            }}
            disabled={!current.valid}
            className="flex-1 bg-gradient-to-r from-purple to-purple-light text-white font-medium text-sm py-2.5 rounded-full cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {step < steps.length - 1 ? 'Next' : 'Save Profile'}
          </button>
        </div>

        <p className="text-purple-glow/20 text-[10px] text-center mt-4">
          You can update this anytime from Settings
        </p>
      </motion.div>
    </motion.div>
  )
}
