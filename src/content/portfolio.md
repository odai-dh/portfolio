---
name: "Odai Dahi"
title: "Full Stack Developer"
subtitle: "I build production Next.js apps, from a dashboard platform at Aeoflo to Vidare, a 3D concept app for Stockholm. Stockholm-based and open to full-time roles."
email: "odai@odaidh.dev"
socials:
  github: "https://github.com/odai-dh"
  linkedin: "https://www.linkedin.com/in/odai-dahi/"
  instagram: "https://www.instagram.com/odai.dh1"
  tiktok: "https://www.tiktok.com/@limonboy96"

skills:
  - { name: "HTML & CSS", category: "frontend" }
  - { name: "JavaScript", category: "frontend" }
  - { name: "TypeScript", category: "frontend" }
  - { name: "React", category: "frontend" }
  - { name: "Next.js", category: "frontend" }
  - { name: "Tailwind CSS", category: "frontend" }
  - { name: "SwiftUI", category: "frontend" }
  - { name: "Framer Motion", category: "frontend" }
  - { name: "GSAP", category: "frontend" }
  - { name: "React Three Fiber", category: "frontend" }
  - { name: "Zustand", category: "frontend" }
  - { name: "Node.js", category: "backend" }
  - { name: "Express", category: "backend" }
  - { name: "MongoDB", category: "backend" }
  - { name: "SQL", category: "backend" }
  - { name: "REST APIs", category: "backend" }
  - { name: "Firebase", category: "backend" }
  - { name: "Supabase", category: "backend" }
  - { name: "Git", category: "tools" }
  - { name: "Figma", category: "tools" }
  - { name: "Zod", category: "tools" }
  - { name: "Vitest", category: "tools" }
  - { name: "Docker", category: "tools" }
  - { name: "Clerk", category: "tools" }
  - { name: "Three.js", category: "tools" }
  - { name: "AI APIs (Groq, Gemini)", category: "tools" }

experience:
  - company: "Aeoflo"
    title: "Frontend Developer Intern"
    date: "Sep 2025 – Mar 2026"
    link: "https://aeoflo.com/"
    duties:
      - "Sole frontend developer at a venture-backed AI analytics startup. Built the 20,000+ line company website from scratch with Next.js, TypeScript and Tailwind CSS, including scroll animations, dark mode, a blog and HubSpot booking."
      - "Designed and built a multi-client analytics dashboard platform with per-brand dashboards for prospective clients such as Oatly, Stiga, Billhop, Norstedts, CRA-YON and X-peng, with KPI cards, Chart.js charts and a JSON data model where adding a client needs no component changes."
      - "Refactored a ~4,000-line Shopify app into modular React components with error boundaries, custom hooks and documentation."
      - "Integrated the HubSpot API and Cloudflare R2, and added Clerk authentication for client project submissions."

  - company: "FEDECRAIL"
    title: "Volunteer Full Stack Developer & Digital Lead"
    date: "Jun 2026 – Present"
    link: "https://www.fedecrail.org/"
    duties:
      - "Leading the website redesign and modernization for the European Federation of Museum & Tourist Railways."
      - "Running UX research for a user base that is predominantly 55+, and designing around their needs."

  - company: "Sportly"
    title: "Frontend Developer Intern"
    date: "Jun 2025 – Oct 2025"
    link: "https://sportly.se/"
    duties:
      - "Built frontend features for a sports tech platform with React, TypeScript and Tailwind CSS."
      - "Shipped responsive UI components that stayed consistent with the design system."
      - "Worked in an agile team with developers and designers to deliver new features."

  - company: "RAW Comedy Club"
    title: "Event Assistant"
    date: "Sep 2024 – Dec 2025"
    duties:
      - "Supported event operations to create memorable guest experiences."
      - "Assisted artists, coordinated logistics and kept events running smoothly."

  - company: "Max Burgers"
    title: "Assistant Restaurant Manager"
    date: "Mar 2020 – Aug 2024"
    duties:
      - "Ran daily operations and supervised staff when the manager was away."
      - "Recruited, trained and coached team members and shift leaders."
      - "Handled financial reporting, closing and monthly inventory control."
      - "Planned and optimized staff schedules."

  - company: "Stockholm Stad"
    title: "IT Support Assistant"
    date: "2018 – 2019"
    duties:
      - "Gave technical support to staff and students."
      - "Troubleshot hardware and software issues."
      - "Supported digital learning environments."
projects:

  - title: "Vidare"
    date: "2026-09-29"
    description: "SL breaks down, Vidare books your taxi home and claims the fare back from SL for you. A clickable concept app inside a scroll-driven 3D Stockholm, prototyped solo in one night at a hackathon and finished in five days."
    tags: ["Next.js", "TypeScript", "React Three Fiber", "GSAP", "Zustand", "Zod", "Vitest", "Tailwind CSS"]
    link: "https://sl-compensation.netlify.app/"
    github: "https://github.com/odai-dh/sl-compensation"
    image: "/images/projects/vidare.jpg"
    content: |
      ### Overview
      When SL traffic in Stockholm breaks down, Swedish law (Lag 2015:953) lets travellers who risk arriving at least 20 minutes late take a taxi, and SL pays up to 1 480 kr. Almost nobody uses it: few people know, and those who do rarely want to pay hundreds of kronor upfront and wait weeks for the refund.

      Vidare removes that friction. You tap **"I'm stranded"**, Vidare checks your trip against SL's rules, orders and pays the taxi, then files the claim with SL for you under a power of attorney (fullmakt) you signed once with BankID. SL pays Vidare, and you pay nothing.

      I designed and built it solo as a clickable demo. The first prototype came together in one night at a hackathon, and I finished it over five days: about 10,800 lines of TypeScript and 108 unit tests.

      *Concept project. Not affiliated with or endorsed by SL.*

      ### The App
      A mobile-first web app covering the whole journey:
      - Onboarding: identity check and fullmakt signing (mock BankID), a card as guarantee, and your SL ticket type
      - An eligibility engine that applies SL's rules, including the 20-minute threshold, pre-announced disruptions and the Uppsala county exception
      - A fixed-price taxi quote showing what Vidare covers and anything you'd pay above the cap, before you order
      - Live ride tracking on an OpenStreetMap map, a receipt, and a claim timeline from "filed" to "paid"
      - English and Swedish, light and dark mode

      ### Built to Become Real
      Every external service (SL disruption data, taxi booking, payments, BankID and SL's claims API) is mocked behind a TypeScript interface, so a real integration can replace a mock without touching the UI. All business logic lives in pure, framework-free TypeScript that is unit tested with Vitest and exposed through Zod-validated API routes, ready for a planned SwiftUI iOS client. SL's numbers live in one rules file, so the yearly change to the cap is a one-line update. On Netlify, each visitor gets a private demo sandbox stored in Netlify Blobs, so one person's clicks never affect another's.

      ### The 3D Showcase Website
      A cinematic, scroll-driven story set in a procedural low-poly Stockholm at night: an instanced city with a custom window shader, an elevated railway, GPU rain, a reflective wet street and bloom. The camera flies a spline driven by scroll, and the chapter text runs on a GSAP timeline tied to the scroll position, so any scroll speed or direction shows the same frame.

      The real app is embedded in a phone mockup and talks to the website through typed, validated postMessage events: tap "I'm stranded" and the train in the city stops and the signal turns red; order a taxi and it drives in, picks you up and heads home. "Play it for me" runs the whole flow automatically.

      ### Polish and Debugging
      - Tracked down why the 3D scene vanished after about 12 seconds: a performance monitor was counting healthy frames as instability and swapping the scene for its fallback. Confirmed the fix in a headless browser. Full write-up: [The 3D city that vanished after 12 seconds](/notes/vidare-vanishing-scene).
      - Replaced a train animation that could reverse or teleport with a small forward-only simulation, shared by the 3D scene and the illustrated fallback and covered by randomised tests.
      - Made every section fit phones from 360 px wide, and added reduced-motion support and an illustrated fallback for devices without WebGL.

      ### Tech Stack
      Next.js 16, React, TypeScript, Tailwind CSS, React Three Fiber, three.js, drei, postprocessing, GSAP ScrollTrigger, Lenis, Framer Motion, Zustand, Zod, Vitest, react-leaflet, OpenStreetMap, Netlify Blobs, Web Audio API

      ### Learning Outcome
      Vidare taught me to design for a real integration from day one. Keeping business rules pure and tested, and hiding every outside service behind an interface, made the demo fast to build and straightforward to make real. It also pushed my frontend work into 3D, where performance, accessibility and phone support take as much work as the visuals.

      I built it with Claude Code as a pair programmer, which mostly taught me discipline: specify behaviour precisely, then verify every change in a real browser instead of trusting "the tests pass".

  - title: "Aeoflo"
    date: "2026-04-21"
    description: "As the sole frontend developer at a venture-backed AI analytics startup, built the company website from scratch and a multi-client dashboard platform with per-brand dashboards for prospective clients."
    tags: ["Next.js", "TypeScript", "React", "Tailwind CSS", "Framer Motion", "Chart.js", "HubSpot API", "Cloudflare R2", "Clerk", "Zod", "shadcn/ui"]
    link: "https://aeoflo-web.netlify.app/"
    github: "#"
    image: "/images/projects/aeoflo.jpg"
    content: |
      ### Overview
      Aeoflo is a venture-backed AI visibility analytics platform for Shopify merchants — helping brands get discovered by AI search engines like ChatGPT, Gemini, and Perplexity.

      As the **sole frontend developer**, I joined at an early stage and shipped across three major workstreams over 6 months.

      ### Company Website
      Built the entire marketing website from scratch — 20,000+ lines of code. Features scroll-triggered animations, dark/light mode, a HubSpot booking integration, Cloudflare R2 CDN for image hosting, a blog system with 16+ posts, an animated testimonial marquee, and a full AI visibility audit lead generation form.

      ### Client Analytics Dashboards
      Designed and built a multi-client AI visibility dashboard platform, with per-brand dashboards created for prospective clients including **Oatly, Stiga, Billhop, Norstedts, CRA-YON, and X-peng**. Key features:
      - Expandable KPI cards with slide-out analytics panels and backdrop blur
      - Chart.js doughnut charts and circular gauge indicators
      - AI model breakdowns per client (ChatGPT, Gemini, Claude, Perplexity)
      - Category performance tables with conditional column visibility
      - Scalable JSON-based data architecture — adding a new client requires no component changes
      - Authenticated project submission flow with Clerk, react-hook-form, and Zod

      ### Shopify App Refactor
      Inherited a ~4,000-line monolithic Shopify app and refactored it into modular React components with error boundaries, custom hooks, and full documentation. Also built a JSON-LD manager for SEO enhancements and dynamic Shopify asset injection.

      ### Recommendation
      > "He grew from a talented intern into a dependable developer capable of shipping production-ready features independently. Any team would benefit from his work ethic, technical skill, and positive attitude."
      >
      > — **Antoine Abribat**, Co-Founder & COO, Aeoflo AB

      ### Tech Stack
      Next.js 15/16, React, TypeScript, Tailwind CSS, Framer Motion, Chart.js, shadcn/ui, HubSpot API, Cloudflare R2, Clerk, react-hook-form, Zod, Formspree, JSON data architecture

      ### Learning Outcome
      This was my deepest production experience to date — shipping production features, iterating on designs based on stakeholder feedback, and owning the entire frontend independently. I learned how to design scalable data architectures, balance visual polish with performance, and communicate effectively across technical and non-technical boundaries.

  - title: "Death Calendar"
    date: "2026-02-27"
    description: "A minimalist iOS app that visualizes your entire life as a grid of dots, making time tangible to encourage intentional living."
    tags: ["Swift", "SwiftUI", "iOS", "MVVM", "UserDefaults", "Combine"]
    link: "https://death-calendar-web.netlify.app/"
    github: "https://github.com/odai-dh/LifeCircle"
    image: "/images/projects/death-calendar.jpg"
    content: |
      ### Overview
      > **Note:** The app isn't on the App Store yet because of Apple's $99/year Developer Program fee. A web preview is live at the link above.

      LifeCircle is an iOS app inspired by the "death calendar" concept, reimagined as a **motivational reflection tool** rather than a morbid reminder.
      It renders your entire life as a grid of dots — each one representing a year, month, week, or day — filled to show the time you've lived, and outlined to show what remains.
      The goal is simple: make time feel real, and live it more intentionally.

      ### Features
      - **Four Time Modes**: Switch between years, months, weeks, and days — rendering grids of up to 29,000+ dots with lazy loading
      - **Interactive Dot Tap**: Tap any dot to see the exact date range, your age at that moment, and any life events attached to it
      - **Life Events & Milestones**: Log events across 10 categories (Career, Travel, Family, Health, etc.) with emoji, description, and category color overlays on the grid
      - **Live Stats Panel**: Collapsible summary showing current age breakdown, total units lived vs. remaining, and a progress bar
      - **Smooth Onboarding**: First-launch flow captures birthdate and target lifespan with full input validation
      - **Settings Editor**: Update birthdate or target age at any time — the grid recalculates and re-animates instantly
      - **Zero Dependencies**: Fully self-contained — no third-party libraries, no backend, no cloud sync required

      ### Tech Stack
      - Built entirely with **SwiftUI** and **Swift** targeting iOS 15.0+
      - **MVVM architecture** with `@StateObject`, `@EnvironmentObject`, and `@Published` for reactive state management
      - **Combine** for observable data flow across the app
      - **UserDefaults** with **Codable** JSON encoding for lightweight, privacy-first local persistence
      - Pure function design via a dedicated `TimeCalculator` utility — deterministic, testable, side-effect-free

      ### How It Works
      1. **Onboarding**: Enter your birthdate and choose a target lifespan (default 80 years)
      2. **Visualization**: The app calculates every unit of time and renders a scrollable dot grid — orange dots for lived time, white outlines for what's ahead
      3. **Exploration**: Tap any dot to reveal its date range and any life events you've logged for that period
      4. **Reflection**: Switch between year/month/week/day views to shift your sense of scale
      5. **Logging**: Add milestones to your timeline — career moves, travel, relationships — and watch them appear as colored markers on the grid

      ### Architecture Highlights
      - **Lazy Rendering**: `LazyVStack` and on-demand dot generation keep Days mode (29K+ dots) performant without pre-allocating memory
      - **Dependency Injection**: Managers are created at the app root and injected via `.environmentObject()` — no singletons
      - **Single Source of Truth**: `UserSettingsManager` and `LifeEventManager` own all state; views are purely declarative
      - **Year-Based Calculations**: Time is calculated by calendar alignment, not raw day counts — ensuring leap years and decade boundaries render correctly

      ### Learning Outcomes
      This project deepened my understanding of **SwiftUI's reactive data model**, particularly how `@Published`, `@StateObject`, and `@EnvironmentObject` interact to build a fully reactive UI without UIKit.
      I learned how to handle **large dataset rendering** efficiently using lazy stacks and on-demand generation — a pattern directly applicable to any paginated or virtualized list.
      Building the `TimeCalculator` as a pure-function utility reinforced clean **separation of concerns** and made the logic easy to reason about and test independently.
      The project also taught me how to design a **dark, minimalist design system** from scratch — typography scales, spacing tokens, and animation curves — without relying on third-party UI libraries.
  - title: "BuzzyJeopardy"
    date: "2026-02-27"
    description: "A real-time multiplayer Jeopardy game for parties and game nights, with AI-generated questions and smart answer judging."
    tags: ["Next.js", "TypeScript", "Tailwind", "Firebase", "Google Gemini", "shadcn/ui", "Framer Motion", "React"]
    link: ""
    github: "https://github.com/odai-dh/buzzy-jeopardy"
    image: "/images/projects/buzzyjeopardy.png"
    content: |
      ### Overview
      > **Want to play with friends or family?** Clone the repo from GitHub, add your own [Google Gemini API key](https://aistudio.google.com/app/apikey) (it's free), and you're good to go.

      BuzzyJeopardy is the next evolution of the Jeopardy game format — rebuilt from the ground up as a **true couch multiplayer experience**.
      Instead of one screen and one player, every participant joins on their own device, buzzes in live, and competes in real-time.
      Whether it's a party, a classroom, or a team building night, BuzzyJeopardy turns any room into a game show.

      ### Features
      - **Real-Time Multiplayer**: Powered by Firebase — all players see updates instantly with no page refreshes
      - **Buzz-In System**: Players tap a giant BUZZ button to compete for the right to answer first
      - **AI-Generated Games**: Enter any topic and Google Gemini generates a full 5-category game in one API call
      - **AI Answer Judging**: Smart validation that accepts typos and paraphrasing — no more arguing over technicalities
      - **Daily Doubles**: Players wager their own points on special clues for high-stakes moments
      - **QR Code Join**: Guests scan a QR code to instantly join on their phones — no account needed
      - **30-Second Timer**: Countdown pressure keeps the game moving and the energy high
      - **Host Controls**: Dedicated host view to reveal clues, judge answers, and manage the game flow
      - **Live Scoreboard**: Real-time score tracking visible to everyone throughout the game

      ### Tech Stack
      - Built with **Next.js 15** and **React** for a fast, modern web experience
      - **Firebase Firestore** handles real-time game state synced across all devices
      - **Google Gemini AI** powers both question generation and intelligent answer validation
      - Styled with **Tailwind CSS** and **shadcn/ui** for a polished dark-themed UI
      - **Framer Motion** drives smooth animations throughout the game
      - Written in **TypeScript** for type-safe, maintainable code

      ### How It Works
      1. **Create**: Host enters a topic (or builds manually) — AI generates the full game board instantly
      2. **Invite**: Players join via a 6-digit code or QR code scan on their own phones
      3. **Play**: Host reveals clues, players race to buzz in and submit their answer
      4. **Judge**: Host marks correct/incorrect, or delegates to the AI judge for tricky answers
      5. **Win**: The player with the most points when the board is cleared takes the crown

      ### Upgrade from V1
      This project is a full rethink of my earlier solo Jeopardy clone. The core shift was from a single-device game with localStorage state to a **distributed, device-per-player architecture** using Firebase.
      I also swapped Hugging Face for Google Gemini and reduced game generation to a single optimized API call — making it faster and more reliable within free-tier limits.

      ### Learning Outcome
      Building BuzzyJeopardy pushed me into **real-time architecture design** — handling race conditions in buzz-in logic, syncing game state across multiple clients, and separating host vs. player views cleanly.
      I also deepened my experience with **Firebase Firestore**, **AI prompt engineering** for structured JSON output, and designing a UI that works equally well on a phone in someone's hand and a laptop on a table.
  - title: "Jeopardy AI"
    date: "2025-12-08"
    description: "An interactive Jeopardy-style trivia game powered by AI-generated questions using Hugging Face API."
    tags: ["Next.js", "TypeScript", "Tailwind", "Hugging Face AI", "shadcn/ui", "React"]
    link: "https://jeopardy-ai.netlify.app/"
    github: "https://github.com/odai-dh/TrivialTriumph"
    image: "/images/projects/jeopardy-ai.jpg"
    content: |
      ### Overview
      Trivial Triumph is a modern take on the classic Jeopardy game format, featuring **AI-powered question generation** to create unique trivia experiences every time.
      Players compete by answering questions across multiple categories, with point values ranging from 100 to 500.
      Built with cutting-edge web technologies and enhanced by AI, this project demonstrates full-stack development with intelligent features.

      ### Features
      - **AI-Generated Questions**: Uses Hugging Face's Qwen2.5-72B-Instruct model to create unique trivia questions dynamically
      - **Multiplayer Support**: Up to 8 players can compete simultaneously
      - **Persistent Game State**: Auto-saves game progress using localStorage
      - **Modern UI**: Beautiful animations and dark mode support with shadcn/ui components
      - **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
      - **Interactive Gameplay**: Click question values to reveal clues, award or deduct points
      - **Custom Categories**: Select from predefined categories or create your own

      ### Tech Stack
      - Built with **Next.js 15** and **React 19** for modern web performance
      - Styled with **Tailwind CSS** and **shadcn/ui** component library
      - AI integration via **Hugging Face Inference API**
      - Written in **TypeScript** for type safety and better developer experience
      - State management with React hooks and localStorage persistence

      ### How It Works
      1. **Setup Phase**: Players add their names and select 5 trivia categories
      2. **Question Generation**: AI generates 5 questions per category with varying difficulty (100-500 points)
      3. **Gameplay**: Players select questions from the board, reveal the clue, and answer
      4. **Scoring**: Points are awarded for correct answers or deducted for incorrect ones
      5. **Winner**: The player with the highest score at the end wins!

      ### Deployment
      Deployed on **Netlify** with serverless function support for AI API calls.
      Features environment variable configuration for secure API key management.

      ### Learning Outcome
      This project gave me hands-on experience with **AI API integration, real-time state management, localStorage persistence**, and building interactive multiplayer game logic.
      I learned how to optimize API calls to reduce token usage, implement sequential AI generation with progress tracking, and create an engaging user experience with modern UI/UX patterns.
      The project also taught me valuable lessons in **error handling, async operations**, and **responsive game design**.
  - title: "E-commerce Platform"
    date: "2025-08-24"
    description: "A full-stack e-commerce application built with Next.js, Node.js/Express, and MongoDB."
    tags: ["Next.js", "TypeScript", "Tailwind", "Node.js", "Express", "MongoDB"]
    link: "https://sellby.netlify.app/"
    github: "https://github.com/odai-dh/ecommerce"
    image: "/images/projects/e-commerce-platform.jpg"
    content: |
      ### Overview
        A full-stack e-commerce platform designed for a seamless shopping experience.  
        Users can browse products, view details, add to cart, and manage their profiles.  
        The backend provides secure authentication, product management, and inventory handling.

        ### Features
        - Responsive UI built with **Next.js, TailwindCSS, and DaisyUI**  
        - User authentication with **JWT**  
        - RESTful API with **Node.js & Express**  
        - Data storage with **MongoDB & Mongoose**  
        - Accessibility and SEO optimized with **Next.js Metadata API**  
        - Deployed on **Netlify** (frontend) and **Heroku/Render** (backend)  

        ### Learning Outcome
        This project gave me hands-on experience with full-stack development, authentication, API design, accessibility, and deployment workflows.
  - title: "Litorina School Website"
    date: "2025-08-24"
    description: "A modern school website built with React, TailwindCSS, and Vite for Litorina Folkhögskola."
    tags: ["React", "Vite", "Tailwind", "DaisyUI", "React Router", "Netlify"]
    link: "https://litorina-school.netlify.app/"
    github: "https://github.com/odai-dh/Litorina-School"
    image: "/images/projects/litorina-school-website.jpg"
    content: |
      ### Overview
      A collaborative project developed as part of Hyper Island’s **Code & Collaborate program**.  
      The goal was to modernize Litorina Folkhögskola’s website to better reflect their values and connect with younger audiences.  

      ### Features
      - Courses, News, Facilities, and Testimonials sections  
      - Fully responsive design across devices  
      - Styled with **TailwindCSS & DaisyUI**  
      - Fast builds and deployment using **Vite & Netlify**  

      ### My Contribution
      I worked on building and styling key sections of the site, translating the design team's mockups into responsive, accessible components. The project gave me hands-on experience delivering a real client solution under time constraints while collaborating across design, development, and project management roles.

      ### Learning Outcome
      This project gave me hands-on experience with **team collaboration, agile workflows, and delivering a real-world client solution**.
  - title: "StremVibe"
    date: "2025-08-24"
    description: "A movie database web app using the TMDB API, allowing users to browse, search, and watch trailers."
    tags: ["React", "TMDB API", "JavaScript", "Netlify"]
    link: "https://stram.netlify.app/"
    github: "https://github.com/odai-dh/StremVibe"
    image: "/images/projects/stremvibe.jpg"
    content: |
      ### Overview
      A streaming-inspired movie database built with **React** and integrated with the **TMDB API**.  
      Users can browse and search movies, view details, and watch trailers.  

      ### Features
      - Browse and search movies from TMDB  
      - View cast, details, and trailers  
      - Liked movies list and saved favorites  
      - Responsive design for all devices  
      - Deployed on **Netlify**  

      ### Learning Outcome
      This project helped me practice **API integration, state management, and building a multi-page React application with reusable components**.
  - title: "SpaceToon 3D"
    date: "2025-08-24"
    description: "An interactive VR solar system experience, where users explore space from inside a cockpit spaceship."
    tags: ["React", "Three.js", "A-Frame", "WebXR", "TypeScript", "Next.js"]
    link: "https://spacetoon-3d.netlify.app/"
    github: "https://github.com/odai-dh/spaceToon-3D"
    image: "/images/projects/spacetoon-3d.jpg"
    content: |
      ### Overview
      SpaceToon 3D is a **VR-ready web application** that lets users explore the solar system in an immersive 3D cockpit experience.  
      Built with **Three.js, A-Frame, and React**, the project supports WebXR devices like Meta Quest.  

      ### Features
      - Fully immersive cockpit with **6DoF spaceship controls**  
      - Realistic 3D planets, orbits, and sun  
      - Boost system, smooth flying, and free movement  
      - VR raycasting interaction for clickable UI  
      - Optimized and user-tested for comfort  

      ### Learning Outcome
      This project gave me hands-on experience with **3D rendering, VR interactions, and WebXR integration**, combining creative design with technical implementation.
  - title: "myHealth ID Digital Healthcare App"
    date: "2025-09-18"
    description: "A responsive UX/UI design for a digital healthcare platform where users can manage appointments, prescriptions, and family health cases."
    tags: ["Figma", "UX/UI Design", "Prototyping", "User Research"]
    link: "https://www.figma.com/proto/03juTRyTDZDbuKr9cbY18k/myHealth-ID?node-id=1-4&p=f&m=draw&scaling=scale-down&content-scaling=fixed&page-id=0%3A1"
    figma: "https://www.figma.com/file/03juTRyTDZDbuKr9cbY18k/myHealth-ID"
    github: "#"
    image: "https://placehold.co/1200x630.png"
    content: |
      ### Overview
      **myHealth ID** is a digital healthcare UX/UI concept designed to simplify the way individuals and guardians access and manage healthcare services.  
      The platform enables users to book appointments, request care, manage prescriptions, and switch between profiles (such as for children under 13).

      ### Design Process
      - **User Research**: Identified primary personas like busy parents and young adults managing their health independently.
      - **Wireframing**: Created low-fidelity sketches to map out key flows (e.g., selecting patient, starting new case, viewing health card).
      - **Prototyping**: Built interactive prototypes in **Figma**, emphasizing simplicity, clarity, and accessibility.
      - **Visual Design**: Applied a clean, health-oriented color palette and icon system for intuitive navigation.
      - **Usability Testing**: Collected early feedback from peers and iterated to improve information hierarchy and mobile usability.

      ### Tools Used
      - **Figma** for wireframing, prototyping, and visual design
      - **Design Tokens** and components for consistency
      - **Auto Layout** and variants for responsive behavior

      ### Learning Outcome
      This project deepened my understanding of user-centered healthcare design, mobile-first layout strategy, and the importance of managing multiple user personas (e.g., adult + child view).  
      It also strengthened my skills in design systems, user flow mapping, and presenting a seamless digital experience for a sensitive and important use case like health management.
  - title: "HyperKart"
    date: "2025-08-24"
    description: "A Mario Kart–inspired tournament website built with HTML, CSS, and JavaScript."
    tags: ["HTML", "CSS", "JavaScript", "Team Project"]
    link: "https://maybejod.github.io/hyperkart/"
    github: "https://github.com/antxhan/hyperkart"
    image: "/images/projects/hyperkart.jpg"
    content: |
      ### Overview
      HyperKart is a fun, interactive web project created as part of a team hackathon.  
      The website allows users to register, view rules, and participate in a Mario Kart–style tournament.  

      ### Features
      - Player registration form  
      - Rules and bracket pages for tournament structure  
      - Playful design with animations and themed styling  
      - Built collaboratively with **HTML, CSS, and JavaScript**  
      - Deployed via **GitHub Pages**  

      ### Learning Outcome
      This project was a chance to practice **team collaboration, creative frontend design, and interactive UI development** while keeping a playful theme.
  - title: "Naiman"
    date: "2025-08-24"
    description: "A startup project in active development. Details are under wraps for now."
    tags: ["Next.js", "TypeScript", "Tailwind", "Startup Project"]
    link: "#"
    github: "#"
    image: "https://placehold.co/1200x630.png"
    content: |
      ### Overview
      Naiman is a project I’m currently building — but it’s not time to reveal everything just yet.  
      What I can share is that it’s an ambitious idea with the potential to change how people interact with everyday services.  

      ### Status
      Still in active development.  
      Not yet public.  

      ### Sneak Peek
      While I’m keeping the details under wraps for now, Naiman is more than just another app.  
      It’s about **connection, convenience, and rethinking an experience people use every day**.  

      Stay tuned — the full story is coming soon.
---

Hey, I’m Odai — a Full Stack Developer who leans frontend, with hands-on experience building real products for startups and clients.

I’ve worked across the stack and across very different users: a multi-client analytics dashboard platform at **Aeoflo**, a sports-tech platform at **Sportly**, a website redesign for European heritage railways at **FEDECRAIL**, and projects like **Vidare**, a 3D concept app built around Swedish travel law, plus **iOS apps** and **AI-powered multiplayer games**. The range is the point: designing for FEDECRAIL's mostly 55+ audience is a different problem from building analytics dashboards, and I enjoy both.

Right now I’m taking on **freelance projects** while actively looking for my next full-time role. I love solving problems that mix creativity and logic, and when I’m not coding, you’ll probably find me [cooking](/cooking) 🍋.

If you’re working on something interesting, I’d love to hear about it.
