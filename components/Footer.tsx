import { Dumbbell, Instagram, Linkedin, Mail } from "lucide-react";
import { CONTACT, SOCIALS } from "@/config/site";

function ObfuscatedContact() {
  return (
    <div className="space-y-3 text-sm">
      <div className="hover:text-white transition-colors">
        <img
          src="/contact/email.svg"
          alt="Email address"
          className="h-5 w-auto"
        />
      </div>

      <div className="hover:text-white transition-colors">
        <img
          src="/contact/phone.svg"
          alt="Phone number"
          className="h-5 w-auto"
        />
      </div>
    </div>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    services: [
      { label: "Solo Trainer", href: "#services" },
      { label: "Growth", href: "#services" },
      { label: "Studio", href: "#services" },
      { label: "Books Cleanup", href: "#contact" },
    ],
    company: [
      { label: "About", href: "#about" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "FAQ", href: "#faq" },
      { label: "Contact", href: "#contact" },
    ],
  };

  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="py-16 grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold text-white">
                Fit<span className="text-primary-400">Books</span>
              </span>
            </a>
            <p className="text-sm leading-relaxed mb-6">
              Expert bookkeeping for fitness professionals in the Greater
              Toronto Area. I speak fitness and finance.
            </p>

            {/* Social links */}
            <div className="flex gap-3">
              <a
                href={SOCIALS.instagram}
                className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={SOCIALS.linkedin}
                className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              {/*<a
                href={`mailto:${CONTACT.email}`}
                className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>*/}
            </div>
          </div>

          {/* Services links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-3">
              {links.services.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {links.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Get In Touch</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <ObfuscatedContact />
                </li>

                <li className="whitespace-pre-line">{CONTACT.address}</li>
              </ul>
  

            <div className="mt-6 p-4 bg-slate-900 rounded-xl">
              <p className="text-sm text-slate-300 mb-2">Free consultation</p>
              <a
                href="#contact"
                className="text-primary-400 font-semibold hover:text-primary-300 transition-colors"
              >
                Book Now →
              </a>
            </div>
          </div>
        </div>
        <p className="text-sm">
          Disclaimer: The information on this website is for general
          informational and bookkeeping education purposes only and is not tax
          advice.
        </p>
        {/* Bottom bar */}
        <div className="py-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm">
            © {currentYear} FitBooks. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
