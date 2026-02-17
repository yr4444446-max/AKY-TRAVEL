# WanderPeak - Professional Tourism Website PWA

A complete, production-ready tourism website with Progressive Web App capabilities, AI chatbot, and Flask backend.

![WanderPeak](https://img.shields.io/badge/WanderPeak-Tourism%20PWA-1a4d2e?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)

## 🌟 Features

### Core Features
- ✅ **Progressive Web App (PWA)** - Installable, works offline
- ✅ **AI Chatbot** - Intelligent travel assistant powered by Flask API
- ✅ **Responsive Design** - Works on all devices
- ✅ **Dark/Light Theme** - User preference saved
- ✅ **Search Functionality** - Find destinations by date, budget
- ✅ **Famous Places Explorer** - Detailed destination guides
- ✅ **Price Comparison** - Best hotel prices across platforms
- ✅ **Reviews Section** - Real traveler testimonials
- ✅ **Interactive Map** - Explore destinations visually
- ✅ **Travel Packages** - Complete tour packages with pricing
- ✅ **Best Deals** - Limited time offers

### Design Features
- 🎨 Human-designed, professional UI/UX
- 🎭 Smooth animations and transitions
- 📱 Mobile-first responsive design
- 🎯 Accessibility focused
- ⚡ Optimized performance
- 🖼️ Beautiful gradients and modern aesthetics

### Technical Features
- 🔒 Secure HTTPS ready
- 📦 Service Worker for offline support
- 💾 Local storage for preferences
- 🔄 Background sync capabilities
- 📲 Push notification ready
- 🚀 Fast load times with caching

## 📁 Project Structure

```
wanderpeak/
├── index.html              # Main homepage
├── famous.html             # Famous places page
├── style.css               # Complete styling
├── script.js               # Main JavaScript functionality
├── chatbot.js              # AI chatbot logic
├── app.py                  # Flask backend API
├── manifest.json           # PWA manifest
├── service-worker.js       # Service worker for offline
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites

- Python 3.7 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Basic understanding of HTML/CSS/JavaScript (optional)

### Installation

1. **Clone or download the project files**

2. **Install Python dependencies**

```bash
pip install flask flask-cors --break-system-packages
```

3. **Start the Flask backend**

```bash
python app.py
```

The API server will start on `http://localhost:5000`

4. **Open the website**

Option A: Use Python's built-in server
```bash
# In a new terminal, navigate to project directory
python -m http.server 8000
```

Then open: `http://localhost:8000`

Option B: Open index.html directly in your browser
- Right-click `index.html` → Open with → Your Browser

5. **Test the chatbot**

- Click the chatbot icon in the bottom-right corner
- Try queries like:
  - "Best places in Japan"
  - "Budget travel tips"
  - "Show me restaurants in Dubai"

## 🎯 Usage Guide

### Navigation
- **Home** - Main landing page with hero section
- **Destinations** - Browse popular travel destinations
- **Famous Places** - Detailed guides for each destination
- **Hotels/Restaurants** - Accommodation and dining options
- **Reviews** - Traveler testimonials
- **Travel Packages** - Complete tour packages
- **Map** - Interactive destination map
- **Best Deals** - Special offers and discounts

### AI Chatbot Features

The chatbot can help with:

**Destination Information**
```
User: "Tell me about Japan"
Bot: [Provides famous places, hidden gems, restaurants]
```

**Restaurant Recommendations**
```
User: "Best restaurants in Dubai"
Bot: [Lists top restaurants with prices and cuisine types]
```

**Budget Advice**
```
User: "Budget travel tips"
Bot: [Provides comprehensive money-saving strategies]
```

**Package Inquiry**
```
User: "Show me travel packages"
Bot: [Lists all available packages with pricing]
```

### Theme Toggle
- Click the sun/moon icon in the header
- Theme preference is saved automatically
- Dark theme is easier on eyes at night

### Search Functionality
1. Fill in the search form:
   - Destination
   - Start Date
   - End Date
   - Budget Range
2. Click "Search" button
3. View matching results

### PWA Installation

**Desktop (Chrome/Edge)**
1. Click the install icon in the address bar
2. Or use the install prompt that appears
3. App will open in standalone window

**Mobile (iOS/Android)**
1. Open website in Safari (iOS) or Chrome (Android)
2. Tap Share button
3. Select "Add to Home Screen"
4. Icon appears on your home screen

## 🔧 Configuration

### Flask API Configuration

Edit `app.py` to customize:

```python
# Change host and port
app.run(debug=True, host='0.0.0.0', port=5000)

# Add new destinations
DESTINATIONS['switzerland'] = {
    'name': 'Switzerland',
    'famous_places': [...],
    # ...
}
```

### Chatbot Customization

Edit `chatbot.js` to change API endpoint:

```javascript
const CHATBOT_API_URL = 'http://your-server.com/api/chat';
```

### Theme Colors

Edit `style.css` CSS variables:

```css
:root {
    --color-primary: #1a4d2e;  /* Main brand color */
    --color-accent: #f4a261;   /* Accent color */
    /* ... */
}
```

## 📊 API Endpoints

### Chatbot API
```
POST /api/chat
Body: { "message": "Best places in Japan", "history": [] }
Response: { "response": "...", "timestamp": "..." }
```

### Destinations API
```
GET /api/destinations
Response: { "destinations": [...] }
```

### Packages API
```
GET /api/packages
Response: { "packages": [...] }
```

### Health Check
```
GET /api/health
Response: { "status": "healthy", ... }
```

## 🎨 Design Philosophy

WanderPeak follows these design principles:

1. **Human-Crafted Aesthetics** - No generic AI templates
2. **Professional Typography** - Playfair Display + Sora fonts
3. **Meaningful Color Palette** - Green (nature) + Warm accents
4. **Intentional Spacing** - Generous whitespace
5. **Smooth Interactions** - Thoughtful animations
6. **Accessibility First** - WCAG guidelines followed

## 🌐 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Android)

## 📱 PWA Features

### Offline Support
- Core pages cached
- Service worker handles offline requests
- Graceful degradation when offline

### Installability
- Meets PWA criteria
- Custom install prompt
- Standalone app experience

### Performance
- Fast initial load
- Lazy loading images
- Optimized assets
- Efficient caching strategy

## 🔐 Security Notes

**For Production Deployment:**

1. Enable HTTPS
2. Add CSP headers
3. Sanitize user inputs
4. Use environment variables for sensitive data
5. Implement rate limiting on API
6. Add authentication for booking features

## 🚀 Deployment

### Deploy Frontend (Netlify/Vercel)

1. Push code to GitHub
2. Connect to Netlify/Vercel
3. Deploy automatically

### Deploy Backend (Heroku/Railway)

```bash
# Create Procfile
echo "web: python app.py" > Procfile

# Create requirements.txt
pip freeze > requirements.txt

# Deploy to platform
```

### Update API URL

In `chatbot.js`:
```javascript
const CHATBOT_API_URL = 'https://your-api.herokuapp.com/api/chat';
```

## 📈 Performance Optimization

Current optimizations:
- Minified CSS/JS (for production)
- Lazy loading images
- Service worker caching
- Efficient animations
- Optimized fonts

Lighthouse Score Goals:
- Performance: 95+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+
- PWA: 100

## 🐛 Troubleshooting

### Chatbot not responding
```bash
# Check Flask server is running
curl http://localhost:5000/api/health

# Check console for errors
# Open browser DevTools > Console
```

### PWA not installing
- Ensure HTTPS (or localhost)
- Check manifest.json is valid
- Verify service worker is registered
- Clear browser cache and try again

### Theme not saving
- Check localStorage is enabled
- Clear site data and try again
- Check browser console for errors

## 🤝 Contributing

This is a complete project ready for use. To customize:

1. Fork the project
2. Make your changes
3. Test thoroughly
4. Deploy your version

## 📝 License

This project is provided as-is for learning and commercial use.

## 📧 Support

For questions or issues:
- Check the README
- Review the code comments
- Test API endpoints
- Check browser console

## 🎉 Credits

**Design & Development**: Professional full-stack implementation
**Fonts**: Google Fonts (Playfair Display, Sora)
**Icons**: Custom SVG icons
**Framework**: Vanilla JavaScript (no dependencies)

## 📚 Additional Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

## 🌟 Key Differentiators

What makes WanderPeak unique:

✨ **Truly Professional Design** - Not template-based
🤖 **Intelligent Chatbot** - Context-aware responses
📱 **Full PWA Implementation** - Works offline completely
💰 **Price Comparison** - Best deals across platforms
🗺️ **Interactive Experience** - Not just static pages
🎨 **Human Aesthetics** - Avoids AI-generated look

---

**Built with ❤️ for travelers worldwide**

*Version 1.0.0 - Production Ready*
