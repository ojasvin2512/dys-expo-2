# DysLearn AI - Learning Platform 🎮✨

A modern, pixel-art themed AI-powered learning platform designed for students with dyslexia and learning differences.

![DysLearn AI](https://img.shields.io/badge/DysLearn-AI%20Learning%20Platform-purple?style=for-the-badge&logo=react)
![Theme](https://img.shields.io/badge/Theme-Pixel%20Gaming-cyan?style=for-the-badge)
![Accessibility](https://img.shields.io/badge/Accessibility-Dyslexia%20Friendly-green?style=for-the-badge)

## 🎮 Features

### **Pixel Gaming Theme**
- **Retro aesthetic** with purple gradients and neon accents
- **Animated intro page** with pixel characters and floating platforms
- **Glowing UI elements** with cyan, magenta, and yellow neon colors
- **Special bold text styling** in chat with animated glow effects
- **Pixel art background** with twinkling stars and scrolling buildings

### **AI-Powered Learning**
- Interactive chat-based learning
- Image generation for visual explanations
- Multiple language support
- Offline challenges and games
- Progress tracking and achievements

### **Accessibility Features**
- **Dyslexia-friendly design** with customizable fonts and spacing
- **Reading ruler** for better text tracking
- **Text-to-speech** with language-aware voice selection
- **Hover speech** for UI elements
- **High contrast themes** and visual indicators

### **Gamification**
- **Points system** with daily goals
- **Achievement badges** with celebration effects
- **Progress tracking** with visual charts
- **Mini-games** (Tetris, Flappy Bird, Dino Game)
- **Challenge system** with offline support

## 🎨 Themes

### **Available Themes:**
- **Pixel** (Default) - Gaming aesthetic with neon glows
- Light, Dark, Sepia
- Ocean, Forest, Sunset
- Lavender, Midnight, Cream

### **Background Styles:**
- **Pixel Art** (Default) - Animated stars and buildings
- Grid, Dots, Gradient
- Cosmic, Playful

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Modern web browser

### **Installation**
```bash
# Clone the repository
git clone https://github.com/yourusername/dyslearn-ai.git

# Navigate to project directory
cd dyslearn-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Environment Setup**
Create a `.env` file with your API keys:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
```

## 🎯 Usage

### **First Time Experience**
1. **Intro Page** - Pixel art welcome screen with animated elements
2. **Press ENTER** - Cool transition effect to main app
3. **Main App** - Pixel theme with consistent gaming aesthetic

### **Chat Features**
- Type questions or requests
- **Bold text** appears with neon glow effects
- Image generation for visual explanations
- Voice input and text-to-speech

### **Customization**
- Access Settings (⚙️) to customize:
  - Theme selection
  - Background style
  - Dyslexia settings
  - Language preferences
  - Voice options

## 🎮 Special Features

### **Pixel Theme Bold Text**
Bold text in chat messages features:
- **Animated glow effects** with pulsing
- **Color-coded by context**:
  - Assistant messages: Magenta glow
  - User messages: Cyan glow
  - General bold: Yellow glow
- **Hover effects** with scaling and brightness
- **Monospace font** for retro gaming feel

### **Intro Page**
- **Floating pixel characters** with bounce animations
- **Animated platforms** moving up and down
- **Scrolling background** with buildings and clouds
- **Twinkling stars** with opacity animations
- **Neon UI elements** with glow effects
- **Cool transition** with pixel wipe effect

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **AI Integration**: Google Gemini API, OpenRouter
- **Animations**: CSS animations, Canvas Confetti
- **Accessibility**: Web Speech API, Custom dyslexia features
- **State Management**: React hooks, localStorage
- **Build Tool**: Vite

## 📁 Project Structure

```
dyslearn-ai/
├── components/           # React components
│   ├── IntroPage.tsx    # Pixel art intro page
│   ├── ChatFeed.tsx     # Main chat interface
│   ├── SettingsModal.tsx # Theme and settings
│   └── ...
├── styles/              # CSS and themes
│   ├── IntroPage.css    # Intro page styling
│   ├── themes.css       # Pixel theme system
│   └── ...
├── data/                # Educational content
├── services/            # API integrations
└── types.ts            # TypeScript definitions
```

## 🎨 Customization

### **Adding New Themes**
1. Add theme name to `types.ts`
2. Create CSS variables in `styles/themes.css`
3. Add to theme options in `SettingsModal.tsx`

### **Modifying Pixel Theme**
Edit `styles/themes.css`:
```css
.pixel {
  --accent-primary: #00ffff;    /* Cyan */
  --accent-secondary: #ff00ff;  /* Magenta */
  --accent-tertiary: #ffff00;   /* Yellow */
}
```

## 🌟 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

- [ ] More pixel art animations
- [ ] Additional mini-games
- [ ] Voice chat integration
- [ ] Mobile app version
- [ ] Multiplayer learning sessions
- [ ] Advanced AI tutoring

## 🤝 Support

- **Issues**: Report bugs or request features
- **Discussions**: Share ideas and get help
- **Documentation**: Check the `/docs` folder for detailed guides

## 🎮 Screenshots

### Intro Page
![Intro Page](screenshots/intro-page.png)
*Pixel art intro with animated characters and platforms*

### Main Chat Interface
![Chat Interface](screenshots/chat-interface.png)
*Pixel theme with glowing bold text and neon UI elements*

### Settings Panel
![Settings](screenshots/settings.png)
*Theme selection with pixel gaming aesthetic*

---

**Made with ❤️ for learners with dyslexia and learning differences**

*Combining modern AI technology with retro gaming aesthetics to create an engaging, accessible learning experience.*