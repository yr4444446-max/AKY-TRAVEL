// WanderPeak AI Chatbot
// ========================================

// Configuration
const CHATBOT_API_URL = 'http://localhost:5000/api/chat';

// DOM Elements
const chatbotContainer = document.getElementById('chatbotContainer');
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotWindow = document.getElementById('chatbotWindow');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatbotForm = document.getElementById('chatbotForm');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotMinimize = document.getElementById('chatbotMinimize');

// State
let chatHistory = [];
let isWaitingForResponse = false;

// Toggle Chatbot
if (chatbotToggle) {
    chatbotToggle.addEventListener('click', () => {
        chatbotContainer.classList.toggle('active');
        if (chatbotContainer.classList.contains('active')) {
            chatbotInput.focus();
        }
    });
}

if (chatbotMinimize) {
    chatbotMinimize.addEventListener('click', () => {
        chatbotContainer.classList.remove('active');
    });
}

// Quick Action Buttons
document.querySelectorAll('.quick-action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        if (action) {
            chatbotInput.value = action;
            sendMessage(action);
        }
    });
});

// Send Message
const sendMessage = async (message = null) => {
    const userMessage = message || chatbotInput.value.trim();
    
    if (!userMessage || isWaitingForResponse) return;
    
    // Add user message to chat
    addMessage(userMessage, 'user');
    chatbotInput.value = '';
    
    // Set waiting state
    isWaitingForResponse = true;
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        // Call Flask API
        const response = await fetch(CHATBOT_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: userMessage,
                history: chatHistory
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to get response');
        }
        
        const data = await response.json();
        
        // Remove typing indicator
        removeTypingIndicator();
        
        // Add bot response
        addMessage(data.response, 'bot');
        
        // Update history
        chatHistory.push({
            user: userMessage,
            bot: data.response
        });
        
    } catch (error) {
        console.error('Chatbot error:', error);
        removeTypingIndicator();
        
        // Fallback response
        const fallbackResponse = getLocalResponse(userMessage);
        addMessage(fallbackResponse, 'bot');
    }
    
    isWaitingForResponse = false;
};

// Local fallback responses
const getLocalResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Japan queries
    if (lowerMessage.includes('japan') && lowerMessage.includes('places')) {
        return `🗾 **Best Places in Japan:**

**Famous Places:**
• Mount Fuji - Iconic volcano and UNESCO site
• Tokyo Tower - 360° city views
• Senso-ji Temple - Tokyo's oldest temple

**Hidden Gems:**
• Shirakawa-go Village - Traditional farmhouses
• Hakone Museum - Art meets nature
• Nara Deer Park - Feed friendly deer

**Best Restaurants:**
• Ichiran Ramen - Authentic tonkotsu
• Sushi Dai - Fresh from Toyosu Market
• Dotonbori Street Food - Osaka nightlife

Would you like details about any specific place?`;
    }
    
    // India queries
    if (lowerMessage.includes('india') && lowerMessage.includes('places')) {
        return `🇮🇳 **Best Places in India:**

**Famous Places:**
• Taj Mahal - Symbol of love
• Jaipur City Palace - Royal heritage
• Kerala Backwaters - Serene beauty

**Hidden Gems:**
• Hampi - Ancient ruins
• Spiti Valley - Remote Himalayas
• Gokarna - Peaceful beaches

**Best Restaurants:**
• Karim's - Mughlai cuisine
• MTR - South Indian breakfast
• Olive Bar - Fusion dining

What type of experience interests you?`;
    }
    
    // Dubai queries
    if (lowerMessage.includes('dubai')) {
        return `🏙️ **Dubai Highlights:**

**Must-Visit:**
• Burj Khalifa - World's tallest building
• Dubai Mall - Shopping paradise
• Palm Jumeirah - Luxury island

**Experiences:**
• Desert Safari - Dune bashing
• Dubai Marina - Waterfront dining
• Gold Souk - Traditional markets

**Dining:**
• At.mosphere - Sky-high dining
• Pierchic - Seafood on water
• Al Hadheerah - Desert experience

When are you planning to visit?`;
    }
    
    // Paris queries
    if (lowerMessage.includes('paris')) {
        return `🗼 **Paris Essentials:**

**Iconic Sites:**
• Eiffel Tower - The iron lady
• Louvre Museum - Art masterpieces
• Notre-Dame - Gothic architecture

**Charming Spots:**
• Montmartre - Artist's quarter
• Latin Quarter - Historic streets
• Seine River Cruise - Romantic

**Food & Café:**
• Le Jules Verne - Eiffel dining
• Café de Flore - Historic café
• Le Comptoir - Modern bistro

Need help with itinerary?`;
    }
    
    // Maldives queries
    if (lowerMessage.includes('maldives')) {
        return `🏝️ **Maldives Paradise:**

**Experiences:**
• Overwater Villas - Luxury stays
• Snorkeling - Coral reefs
• Island Hopping - Local culture

**Activities:**
• Diving - Marine life
• Sunset Cruise - Romantic
• Spa Treatments - Relaxation

**Resorts:**
• Conrad Rangali - Underwater restaurant
• Soneva Jani - Waterslides
• Four Seasons - Private beaches

Budget or luxury preference?`;
    }
    
    // Budget queries
    if (lowerMessage.includes('budget') || lowerMessage.includes('cheap') || lowerMessage.includes('affordable')) {
        return `💰 **Budget Travel Tips:**

• Book flights 2-3 months in advance
• Travel during shoulder season (better prices)
• Use local transportation
• Stay in guesthouses or hostels
• Eat at local restaurants
• Book packages for better deals

Our budget packages start from ₹30,000!

Which destination interests you?`;
    }
    
    // Restaurant queries
    if (lowerMessage.includes('restaurant') || lowerMessage.includes('food') || lowerMessage.includes('eat')) {
        return `🍽️ **Restaurant Recommendations:**

I can help you find the best dining spots! 

Could you specify:
• Which destination?
• Cuisine preference?
• Budget range?
• Special occasion?

I'll provide personalized recommendations!`;
    }
    
    // Hotel queries
    if (lowerMessage.includes('hotel') || lowerMessage.includes('stay') || lowerMessage.includes('accommodation')) {
        return `🏨 **Hotel Assistance:**

I'll help you find perfect accommodations!

Tell me:
• Destination?
• Budget per night?
• Hotel type (luxury/boutique/budget)?
• Amenities needed?

I can also show price comparisons across booking platforms!`;
    }
    
    // Package queries
    if (lowerMessage.includes('package') || lowerMessage.includes('tour')) {
        return `📦 **Our Travel Packages:**

**Popular Packages:**
• Tokyo Complete Tour - 7D/6N - ₹95,000
• Golden Triangle India - 6D/5N - ₹55,000
• Dubai Luxury - 5D/4N - ₹125,000
• Paris Romance - 6D/5N - ₹140,000

All packages include:
✓ Flights
✓ Hotels
✓ Meals
✓ Guided tours
✓ Local transport

Which interests you?`;
    }
    
    // Booking queries
    if (lowerMessage.includes('book') || lowerMessage.includes('reservation')) {
        return `📅 **Ready to Book?**

Great! To help you book:

1. Choose your destination
2. Select travel dates
3. Pick package type
4. Review itinerary
5. Confirm booking

Use our search form on the homepage or tell me your preferences, and I'll guide you through!

What destination are you interested in?`;
    }
    
    // Default response
    return `I'm your WanderPeak travel assistant! 🌍

I can help you with:
• Destination recommendations
• Famous places & hidden gems
• Restaurant suggestions
• Hotel bookings
• Package deals
• Travel tips

What would you like to know?`;
};

// Add message to chat
const addMessage = (text, sender) => {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;
    
    const time = new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit' 
    });
    
    if (sender === 'bot') {
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="currentColor"/>
                </svg>
            </div>
            <div class="message-content">
                <p>${formatMessage(text)}</p>
                <span class="message-time">${time}</span>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.5"/>
                </svg>
            </div>
            <div class="message-content">
                <p>${text}</p>
                <span class="message-time">${time}</span>
            </div>
        `;
    }
    
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
};

// Format message (basic markdown)
const formatMessage = (text) => {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
};

// Show typing indicator
const showTypingIndicator = () => {
    const indicator = document.createElement('div');
    indicator.className = 'chat-message bot-message typing-indicator';
    indicator.innerHTML = `
        <div class="message-avatar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="currentColor"/>
            </svg>
        </div>
        <div class="message-content">
            <p style="display: flex; gap: 4px; padding: 12px;">
                <span style="width: 8px; height: 8px; background: currentColor; border-radius: 50%; animation: typing 1.4s infinite;"></span>
                <span style="width: 8px; height: 8px; background: currentColor; border-radius: 50%; animation: typing 1.4s infinite 0.2s;"></span>
                <span style="width: 8px; height: 8px; background: currentColor; border-radius: 50%; animation: typing 1.4s infinite 0.4s;"></span>
            </p>
        </div>
    `;
    
    // Add typing animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes typing {
            0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
            30% { opacity: 1; transform: translateY(-8px); }
        }
    `;
    document.head.appendChild(style);
    
    chatbotMessages.appendChild(indicator);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
};

// Remove typing indicator
const removeTypingIndicator = () => {
    const indicator = chatbotMessages.querySelector('.typing-indicator');
    if (indicator) {
        indicator.remove();
    }
};

// Form submit handler
if (chatbotForm) {
    chatbotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        sendMessage();
    });
}

// Enter key to send (Shift+Enter for new line)
if (chatbotInput) {
    chatbotInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
}

// Initialize chatbot with welcome message
document.addEventListener('DOMContentLoaded', () => {
    // Load chat history from localStorage
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
        try {
            chatHistory = JSON.parse(savedHistory);
        } catch (e) {
            console.error('Failed to load chat history:', e);
        }
    }
});

// Save chat history before page unload
window.addEventListener('beforeunload', () => {
    try {
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory.slice(-10))); // Keep last 10 messages
    } catch (e) {
        console.error('Failed to save chat history:', e);
    }
});

// Chatbot suggestions based on current page
const getPageContext = () => {
    const path = window.location.pathname;
    
    if (path.includes('famous.html')) {
        return {
            suggestions: [
                'Tell me about hidden gems',
                'Best restaurants here',
                'Local travel tips'
            ]
        };
    }
    
    return {
        suggestions: [
            'Best places in Japan',
            'Budget travel tips',
            'Popular packages'
        ]
    };
};

// Update quick actions based on page
const updateQuickActions = () => {
    const context = getPageContext();
    const quickActions = document.querySelectorAll('.quick-action-btn');
    
    quickActions.forEach((btn, index) => {
        if (context.suggestions[index]) {
            btn.textContent = context.suggestions[index];
            btn.dataset.action = context.suggestions[index];
        }
    });
};

// Call on page load
updateQuickActions();
