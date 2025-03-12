import { Section } from './section'

export const Objectives = () => {
  const objectives = [
    'Participação na elite do Futebol Americano Nacional',
    'Fortalecimento da equipe para competições nacionais',
    'Expansão da base de fãs na Zona da Mata Mineira',
    'Desenvolvimento sustentável do esporte na região',
  ]

  return (
    <Section title="Objetivos 2025">
      <div className="rounded-lg bg-gradient-to-r from-[#1a2a6c] to-primary p-6">
        <ul className="list-disc pl-6 space-y-2">
          {objectives.map((objective, index) => (
            <li key={index}>{objective}</li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
