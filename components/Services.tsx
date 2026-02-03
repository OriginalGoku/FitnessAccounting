'use client'

import { Check, ArrowRight } from 'lucide-react'

interface Package {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  highlighted?: boolean
  color: string
}

export default function Services() {
  const packages: Package[] = [
    {
      name: 'Solo Trainer',
      price: '$299',
      period: '/month',
      description: 'Perfect for independent personal trainers with straightforward finances',
      color: 'from-emerald-500 to-teal-600',
      features: [
        'Monthly bank & credit card reconciliation',
        'Income tracking (Square, Stripe, e-transfer)',
        'Expense categorization',
        'HST/GST tracking',
        'Monthly profit summary',
        'Year-end package for accountant',
        'Email support (48hr response)',
      ],
    },
    {
      name: 'Growth',
      price: '$449',
      period: '/month',
      description: 'For trainers with multiple income streams — online, groups, merchandise',
      highlighted: true,
      color: 'from-primary-500 to-primary-700',
      features: [
        'Everything in Solo Trainer',
        'Up to 200 transactions/month',
        'Multiple revenue stream tracking',
        'Fitness platform integrations',
        'Cash flow forecasting',
        'Monthly 15-min check-in call',
        'Priority support (24hr response)',
      ],
    },
    {
      name: 'Studio',
      price: '$699',
      period: '/month',
      description: 'For studios with contractors or employees — yoga, CrossFit, martial arts',
      color: 'from-violet-500 to-purple-700',
      features: [
        'Everything in Growth',
        'Up to 400 transactions/month',
        'Contractor tracking & T4A prep',
        'Payroll (up to 5 employees)',
        'P&L by service line',
        'Equipment depreciation',
        'Weekly check-in calls',
      ],
    },
  ]

  return (
    <section id="services" className="section-padding bg-slate-900 relative overflow-hidden noise-overlay">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-primary-400 font-semibold mb-4 tracking-wide uppercase text-sm">
            Pricing
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Simple, transparent packages
          </h2>
          <p className="text-lg text-slate-400">
            Choose the package that fits your business. All packages include 
            everything you need to keep your books clean and tax-ready.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
                pkg.highlighted
                  ? 'bg-white scale-105 shadow-2xl shadow-primary-500/20'
                  : 'bg-slate-800 hover:bg-slate-800/80'
              }`}
            >
              {/* Popular badge */}
              {pkg.highlighted && (
                <div className="absolute top-0 right-0">
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold px-4 py-1 rounded-bl-lg">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Header gradient */}
              <div className={`h-2 bg-gradient-to-r ${pkg.color}`} />

              <div className="p-8">
                {/* Package name */}
                <h3
                  className={`font-display text-2xl font-bold mb-2 ${
                    pkg.highlighted ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  {pkg.name}
                </h3>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-4">
                  <span
                    className={`text-4xl font-bold ${
                      pkg.highlighted ? 'text-primary-600' : 'text-white'
                    }`}
                  >
                    {pkg.price}
                  </span>
                  <span className={pkg.highlighted ? 'text-slate-500' : 'text-slate-400'}>
                    {pkg.period}
                  </span>
                </div>

                {/* Description */}
                <p
                  className={`mb-6 ${
                    pkg.highlighted ? 'text-slate-600' : 'text-slate-400'
                  }`}
                >
                  {pkg.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          pkg.highlighted ? 'text-primary-500' : 'text-primary-400'
                        }`}
                      />
                      <span
                        className={pkg.highlighted ? 'text-slate-700' : 'text-slate-300'}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href="#contact"
                  className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 group ${
                    pkg.highlighted
                      ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/30'
                      : 'bg-slate-700 text-white hover:bg-slate-600 border border-slate-600'
                  }`}
                >
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Additional note */}
        <p className="text-center text-slate-400 mt-12">
          Need something different? I also offer{' '}
          <a href="#contact" className="text-primary-400 hover:text-primary-300 underline">
            one-time cleanups
          </a>{' '}
          and custom packages for unique situations.
        </p>
      </div>
    </section>
  )
}
