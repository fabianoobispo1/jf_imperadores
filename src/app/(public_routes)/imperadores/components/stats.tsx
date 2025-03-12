'use client'

import { HistoryIcon } from 'lucide-react'
import { useRef } from 'react'
import { useInView, motion } from 'framer-motion'

import { StatCard } from './stat-card'
import { AthleteIcon } from './icons/athlete-icon'
import { TrophyIcon } from './icons/trophy-icon'
import { FansIcon } from './icons/fans-icon'

export const StatsSection = () => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.3,
  })

  const stats = [
    {
      number: '8+',
      label: 'Anos de História',
      icon: <HistoryIcon />,
      description: 'Surgiu da fusão entre JF Mamutes e Juiz de Fora Red Fox',
    },
    {
      number: '200+',
      label: 'Atletas Formados',
      icon: <AthleteIcon />,
      description:
        'Modalidades Tackle (Fullpads), Flag Football 5v5 Masculino e Flag Football 5v5 Feminino',
    },
    {
      number: '40+',
      label: 'Jogos Oficiais',
      icon: <TrophyIcon />,
      description: 'Conquistas importantes',
    },
    {
      number: '5000+',
      label: 'Torcedores',
      icon: <FansIcon />,
      description: 'Seja onde o Império for jogar, conosco nossa torcida estará!',
    },
  ]

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="py-20 bg-black/90 min-h-screen flex items-center"
    >
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          initial={{ y: -20 }}
          animate={isInView ? { y: 0 } : { y: -20 }}
          transition={{ duration: 0.7 }}
          className="text-4xl font-bold text-center mb-16 text-primary"
        >
          Nossa História em Números
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} isInView={isInView} delay={index * 0.2} />
          ))}
        </div>

        <motion.div
          initial={{ y: 20 }}
          animate={isInView ? { y: 0 } : { y: 20 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-xl text-gray-300">Junte-se a nós nessa jornada de sucesso</p>
        </motion.div>
      </div>
    </motion.section>
  )
}
