import { Section } from './section'

const timelineEvents = [
  {
    year: '2017',
    title: 'O Início de uma Era',
    description:
      'Nascemos da fusão dos times Mamutes e Red Fox, imediatamente conquistando o título da Conferência Sudeste e o terceiro lugar na Liga Nacional.',
  },
  {
    year: '2018',
    title: 'Parceria Estratégica',
    description:
      'Firmamos uma importante parceria com o Cruzeiro, ampliando nossa visibilidade no cenário nacional.',
  },
  {
    year: '2019',
    title: 'Superação e Vitória',
    description:
      'Após reformulação, conquistamos o título da Copa Ouro, mostrando nossa capacidade de superação.',
  },
  {
    year: '2022',
    title: 'Retorno Triunfal',
    description:
      'Pós-pandemia, conquistamos o título nacional da segunda divisão.',
  },
  {
    year: '2024',
    title: 'História em Juiz de Fora',
    description:
      'Conquista histórica do título mineiro, marcando nossa posição como potência regional.',
  },
]

export const Timeline = () => {
  return (
    <Section title="Nossa História">
      <div className="space-y-4 ">
        {timelineEvents.map((event) => (
          <div
            key={event.year}
            className="rounded-lg border-l-4 border-yellow-400 bg-black/30 p-4"
          >
            <h3 className="text-xl font-bold">
              {event.year} - {event.title}
            </h3>
            <p>{event.description}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
