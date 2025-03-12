'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

export const ConquistasSection = () => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.2,
  })

  const conquistasItems = [
    {
      title: 'Títulos Estaduais',
      content:
        'Vice campeão Mineiro 2017\nCampeão da Copa Ouro 2019\nVice campeão do Gerais Bowl 2022 e 2023\nCampeão do Gerais Bowl 2024',
    },
    {
      title: 'Títulos Regionais',
      content: 'Campeão do Sudeste na Liga Nacional de Futebol Americano em 2017 (3° Nacional)',
    },

    {
      title: 'Títulos Nacionais',
      content: 'Campeão do Brasileirão D2 2022',
    },
  ]
  return (
    <motion.section ref={sectionRef} className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 bg-black/90">
        <Image
          src="/images/DSC_0219.jpg"
          alt="História JF Imperadores"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={75}
          loading="eager"
          className="object-cover opacity-20"
        />
        {/*    <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" /> */}
      </div>

      {/* Golden Details */}
      {/*       <div className="absolute inset-0">
        <div className="absolute top-0 w-full h-20 bg-gradient-to-b from-primary/10 to-transparent" />
        <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-primary/10 to-transparent" />
      </div> */}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center text-primary mb-16"
        >
          Conquistas
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8 relative">
          {conquistasItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-black/60 backdrop-blur-sm p-8 rounded-xl border border-primary/20 hover:border-primary/40 transition-all"
            >
              <h3 className="text-2xl font-bold text-primary mb-4">{item.title}</h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">{item.content}</p>
              <div className="h-1 w-20 bg-primary/50 mt-4" />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
