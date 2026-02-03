'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "What if my books are a complete mess right now?",
      answer:
        "That's actually very common! I offer one-time cleanup packages to get your books sorted before we start regular monthly service. We'll untangle everything together — no judgment, just solutions.",
    },
    {
      question: "Do you do my taxes?",
      answer:
        "I prepare everything your accountant needs to file your taxes — organized transactions, categorized expenses, HST summaries, and year-end financial statements. This typically saves your accountant hours of work, which saves you money. But the actual tax filing and tax advice should come from a CPA.",
    },
    {
      question: "What software do you use?",
      answer:
        "I primarily work in QuickBooks Online because it integrates well with most payment platforms fitness professionals use (Square, Stripe, PayPal, etc.). If you're already using something else, we can discuss what works best for your situation.",
    },
    {
      question: "How do you access my accounts?",
      answer:
        "I use read-only connections through secure banking integrations. I can see your transactions to categorize and reconcile them, but I never have the ability to move money or make payments. Your funds stay completely under your control.",
    },
    {
      question: "What's included in the monthly reports?",
      answer:
        "You'll receive a clear summary showing your income (broken down by source/service type), expenses (categorized), net profit, and how you compare to previous months. No accounting jargon — just the numbers that matter for running your business.",
    },
    {
      question: "Can I switch packages if my business grows?",
      answer:
        "Absolutely. Many clients start with Solo Trainer and move to Growth as they add income streams. We'll review your needs quarterly and adjust if it makes sense. There's no penalty for switching.",
    },
    {
      question: "What if I have questions between monthly reports?",
      answer:
        "Every package includes email support. Growth and Studio clients also get regular check-in calls. I'm always happy to answer quick questions — that's part of the relationship.",
    },
  ]

  return (
    <section id="faq" className="section-padding bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-primary-600 font-semibold mb-4 tracking-wide uppercase text-sm">
            FAQ
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Common questions
          </h2>
          <p className="text-lg text-slate-600">
            Everything you need to know about working together.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all duration-200 hover:border-primary-200"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="font-semibold text-slate-900 pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-primary-600 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-5 text-slate-600 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-4">
            Still have questions? I&apos;m happy to chat.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            Get in touch →
          </a>
        </div>
      </div>
    </section>
  )
}
