"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Dumbbell } from "lucide-react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/#services", label: "Services" },
    { href: "/#how-it-works", label: "How It Works" },
    { href: "/#about", label: "About" },
    { href: "/#faq", label: "FAQ" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center group-hover:bg-primary-700 transition-colors">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-slate-900">
              Fit<span className="text-primary-600">Books</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          {/*<div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-slate-600 hover:text-primary-600 font-medium transition-colors animated-underline"
              >
                {link.label}
              </a>
            ))}
          </div>*/}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-600 hover:text-primary-600 font-medium transition-colors animated-underline"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link href="/#contact" className="btn-primary">
              Free Consultation
            </Link>
            {/*<a href="#contact" className="btn-primary">
              Free Consultation
            </a>*/}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-600 hover:text-primary-600 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-white border-t border-slate-100 shadow-lg animate-fade-in-down">
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-slate-600 hover:text-primary-600 font-medium py-2 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {/*{navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-slate-600 hover:text-primary-600 font-medium py-2 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}*/}
              <Link
                href="/#contact"
                className="btn-primary w-full text-center mt-4"
                onClick={() => setIsOpen(false)}
              >
                Free Consultation
              </Link>
              {/*<a
                href="#contact"
                className="btn-primary w-full text-center mt-4"
                onClick={() => setIsOpen(false)}
              >
                Free Consultation
              </a>*/}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
