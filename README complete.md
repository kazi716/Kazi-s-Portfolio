# 🚀 Kazi Md Samim Faraj — Portfolio

A modern, interactive portfolio website for a Cybersecurity & Cloud Engineering student. Built with vanilla HTML/CSS/JS — no frameworks, no build step.

![Portfolio Preview](https://img.shields.io/badge/Portfolio-Live-success?style=flat-square)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

---

## ✨ Features

### 🖱️ Custom Animated Cursor
- Smooth lag-follow cursor with outer ring + inner dot
- Hover state expansion on interactive elements (links, buttons, cards)
- Magnetic effect on stat cards
- GPU-accelerated with `will-change` and `requestAnimationFrame`

### 📜 Clickable Certificates
- All **15 certifications** are clickable and link to their respective platforms
- Anthropic, AWS, Google Cloud, Cisco, OPSWAT, NexFellow
- Hover effects with color transitions

### 📄 PDF Resume Generator
- One-click **"Download Resume PDF"** button
- Generates a clean, professional **black-and-white A4 PDF**
- Includes: Summary, Education, Experience, Skills, Projects, Certifications
- Powered by [jsPDF](https://github.com/parallax/jsPDF)

### ⚡ Live GitHub Dev Pulse
- Real-time GitHub API integration for user `kazi716`
- Displays live stats: **Repos, Streak, Contributions, Stars**
- Shows top 3 repositories with language and star count
- Graceful fallback if API rate limit is hit

### 🎨 Visual Effects
- Particle network background with mouse interaction
- Scroll progress bar
- Scanline overlay for subtle texture
- Smooth scroll navigation with scroll spy
- Back-to-top button

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Structure | HTML5 |
| Styling | CSS3 (Custom Properties, Grid, Flexbox) |
| Logic | Vanilla JavaScript (ES5 for compatibility) |
| PDF Generation | jsPDF 2.5.1 (CDN) |
| Data | GitHub REST API v3 |
| Icons | Inline SVG |

---

## 📁 File Structure

```
portfolio/
├── index.html          # Single-file portfolio (self-contained)
└── README.md           # This file
```

> **Note:** The entire portfolio is a single HTML file. All CSS, JavaScript, SVG icons, and even the profile image (base64) are embedded inline. No external assets required except the jsPDF CDN.

---

## 🚀 Getting Started

### Option 1: Direct Open
Simply double-click `index.html` or open it in any modern browser:
```bash
# macOS
open index.html

# Linux
xdg-open index.html

# Windows
start index.html
```

### Option 2: Local Server (recommended for GitHub API)
```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```
Then visit `http://localhost:8000`

> Using a local server ensures the GitHub API calls work without CORS issues.

---

## ⚙️ Configuration

### Change GitHub Username
Edit the JavaScript variable in `index.html`:
```javascript
var ghUsername = 'kazi716';  // Change to your GitHub username
```

### Update Certificate Links
Certificate URLs are mapped in the `cert_links` object:
```javascript
var cert_links = {
    'AI Fluency for Students': 'https://...',
    // ...
};
```

### Customize PDF Content
The PDF generator is fully self-contained in the `<script>` section. Edit the `addText`, `addBullet`, and section blocks to match your profile.

---

## 🎨 Customization

### Colors
All colors are CSS custom properties in `:root`:
```css
:root {
  --bg: #0d1117;           /* Background */
  --surface: #161b22;      /* Card backgrounds */
  --accent: #3b82f6;       /* Primary accent (blue) */
  --positive: #22c55e;     /* Success green */
  --warning: #f59e0b;      /* Warning orange */
  --text-primary: #e6edf3; /* Main text */
}
```

### Particle Settings
```javascript
var PARTICLE_COUNT = 120;    // Number of particles
var CONNECTION_DIST = 100;   // Max connection distance
var MOUSE_RADIUS = 150;      // Mouse repulsion radius
```

---

## 📱 Browser Support

| Browser | Status |
|---------|--------|
| Chrome 90+ | ✅ Fully supported |
| Firefox 88+ | ✅ Fully supported |
| Safari 14+ | ✅ Fully supported |
| Edge 90+ | ✅ Fully supported |

> Requires ES6+ support (const/let, arrow functions, fetch API). For older browsers, use the Babel-transpiled version.

---

## 🔒 API Rate Limits

The GitHub integration uses **unauthenticated requests**:
- **Limit:** 60 requests per hour per IP
- **Scope:** User data + repos + events

If the limit is exceeded, the section shows a fallback message with a direct profile link.

To increase the limit to **5,000 requests/hour**, add a GitHub Personal Access Token:
```javascript
fetch('https://api.github.com/users/' + ghUsername, {
    headers: { 'Authorization': 'token YOUR_TOKEN' }
})
```

---

## 📝 Changelog

### v1.2.0 (2026-08-04)
- ✅ Fixed section switching (sections now properly inside `kp-content`)
- ✅ Fixed extra whitespace in Contact section
- ✅ Added PDF resume generator
- ✅ Added live GitHub Dev Pulse
- ✅ Made all certificates clickable

### v1.1.0 (2026-08-04)
- ✅ Fixed custom cursor visibility
- ✅ Fixed `kp-root` / `kp-nav` ID references
- ✅ Enhanced cursor with smooth transitions

### v1.0.0 (2026-08-04)
- 🎉 Initial release
- Particle background, scroll spy, custom cursor
- Responsive layout, dark theme

---

## 🤝 Contributing

This is a personal portfolio, but suggestions are welcome! Open an issue or fork and customize for your own use.

### Ideas for Extensions
- [ ] Add dark/light theme toggle
- [ ] Add blog section with Markdown support
- [ ] Add contact form with Formspree/EmailJS
- [ ] Add project screenshots carousel
- [ ] Add service worker for offline PWA support

---

## 📄 License

**MIT License** — feel free to use this template for your own portfolio. Attribution appreciated but not required.

```
Copyright (c) 2026 Kazi Md Samim Faraj

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 📬 Contact

- **Email:** [samimkazi716@gmail.com](mailto:samimkazi716@gmail.com)
- **GitHub:** [@kazi716](https://github.com/kazi716)
- **LinkedIn:** [kazi-md-samim-faraj](https://linkedin.com/in/kazi-md-samim-faraj)

---

<p align="center">
  <sub>Built with 💙 by Kazi Md Samim Faraj</sub>
</p>
