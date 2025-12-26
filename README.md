# Ajibola Akelebe Portfolio - React Version

This is a React conversion of the Ajibola Akelebe portfolio website, originally built with vanilla JavaScript, HTML, and SCSS.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
portfolio/
├── src/
│   ├── components/       # React components
│   │   ├── Loader.jsx
│   │   ├── Nav.jsx
│   │   ├── Header.jsx
│   │   ├── About.jsx
│   │   ├── Works.jsx
│   │   └── Footer.jsx
│   ├── pages/            # Page components
│   │   ├── Home.jsx
│   │   └── Approach.jsx
│   ├── hooks/             # Custom React hooks
│   │   ├── useClock.js
│   │   ├── useLocomotiveScroll.js
│   │   ├── useColorChanger.js
│   │   ├── useProjectHover.js
│   │   ├── useFooterEyes.js
│   │   └── useAnimations.js
│   ├── css/               # SCSS stylesheets
│   │   ├── main.scss
│   │   ├── components/
│   │   ├── pages/
│   │   └── utilities/
│   ├── assets/            # Images and videos
│   ├── fonts/             # Custom fonts
│   ├── App.jsx            # Main app component with routing
│   └── main.jsx           # Entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🎨 Features

- **Smooth Scrolling**: Locomotive Scroll integration
- **Animations**: GSAP animations with ScrollTrigger
- **Dynamic Theming**: Color changes on scroll
- **Interactive Elements**:
  - Project hover effects
  - Animated SVG eyes in footer
  - Real-time clock
- **Responsive Design**: Mobile-first approach
- **React Router**: Client-side routing

## 🔧 Technologies

- **React 18** - UI library
- **React Router** - Routing
- **Vite** - Build tool
- **Locomotive Scroll** - Smooth scrolling
- **GSAP** - Animation library
- **SCSS** - Styling

## 📝 Key Changes from Vanilla JS Version

1. **Component-based Architecture**: HTML sections converted to React components
2. **Custom Hooks**: JavaScript modules converted to React hooks
3. **React Router**: Client-side routing instead of separate HTML files
4. **Lifecycle Management**: Proper cleanup of event listeners and animations
5. **State Management**: React state for clock and other dynamic content

## 🐛 Troubleshooting

If you encounter issues:

1. **Port already in use**: Change the port in `vite.config.js`
2. **Fonts not loading**: Ensure fonts are in `src/fonts/` directory
3. **Assets not found**: Check that assets are in `src/assets/` and use `/assets/` in paths
4. **Animations not working**: Ensure Locomotive Scroll and GSAP are properly initialized

## 📄 License

All rights reserved.
