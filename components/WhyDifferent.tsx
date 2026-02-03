import { Zap, Brain, Shield, Clock } from 'lucide-react'

export default function WhyDifferent() {
  const differentiators = [
    {
      icon: Brain,
      title: 'I Speak Fitness',
      description:
        'I know what a "pack of 10" means. I understand why your income spikes in January. I won\'t ask you to explain your business model.',
    },
    {
      icon: Zap,
      title: 'Tech-Forward Approach',
      description:
        'I automate the tedious parts — receipt capture, transaction categorization, report generation — so you get accuracy without the overhead.',
    },
    {
      icon: Shield,
      title: 'Always Tax-Ready',
      description:
        'Your HST is tracked, your expenses are categorized, and your year-end package is ready when your accountant needs it.',
    },
    {
      icon: Clock,
      title: 'Save Hours Weekly',
      description:
        'Stop wrestling with spreadsheets and payment app exports. Get your evenings back while knowing your books are handled.',
    },
  ]

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-primary-50/50 to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-primary-600 font-semibold mb-4 tracking-wide uppercase text-sm">
            Why I&apos;m Different
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Most bookkeepers don&apos;t get{' '}
            <span className="gradient-text">fitness businesses</span>
          </h2>
          <p className="text-lg text-slate-600">
            Generic bookkeepers see confusing payment streams and messy income. I see 
            a business I understand because I&apos;ve lived it.
          </p>
        </div>

        {/* Differentiators Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {differentiators.map((item, index) => (
            <div
              key={index}
              className="group relative bg-slate-50 rounded-2xl p-8 hover:bg-white transition-all duration-300 card-hover border border-transparent hover:border-primary-100"
            >
              {/* Icon */}
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-600 transition-colors duration-300">
                <item.icon className="w-7 h-7 text-primary-600 group-hover:text-white transition-colors duration-300" />
              </div>

              {/* Content */}
              <h3 className="font-display text-xl font-bold text-slate-900 mb-3">
                {item.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">{item.description}</p>

              {/* Hover accent */}
              <div className="absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </div>
          ))}
        </div>

        {/* Pull Quote */}
        <div className="mt-16 text-center">
          <blockquote className="relative inline-block max-w-2xl">
            <div className="absolute -top-4 -left-4 text-6xl text-primary-200 font-serif">&ldquo;</div>
            <p className="text-xl md:text-2xl text-slate-700 italic font-display">
              Finally, a bookkeeper who doesn&apos;t ask me to explain what Mindbody is 
              or why my income looks different every month.
            </p>
            <footer className="mt-4 text-slate-500">
              — Personal Trainer, Toronto
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  )
}
