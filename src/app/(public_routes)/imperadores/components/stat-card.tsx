import { motion } from 'framer-motion'

import { Counter } from './counter'

interface StatCardProps {
  number: string
  label: string
  icon: React.ReactNode
  description: string
  isInView?: boolean
  delay?: number
}

export const StatCard = ({
  number,
  label,
  icon,
  description,
  isInView = false,
  delay = 0,
}: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-primary/20 hover:border-primary/40 transition-all group"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-primary/10 rounded-lg text-primary group-hover:bg-primary/20 transition-colors">
          {icon}
        </div>
      </div>

      <div className="space-y-2">
        <Counter value={number} className="text-4xl font-bold text-primary" />

        <h3 className="text-xl font-semibold text-white">{label}</h3>

        <p className="text-gray-400 text-sm">{description}</p>
      </div>

      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: '100%' } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="h-0.5 bg-gradient-to-r from-primary/50 to-transparent mt-4"
      />
    </motion.div>
  )
}
