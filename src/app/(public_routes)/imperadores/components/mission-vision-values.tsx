'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Target, Eye, Heart } from 'lucide-react'
import Image from 'next/image'
/* import Image from 'next/image'
 */
export const MissionVisionValues = () => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  const cards = [
    {
      title: 'Missão',
      icon: <Target className="w-12 h-12" />,
      content:
        'Promover a formação de cidadãos e atletas por meio de uma estrutura profissional, que vai além do esporte e incentiva valores como disciplina, superação e trabalho em equipe. \nNosso compromisso é fortalecer o futebol americano em Juiz de Fora, proporcionando oportunidades para jovens e adultos, e servindo como um instrumento de transformação social. Com planejamento e dedicação, buscamos aumentar nossa competitividade e consolidar o JF Imperadores como uma referência no esporte, levando com orgulho o nome da nossa cidade para todo o Brasil.',
    },
    {
      title: 'Visão',
      icon: <Eye className="w-12 h-12" />,
      content:
        'Ser um clube referência no futebol americano, reconhecido não apenas pela sua competitividade, mas também pelo compromisso em valorizar seus atletas e torcedores. Nosso objetivo é nos consolidar como um grande formador de talentos, promovendo o desenvolvimento esportivo e social. \nMais do que um time, queremos ser um agente de transformação, impactando vidas e criando oportunidades através do esporte.',
    },
    {
      title: 'Valores',
      icon: <Heart className="w-12 h-12" />,
      content:
        '🏆 Espírito Vencedor e Trabalho em Equipe – Acreditamos na força da união e na busca constante pela excelência, dentro e fora de campo. \n✅ Responsabilidade, Transparência e Ética – Agimos com integridade, respeito e compromisso, construindo uma base sólida para o crescimento do clube e de nossos atletas. \n🔥 Comprometimento, Empenho e Disciplina – Dedicamo-nos ao máximo para alcançar nossos objetivos, sempre com paixão pelo esporte e determinação para superar desafios.',
    },
  ]

  return (
    <motion.section
      ref={sectionRef}
      className="relative min-h-screen bg-black/90 overflow-hidden py-20"
    >
      <div className="absolute inset-0 bg-black/90">
        <Image
          src="/images/image_1.jpeg"
          alt="História JF Imperadores"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={75}
          loading="eager"
          className="object-cover opacity-20"
        />
        {/*    <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" /> */}
      </div>
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-primary/5 to-transparent" />
      </div>

      <div className="absolute -left-10 top-1/4 w-40 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent rotate-45" />
      <div className="absolute -right-10 top-3/4 w-40 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent -rotate-45" />

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-black/60 backdrop-blur-sm p-8 rounded-xl border border-primary/20 hover:border-primary/40 transition-all group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-primary mb-6 transform group-hover:scale-110 transition-transform">
                  {card.icon}
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">{card.title}</h3>
                {Array.isArray(card.content) ? (
                  <ul className="space-y-2 text-gray-300">
                    {card.content.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {card.content}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
