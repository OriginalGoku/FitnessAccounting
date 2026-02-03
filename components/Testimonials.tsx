'use client'

import { Star, Quote } from 'lucide-react'

export default function Testimonials() {
  const testimonials = [
    {
      quote:
        "Before working with FitBooks, I was spending every Sunday afternoon trying to figure out my books. Now I just forward my receipts and everything is handled. Game changer.",
      author: 'Sarah M.',
      role: 'Personal Trainer, Toronto',
      rating: 5,
    },
    {
      quote:
        "Finally someone who doesn't ask me to explain what a training package is or why my income looks different every month. The monthly reports actually make sense.",
      author: 'James K.',
      role: 'Karate Studio Owner, Vaughan',
      rating: 5,
    },
    {
      quote:
        "My accountant was shocked at how organized everything was at year-end. She said it saved her at least 3 hours — which saved me money on her fees.",
      author: 'Michelle T.',
      role: 'Yoga Studio Owner, Richmond Hill',
      rating: 5,
    },
  ]

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary-50 to-transparent rounded-full opacity-50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-primary-600 font-semibold mb-4 tracking-wide uppercase text-sm">
            Testimonials
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            What fitness professionals{' '}
            <span className="gradient-text">are saying</span>
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative bg-slate-50 rounded-2xl p-8 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary-100 group"
            >
              {/* Quote icon */}
              <div className="absolute -top-4 left-8 w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <Quote className="w-5 h-5 text-white" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4 pt-2">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-amber-400 fill-amber-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-slate-700 mb-6 leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-primary-600">
                    {testimonial.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{testimonial.author}</p>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>

              {/* Hover accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-b-2xl scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </div>
          ))}
        </div>

        {/* Trust note */}
        <p className="text-center text-slate-500 mt-12 text-sm">
          * Testimonials represent typical client experiences. Results may vary.
        </p>
      </div>
    </section>
  )
}
