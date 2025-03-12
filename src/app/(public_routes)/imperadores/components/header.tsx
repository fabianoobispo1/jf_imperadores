import Image from 'next/image'

export const Header = () => {
  return (
    <div className=" mb-8 rounded-xl py-10 text-center">
      <Image
        src="/logo.png"
        alt="Logo Imperadores"
        width={250}
        height={250}
        className="mx-auto rounded-full border-3 border-yellow-400"
      />
      <h1 className="mt-4 text-5xl font-bold text-yellow-400 drop-shadow-lg">
        Juiz de Fora Imperadores
      </h1>
      <p className="mt-2 text-xl text-white">
        Uma História de Superação e Conquistas desde 2017
      </p>
    </div>
  )
}
