'use client'

import { motion } from 'framer-motion'

export const Goals = () => {
  const goals = [
    {
      title: 'Fortalecer a equipe',
      description: 'Fortalecer a equipe para competições nacionais.',
    },
    {
      title: 'Expandir a base',
      description: 'Expandir a base de fãs e engajamento na comunidade.',
    },
    {
      title: 'Criar ambiente sustentável',
      description:
        'Criar um ambiente sustentável para o crescimento do Futebol Americano na região.',
    },
  ]

  return (
    <div className="py-12">
      <motion.h2
        className="text-4xl font-bold text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Nossos Objetivos
      </motion.h2>

      <div className="grid gap-8 md:grid-cols-3 mb-16">
        {goals.map((goal, index) => (
          <motion.div
            key={index}
            className="bg-black/30 p-6 rounded-lg backdrop-blur-sm"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <h3 className="text-2xl font-semibold text-primary mb-4">{goal.title}</h3>
            <p className="text-gray-200">{goal.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="max-w-3xl mx-auto text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl font-bold mb-6">Conclusão</h2>
        <p className="text-lg text-gray-200">
          Acreditamos que, juntos, podemos construir uma parceria sólida e frutífera. Estamos
          abertos a discutir diferentes formatos de patrocínio que atendam às suas necessidades e
          expectativas. Vamos juntos fazer história no Futebol Americano!
        </p>
      </motion.div>
    </div>
  )
}
