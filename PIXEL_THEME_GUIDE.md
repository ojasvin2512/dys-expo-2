# Pixel Theme & Style Guide 🎮✨

I've added a complete **Pixel Gaming Theme** that matches your intro page aesthetic!

## 🎨 What Was Added

### 1. **New Theme: "Pixel"**
- Added to theme options in Settings
- Purple gradient background (#2d1b4e → #6b4a9e)
- Cyan, magenta, and yellow neon accents
- Gaming-inspired color palette
- Glowing text effects
- Neon borders and shadows

### 2. **New Background Style: "Pixel Art"**
- Added to background style options
- Animated twinkling stars
- Scrolling pixel buildings silhouette
- Matches intro page aesthetic
- Subtle animations

### 3. **Complete Theme System** (`styles/themes.css`)
- Comprehensive CSS variables
- Component-specific styling
- Animations and effects
- Responsive design

## 🎮 Theme Features

### **Color Palette**

#### Background Colors
- **Primary**: `#2d1b4e` (Deep Purple)
- **Secondary**: `#4a2c6f` (Medium Purple)
- **Tertiary**: `#6b4a9e` (Light Purple)

#### Text Colors
- **Primary**: White
- **Secondary**: Light Purple (`#e0d0ff`)
- **Tertiary**: Soft Purple (`#c0a0ff`)
- **Muted**: Muted Purple (`#a080d0`)

#### Accent Colors
- **Cyan**: `#00ffff` (Primary accent)
- **Magenta**: `#ff00ff` (Secondary accent)
- **Yellow**: `#ffff00` (Tertiary accent)
- **Success**: `#00ff88` (Green)
- **Warning**: `#ffaa00` (Orange)
- **Error**: `#ff0080` (Pink)

### **Visual Effects**

#### Glow Effects
- **Cyan Glow**: `0 0 20px rgba(0, 255, 255, 0.6)`
- **Magenta Glow**: `0 0 20px rgba(255, 0, 255, 0.6)`
- **Yellow Glow**: `0 0 20px rgba(255, 255, 0, 0.6)`

#### Text Shadows
- Headings have cyan glow
- Accent text has magenta glow
- Links have subtle glow effects

#### Border Styles
- 2-3px solid borders
- Neon colors (cyan, magenta, yellow)
- Glowing box shadows

## 🎯 Styled Components

### **Buttons**
- Rainbow gradient background (pink → orange → yellow)
- Cyan border with glow
- Hover: Lifts up with enhanced glow
- Active: Presses down
- Shine animation overlay

### **Input Fields**
- Semi-transparent purple background
- Cyan border
- Focus: Magenta border with glow
- Placeholder text in muted purple

### **Message Bubbles**
- Semi-transparent card background
- User messages: Cyan border with glow
- Assistant messages: Magenta border with glow
- Backdrop blur effect

### **Cards & Panels**
- Semi-transparent purple background
- Cyan border
- Cyan glow shadow
- Backdrop blur

### **Sidebar**
- Deep purple background
- Cyan border on right
- Subtle cyan glow

### **Header**
- Medium purple background
- Cyan border on bottom
- Subtle cyan glow

### **Scrollbar**
- Dark purple track
- Cyan thumb with glow
- Hover: Magenta with enhanced glow

### **Badges & Tags**
- Gradient background (cyan → magenta)
- Yellow border
- Multi-color glow
- Bold white text

### **Progress Bars**
- Purple background
- Cyan border
- Gradient fill (cyan → magenta → yellow)
- Shine animation

### **Modals & Dialogs**
- Deep purple background
- Thick cyan border
- Strong cyan glow
- Heavy backdrop blur

### **Tables**
- Cyan border
- Purple header with cyan text
- Hover: Highlight row
- Glowing header text

### **Code Blocks**
- Dark purple background
- Tertiary border
- Yellow text
- Courier New font

### **Links**
- Cyan color with glow
- Hover: Magenta with enhanced glow
- No underline

## 🌟 Background Style: Pixel Art

### **Features**
- **Twinkling Stars**: 10 animated stars in various colors
- **Scrolling Buildings**: Pixel art building silhouettes
- **Gradient Base**: Purple gradient background
- **Animations**: Smooth, subtle movements

### **Animations**
- Stars twinkle (opacity pulse, 4s)
- Buildings scroll left (30s loop)
- Non-intrusive, performance-optimized

## 🎨 How to Use

### **Enable Pixel Theme**
1. Open Settings (⚙️ icon)
2. Go to "Theme" section
3. Click "Pixel" button
4. Theme applies instantly!

### **Enable Pixel Art Background**
1. Open Settings
2. Go to "Background Style" section
3. Click "Pixel Art" button
4. Background applies instantly!

### **Best Combination**
- **Theme**: Pixel
- **Background**: Pixel Art
- Creates cohesive gaming aesthetic!

## 🎮 Component Examples

### **Button Styling**
```css
/* Gradient background with glow */
background: linear-gradient(135deg, #ff0080 0%, #ff8c00 50%, #ffff00 100%);
border: 2px solid #00ffff;
box-shadow: 0 0 30px rgba(0, 255, 255, 0.6);
```

### **Card Styling**
```css
/* Semi-transparent with glow */
background: rgba(45, 27, 78, 0.8);
border: 2px solid #00ffff;
box-shadow: 0 0 20px rgba(0, 255, 255, 0.6);
backdrop-filter: blur(10px);
```

### **Text Glow**
```css
/* Cyan glow effect */
color: #00ffff;
text-shadow: 
  0 0 10px rgba(0, 255, 255, 0.8),
  0 0 20px rgba(0, 255, 255, 0.5);
```

## 🎯 CSS Variables

All theme colors are available as CSS variables:

```css
/* Use in your components */
.my-component {
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 2px solid var(--border-primary);
  box-shadow: var(--shadow-glow-cyan);
}
```

### **Available Variables**
- `--bg-primary`, `--bg-secondary`, `--bg-tertiary`
- `--text-primary`, `--text-secondary`, `--text-tertiary`, `--text-muted`
- `--accent-primary`, `--accent-secondary`, `--accent-tertiary`
- `--accent-success`, `--accent-warning`, `--accent-error`
- `--border-primary`, `--border-secondary`, `--border-tertiary`
- `--shadow-glow-cyan`, `--shadow-glow-magenta`, `--shadow-glow-yellow`
- `--card-bg`, `--card-border`
- `--button-bg`, `--button-border`
- `--input-bg`, `--input-border`
- `--scrollbar-track`, `--scrollbar-thumb`, `--scrollbar-thumb-hover`

## 🎨 Customization

### **Adjust Colors**
Edit `styles/themes.css` and modify the CSS variables in `.pixel` class:

```css
.pixel {
  --accent-primary: #00ffff; /* Change cyan */
  --accent-secondary: #ff00ff; /* Change magenta */
  --accent-tertiary: #ffff00; /* Change yellow */
}
```

### **Adjust Glow Intensity**
Modify shadow values:

```css
--shadow-glow-cyan: 0 0 30px rgba(0, 255, 255, 0.8); /* Stronger glow */
```

### **Adjust Background Animation**
Change animation duration in `@keyframes`:

```css
@keyframes scrollPixelBuildings {
  /* Change 30s to adjust speed */
  animation: scrollPixelBuildings 20s linear infinite;
}
```

## 📱 Responsive Design

The pixel theme is fully responsive:
- Adjusts glow intensity on mobile
- Scales text appropriately
- Maintains visual hierarchy
- Optimizes animations for performance

## 🎮 Perfect Match

The Pixel theme and Pixel Art background perfectly match your intro page:
- Same color palette
- Same visual style
- Consistent neon effects
- Cohesive gaming aesthetic

## 🚀 Performance

- CSS-only animations (GPU accelerated)
- Efficient pseudo-elements
- Optimized backdrop filters
- Smooth 60fps animations
- Low memory footprint

## 🎯 Accessibility

- High contrast text
- Clear visual hierarchy
- Readable font sizes
- Distinct interactive states
- Keyboard-friendly

Enjoy your new pixel gaming theme! 🎮✨🚀
