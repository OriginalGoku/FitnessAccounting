import { MessageSquare, Settings, BarChart3, FileCheck } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: MessageSquare,
      title: 'Free Consultation',
      description:
        'We start with a 30-minute call to understand your business, review your current situation, and find the right package for you.',
    },
    {
      number: '02',
      icon: Settings,
      title: 'Quick Setup',
      description:
        'I connect to your accounts (read-only), set up your chart of accounts, and create a simple system for sharing documents.',
    },
    {
      number: '03',
      icon: BarChart3,
      title: 'Monthly Rhythm',
      description:
        'By the 15th of each month, your books are reconciled and you receive a clear report showing income, expenses, and profit.',
    },
    {
      number: '04',
      icon: FileCheck,
      title: 'Tax-Ready Year-End',
      description:
        'In January, you get a complete package for your accountant — saving them hours of work (and saving you their fees).',
    },
  ]

  return (
    <section id="how-it-works" className="section-padding bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-primary-600 font-semibold mb-4 tracking-wide uppercase text-sm">
            How It Works
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Getting started is{' '}
            <span className="gradient-text">simple</span>
          </h2>
          <p className="text-lg text-slate-600">
            From first call to tax-ready books — here&apos;s how we&apos;ll work together.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary-200 to-transparent" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step card */}
                <div className="bg-slate-50 rounded-2xl p-6 h-full hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-primary-100">
                  {/* Number badge */}
                  <div className="relative z-10 w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center mb-6 mx-auto lg:mx-0">
                    <span className="text-2xl font-bold gradient-text">{step.number}</span>
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                    <step.icon className="w-6 h-6 text-primary-600" />
                  </div>

                  {/* Content */}
                  <h3 className="font-display text-xl font-bold text-slate-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">{step.description}</p>
                </div>

                {/* Arrow connector (mobile/tablet) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block lg:hidden absolute -bottom-4 left-1/2 -translate-x-1/2">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-primary-300"
                    >
                      <path
                        d="M12 4v16m0 0l-6-6m6 6l6-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Timeline CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 bg-primary-50 rounded-full px-6 py-3">
            <span className="text-primary-700 font-medium">
              Most clients are fully onboarded within one week
            </span>
            <a
              href="#contact"
              className="bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-primary-700 transition-colors"
            >
              Start Now
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
