// WanderPeak - Main JavaScript
// ========================================

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mainNav = document.getElementById('mainNav');
const header = document.getElementById('header');
const searchForm = document.getElementById('searchForm');
const installPrompt = document.getElementById('installPrompt');
const installBtn = document.getElementById('installBtn');
const dismissInstall = document.getElementById('dismissInstall');

// PWA Install
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install prompt after 3 seconds
    setTimeout(() => {
        if (installPrompt && !localStorage.getItem('installDismissed')) {
            installPrompt.classList.add('visible');
        }
    }, 3000);
});

if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response: ${outcome}`);
            deferredPrompt = null;
            installPrompt.classList.remove('visible');
        }
    });
}

if (dismissInstall) {
    dismissInstall.addEventListener('click', () => {
        installPrompt.classList.remove('visible');
        localStorage.setItem('installDismissed', 'true');
    });
}

// Theme Toggle
const initTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
};

const toggleTheme = () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
};

if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

initTheme();

// Mobile Menu Toggle
if (mobileMenuToggle && mainNav) {
    mobileMenuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
}

// Header Scroll Effect
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (header) {
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    lastScroll = currentScroll;
});

// Smooth Scroll for Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (mainNav) {
                    mainNav.classList.remove('active');
                }
                if (mobileMenuToggle) {
                    mobileMenuToggle.classList.remove('active');
                }
                document.body.classList.remove('menu-open');
            }
        }
    });
});

// Search Form Handler
if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const destination = document.getElementById('destination').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const budget = document.getElementById('budget').value;
        
        if (destination && startDate && endDate && budget) {
            // Show loading state
            const searchBtn = searchForm.querySelector('.btn-search');
            const originalText = searchBtn.innerHTML;
            searchBtn.innerHTML = '<span>Searching...</span>';
            searchBtn.disabled = true;
            
            // Simulate search (in production, this would call an API)
            setTimeout(() => {
                alert(`Searching for trips to ${destination}\nFrom: ${startDate}\nTo: ${endDate}\nBudget: ${budget}`);
                searchBtn.innerHTML = originalText;
                searchBtn.disabled = false;
            }, 1000);
        }
    });
}

// Destinations Data
const destinationsData = [
    {
        id: 'japan',
        name: 'Japan',
        rating: 4.9,
        reviews: 12847,
        price: 85000,
        image: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        description: 'Experience the perfect blend of ancient traditions and cutting-edge modernity in the Land of the Rising Sun.',
        badge: 'Top Rated'
    },
    {
        id: 'india',
        name: 'India',
        rating: 4.7,
        reviews: 9234,
        price: 45000,
        image: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        description: 'Discover diverse cultures, majestic monuments, and vibrant festivals in this incredible subcontinent.',
        badge: 'Best Value'
    },
    {
        id: 'dubai',
        name: 'Dubai',
        rating: 4.8,
        reviews: 15621,
        price: 95000,
        image: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        description: 'Luxury and innovation meet in this futuristic desert metropolis of superlatives.',
        badge: 'Luxury'
    },
    {
        id: 'paris',
        name: 'Paris',
        rating: 4.9,
        reviews: 18943,
        price: 120000,
        image: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        description: 'Romance, art, and culinary excellence in the City of Light and love.',
        badge: 'Popular'
    },
    {
        id: 'maldives',
        name: 'Maldives',
        rating: 5.0,
        reviews: 8456,
        price: 150000,
        image: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        description: 'Paradise islands with crystal-clear waters and world-class diving experiences.',
        badge: 'Premium'
    }
];

// Load Destinations
const loadDestinations = () => {
    const grid = document.getElementById('destinationsGrid');
    if (!grid) return;
    
    destinationsData.forEach(dest => {
        const card = document.createElement('div');
        card.className = 'destination-card';
        card.innerHTML = `
            <div class="destination-image">
                <div style="width: 100%; height: 100%; background: ${dest.image}; display: flex; align-items: center; justify-content: center;">
                    <svg width="80" height="80" viewBox="0 0 80 80" fill="white" opacity="0.3">
                        <path d="M40 10L50 30L70 40L50 50L40 70L30 50L10 40L30 30L40 10Z"/>
                    </svg>
                </div>
                <div class="destination-badge">${dest.badge}</div>
            </div>
            <div class="destination-info">
                <div class="destination-header">
                    <h3 class="destination-name">${dest.name}</h3>
                    <div class="destination-rating">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="#fbbf24">
                            <path d="M8 1L10.09 5.26L14.85 5.94L11.43 9.27L12.18 14L8 11.77L3.82 14L4.57 9.27L1.15 5.94L5.91 5.26L8 1Z"/>
                        </svg>
                        ${dest.rating}
                    </div>
                </div>
                <p class="destination-description">${dest.description}</p>
                <div class="destination-meta">
                    <div class="destination-price">
                        ₹${dest.price.toLocaleString()} <span>per person</span>
                    </div>
                    <div style="font-size: 0.875rem; color: var(--color-gray-500);">
                        ${dest.reviews.toLocaleString()} reviews
                    </div>
                </div>
                <div class="destination-actions">
                    <button class="btn-view-details" onclick="viewDestination('${dest.id}')">View Details</button>
                    <button class="btn-book-now" onclick="bookDestination('${dest.id}')">Book Now</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
};

// Packages Data
const packagesData = [
    {
        name: 'Tokyo Complete Tour',
        duration: '7 Days / 6 Nights',
        price: 95000,
        includes: ['Flights', 'Hotels', 'Meals', 'Guide'],
        rating: 4.8
    },
    {
        name: 'Golden Triangle India',
        duration: '6 Days / 5 Nights',
        price: 55000,
        includes: ['Flights', 'Hotels', 'Transport', 'Guide'],
        rating: 4.7
    },
    {
        name: 'Dubai Luxury Escape',
        duration: '5 Days / 4 Nights',
        price: 125000,
        includes: ['Flights', '5-Star Hotel', 'Desert Safari', 'Burj Khalifa'],
        rating: 4.9
    }
];

// Load Packages
const loadPackages = () => {
    const grid = document.getElementById('packagesGrid');
    if (!grid) return;
    
    packagesData.forEach((pkg, index) => {
        const card = document.createElement('div');
        card.className = 'destination-card';
        const gradients = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        ];
        card.innerHTML = `
            <div class="destination-image">
                <div style="width: 100%; height: 100%; background: ${gradients[index]}; display: flex; align-items: center; justify-content: center;">
                    <svg width="60" height="60" viewBox="0 0 60 60" fill="white" opacity="0.3">
                        <rect x="10" y="15" width="40" height="30" rx="2"/>
                        <path d="M10 25H50M20 15V10M40 15V10"/>
                    </svg>
                </div>
                <div class="destination-badge">${pkg.duration}</div>
            </div>
            <div class="destination-info">
                <h3 class="destination-name">${pkg.name}</h3>
                <p class="destination-description">
                    Includes: ${pkg.includes.join(', ')}
                </p>
                <div class="destination-meta">
                    <div class="destination-price">₹${pkg.price.toLocaleString()} <span>per person</span></div>
                    <div class="destination-rating">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="#fbbf24">
                            <path d="M8 1L10.09 5.26L14.85 5.94L11.43 9.27L12.18 14L8 11.77L3.82 14L4.57 9.27L1.15 5.94L5.91 5.26L8 1Z"/>
                        </svg>
                        ${pkg.rating}
                    </div>
                </div>
                <div class="destination-actions">
                    <button class="btn-view-details">View Details</button>
                    <button class="btn-book-now">Book Now</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
};

// Deals Data
const dealsData = [
    {
        name: 'Early Bird Special - Japan',
        discount: '30% OFF',
        originalPrice: 95000,
        salePrice: 66500,
        validUntil: '2024-03-31'
    },
    {
        name: 'Summer Sale - Maldives',
        discount: '25% OFF',
        originalPrice: 150000,
        salePrice: 112500,
        validUntil: '2024-04-15'
    },
    {
        name: 'Weekend Getaway - Dubai',
        discount: '20% OFF',
        originalPrice: 125000,
        salePrice: 100000,
        validUntil: '2024-03-20'
    }
];

// Load Deals
const loadDeals = () => {
    const grid = document.getElementById('dealsGrid');
    if (!grid) return;
    
    dealsData.forEach((deal, index) => {
        const card = document.createElement('div');
        card.className = 'destination-card';
        const gradients = [
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
        ];
        card.innerHTML = `
            <div class="destination-image">
                <div style="width: 100%; height: 100%; background: ${gradients[index]}; display: flex; align-items: center; justify-content: center; flex-direction: column; color: white;">
                    <div style="font-size: 3rem; font-weight: 800;">${deal.discount}</div>
                    <div style="font-size: 0.875rem; opacity: 0.9;">Limited Time Offer</div>
                </div>
                <div class="destination-badge">Expires ${new Date(deal.validUntil).toLocaleDateString()}</div>
            </div>
            <div class="destination-info">
                <h3 class="destination-name">${deal.name}</h3>
                <div class="destination-meta">
                    <div>
                        <div style="text-decoration: line-through; color: var(--color-gray-400); font-size: 0.875rem;">₹${deal.originalPrice.toLocaleString()}</div>
                        <div class="destination-price">₹${deal.salePrice.toLocaleString()} <span>per person</span></div>
                    </div>
                </div>
                <div class="destination-actions">
                    <button class="btn-book-now" style="flex: 1;">Grab Deal Now</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
};

// Reviews Data
const reviewsData = [
    {
        name: 'Sarah Johnson',
        location: 'New York, USA',
        rating: 5,
        comment: 'WanderPeak made our Japan trip absolutely magical! Every detail was perfectly planned, and the hidden gem recommendations were spot on. Best travel experience ever!',
        date: '2 weeks ago',
        initial: 'SJ'
    },
    {
        name: 'Rajesh Kumar',
        location: 'Mumbai, India',
        rating: 5,
        comment: 'Incredible service and attention to detail. The Dubai package exceeded all expectations. The team was responsive and helpful throughout our journey.',
        date: '1 month ago',
        initial: 'RK'
    },
    {
        name: 'Emily Chen',
        location: 'Singapore',
        rating: 4,
        comment: 'Beautiful Maldives experience! The resort recommendations were perfect. Only minor hiccup with flight timing, but the team resolved it quickly.',
        date: '3 weeks ago',
        initial: 'EC'
    },
    {
        name: 'Michael Brown',
        location: 'London, UK',
        rating: 5,
        comment: 'Paris trip was dreamy! WanderPeak\'s local restaurant suggestions were outstanding. Felt like a local rather than a tourist. Highly recommend!',
        date: '1 week ago',
        initial: 'MB'
    }
];

// Load Reviews
const loadReviews = () => {
    const grid = document.getElementById('reviewsGrid');
    if (!grid) return;
    
    reviewsData.forEach(review => {
        const card = document.createElement('div');
        card.className = 'review-card';
        
        const stars = Array(5).fill(0).map((_, i) => `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="${i < review.rating ? '#fbbf24' : '#e5e5e5'}">
                <path d="M8 1L10.09 5.26L14.85 5.94L11.43 9.27L12.18 14L8 11.77L3.82 14L4.57 9.27L1.15 5.94L5.91 5.26L8 1Z"/>
            </svg>
        `).join('');
        
        card.innerHTML = `
            <div class="review-header">
                <div class="reviewer-image">${review.initial}</div>
                <div class="reviewer-info">
                    <h4>${review.name}</h4>
                    <div class="reviewer-location">${review.location}</div>
                </div>
            </div>
            <div class="review-rating">${stars}</div>
            <p class="review-text">${review.comment}</p>
            <div class="review-date">${review.date}</div>
        `;
        grid.appendChild(card);
    });
};

// Destination Actions
window.viewDestination = (id) => {
    window.location.href = `famous.html?destination=${id}`;
};

window.bookDestination = (id) => {
    const dest = destinationsData.find(d => d.id === id);
    if (dest) {
        alert(`Booking ${dest.name}!\n\nYou will be redirected to the booking page.`);
        // In production, navigate to booking page
    }
};

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    loadDestinations();
    loadPackages();
    loadDeals();
    loadReviews();
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all cards
    document.querySelectorAll('.destination-card, .review-card, .place-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(card);
    });
});

// Map Marker Interactions
document.querySelectorAll('.destination-marker').forEach(marker => {
    marker.addEventListener('click', () => {
        const destination = marker.dataset.destination;
        viewDestination(destination);
    });
});

// Contact Form
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('contactName').value;
        const email = document.getElementById('contactEmail').value;
        const message = document.getElementById('contactMessage').value;
        
        if (name && email && message) {
            // Show loading state
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate sending (in production, this would call an API)
            setTimeout(() => {
                alert('Thank you for your message! We\'ll get back to you soon.');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1000);
        }
    });
}

// Login Button Handler
const loginBtn = document.getElementById('loginBtn');
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        alert('Login functionality will be available soon!\n\nFor demo purposes, you can explore all features.');
    });
}

// Book Now Button Handler
const bookNowBtn = document.getElementById('bookNowBtn');
if (bookNowBtn) {
    bookNowBtn.addEventListener('click', () => {
        const searchSection = document.querySelector('.search-section');
        if (searchSection) {
            searchSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Price Comparison Feature (for hotels)
const priceComparison = {
    'Tokyo Hotel': {
        agoda: 5000,
        bookingCom: 5400,
        expedia: 5200
    },
    'Dubai Palace': {
        agoda: 8500,
        bookingCom: 8800,
        expedia: 8600
    }
};

window.showPriceComparison = (hotelName) => {
    const prices = priceComparison[hotelName];
    if (prices) {
        const minPrice = Math.min(...Object.values(prices));
        const minPlatform = Object.keys(prices).find(key => prices[key] === minPrice);
        
        alert(`Price Comparison for ${hotelName}:\n\n` +
              `Agoda: ₹${prices.agoda}\n` +
              `Booking.com: ₹${prices.bookingCom}\n` +
              `Expedia: ₹${prices.expedia}\n\n` +
              `Best Price: ${minPlatform} - ₹${minPrice}`);
    }
};

// Performance: Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Network Status Indicator
window.addEventListener('online', () => {
    console.log('Back online!');
});

window.addEventListener('offline', () => {
    console.log('You are offline. Some features may be limited.');
});
