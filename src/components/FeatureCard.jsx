const FeatureCard = ({ label, value, subtitle, className = '' }) => {
  return (
    <div
      className={`backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-5 md:p-6 ${className}`}
    >
      <div className="text-white/70 text-sm sm:text-base font-semibold mb-2">
        {label}
      </div>
      <div className="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">
        {value}
      </div>
      <div className="text-white/80 text-sm sm:text-lg md:text-xl leading-snug">
        {subtitle}
      </div>
    </div>
  )
}

export default FeatureCard
