"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function Hero() {
  const benefits = [
    "I understand your business model",
    "I automate the tedious parts",
    "Your books are always tax-ready",
  ];

  return (
    <section className="relative min-h-[calc(100vh-5rem)] flex items-start overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-primary-50/30 to-white" />

      {/* Decorative elements */}
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-200/20 rounded-full blur-3xl" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 md:pt-16 md:pb-24">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-primary-700">
              Bookkeeping built for fitness professionals
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 animate-fade-in-up">
            Your trainer for{" "}
            <span className="relative">
              <span className="gradient-text">finances</span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 10C50 4 150 2 298 6"
                  stroke="url(#underline-gradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient
                    id="underline-gradient"
                    x1="0"
                    y1="0"
                    x2="300"
                    y2="0"
                  >
                    <stop stopColor="#0d947a" />
                    <stop offset="1" stopColor="#2dd4b0" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-2xl animate-fade-in-up delay-100">
            I&apos;m a bookkeeper who&apos;s also a personal trainer. I know
            your business inside out — the payment chaos, the seasonal swings,
            the HST headaches. Let me handle the numbers while you focus on your
            clients.
          </p>

          {/* Benefits */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10 animate-fade-in-up delay-200">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-slate-700"
              >
                <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <span className="font-medium">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
            <a href="#contact" className="btn-primary text-lg px-8 py-4 group">
              Book Free Consultation
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#services" className="btn-secondary text-lg px-8 py-4">
              View Services
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 pt-8 border-t border-slate-200 animate-fade-in-up delay-400">
            <p className="text-sm text-slate-500 mb-4">
              Trusted by fitness professionals across the GTA
            </p>
            <div className="flex flex-wrap gap-8 items-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">100%</div>
                <div className="text-sm text-slate-500">Tax-ready books</div>
              </div>
              <div className="w-px h-12 bg-slate-200" />
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">48hr</div>
                <div className="text-sm text-slate-500">Response time</div>
              </div>
              <div className="w-px h-12 bg-slate-200" />
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">GTA</div>
                <div className="text-sm text-slate-500">Local expertise</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
