# Odai Dahi - Frontend Developer Portfolio

![Portfolio Preview](/public/og-image.png)

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Getting Started](#-getting-started)
- [Customization](#-customization)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Performance](#-performance)
- [License](#-license)
- [Contact](#-contact)
- [Acknowledgments](#-acknowledgments)

## ✨ Features
    💻 Clean, modern design with smooth animations
    📱 Fully responsive for all device sizes
    🌓 Dark mode support
    ⚡ Built with Next.js 14 App Router
    🔍 SEO optimized with metadata
    📝 Interactive project showcase with website previews
    📊 Skills visualization
    📫 Contact form with email integration via Resend
    🔄 Tab-based experience timeline
    ⚙️ Type-safe development with TypeScript


## 🛠️ Tech Stack
    Framework: Next.js 14
    Language: TypeScript
    Styling: Tailwind CSS
    UI Components: shadcn/ui
    Form Handling: React Hook Form & Zod
    Email Service: Resend
    Animation: Custom fade-in components
    Deployment: Vercel

## 🚀 Getting Started
### Prerequisites

    Node.js 18+
    npm or yarn

### Installation
1. Clone the repository:

```bash
git clone https://github.com/odai-dh/portfolio.git
cd portfolio
```

2. Install dependencies:

```bash
npm install
```

3. Create a .env.local file and add your Resend API key:

RESEND_API_KEY=your_resend_api_key

4. Run the development server:
```bash
npm run dev
```

5. Open http://localhost:3000 in your browser.


## 🔧 Customization
### Content

Update your portfolio content by editing the Markdown files in content:

portfolio.md: Main content including projects, skills, and experiences

### Styling

The site uses Tailwind CSS for styling. Customize the theme in tailwind.config.js.

## 📁 Project Structure
```bash
portfolio/
├── public/               # Static assets
│   ├── favicon.ico       # Site favicon
│   ├── og-image.png      # Open Graph image
│   └── site.webmanifest  # PWA manifest
├── src/
│   ├── app/              # App router pages
│   │   ├── actions.ts    # Server actions
│   │   ├── globals.css   # Global styles
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Home page
│   ├── components/       # React components
│   │   ├── ContactSection.tsx
│   │   ├── ExperienceSection.tsx
│   │   ├── FadeIn.tsx
│   │   ├── Footer.tsx
│   │   ├── MainNav.tsx
│   │   ├── ProjectContentCards.tsx
│   │   ├── SectionWrapper.tsx
│   │   ├── SkillsChart.tsx
│   │   ├── WebsitePreview.tsx
│   │   └── ui/           # UI components
│   ├── content/          # Markdown content
│   │   └── portfolio.md  # Portfolio content
│   ├── hooks/            # Custom React hooks
│   │   └── use-toast.ts  # Toast notifications
│   └── lib/              # Utility functions
│       └── markdown.ts   # Markdown parser
├── .env.local            # Environment variables (create this)
├── next.config.js        # Next.js configuration
├── package.json          # Dependencies
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

---

Designed and developed by [Odai Dahi](https://github.com/odai-dh)