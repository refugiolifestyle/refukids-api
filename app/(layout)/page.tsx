
export default function Home() {
  return <>
    <div className="absolute inset-0 z-[-1] w-full h-screen">
      <div className="absolute inset-0 w-full h-full bg-linear-to-r from-black to-transparent opacity-90"></div>
      <img
        src={`/bg-layout.jpeg`}
        alt="Fundo com a logo da Conferência"
        className="w-full h-full object-cover object-right"
      />
    </div>
    <h1 className="text-white text-6xl font-thin">Culto Refukids</h1>
    <h4 className="text-white text-2xl font-thin">Domingo, 20h</h4>
    <div className="h-1 w-24 my-4 bg-linear-to-r from-[#ad1a1c] to-[#830b0c]" />
  </>;
}