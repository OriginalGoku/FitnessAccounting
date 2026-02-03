import { Award, MapPin, Briefcase, Heart } from 'lucide-react'
import Image from 'next/image'

export default function About() {
  const credentials = [
    {
      icon: Briefcase,
      title: 'Accounting Experience',
      description: 'Years of hands-on experience in AP/AR, payroll, HST filing, and multi-currency accounting',
    },
    {
      icon: Heart,
      title: 'Fitness Background',
      description: 'Certified personal trainer who understands the unique challenges of fitness businesses',
    },
    {
      icon: Award,
      title: 'QuickBooks Expert',
      description: 'Proficient in QuickBooks and modern accounting tools with automation expertise',
    },
    {
      icon: MapPin,
      title: 'Local to GTA',
      description: 'Based in Richmond Hill, available for in-person meetings when needed',
    },
  ]

  return (
    <section id="about" className="section-padding bg-slate-50 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary-100/30 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Photo placeholder / visual */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 overflow-hidden relative">
              {/* Placeholder for actual photo */}
              {/*<div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white/90 p-8">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
                    <span className="text-6xl">👋</span>
                  </div>
                  <p className="text-lg font-medium">Your Photo Here</p>
                  <p className="text-sm text-white/70 mt-2">
                    Replace with a professional headshot
                  </p>
                </div>
              </div>*/}
              {/* Profile photo */}
              <Image
                src="/my_profile_pic.jpg"
                alt="Profile photo"
                fill
                priority
                className="object-cover"
              />
              {/* Decorative elements */}
              {/*<div className="absolute top-4 right-4 w-24 h-24 border-2 border-white/20 rounded-2xl" />
              <div className="absolute bottom-4 left-4 w-16 h-16 border-2 border-white/20 rounded-full" />*/}
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 max-w-xs">
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🏋️</span>
                </div>
                <div>
                  <p className="font-bold text-slate-900">Fitness + Finance</p>
                  <p className="text-sm text-slate-500">A rare combination</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div>
            <p className="text-primary-600 font-semibold mb-4 tracking-wide uppercase text-sm">
              About Me
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              I&apos;ve been on{' '}
              <span className="gradient-text">both sides</span>{' '}
              of your business
            </h2>

            <div className="space-y-4 text-lg text-slate-600 mb-8">
              <p>
                As a personal trainer, I know the chaos of managing clients, chasing 
                payments across five different apps, and trying to figure out what counts 
                as a business expense at tax time.
              </p>
              <p>
                As an accountant with years of experience in accounts payable, receivable, 
                payroll, and tax compliance, I know how to bring order to that chaos — 
                quickly and accurately.
              </p>
              <p>
                I built this practice because I saw too many fitness professionals 
                struggling with books that didn&apos;t need to be hard. With the right 
                systems (and someone who actually understands your business), keeping 
                clean books can be effortless.
              </p>
            </div>

            {/* Credentials grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {credentials.map((cred, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-white rounded-xl p-4 border border-slate-100"
                >
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <cred.icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">{cred.title}</h4>
                    <p className="text-sm text-slate-500">{cred.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
