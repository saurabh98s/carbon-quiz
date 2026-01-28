# Carbon Readiness Assessment Quiz

A beautiful, interactive sustainability assessment quiz built with React, TypeScript, and Framer Motion. This quiz helps organizations evaluate their carbon reduction maturity across 9 key sustainability areas.

## Features

✨ **Beautiful Design**: Dark theme with green accents matching C9 Central's aesthetic
🎯 **Interactive Quiz**: 45 questions across 9 sustainability categories
📊 **Data Visualization**: Bar charts and radar charts for results analysis
🎨 **Smooth Animations**: Framer Motion animations for delightful UX
📱 **Responsive**: Mobile-first design with touch-friendly interactions
🏆 **Scoring System**: 4-tier system (Explorer, Builder, Achiever, Leader)
💡 **Personalized Recommendations**: Actionable insights based on your score

## Sustainability Categories

1. **Energy & Emissions** ⚡ - Track and reduce your carbon footprint
2. **Water Use & Treatment** 💧 - Monitor and optimize water consumption
3. **Waste & Circularity** ♻️ - Implement circular economy principles
4. **Sustainable Procurement** 📦 - Choose eco-friendly suppliers
5. **ESG Compliance & Integrity** 📊 - Ensure regulatory compliance
6. **Governance & Culture** 👥 - Build sustainable leadership
7. **Nature & Community Impact** 🌳 - Protect ecosystems and communities
8. **Digital & Operational Efficiency** 🖥️ - Leverage technology for sustainability
9. **Audit Readiness & Transparency** 📈 - Prepare for audits and reporting

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Framer Motion** - Smooth animations and transitions
- **Recharts** - Beautiful data visualizations
- **Lucide React** - Modern icon library
- **Vite** - Fast build tool and dev server

## Getting Started

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/          # React components
│   ├── WelcomeScreen.tsx
│   ├── QuizScreen.tsx
│   ├── ResultsScreen.tsx
│   └── LoadingScreen.tsx
├── data/
│   └── quizData.ts      # Quiz questions and sections
├── types/
│   └── quiz.ts          # TypeScript interfaces
├── App.tsx              # Main application component
├── App.css              # Component-specific styles
└── index.css            # Global styles
```

## Scoring System

- **Explorer (0-30%)**: 🌱 Just getting started
- **Builder (31-60%)**: 🌿 Taking steps toward sustainability
- **Achiever (61-85%)**: 🌲 Mature practices, close to audit-ready
- **Leader (86-100%)**: 🌳 Green trailblazer, ready for certification

## Customization

The quiz is fully customizable. You can:

- Modify questions in `src/data/quizData.ts`
- Adjust scoring logic in `src/App.tsx`
- Customize colors and styling in `src/index.css`
- Add new chart types in `src/components/ResultsScreen.tsx`

## License

This project is part of the C9 Central sustainability initiative. Contact us for collaboration opportunities.

---

**Built with ❤️ for a sustainable future by C9 Central**