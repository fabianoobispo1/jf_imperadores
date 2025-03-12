'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, Phone, Send } from 'lucide-react'

import { Button } from '@/components/ui/button'

export const Contact = () => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  return (
    <motion.section
      id="contact"
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
          Faça Parte desta História
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="text-xl text-gray-300 mb-8">
            Juntos, podemos construir uma parceria sólida e frutífera para o desenvolvimento do
            Futebol Americano em nossa região.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-black/60 backdrop-blur-sm p-6 rounded-xl border border-primary/20">
              <Mail className="w-8 h-8 text-primary mb-4 mx-auto" />
              <p className="text-gray-300">contato@jfimperadores.com.br</p>
            </div>

            <div className="bg-black/60 backdrop-blur-sm p-6 rounded-xl border border-primary/20">
              <Phone className="w-8 h-8 text-primary mb-4 mx-auto" />
              <p className="text-gray-300">(32) 99164-6300</p>
            </div>
          </div>

          <Button
            onClick={() =>
              window.open(
                'https://wa.me/5532991646300?text=Olá! Tenho interesse em ser um patrocinador do JF Imperadores.'
              )
            }
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:scale-105 transition-transform group"
          >
            SEJA UM PATROCINADOR
            <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </motion.section>
  )
}
