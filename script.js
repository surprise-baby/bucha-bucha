// --- CONFIGURATION ---
const PASSWORDS = {
    step1: "RIMU",
    step2: "BUCHABUCHA" // Case insensitive
};

const SAD_MESSAGES = [
    "ARE YOU SURE???? 🥺",
    "Are you really sure?",
    "Really really sure?",
    "REALLY REALLY REALLY SURE???",
    "This is illegal.",
    "I will cry.",
    "This is emotional damage.",
    "Final warning.",
    "Are you 100000% sure?",
    "I’m uninstalling."
];

// --- STATE ---
let currentSadIndex = 0;
let audioPlaying = false;

// --- DOM ELEMENTS ---
const pages = {
    1: document.getElementById('page-1'),
    2: document.getElementById('page-2'),
    3: document.getElementById('page-3'),
    4: document.getElementById('page-4'),
    5: document.getElementById('page-5')
};

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    setupInputs();
    setupButtons();
    setupExtras();
});

// --- PAGE 1: PASSWORD ---
function setupInputs() {
    const chars = document.querySelectorAll('.char-input');
    const step1 = document.getElementById('pass-step-1');
    const step2 = document.getElementById('pass-step-2');
    const error1 = document.getElementById('error-msg-1');

    // Auto-focus logic for 4-char input
    chars.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            input.value = input.value.toUpperCase();
            if (input.value.length === 1 && index < 3) {
                chars[index + 1].focus();
            }

            // Check full word
            const word = Array.from(chars).map(i => i.value).join('');
            if (word.length === 4) {
                if (word === PASSWORDS.step1) {
                    // Success Step 1
                    confetti({ particleCount: 50, spread: 60 });
                    step1.classList.add('hidden'); // Simplified transition
                    step2.classList.remove('hidden');
                } else {
                    // Fail Step 1
                    error1.classList.remove('hidden');
                    document.getElementById('login-card').classList.add('shake');
                    setTimeout(() => document.getElementById('login-card').classList.remove('shake'), 500);
                    // Clear inputs
                    setTimeout(() => chars.forEach(i => i.value = ''), 1000);
                    chars[0].focus();
                }
            }
        });
    });

    // Step 2 Logic
    const finalInput = document.getElementById('final-pass');

    function checkStep2() {
        const val = finalInput.value.toUpperCase().trim();
        if (val === PASSWORDS.step2) {
            // Success Step 2
            fireworks();
            transitionToPage(2);
        } else {
            const card = document.getElementById('login-card');
            const err = document.getElementById('error-msg-2');

            // Only show error if length matches or it was an explict check (like button click)
            if (val.length >= PASSWORDS.step2.length) {
                err.classList.remove('hidden');
                card.classList.add('shake');
                setTimeout(() => card.classList.remove('shake'), 500);
            }
        }
    }

    document.getElementById('unlock-btn').addEventListener('click', checkStep2);

    finalInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkStep2();
    });

    finalInput.addEventListener('input', () => {
        if (finalInput.value.length === PASSWORDS.step2.length) {
            checkStep2();
        }
    });
}

// --- PAGE 2: MAIN QUESTION ---
function setupButtons() {
    const noBtn = document.getElementById('no-btn');
    const contentWrapper = document.querySelector('#page-2 .content-wrapper');

    // Running No Button
    noBtn.addEventListener('mouseover', moveNoButton);
    // Mobile support
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveNoButton();
    });

    function moveNoButton() {
        const x = Math.random() * (window.innerWidth - 100);
        const y = Math.random() * (window.innerHeight - 50);
        noBtn.style.position = 'fixed'; // Change to fixed to allow full screen roam
        noBtn.style.left = `${x}px`;
        noBtn.style.top = `${y}px`;
    }

    document.getElementById('yes-btn').addEventListener('click', () => {
        transitionToPage(4);
    });

    // Fallback if they somehow click No
    noBtn.addEventListener('click', () => {
        transitionToPage(3);
    });

    // Sad Page Logic
    const sadTitle = document.getElementById('sad-title');
    const sadYes = document.getElementById('sad-yes-btn');

    sadYes.addEventListener('click', () => {
        currentSadIndex = (currentSadIndex + 1) % SAD_MESSAGES.length;
        sadTitle.innerText = SAD_MESSAGES[currentSadIndex];
        sadYes.style.transform = `scale(${1 + currentSadIndex * 0.1})`;
    });

    document.getElementById('sad-no-btn').addEventListener('click', () => {
        currentSadIndex = 0; // Reset
        transitionToPage(2);
    });

    // Page 4 -> 5
    document.getElementById('quiz-start-btn').addEventListener('click', () => {
        transitionToPage(5);
        startQuiz();
    });
}

// --- PAGE 5: QUIZ ---
const QUIZ_DATA = [
    {
        q: "When did we first talk until 3AM like sleep is fake?? 🌙",
        options: ["Last Week", "The Simulation", "Day 1", "Never"],
        correct: 2 // Index
    },
    {
        q: "What is our dumbest inside joke?",
        options: ["The Potato", "BuchaBucha", "Aliens", "Coding"],
        correct: 1
    },
    {
        q: "Who fell harder? 👀",
        options: ["You", "Me", "Rachit (Obv)", "Both equal (lie)"],
        correct: 2
    },
    {
        q: "I would choose you in every universe.",
        options: ["Yes", "YES", "YESSS", "FOREVER"],
        correct: -1 // All correct
    }
];

let quizIndex = 0;

function startQuiz() {
    loadQuestion(0);
}

function loadQuestion(index) {
    if (index >= QUIZ_DATA.length) {
        // End of quiz
        document.querySelector('.quiz-container').innerHTML = `
            <h1 class="bounce-text">HAPPY VALENTINE’S DAY RIMU 💕</h1>
            <p>I love you more than code bugs.</p>
            <p style="font-family:'Great Vibes'; font-size: 2rem; margin-top: 20px;">— Rachit</p>
        `;
        fireworks();
        return;
    }

    const data = QUIZ_DATA[index];
    document.getElementById('quiz-question').innerText = data.q;
    const optsDiv = document.getElementById('quiz-options');
    optsDiv.innerHTML = '';

    data.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.className = 'quiz-btn';
        btn.onclick = () => {
            if (data.correct === -1 || i === data.correct) {
                confetti({
                    particleCount: 30,
                    spread: 50,
                    origin: { y: 0.6 }
                });
                if (index === QUIZ_DATA.length - 1) {
                    loadQuestion(index + 1); // Finish
                } else {
                    setTimeout(() => loadQuestion(index + 1), 500);
                }
            } else {
                btn.classList.add('shake');
                btn.style.background = '#ffcccc';
                btn.innerText = "NOPE 🤪";
                setTimeout(() => btn.classList.remove('shake'), 500);
            }
        };
        optsDiv.appendChild(btn);
    });
}

// --- UTILS ---
function transitionToPage(pageNum) {
    // Blur any focused element (keyboard fix)
    if (document.activeElement) document.activeElement.blur();

    // First, hide ALL pages immediately
    Object.values(pages).forEach(p => {
        p.classList.remove('active');
        p.classList.add('hidden');
    });

    // Page 2 Specific: Reset buttons to hidden state BEFORE showing page
    if (pageNum === 2) {
        const btns = document.getElementById('intro-buttons');
        btns.classList.add('hidden');
        btns.classList.remove('fade-in');
    }

    // Show target page after a brief delay to ensure clean transition
    setTimeout(() => {
        const target = pages[pageNum];
        target.classList.remove('hidden');
        
        // Add active class after another brief delay for smooth animation
        setTimeout(() => {
            target.classList.add('active');
            
            // Page 2 Specific Logic: Delayed Reveal of buttons
            if (pageNum === 2) {
                const btns = document.getElementById('intro-buttons');
                setTimeout(() => {
                    btns.classList.remove('hidden');
                    btns.classList.add('fade-in');
                }, 2500); // 2.5s delay for dramatic effect
            }
        }, 100);
    }, 100);
}

function fireworks() {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } }));
    }, 250);
}

function setupExtras() {
    // Music Toggle
    const audio = document.getElementById('bg-music');
    const btn = document.getElementById('music-toggle');

    btn.addEventListener('click', () => {
        if (audioPlaying) {
            audio.pause();
            btn.innerText = "🎵 Play Music";
        } else {
            audio.play().catch(e => console.log("Audio play failed (needs interaction):", e));
            btn.innerText = "⏸ Pause Music";
        }
        audioPlaying = !audioPlaying;
    });

    // Cursor Trail
    document.addEventListener('mousemove', (e) => {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = `${e.pageX}px`;
        trail.style.top = `${e.pageY}px`;
        document.body.appendChild(trail);

        setTimeout(() => {
            trail.style.opacity = '0';
            setTimeout(() => trail.remove(), 500);
        }, 100);
    });
}
