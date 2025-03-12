'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

export const HistorySection = () => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.2,
  })

  const historyItems = [
    {
      title: 'JF Imperadores: 8 Anos de Paixão pelo Futebol Americano',
      content:
        'Em fevereiro de 2025, o JF Imperadores completa oito anos de fundação! Nossa história começou com a fusão de duas equipes de Juiz de Fora: o JF Mamutes e o Juiz de Fora Red Fox.\nAntes da união, ambas as equipes competiam na modalidade NoPads (sem capacete e ombreira).\nCom a fusão, nasceu a oportunidade de evoluir para a modalidade FullPads, permitindo que nossos atletas jogassem com todos os equipamentos oficiais, elevando o nível do esporte na cidade.\nHoje, seguimos crescendo e fortalecendo o futebol americano em Juiz de Fora. Venha fazer parte dessa história!',
    },
    {
      title: 'Nosso Nome: Uma Homenagem à História',
      content:
        'O nome "Imperadores" é uma referência ao Brasil Imperial, um período marcante na história e cultura do nosso país e da cidade de Juiz de Fora. \nNossa identidade se inspira na presença da família real, que se instalou no Museu Mariano Procópio, um dos patrimônios históricos da cidade. Além disso, em 1861, Dom Pedro II escalou o Morro do Imperador para admirar a vista de Juiz de Fora, eternizando esse local como um símbolo de nossa história. \nMais do que um nome, Imperadores representa tradição, força e a grandiosidade de um legado que seguimos construindo dentro e fora de campo.',
    },

    {
      title: 'Nossos Atletas: Transformação Dentro e Fora de Campo',
      content:
        'Ao longo de nossa trajetória, já formamos mais de 200 atletas em diferentes modalidades do futebol americano: \n🏈 Tackle (FullPads) \n🏆 Flag Football 5x5 Masculino \n🏆 Flag Football 5x5 Feminino \nMais do que um time, o JF Imperadores é um agente de transformação social. Para muitos de nossos atletas, vestir essa camisa representou uma verdadeira ascensão na vida. Aqui, encontraram não apenas um esporte, mas também um propósito: \n✅ Superação das drogas e do álcool \n✅ Combate à depressão \n✅ Desenvolvimento pessoal e profissional \nMuitos jovens cresceram e se tornaram adultos sob nosso manto, carregando consigo valores como disciplina, união e determinação. \nInvestir no JF Imperadores é investir em histórias reais de superação!',
    },
    {
      title: 'Nossas Recentes Conquistas:',
      content:
        'Em 2024, alcançamos um marco histórico ao trazer para Juiz de Fora o título do Gerais Bowl, consolidando nossa força no cenário do futebol americano em Minas Gerais. \nNo entanto, apesar dessa grande conquista, a falta de recursos nos impediu de representar nossa cidade na disputa nacional. Esse desafio reforça a importância do apoio de patrocinadores para que possamos ir ainda mais longe e levar o nome de Juiz de Fora para todo o Brasil. \nJunte-se a nós nessa jornada e faça parte das próximas grandes vitórias do JF Imperadores!',
    },
  ]
  return (
    <motion.section ref={sectionRef} className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 bg-black/90">
        <Image
          src="/images/994B1369.jpg"
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
          Nossa História
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8 relative">
          {historyItems.map((item, index) => (
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
