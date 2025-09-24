# Thistle Technologies Codelab System

A professional, modular presentation framework for technical workshops and codelabs using Reveal.js.

## 🎯 Features

- **Professional Design**: Clean, modern styling with Thistle/BeagleBoard branding
- **Modular Architecture**: Reusable framework for multiple codelabs
- **Accessibility**: Screen reader support, keyboard navigation, proper contrast
- **Interactive**: Copy-to-clipboard, progress tracking, speaker notes
- **Responsive**: Works on desktop, tablet, and mobile devices
- **No Dependencies**: Self-contained with CDN resources (works offline-first)

## 🏗️ Architecture

```
/thistle-codelabs/
├── /framework/              # Reusable presentation framework
│   ├── thistle-theme.css   # Custom Reveal.js theme
│   ├── codelab-framework.js # Enhanced functionality
│   └── codelab-template.html # Template for new codelabs
├── /codelabs/              # Individual codelab presentations
│   ├── /beagley-ai-thistle/ # BeagleY-AI + Thistle OTA workshop
│   │   └── codelab.html
│   └── /[future-codelabs]/ # Additional workshops
├── /shared/                # Shared resources
│   ├── /images/
│   └── /components/
└── README.md
```

## 🚀 Quick Start

### Running the BeagleY-AI Codelab

1. Open `codelabs/beagley-ai-thistle/codelab.html` in a web browser
2. Use arrow keys to navigate slides
3. Press 'S' for speaker notes
4. Press 'C' to copy code blocks
5. Press 'F' for fullscreen

### Creating a New Codelab

1. Copy the template:
   ```bash
   cp framework/codelab-template.html codelabs/my-new-codelab/codelab.html
   ```

2. Replace template variables:
   - `{{CODELAB_TITLE}}` - Workshop title
   - `{{CODELAB_SUBTITLE}}` - Brief description
   - `{{CODELAB_MISSION}}` - Learning objective
   - `{{CONTENT_SLIDES}}` - Your slide content
   - `{{SKILLS_LEARNED}}` - Skills participants will gain

3. Add your content between the title and thank you slides

## 🎨 Theme System

### CSS Variables

The theme uses CSS custom properties for easy customization:

```css
:root {
  --thistle-primary: #14b3c2;    /* Primary brand color */
  --thistle-secondary: #0ea5e9;   /* Secondary accent */
  --beagle-green: #22c55e;        /* BeagleBoard accent */
  --text-primary: #f8fafc;        /* Primary text */
  --bg-primary: #0f172a;          /* Background */
}
```

### Component Classes

- `.card` - Content containers with subtle background
- `.grid .grid-2 .grid-3` - Responsive grid layouts
- `.pill` - Small status indicators
- `.badge` - Colored status labels
- `.alert` - Information/warning/success boxes
- `.step` and `.step-number` - Sequential step indicators

## 🛠️ Enhanced Features

### Copy-to-Clipboard

- Automatic copy buttons on code blocks
- Keyboard shortcut: Press 'C' to copy current slide's first code block
- Visual feedback with success animation

### Progress Tracking

- Slide counter in top-left corner
- Progress bar at bottom
- Automatic slide numbering

### Accessibility

- Screen reader announcements for slide changes
- Keyboard navigation support
- High contrast colors
- Skip navigation link
- Proper ARIA labels

### Speaker Notes

Add speaker notes to any slide:

```html
<section>
  <h2>Slide Title</h2>
  <p>Slide content...</p>

  <aside class="notes">
    These are speaker notes that appear when you press 'S'.
    Great for workshop facilitators!
  </aside>
</section>
```

## 📱 Responsive Design

The framework adapts to different screen sizes:

- **Desktop**: Full-featured experience with all interactions
- **Tablet**: Optimized layout with touch-friendly controls
- **Mobile**: Simplified design with essential functionality
- **Print**: Clean, printer-friendly styles for handouts

## 🎯 BeagleY-AI Thistle Codelab

### Content Overview

1. **Introduction** - Why OTA updates matter
2. **File vs. Secure Boot** - Update strategy comparison
3. **Prerequisites** - Hardware and account setup
4. **Flash BeagleY-AI** - Using bb-imager with configuration
5. **SSH Connection** - Multiple connection methods
6. **Install Tools** - TRH (workstation) and TUC (device)
7. **Project Setup** - API tokens and device enrollment
8. **Create Update** - LED blink script with fallback
9. **Sign & Release** - Cryptographic signing and cloud upload
10. **Deploy & Test** - Running update client and verification
11. **Production Tips** - CI/CD integration and advanced features
12. **Troubleshooting** - Common issues and solutions

### Technical Accuracy

All commands and procedures are based on:
- [Thistle File Update Documentation](https://docs.thistle.tech/update/get_started/file_update)
- [BeagleY-AI Quick Start Guide](https://docs.beagleboard.org/boards/beagley/ai/02-quick-start.html)
- Current Thistle tool versions (1.6.0+)
- Production best practices

### Security Features Covered

- **Cryptographic Signing**: Remote KMS-backed signing
- **Verification**: Device-side signature validation
- **Atomic Updates**: All-or-nothing file installation
- **Rollback Safety**: Automatic rejection of bad updates
- **Trust Chain**: Device enrollment and authentication

## 🔧 Development

### Adding Features

The framework is designed for extensibility:

1. **CSS Components**: Add to `framework/thistle-theme.css`
2. **JavaScript Features**: Extend `framework/codelab-framework.js`
3. **Templates**: Update `framework/codelab-template.html`

### Best Practices

1. **No Scrolling**: Each slide should fit completely in viewport
2. **Progressive Disclosure**: Break complex concepts into steps
3. **Copy-Paste Ready**: All commands clearly formatted
4. **Visual Hierarchy**: Use consistent heading levels and spacing
5. **Professional Styling**: Maintain brand consistency

## 📚 Resources

- [Reveal.js Documentation](https://revealjs.com/)
- [Thistle Technologies](https://docs.thistle.tech/)
- [BeagleBoard.org](https://docs.beagleboard.org/)

## 🤝 Contributing

When adding new codelabs:

1. Use the template system
2. Follow the established visual design
3. Include comprehensive speaker notes
4. Test on multiple devices/browsers
5. Verify all technical content for accuracy

## 📄 License

This codelab system is designed for educational and professional training purposes. Respect the licensing terms of all included technologies and documentation sources.