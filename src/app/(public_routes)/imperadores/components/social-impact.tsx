'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Users, Heart, Trophy } from 'lucide-react'
import Image from 'next/image'

export const SocialImpact = () => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  return (
    <motion.section ref={sectionRef} className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 bg-black/90">
        <Image
          src="/images/994B1403.jpg"
          alt="História JF Imperadores"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={75}
          loading="eager"
          className="object-cover opacity-20"
        />
        {/*    <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" /> */}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center text-primary mb-16"
        >
          Imperadores do Bem
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-primary">
              Transformando Vidas Através do Esporte
            </h3>
            <p className="text-gray-300 leading-relaxed">
              O projeto Imperadores do Bem tem a missão de levar o futebol americano para as
              periferias de Juiz de Fora. Através de ações sociais são apresentados os valores do
              futebol americano com o objetivo de desenvolver as crianças através do esporte e
              formar possíveis atletas para o futuro.
            </p>
            <div className="flex gap-4">
              <div className="p-4 bg-black/40 rounded-lg border border-primary/20">
                <Users className="w-8 h-8 text-primary mb-2" />
                <p className="text-sm text-gray-300">Atendimento a comunidades</p>
              </div>
              <div className="p-4 bg-black/40 rounded-lg border border-primary/20">
                <Heart className="w-8 h-8 text-primary mb-2" />
                <p className="text-sm text-gray-300">Desenvolvimento social</p>
              </div>
              <div className="p-4 bg-black/40 rounded-lg border border-primary/20">
                <Trophy className="w-8 h-8 text-primary mb-2" />
                <p className="text-sm text-gray-300">Formação de atletas</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-black/60 backdrop-blur-sm p-8 rounded-xl border border-primary/20"
          >
            <h4 className="text-xl font-bold text-primary mb-4">Áreas de Atuação</h4>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full" />
                Bairro Marumbi
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full" />
                Bairro Bom Jardim
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
