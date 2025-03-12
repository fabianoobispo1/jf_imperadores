'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export const Benefits = () => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  const benefitCards = [
    {
      title: 'Visibilidade Premium',
      items: [
        'Exposição em Uniformes Oficiais: Sua marca estará presente em um dos maiores símbolos do time, proporcionando visibilidade constante e imediata.',
        'Presença em Materiais Promocionais: Logo em banners, posters e outros materiais, garantindo que sua marca seja vista em diferentes contextos de marketing.',
        'Divulgação em Eventos Esportivos: Participação em competições e eventos de grande porte, com destaque para sua marca durante todas as ativações.',
        'Alcance de Público Diversificado: Acesso a um público fiel e engajado, composto por jovens, adultos e famílias, tanto em jogos quanto em outras atividades do time.',
      ],
    },
    {
      title: 'Engajamento Comunitário',
      items: [
        'Associação com um Projeto Social e Esportivo: Ao apoiar o time, sua marca se associa a um projeto que promove transformação social e o desenvolvimento de jovens através do esporte.',
        'Promoção da Saúde e Bem-Estar: Apoio a uma equipe que valoriza a saúde física e mental dos seus atletas e da comunidade.',
        'Participação em Eventos Comunitários: Envolvimento em ações que aproximam a marca da população local, reforçando o impacto positivo que sua empresa gera.',
        'Impacto Social Positivo: O apoio ao JF Imperadores vai além do esporte, contribuindo diretamente para a ascensão social de jovens e adultos em situação de vulnerabilidade.',
      ],
    },
    {
      title: 'Marketing Digital e Alcance Nacional',
      items: [
        'Presença nas Redes Sociais da Equipe: Sua marca será promovida nas principais plataformas digitais do time, com destaque para ações que envolvem engajamento online.',
        'Conteúdo Exclusivo Personalizado: Desenvolvimento de campanhas e postagens personalizadas para integrar sua marca com a comunidade esportiva.',
        'Campanhas Digitais Integradas: Planejamento de ações em conjunto com o time, criando experiências de promoção digital para aumentar o alcance e fortalecer sua presença.',
        'Alcance Orgânico Qualificado: Através da nossa base de fãs e seguidores, sua marca terá um alcance orgânico e qualificado, com maior potencial de conversão.',
        'Alcance Nacional: Com a transmissão do Campeonato Mineiro pela Bandsports, sua marca ganha visibilidade em um cenário nacional, alcançando fãs e espectadores em todo o Brasil.',
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
          Benefícios aos Patrocinadores
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {benefitCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-black/60 backdrop-blur-sm p-8 rounded-xl border border-primary/20 hover:border-primary/40 transition-all group"
            >
              <h3 className="text-2xl font-bold text-primary mb-6">{card.title}</h3>
              <ul className="space-y-4">
                {card.items.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-gray-300">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
