# FitBooks - Bookkeeping for Fitness Professionals

A professional Next.js website for a bookkeeping service targeting personal trainers, fitness instructors, and studio owners in the GTA.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone or download this project
cd fitbooks-site

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your site.

## 📁 Project Structure

```
fitbooks-site/
├── app/
│   ├── globals.css      # Global styles, Tailwind, design system
│   ├── layout.tsx       # Root layout with metadata
│   └── page.tsx         # Main landing page
├── components/
│   ├── Navigation.tsx   # Fixed header with mobile menu
│   ├── Hero.tsx         # Main hero section
│   ├── WhyDifferent.tsx # Value proposition section
│   ├── Services.tsx     # Pricing packages
│   ├── HowItWorks.tsx   # Process explanation
│   ├── About.tsx        # About/credentials section
│   ├── Testimonials.tsx # Client testimonials
│   ├── FAQ.tsx          # Frequently asked questions
│   ├── CTA.tsx          # Contact form section
│   └── Footer.tsx       # Site footer
├── public/              # Static assets (add your images here)
├── next.config.js       # Next.js configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── package.json
```


## 🔧 Technical Notes

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom design system
- **Typography**: Fraunces (display) + DM Sans (body)
- **Icons**: Lucide React
- **Export**: Static export enabled for easy hosting

## 📱 Mobile Responsive

The site is fully responsive:
- Mobile-first approach
- Collapsible navigation menu
- Optimized touch targets
- Readable typography at all sizes

## ♿ Accessibility

- Semantic HTML structure
- Focus visible states
- ARIA labels where needed
- Good color contrast ratios
- Keyboard navigable


---

Built with ❤️ for fitness professionals who'd rather focus on their clients than their spreadsheets.
