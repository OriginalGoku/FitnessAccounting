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


## 🎨 Customization

### 1. Update Contact Information

Edit these files to add your real contact details:
- `components/CTA.tsx` - Email, phone, contact form
- `components/Footer.tsx` - Email, phone, social links

### 2. Add Your Photo

Replace the placeholder in `components/About.tsx`:
1. Add your photo to `/public/` (e.g., `headshot.jpg`)
2. Import and use Next.js Image component

### 3. Update Branding

- **Logo**: Edit the logo in `Navigation.tsx` and `Footer.tsx`
- **Colors**: Modify `tailwind.config.js` to change the primary color palette
- **Fonts**: Update the Google Fonts import in `globals.css`

### 4. Update Pricing

Edit `components/Services.tsx` to adjust:
- Package names
- Pricing
- Included features

### 5. Add Real Testimonials

Replace placeholder testimonials in `components/Testimonials.tsx` with real client quotes (with permission).

## 🚀 Deployment to Vercel

### Option 1: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```


---

Built with ❤️ for fitness professionals who'd rather focus on their clients than their spreadsheets.
