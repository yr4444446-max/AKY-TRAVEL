#!/usr/bin/env python3
"""
WanderPeak Tourism Website - Flask Backend
AI Chatbot API
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import re
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Travel knowledge base
DESTINATIONS = {
    'japan': {
        'name': 'Japan',
        'famous_places': [
            {'name': 'Mount Fuji', 'description': 'Iconic volcano and UNESCO World Heritage site', 'price': 8500},
            {'name': 'Tokyo Tower', 'description': 'Communications tower with panoramic city views', 'price': 1200},
            {'name': 'Senso-ji Temple', 'description': 'Tokyo\'s oldest temple with vibrant atmosphere', 'price': 0}
        ],
        'hidden_gems': [
            {'name': 'Shirakawa-go Village', 'description': 'UNESCO village with traditional farmhouses', 'price': 3500},
            {'name': 'Hakone Museum', 'description': 'Open-air museum with mountain scenery', 'price': 1800},
            {'name': 'Nara Deer Park', 'description': 'Over 1,000 friendly deer roam freely', 'price': 0}
        ],
        'restaurants': [
            {'name': 'Ichiran Ramen', 'cuisine': 'Ramen', 'price_range': '₹800-₹1,500'},
            {'name': 'Sushi Dai', 'cuisine': 'Sushi', 'price_range': '₹3,000-₹5,000'},
            {'name': 'Dotonbori Street Food', 'cuisine': 'Street Food', 'price_range': '₹300-₹800'}
        ]
    },
    'india': {
        'name': 'India',
        'famous_places': [
            {'name': 'Taj Mahal', 'description': 'Symbol of eternal love', 'price': 1050},
            {'name': 'Jaipur City Palace', 'description': 'Royal heritage and architecture', 'price': 700},
            {'name': 'Kerala Backwaters', 'description': 'Serene waterways and houseboat cruises', 'price': 5000}
        ],
        'hidden_gems': [
            {'name': 'Hampi', 'description': 'Ancient ruins and boulder landscapes', 'price': 500},
            {'name': 'Spiti Valley', 'description': 'Remote Himalayan paradise', 'price': 2000},
            {'name': 'Gokarna', 'description': 'Peaceful beaches and temples', 'price': 300}
        ],
        'restaurants': [
            {'name': 'Karim\'s', 'cuisine': 'Mughlai', 'price_range': '₹500-₹1,200'},
            {'name': 'MTR', 'cuisine': 'South Indian', 'price_range': '₹200-₹500'},
            {'name': 'Olive Bar & Kitchen', 'cuisine': 'Mediterranean', 'price_range': '₹1,500-₹3,000'}
        ]
    },
    'dubai': {
        'name': 'Dubai',
        'famous_places': [
            {'name': 'Burj Khalifa', 'description': 'World\'s tallest building', 'price': 3500},
            {'name': 'Dubai Mall', 'description': 'Shopping and entertainment paradise', 'price': 0},
            {'name': 'Palm Jumeirah', 'description': 'Iconic man-made island', 'price': 2000}
        ],
        'hidden_gems': [
            {'name': 'Al Fahidi Historic District', 'description': 'Traditional architecture and culture', 'price': 200},
            {'name': 'Dubai Marina Walk', 'description': 'Waterfront promenade', 'price': 0},
            {'name': 'Miracle Garden', 'description': 'World\'s largest flower garden', 'price': 250}
        ],
        'restaurants': [
            {'name': 'At.mosphere', 'cuisine': 'Fine Dining', 'price_range': '₹8,000-₹15,000'},
            {'name': 'Pierchic', 'cuisine': 'Seafood', 'price_range': '₹6,000-₹12,000'},
            {'name': 'Al Hadheerah', 'cuisine': 'Arabic', 'price_range': '₹3,500-₹6,000'}
        ]
    },
    'paris': {
        'name': 'Paris',
        'famous_places': [
            {'name': 'Eiffel Tower', 'description': 'Iconic iron lattice tower', 'price': 2500},
            {'name': 'Louvre Museum', 'description': 'World\'s largest art museum', 'price': 1700},
            {'name': 'Notre-Dame Cathedral', 'description': 'Gothic architectural masterpiece', 'price': 0}
        ],
        'hidden_gems': [
            {'name': 'Montmartre', 'description': 'Historic artist\'s quarter', 'price': 0},
            {'name': 'Canal Saint-Martin', 'description': 'Trendy waterfront area', 'price': 0},
            {'name': 'Sainte-Chapelle', 'description': 'Stunning stained glass chapel', 'price': 1100}
        ],
        'restaurants': [
            {'name': 'Le Jules Verne', 'cuisine': 'French Fine Dining', 'price_range': '₹15,000-₹25,000'},
            {'name': 'Café de Flore', 'cuisine': 'Café', 'price_range': '₹1,500-₹3,000'},
            {'name': 'Le Comptoir du Relais', 'cuisine': 'Bistro', 'price_range': '₹3,000-₹5,000'}
        ]
    },
    'maldives': {
        'name': 'Maldives',
        'famous_places': [
            {'name': 'Overwater Villas', 'description': 'Luxury accommodations on water', 'price': 25000},
            {'name': 'Maafushi Island', 'description': 'Local island experience', 'price': 5000},
            {'name': 'Banana Reef', 'description': 'World-class diving spot', 'price': 7500}
        ],
        'hidden_gems': [
            {'name': 'Thulusdhoo Island', 'description': 'Surfing and local culture', 'price': 3000},
            {'name': 'Fulhadhoo', 'description': 'Pristine and untouched', 'price': 4000},
            {'name': 'Hanifaru Bay', 'description': 'Manta ray gathering spot', 'price': 6000}
        ],
        'restaurants': [
            {'name': 'Ithaa Undersea Restaurant', 'cuisine': 'European', 'price_range': '₹20,000-₹30,000'},
            {'name': 'Sea.Fire.Salt', 'cuisine': 'Seafood', 'price_range': '₹8,000-₹15,000'},
            {'name': 'Cafe del Mar', 'cuisine': 'International', 'price_range': '₹3,000-₹6,000'}
        ]
    }
}

PACKAGES = [
    {
        'name': 'Tokyo Complete Tour',
        'destination': 'Japan',
        'duration': '7 Days / 6 Nights',
        'price': 95000,
        'includes': ['Flights', 'Hotels', 'Meals', 'Guided Tours', 'Local Transport']
    },
    {
        'name': 'Golden Triangle India',
        'destination': 'India',
        'duration': '6 Days / 5 Nights',
        'price': 55000,
        'includes': ['Flights', 'Hotels', 'Transport', 'Guided Tours']
    },
    {
        'name': 'Dubai Luxury Escape',
        'destination': 'Dubai',
        'duration': '5 Days / 4 Nights',
        'price': 125000,
        'includes': ['Flights', '5-Star Hotel', 'Desert Safari', 'Burj Khalifa Tickets']
    },
    {
        'name': 'Paris Romance Package',
        'destination': 'Paris',
        'duration': '6 Days / 5 Nights',
        'price': 140000,
        'includes': ['Flights', 'Boutique Hotel', 'Seine Cruise', 'Museum Passes']
    },
    {
        'name': 'Maldives Paradise',
        'destination': 'Maldives',
        'duration': '5 Days / 4 Nights',
        'price': 180000,
        'includes': ['Flights', 'Water Villa', 'All Meals', 'Diving', 'Spa']
    }
]

def extract_destination(message):
    """Extract destination from user message"""
    message_lower = message.lower()
    for dest_key, dest_data in DESTINATIONS.items():
        if dest_key in message_lower or dest_data['name'].lower() in message_lower:
            return dest_key
    return None

def get_destination_info(destination_key):
    """Get formatted destination information"""
    if destination_key not in DESTINATIONS:
        return None
    
    dest = DESTINATIONS[destination_key]
    response = f"🌟 **{dest['name']} Travel Guide**\n\n"
    
    # Famous Places
    response += "**Famous Places:**\n"
    for place in dest['famous_places']:
        price_str = f"₹{place['price']:,}" if place['price'] > 0 else "Free"
        response += f"• **{place['name']}** - {place['description']} ({price_str})\n"
    
    response += "\n**Hidden Gems:**\n"
    for place in dest['hidden_gems']:
        price_str = f"₹{place['price']:,}" if place['price'] > 0 else "Free"
        response += f"• **{place['name']}** - {place['description']} ({price_str})\n"
    
    response += "\n**Best Restaurants:**\n"
    for restaurant in dest['restaurants']:
        response += f"• **{restaurant['name']}** - {restaurant['cuisine']} ({restaurant['price_range']})\n"
    
    response += "\n💡 Would you like to know more about any specific place or need help booking?"
    
    return response

def get_restaurants_info(destination_key):
    """Get restaurant information for a destination"""
    if destination_key not in DESTINATIONS:
        return None
    
    dest = DESTINATIONS[destination_key]
    response = f"🍽️ **Best Restaurants in {dest['name']}**\n\n"
    
    for restaurant in dest['restaurants']:
        response += f"**{restaurant['name']}**\n"
        response += f"Cuisine: {restaurant['cuisine']}\n"
        response += f"Price Range: {restaurant['price_range']}\n\n"
    
    response += "Would you like reservations or more details about any restaurant?"
    
    return response

def get_packages_info(destination=None):
    """Get package information"""
    response = "📦 **Available Travel Packages**\n\n"
    
    packages = PACKAGES
    if destination:
        dest_name = DESTINATIONS.get(destination, {}).get('name', '')
        packages = [p for p in PACKAGES if p['destination'] == dest_name]
    
    for pkg in packages:
        response += f"**{pkg['name']}**\n"
        response += f"Duration: {pkg['duration']}\n"
        response += f"Price: ₹{pkg['price']:,} per person\n"
        response += f"Includes: {', '.join(pkg['includes'])}\n\n"
    
    response += "💰 All packages include best price guarantee!\nInterested in booking?"
    
    return response

def get_budget_tips():
    """Get budget travel tips"""
    return """💰 **Smart Budget Travel Tips**

**Booking Strategy:**
• Book flights 2-3 months in advance
• Travel during shoulder season (cheaper & less crowded)
• Compare prices across multiple platforms
• Sign up for price alerts

**Accommodation:**
• Consider guesthouses over hotels
• Book directly with properties
• Look for package deals
• Stay slightly outside tourist areas

**Transportation:**
• Use local public transport
• Walk when possible
• Book airport transfers in advance
• Consider city passes

**Food & Dining:**
• Eat at local restaurants
• Try street food (where safe)
• Have main meal at lunch (cheaper)
• Stay at places with breakfast included

**Activities:**
• Free walking tours
• Visit during free admission days
• Book combo tickets
• Use city discount cards

💡 Our budget packages start from ₹30,000!
Which destination interests you?"""

def generate_response(message, history):
    """Generate chatbot response based on user message"""
    message_lower = message.lower()
    
    # Greetings
    if any(word in message_lower for word in ['hello', 'hi', 'hey', 'greetings']):
        return "Hello! 👋 I'm your WanderPeak travel assistant. I can help you discover amazing destinations, find the best restaurants, plan your itinerary, and book your dream vacation. What would you like to explore today?"
    
    # Destination-specific queries
    destination = extract_destination(message)
    
    if destination:
        # Places query
        if any(word in message_lower for word in ['places', 'visit', 'attractions', 'sights', 'see']):
            return get_destination_info(destination)
        
        # Restaurant query
        elif any(word in message_lower for word in ['restaurant', 'food', 'eat', 'dining', 'cuisine']):
            return get_restaurants_info(destination)
        
        # Package query
        elif any(word in message_lower for word in ['package', 'tour', 'deal']):
            return get_packages_info(destination)
        
        # General destination query
        else:
            return get_destination_info(destination)
    
    # Budget queries
    if any(word in message_lower for word in ['budget', 'cheap', 'affordable', 'save', 'money']):
        return get_budget_tips()
    
    # Package queries
    if any(word in message_lower for word in ['package', 'tour', 'deal', 'offer']):
        return get_packages_info()
    
    # Restaurant queries
    if any(word in message_lower for word in ['restaurant', 'food', 'eat', 'dining']):
        return """🍽️ **Restaurant Recommendations**

I can help you find amazing dining experiences!

Please tell me:
• Which destination? (Japan, India, Dubai, Paris, Maldives)
• Cuisine preference?
• Budget range?
• Special dietary requirements?

I'll provide personalized recommendations with price comparisons!"""
    
    # Hotel queries
    if any(word in message_lower for word in ['hotel', 'accommodation', 'stay', 'lodge']):
        return """🏨 **Hotel & Accommodation Help**

I'll help you find the perfect place to stay!

Let me know:
• Destination?
• Check-in and check-out dates?
• Number of guests?
• Budget per night?
• Preferred hotel type (luxury/boutique/budget)?

I can also show price comparisons across Agoda, Booking.com, and Expedia!"""
    
    # Booking queries
    if any(word in message_lower for word in ['book', 'reservation', 'reserve']):
        return """📅 **Ready to Book Your Adventure?**

Great choice! Here's how we can help:

1. **Choose Your Destination** - Where do you want to go?
2. **Select Dates** - When are you planning to travel?
3. **Pick Your Package** - Or customize your own itinerary
4. **Review & Confirm** - Get best price guarantee

You can:
• Use our search form on the homepage
• Tell me your preferences here
• Call us at +91 98765 43210
• Email: hello@wanderpeak.com

What destination interests you?"""
    
    # Help query
    if any(word in message_lower for word in ['help', 'assist', 'support']):
        return """🌍 **How I Can Help You**

I'm your personal travel assistant! I can:

✈️ **Destinations**
• Recommend places to visit
• Share hidden gems
• Provide local insights

🍽️ **Dining**
• Best restaurants
• Local cuisine guides
• Price ranges

🏨 **Accommodation**
• Hotel recommendations
• Price comparisons
• Booking assistance

📦 **Packages**
• Complete tour packages
• Custom itineraries
• Best deals

💰 **Budget Tips**
• Money-saving strategies
• Best value options
• Travel hacks

What would you like to know?"""
    
    # Default response
    return """I'm here to help you plan the perfect trip! 🌟

I can assist with:
• **Destinations** - Japan, India, Dubai, Paris, Maldives
• **Famous Places** - Must-see attractions
• **Hidden Gems** - Local favorites
• **Restaurants** - Best dining spots
• **Hotels** - Accommodation options
• **Packages** - Complete tour deals
• **Budget Tips** - Travel smart

Try asking:
• "Best places in Japan"
• "Budget travel tips"
• "Show me Dubai restaurants"
• "What packages do you have?"

What interests you?"""

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chatbot messages"""
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({'error': 'Message is required'}), 400
        
        user_message = data['message']
        history = data.get('history', [])
        
        # Generate response
        bot_response = generate_response(user_message, history)
        
        return jsonify({
            'response': bot_response,
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

@app.route('/api/destinations', methods=['GET'])
def get_destinations():
    """Get all destinations"""
    return jsonify({
        'destinations': [
            {
                'id': key,
                'name': data['name'],
                'famous_count': len(data['famous_places']),
                'hidden_count': len(data['hidden_gems']),
                'restaurant_count': len(data['restaurants'])
            }
            for key, data in DESTINATIONS.items()
        ]
    })

@app.route('/api/packages', methods=['GET'])
def get_packages():
    """Get all packages"""
    return jsonify({'packages': PACKAGES})

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'WanderPeak Chatbot API',
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    print("=" * 50)
    print("WanderPeak Chatbot API Server")
    print("=" * 50)
    print("Server running on: http://localhost:5000")
    print("Endpoints:")
    print("  POST /api/chat - Chatbot messages")
    print("  GET  /api/destinations - Get destinations")
    print("  GET  /api/packages - Get packages")
    print("  GET  /api/health - Health check")
    print("=" * 50)
    
    app.run(debug=True, host='0.0.0.0', port=5000)
