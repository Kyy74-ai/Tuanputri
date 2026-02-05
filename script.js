// Configuration
const SECRET_NAME = "Aya";
const MAX_ATTEMPTS = 3;
const TIMEOUT_DURATION = 30000; // 30 seconds in milliseconds

// State variables
let attemptsLeft = MAX_ATTEMPTS;
let isLockedOut = false;
let lockoutTimeout = null;

// DOM Elements
const lockScreen = document.getElementById('lock-screen');
const unlockedScreen = document.getElementById('unlocked-screen');
const nameInput = document.getElementById('name-input');
const attemptsDisplay = document.getElementById('attempts-left');
const errorMsg = document.getElementById('error-msg');
const unlockBtn = document.getElementById('unlock-btn');
const ayaImg = document.getElementById('aya-img');
const unlockSound = document.getElementById('unlock-sound');
const errorSound = document.getElementById('error-sound');

// Preload Aya image
const preloadImage = new Image();
preloadImage.src = "aya.jpg";

// Check name function
function checkName() {
    if (isLockedOut) {
        errorMsg.textContent = `⏳ Locked out! Please wait ${getRemainingLockoutTime()} seconds.`;
        return;
    }
    
    const inputName = nameInput.value.trim();
    
    if (inputName === "") {
        showError("⚠️ Please enter a name!");
        return;
    }
    
    if (inputName === SECRET_NAME) {
        // CORRECT NAME
        unlockSound.currentTime = 0;
        unlockSound.play().catch(e => console.log("Audio error:", e));
        
        // Switch to unlocked screen
        lockScreen.classList.add('hidden');
        unlockedScreen.classList.remove('hidden');
        
        // Reset attempts
        attemptsLeft = MAX_ATTEMPTS;
        attemptsDisplay.textContent = attemptsLeft;
        errorMsg.textContent = "";
        nameInput.value = "";
        
        // Ensure image loads
        ayaImg.src = "aya.jpg?t=" + new Date().getTime();
    } else {
        // WRONG NAME
        attemptsLeft--;
        attemptsDisplay.textContent = attemptsLeft;
        
        errorSound.currentTime = 0;
        errorSound.play().catch(e => console.log("Audio error:", e));
        
        if (attemptsLeft <= 0) {
            // Lockout user
            isLockedOut = true;
            unlockBtn.disabled = true;
            nameInput.disabled = true;
            
            errorMsg.textContent = `🔒 Too many attempts! Locked out for 30 seconds.`;
            errorMsg.style.color = "#ff4757";
            
            // Start lockout timer
            lockoutTimeout = setTimeout(() => {
                isLockedOut = false;
                attemptsLeft = MAX_ATTEMPTS;
                attemptsDisplay.textContent = attemptsLeft;
                unlockBtn.disabled = false;
                nameInput.disabled = false;
                errorMsg.textContent = "🔓 Lockout ended! Try again.";
                errorMsg.style.color = "#2ed573";
                
                setTimeout(() => {
                    errorMsg.textContent = "";
                }, 3000);
            }, TIMEOUT_DURATION);
        } else {
            showError(`❌ Wrong name! Attempts left: ${attemptsLeft}`);
        }
        
        // Shake animation for wrong input
        nameInput.style.animation = 'none';
        setTimeout(() => {
            nameInput.style.animation = 'shake 0.5s';
        }, 10);
    }
}

// Show error message
function showError(message) {
    errorMsg.textContent = message;
    errorMsg.style.color = "#ff4757";
    
    // Clear error after 3 seconds
    setTimeout(() => {
        if (errorMsg.textContent === message) {
            errorMsg.textContent = "";
        }
    }, 3000);
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
}

// Enter key support
nameInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkName();
    }
});

// Add shake animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Initialize

attemptsDisplay.textContent = attemptsLeft;
