// ========== PREMIUM VALENTINE SCRIPT ==========

// Configuration
const SECRET_NAME = "Hesta";
const MAX_ATTEMPTS = 3;
const TIMEOUT_DURATION = 30000;

// State variables
let attemptsLeft = MAX_ATTEMPTS;
let isLockedOut = false;
let lockoutTimeout = null;
let loveDays = 0;
let isMusicPlaying = false;
let loveMessages = [
    "I love you more than words can express! 💕",
    "You're the most amazing person in my life! ✨",
    "My heart beats only for you! 💓",
    "Every moment with you is magical! 🌟",
    "You're my forever Valentine! 💖"
];

// DOM Elements
const lockScreen = document.getElementById('lock-screen');
const unlockedScreen = document.getElementById('unlocked-screen');
const nameInput = document.getElementById('name-input');
const attemptsDisplay = document.getElementById('attempts-left');
const errorMsg = document.getElementById('error-msg');
const unlockBtn = document.getElementById('unlock-btn');
const hestaImg = document.getElementById('hesta-img');
const displayName = document.getElementById('display-name');
const cardName = document.getElementById('card-name');
const dayCount = document.getElementById('day-count');
const loveSong = document.getElementById('love-song');
const musicToggle = document.getElementById('music-toggle');
const unlockSound = document.getElementById('unlock-sound');
const errorSound = document.getElementById('error-sound');
const heartbeatSound = document.getElementById('heartbeat-sound');
const sparkleSound = document.getElementById('sparkle-sound');

// Initialize love counter (example: since Feb 1, 2024)
function initLoveCounter() {
    const startDate = new Date('2024-02-01');
    const today = new Date();
    loveDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    dayCount.textContent = loveDays > 0 ? loveDays : "∞";
}

// Preload images with fallback
function preloadImage() {
    const image = new Image();
    image.src = "hesta.jpg";
    
    image.onload = function() {
        console.log("Main image loaded successfully");
    };
    
    image.onerror = function() {
        console.log("Main image failed, using fallback");
        // Fallback to Unsplash romantic image
        hestaImg.src = "https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
    };
}

// Premium unlock animation
function playUnlockAnimation() {
    // Play sounds
    unlockSound.currentTime = 0;
    unlockSound.play().catch(e => console.log("Audio:", e));
    
    heartbeatSound.currentTime = 0;
    setTimeout(() => heartbeatSound.play().catch(e => console.log("Audio:", e)), 500);
    
    sparkleSound.currentTime = 0;
    setTimeout(() => sparkleSound.play().catch(e => console.log("Audio:", e)), 1000);
    
    // Create floating hearts
    for (let i = 0; i < 20; i++) {
        createFloatingHeart();
    }
    
    // Start love song if not playing
    if (!isMusicPlaying) {
        loveSong.currentTime = 0;
        loveSong.play().then(() => {
            isMusicPlaying = true;
            musicToggle.innerHTML = '<i class="fas fa-pause"></i><span>Pause Song</span>';
        }).catch(e => console.log("Music autoplay blocked:", e));
    }
}

// Create floating heart animation
function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.position = 'fixed';
    heart.style.fontSize = Math.random() * 20 + 20 + 'px';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.top = '100vh';
    heart.style.opacity = '0.7';
    heart.style.zIndex = '9999';
    heart.style.pointerEvents = 'none';
    heart.style.animation = `floatUp ${Math.random() * 2 + 3}s ease-in forwards`;
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 5000);
}

// Check name function
function checkName() {
    if (isLockedOut) {
        showError(`⏳ Locked out! Please wait ${getRemainingLockoutTime()} seconds.`, true);
        return;
    }
    
    const inputName = nameInput.value.trim();
    
    if (inputName === "") {
        showError("💔 Please enter a name!", false);
        shakeElement(nameInput);
        return;
    }
    
    if (inputName.toLowerCase() === SECRET_NAME.toLowerCase()) {
        // CORRECT NAME - Premium unlock
        playUnlockAnimation();
        
        // Update displayed names
        displayName.textContent = inputName;
        cardName.textContent = inputName;
        
        // Load image with timestamp to prevent caching
        hestaImg.src = "hesta.jpg?t=" + new Date().getTime();
        
        // Switch screens with delay for animation
        setTimeout(() => {
            lockScreen.classList.add('hidden');
            unlockedScreen.classList.remove('hidden');
            
            // Add entrance animation
            unlockedScreen.style.animation = 'none';
            setTimeout(() => {
                unlockedScreen.style.animation = 'photoAppear 1.5s ease-out';
            }, 10);
        }, 1500);
        
        // Reset attempts
        resetAttempts();
        
    } else {
        // WRONG NAME
        attemptsLeft--;
        attemptsDisplay.textContent = attemptsLeft;
        
        // Play error sound
        errorSound.currentTime = 0;
        errorSound.play().catch(e => console.log("Audio:", e));
        
        if (attemptsLeft <= 0) {
            lockoutUser();
        } else {
            showError(`❌ Not quite right! Attempts left: ${attemptsLeft}`, false);
            shakeElement(nameInput);
            shakeElement(unlockBtn);
        }
    }
}

// Show error with style
function showError(message, isWarning) {
    errorMsg.textContent = message;
    errorMsg.style.color = isWarning ? "#ff9900" : "#ff4757";
    errorMsg.style.backgroundColor = isWarning ? "rgba(255, 153, 0, 0.1)" : "rgba(255, 71, 87, 0.1)";
    
    // Animate error message
    errorMsg.style.transform = 'scale(1.05)';
    setTimeout(() => {
        errorMsg.style.transform = 'scale(1)';
    }, 300);
    
    // Clear error after 4 seconds
    setTimeout(() => {
        if (errorMsg.textContent === message) {
            errorMsg.textContent = "";
        }
    }, 4000);
}

// Shake animation for elements
function shakeElement(element) {
    element.style.animation = 'none';
    setTimeout(() => {
        element.style.animation = 'shake 0.5s';
    }, 10);
}

// Lockout user
function lockoutUser() {
    isLockedOut = true;
    unlockBtn.disabled = true;
    nameInput.disabled = true;
    
    showError(`🔒 Too many attempts! Locked out for 30 seconds.`, true);
    
    // Start lockout timer
    lockoutTimeout = setTimeout(() => {
        resetAttempts();
        showError("🔓 Lockout ended! Try again with love 💕", false);
        
        setTimeout(() => {
            errorMsg.textContent = "";
        }, 3000);
    }, TIMEOUT_DURATION);
}

// Reset attempts
function resetAttempts() {
    isLockedOut = false;
    attemptsLeft = MAX_ATTEMPTS;
    attemptsDisplay.textContent = attemptsLeft;
    unlockBtn.disabled = false;
    nameInput.disabled = false;
    nameInput.value = "";
    nameInput.style.animation = '';
    
    if (lockoutTimeout) {
        clearTimeout(lockoutTimeout);
        lockoutTimeout = null;
    }
}

// Get remaining lockout time
function getRemainingLockoutTime() {
    if (!lockoutTimeout) return 0;
    return Math.ceil(TIMEOUT_DURATION / 1000);
}

// Lock again function
function lockAgain() {
    unlockedScreen.classList.add('hidden');
    lockScreen.classList.remove('hidden');
    
    // Reset for next use
    resetAttempts();
    
    // Pause music
    if (isMusicPlaying) {
        loveSong.pause();
        isMusicPlaying = false;
        musicToggle.innerHTML = '<i class="fas fa-music"></i><span>Love Song</span>';
    }
}

// Show love message
function showLove(index) {
    const messages = document.querySelectorAll('.card-message');
    if (messages[index]) {
        const original = messages[index].textContent;
        messages[index].textContent = loveMessages[Math.floor(Math.random() * loveMessages.length)];
        
        // Add sparkle effect
        sparkleSound.currentTime = 0;
        sparkleSound.play().catch(e => console.log("Audio:", e));
        
        setTimeout(() => {
            messages[index].textContent = original;
        }, 3000);
    }
}

// Toggle music
function toggleMusic() {
    if (isMusicPlaying) {
        loveSong.pause();
        musicToggle.innerHTML = '<i class="fas fa-music"></i><span>Play Song</span>';
    } else {
        loveSong.play().then(() => {
            musicToggle.innerHTML = '<i class="fas fa-pause"></i><span>Pause Song</span>';
        }).catch(e => {
            showError("Click play button to start music", true);
        });
    }
    isMusicPlaying = !isMusicPlaying;
}

// Share love
function shareLove() {
    if (navigator.share) {
        navigator.share({
            title: 'My Secret Valentine Message',
            text: 'Check out this beautiful Valentine message made with love! 💖',
            url: window.location.href,
        }).catch(e => console.log('Share cancelled:', e));
    } else {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            showError("Link copied to clipboard! 📋", false);
        });
    }
}

// Enter key support
nameInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkName();
    }
});

// Add CSS animations if not present
function addAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatUp {
            0% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
            100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
}

// Touch optimization
function initTouchEvents() {
    // Prevent double-tap zoom
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Better touch feedback
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        btn.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initLoveCounter();
    preloadImage();
    addAnimations();
    initTouchEvents();
    
    attemptsDisplay.textContent = attemptsLeft;
    
    // Auto-focus on input
    setTimeout(() => {
        nameInput.focus();
    }, 500);
    
    // Add keyboard sound effect
    nameInput.addEventListener('keydown', function() {
        if (nameInput.value.length === 0) {
            sparkleSound.currentTime = 0;
            sparkleSound.play().catch(e => console.log("Audio:", e));
        }
    });
});
