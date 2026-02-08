"use client";

import { Mail, Phone, MapPin, ArrowRight, Calendar } from "lucide-react";
import { CONTACT } from "@/config/site";
// import HubSpotForm from "@/components/HubSpotForm";
import CTAForm from "@/components/CTAForm";

export default function CTA() {
  return (
    <section
      id="contact"
      className="section-padding bg-slate-900 relative overflow-hidden noise-overlay"
    >
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: CTA content */}
          <div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to get your{" "}
              <span className="text-primary-400">finances in shape?</span>
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Book a free 30-minute consultation. We&apos;ll review your current
              situation, discuss your needs, and figure out if we&apos;re a good
              fit — no pressure, no obligation.
            </p>

            {/* Benefits */}
            <div className="space-y-4 mb-8">
              {[
                "Free financial health check",
                "No commitment required",
                "Get answers to all your questions",
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary-500/20 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-3 h-3 text-primary-400" />
                  </div>
                  <span className="text-slate-300">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Contact info */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <img
                    src="/contact/email.svg"
                    alt="Email address"
                    className="h-4 w-auto"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Phone</p>
                  <img
                    src="/contact/phone.svg"
                    alt="Phone number"
                    className="h-4 w-auto"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Location</p>
                  <p className="font-medium whitespace-pre-line">
                    {CONTACT.address}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact form */}
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary-600" />
              </div>
              <h3 className="font-display text-2xl font-bold text-slate-900">
                Book Your Free Call
              </h3>
            </div>
            <CTAForm />
            {/*<form className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="business"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Type of Business
                </label>
                <select
                  id="business"
                  name="business"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all bg-white"
                >
                  <option value="">Select your business type</option>
                  <option value="personal-trainer">
                    Personal Trainer (1-on-1)
                  </option>
                  <option value="online-coach">Online Coach / Hybrid</option>
                  <option value="group-fitness">
                    Group Fitness Instructor
                  </option>
                  <option value="studio-owner">Studio / Gym Owner</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Tell me about your situation (optional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-none"
                  placeholder="Current pain points, how long you've been in business, etc."
                />
              </div>

              <button
                type="submit"
                className="w-full btn-primary text-lg py-4 group"
              >
                Request Free Consultation
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-center text-sm text-slate-500">
                I&apos;ll respond within 24 hours to schedule our call.
              </p>
            </form>*/}
          </div>

          {/*<div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl">
            <HubSpotForm
              region="na3"
              portalId="342951756"
              formId="20d2959c-3f78-4251-b5a3-b84ff7d997b3"
            />
          </div>*/}
        </div>
      </div>
    </section>
  );
}
