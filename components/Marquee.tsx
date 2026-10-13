export default function Marquee() {
  const text = "НЕ ИЩИ СМЫСЛ • НОСИ ЕГО • ТИРАЖ ОГРАНИЧЕН • "
  const repeated = text.repeat(6)

  return (
    <div className="overflow-hidden border-y-2 border-brand-black bg-brand-red py-2">
      <div className="marquee inline-block whitespace-nowrap font-display text-sm font-black tracking-wider text-white animate-marquee">
        {repeated}
      </div>
    </div>
  )
}