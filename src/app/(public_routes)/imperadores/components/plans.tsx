'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Crown, Shield, Award } from 'lucide-react'

export const Plans = () => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  const plans = [
    {
      title: 'Plano Imperial 👑',
      price: '40.000',
      icon: <Crown className="w-12 h-12" />,
      features: [
        'Logo principal no uniforme (30x20cm)',
        '4 placas de campo premium',
        '3 posts exclusivos semanais',
        'Ativações VIP em todos os jogos',
      ],
    },
    {
      title: 'Plano Ouro ⚔️',
      price: '25.000',
      icon: <Award className="w-12 h-12" />,
      features: [
        'Logo na manga do uniforme (15x15cm)',
        '2 placas de campo',
        '2 posts exclusivos semanais',
        'Ativações VIP em 4 jogos',
      ],
    },
    {
      title: 'Plano Prata 🛡️',
      price: '12.000',
      icon: <Shield className="w-12 h-12" />,
      features: [
        'Logo na parte traseira (10x10cm)',
        '1 placa de campo',
        '1 post exclusivo semanal',
        'Ativações VIP em 2 jogos',
      ],
    },
  ]

  return (
    <motion.section
      ref={sectionRef}
      className="relative min-h-screen bg-black/90 overflow-hidden py-20"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-primary/5 to-transparent" />
      </div>

      <div className="absolute -left-10 top-1/4 w-40 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent rotate-45" />
      <div className="absolute -right-10 top-3/4 w-40 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent -rotate-45" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center text-primary mb-16"
        >
          Planos de Investimento
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-black/60 backdrop-blur-sm p-8 rounded-xl border border-primary/20 hover:border-primary/40 transition-all group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-primary mb-6 transform group-hover:scale-110 transition-transform">
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-bold text-primary mb-2">{plan.title}</h3>
                <p className="mb-6">
                  <span className="text-4xl font-bold text-white">
                    R${' '}
                    {Math.round(parseInt(plan.price.replace(/\D/g, '')) / 12).toLocaleString(
                      'pt-BR'
                    )}
                  </span>
                  <span className="text-lg text-gray-400">/mês</span>
                  <br />
                  <span className="text-sm text-gray-400">
                    (R$ {parseInt(plan.price).toLocaleString('pt-BR')} mil anual)
                  </span>
                </p>
                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-300">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
