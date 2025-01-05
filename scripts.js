document.addEventListener('DOMContentLoaded', () => {
    // Morse code dictionary
    const morseCode = {
        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
        'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
        'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
        'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
        'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
        '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
        '8': '---..', '9': '----.'
    };

    // DOM elements
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const modal = document.getElementById('learningModal');
    const closeModal = document.querySelector('.close-modal');
    const lessonGrid = document.querySelector('.lesson-grid');
    const practiceArea = document.querySelector('.practice-area');
    const challengeArea = document.querySelector('.challenge-area');
    const progressStats = document.querySelector('.progress-stats');

    // State
    let currentLesson = 1;
    let score = 0;
    let streak = 0;
    let accuracy = 0;
    let totalAttempts = 0;
    let lastCompletedDay = 0;

    // Load progress from local storage
    function loadProgress() {
        const savedProgress = localStorage.getItem('morseCodeProgress');
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            currentLesson = progress.currentLesson;
            score = progress.score;
            streak = progress.streak;
            accuracy = progress.accuracy;
            totalAttempts = progress.totalAttempts;
            lastCompletedDay = progress.lastCompletedDay;
        }
    }

    // Save progress to local storage
    function saveProgress() {
        const progress = {
            currentLesson,
            score,
            streak,
            accuracy,
            totalAttempts,
            lastCompletedDay
        };
        localStorage.setItem('morseCodeProgress', JSON.stringify(progress));
    }

    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Modal functionality
    function openModal(content) {
        modal.classList.add('active');
        document.querySelector('.lesson-content').innerHTML = content;
    }

    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Generate lesson cards
    function generateLessonCards() {
        const lessons = [
            { title: "Basic Dots and Dashes", letters: ['E', 'T', 'A', 'N'] },
            { title: "Common Letters I", letters: ['I', 'M', 'S', 'O'] },
            { title: "Common Letters II", letters: ['R', 'H', 'D', 'L'] },
            { title: "Expanding Vocabulary", letters: ['U', 'C', 'W', 'F'] },
            { title: "Complex Letters", letters: ['K', 'Y', 'P', 'Q'] },
            { title: "Numbers Part 1", letters: ['1', '2', '3', '4', '5'] },
            { title: "Numbers Part 2", letters: ['6', '7', '8', '9', '0'] }
        ];

        lessonGrid.innerHTML = lessons.map((lesson, index) => `
            <div class="lesson-card" data-day="${index + 1}">
                <div class="lesson-header">
                    <span class="day">Day ${index + 1}</span>
                    <span class="status">${index + 1 <= currentLesson ? 'Unlocked' : 'Locked'}</span>
                </div>
                <h3>${lesson.title}</h3>
                <p>Learn and practice the following letters:</p>
                <div class="letters">
                    ${lesson.letters.map(letter => `<span>${letter}</span>`).join('')}
                </div>
            </div>
        `).join('');

        // Add click event listeners to lesson cards
        document.querySelectorAll('.lesson-card').forEach(card => {
            card.addEventListener('click', () => {
                const day = parseInt(card.getAttribute('data-day'));
                if (day <= currentLesson) {
                    const content = generateLessonContent(day);
                    openModal(content);
                }
            });
        });
    }

    function generateLessonContent(day) {
        const lessons = [
            { title: "Basic Dots and Dashes", letters: ['E', 'T', 'A', 'N'] },
            { title: "Common Letters I", letters: ['I', 'M', 'S', 'O'] },
            { title: "Common Letters II", letters: ['R', 'H', 'D', 'L'] },
            { title: "Expanding Vocabulary", letters: ['U', 'C', 'W', 'F'] },
            { title: "Complex Letters", letters: ['K', 'Y', 'P', 'Q'] },
            { title: "Numbers Part 1", letters: ['1', '2', '3', '4', '5'] },
            { title: "Numbers Part 2", letters: ['6', '7', '8', '9', '0'] }
        ];

        const lesson = lessons[day - 1];
        return `
            <h2 class="lesson-title">${lesson.title}</h2>
            <p class="lesson-description">Learn and practice the following letters:</p>
            <div class="lesson-letters">
                ${lesson.letters.map(letter => `<span>${letter}: ${morseCode[letter]}</span>`).join('')}
            </div>
            <div class="lesson-exercises">
                <div class="recognition-exercise">
                    <h3>Recognition Exercise</h3>
                    <div class="morse-code-display"></div>
                    <input type="text" class="recognition-input" maxlength="1">
                    <button class="submit-recognition">Submit</button>
                </div>
                <div class="writing-exercise">
                    <h3>Writing Exercise</h3>
                    <div class="letter-to-morse"></div>
                    <input type="text" class="writing-input" placeholder="Type Morse code">
                    <button class="submit-writing">Submit</button>
                </div>
                <div class="listening-exercise">
                    <h3>Listening Exercise</h3>
                    <button class="play-morse-sound">Play Sound</button>
                    <input type="text" class="listening-input" maxlength="1">
                    <button class="submit-listening">Submit</button>
                </div>
            </div>
            <div class="exercise-feedback"></div>
        `;
    }

    // Practice functionality
    function initializePractice() {
        const morseDisplay = document.querySelector('.morse-display');
        const letterInput = document.querySelector('.letter-input');
        const checkAnswer = document.querySelector('.check-answer');
        const playSound = document.querySelector('.play-sound');
        const feedback = document.querySelector('.feedback');
        const scoreDisplay = document.querySelector('.score');
        const streakDisplay = document.querySelector('.streak');

        let currentLetter = '';

        function generateRandomLetter() {
            const letters = Object.keys(morseCode);
            return letters[Math.floor(Math.random() * letters.length)];
        }

        function updateDisplay() {
            currentLetter = generateRandomLetter();
            morseDisplay.querySelector('.current-letter').textContent = currentLetter;
            morseDisplay.querySelector('.morse-code').textContent = morseCode[currentLetter];
        }

        function checkUserAnswer() {
            const userInput = letterInput.value.toUpperCase();
            if (userInput === currentLetter) {
                feedback.textContent = 'Correct!';
                feedback.style.color = 'green';
                score++;
                streak++;
            } else {
                feedback.textContent = 'Incorrect. Try again!';
                feedback.style.color = 'red';
                streak = 0;
            }
            totalAttempts++;
            accuracy = Math.round((score / totalAttempts) * 100);
            updateStats();
            updateDisplay();
            letterInput.value = '';
            saveProgress();
        }

        function updateStats() {
            scoreDisplay.textContent = `Score: ${score}`;
            streakDisplay.textContent = `Streak: ${streak}`;
            document.querySelector('.progress-fill').style.width = `${(currentLesson / 7) * 100}%`;
            document.querySelector('.progress-percentage').textContent = `${Math.round((currentLesson / 7) * 100)}%`;
            document.querySelector('.accuracy-display').textContent = `${accuracy}%`;
            document.querySelector('.streak-display').textContent = `${streak} days`;
        }

        function playMorseSound() {
            const audio = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audio.createOscillator();
            const gainNode = audio.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audio.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(600, audio.currentTime);

            const dot = 0.1;
            const dash = 0.3;

            let startTime = audio.currentTime;

            morseCode[currentLetter].split('').forEach(symbol => {
                gainNode.gain.setValueAtTime(1, startTime);
                startTime += symbol === '.' ? dot : dash;
                gainNode.gain.setValueAtTime(0, startTime);
                startTime += dot;
            });

            oscillator.start();
            oscillator.stop(startTime);
        }

        updateDisplay();
        checkAnswer.addEventListener('click', checkUserAnswer);
        playSound.addEventListener('click', playMorseSound);
        letterInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkUserAnswer();
            }
        });
    }

    // Challenge functionality
    function initializeChallenge() {
        const challengeTask = document.querySelector('.challenge-task');
        const challengeInput = document.querySelector('.challenge-input input');
        const submitChallenge = document.querySelector('.submit-challenge');

        function generateChallenge() {
            const words = ['SOS', 'HELLO', 'WORLD', 'MORSE', 'CODE', 'SIGNAL', 'RADIO', 'LEARN'];
            const word = words[Math.floor(Math.random() * words.length)];
            const morse = word.split('').map(letter => morseCode[letter]).join(' ');
            challengeTask.textContent = `Convert this Morse code to text: ${morse}`;
            return word;
        }

        let currentWord = generateChallenge();

        submitChallenge.addEventListener('click', () => {
            const userInput = challengeInput.value.toUpperCase();
            if (userInput === currentWord) {
                alert('Correct! You solved the challenge!');
                currentWord = generateChallenge();
                challengeInput.value = '';
                currentLesson = Math.min(currentLesson + 1, 7);
                updateStats();
                saveProgress();
            } else {
                alert('Incorrect. Try again!');
            }
        });
    }

    // Initialize all functionalities
    loadProgress();
    generateLessonCards();
    initializePractice();
    initializeChallenge();

    // Update stats on page load
    function updateStats() {
        document.querySelector('.progress-fill').style.width = `${(currentLesson / 7) * 100}%`;
        document.querySelector('.progress-percentage').textContent = `${Math.round((currentLesson / 7) * 100)}%`;
        document.querySelector('.accuracy-display').textContent = `${accuracy}%`;
        document.querySelector('.streak-display').textContent = `${streak} days`;
    }
    updateStats();

    // Check and update streak daily
    function checkDailyStreak() {
        const today = new Date().toDateString();
        if (today !== lastCompletedDay) {
            if (new Date(lastCompletedDay).getTime() < new Date().getTime() - 86400000) {
                streak = 0;
            }
            lastCompletedDay = today;
            saveProgress();
        }
    }
    checkDailyStreak();

    // Error handling
    window.addEventListener('error', function(e) {
        console.error('An error occurred:', e.error);
        alert('An error occurred. Please refresh the page and try again.');
    });

    //  smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add animations to elements as they come into view
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    });

    animatedElements.forEach(el => observer.observe(el));
});

    // Implement the lesson exercises functionality
    function initializeLessonExercises() {
        const modal = document.getElementById('learningModal');
        
        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('submit-recognition')) {
                handleRecognitionExercise(e);
            } else if (e.target.classList.contains('submit-writing')) {
                handleWritingExercise(e);
            } else if (e.target.classList.contains('submit-listening')) {
                handleListeningExercise(e);
            } else if (e.target.classList.contains('play-morse-sound')) {
                playMorseSoundForExercise(e);
            }
        });

        function handleRecognitionExercise(e) {
            const morseDisplay = e.target.closest('.recognition-exercise').querySelector('.morse-code-display');
            const input = e.target.closest('.recognition-exercise').querySelector('.recognition-input');
            const feedback = modal.querySelector('.exercise-feedback');

            const currentMorse = morseDisplay.textContent;
            const userInput = input.value.toUpperCase();
            const correctLetter = Object.keys(morseCode).find(key => morseCode[key] === currentMorse);

            if (userInput === correctLetter) {
                feedback.textContent = 'Correct! Well done!';
                feedback.style.color = 'green';
                setTimeout(() => generateNewRecognitionExercise(morseDisplay), 1500);
            } else {
                feedback.textContent = `Incorrect. The correct answer was ${correctLetter}. Try again!`;
                feedback.style.color = 'red';
            }

            input.value = '';
        }

        function handleWritingExercise(e) {
            const letterDisplay = e.target.closest('.writing-exercise').querySelector('.letter-to-morse');
            const input = e.target.closest('.writing-exercise').querySelector('.writing-input');
            const feedback = modal.querySelector('.exercise-feedback');

            const currentLetter = letterDisplay.textContent;
            const userInput = input.value.replace(/\s+/g, '').toUpperCase();
            const correctMorse = morseCode[currentLetter];

            if (userInput === correctMorse) {
                feedback.textContent = 'Correct! Excellent job!';
                feedback.style.color = 'green';
                setTimeout(() => generateNewWritingExercise(letterDisplay), 1500);
            } else {
                feedback.textContent = `Incorrect. The correct Morse code for ${currentLetter} is ${correctMorse}. Try again!`;
                feedback.style.color = 'red';
            }

            input.value = '';
        }

        function handleListeningExercise(e) {
            const playButton = e.target.closest('.listening-exercise').querySelector('.play-morse-sound');
            const input = e.target.closest('.listening-exercise').querySelector('.listening-input');
            const feedback = modal.querySelector('.exercise-feedback');

            const currentLetter = playButton.dataset.letter;
            const userInput = input.value.toUpperCase();

            if (userInput === currentLetter) {
                feedback.textContent = 'Correct! Great listening!';
                feedback.style.color = 'green';
                setTimeout(() => generateNewListeningExercise(playButton), 1500);
            } else {
                feedback.textContent = `Incorrect. The correct letter was ${currentLetter}. Try again!`;
                feedback.style.color = 'red';
            }

            input.value = '';
        }

        function generateNewRecognitionExercise(display) {
            const letters = Object.keys(morseCode);
            const randomLetter = letters[Math.floor(Math.random() * letters.length)];
            display.textContent = morseCode[randomLetter];
        }

        function generateNewWritingExercise(display) {
            const letters = Object.keys(morseCode);
            const randomLetter = letters[Math.floor(Math.random() * letters.length)];
            display.textContent = randomLetter;
        }

        function generateNewListeningExercise(playButton) {
            const letters = Object.keys(morseCode);
            const randomLetter = letters[Math.floor(Math.random() * letters.length)];
            playButton.dataset.letter = randomLetter;
        }

        function playMorseSoundForExercise(e) {
            const playButton = e.target;
            const letter = playButton.dataset.letter;
            const morse = morseCode[letter];

            const audio = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audio.createOscillator();
            const gainNode = audio.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audio.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(600, audio.currentTime);

            const dot = 0.1;
            const dash = 0.3;

            let startTime = audio.currentTime;

            morse.split('').forEach(symbol => {
                gainNode.gain.setValueAtTime(1, startTime);
                startTime += symbol === '.' ? dot : dash;
                gainNode.gain.setValueAtTime(0, startTime);
                startTime += dot;
            });

            oscillator.start();
            oscillator.stop(startTime);
        }
    }

    // Initialize lesson exercises
    initializeLessonExercises();

    // Implement progress tracking
    function updateProgress() {
        const progressPercentage = Math.round((currentLesson / 7) * 100);
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-percentage');
        const accuracyDisplay = document.querySelector('.accuracy-display');
        const streakDisplay = document.querySelector('.streak-display');

        progressFill.style.width = `${progressPercentage}%`;
        progressText.textContent = `${progressPercentage}%`;
        accuracyDisplay.textContent = `${accuracy}%`;
        streakDisplay.textContent = `${streak} days`;

        saveProgress();
    }

    // Implement daily challenge
    function initializeDailyChallenge() {
        const challengeTask = document.querySelector('.challenge-task');
        const challengeInput = document.querySelector('.challenge-input input');
        const submitChallenge = document.querySelector('.submit-challenge');

        function generateDailyChallenge() {
            const phrases = [
                'SOS SAVE OUR SOULS',
                'CQ CQ CQ CALLING ALL STATIONS',
                'HELLO WORLD',
                'PRACTICE MAKES PERFECT',
                'KEEP CALM AND CARRY ON',
                'MAY THE FORCE BE WITH YOU',
                'TO BE OR NOT TO BE'
            ];
            const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
            const morse = randomPhrase.split('').map(char => morseCode[char] || ' ').join(' ');
            challengeTask.textContent = `Decode this message: ${morse}`;
            return randomPhrase;
        }

        let currentChallenge = generateDailyChallenge();

        submitChallenge.addEventListener('click', () => {
            const userInput = challengeInput.value.toUpperCase();
            if (userInput === currentChallenge) {
                alert('Congratulations! You solved the daily challenge!');
                streak++;
                currentLesson = Math.min(currentLesson + 1, 7);
                updateProgress();
                challengeInput.value = '';
                currentChallenge = generateDailyChallenge();
            } else {
                alert('Incorrect. Try again!');
            }
        });
    }

    // Initialize daily challenge
    initializeDailyChallenge();

    // Implement smooth scrolling for all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            document.querySelector('#practice').scrollIntoView({ behavior: 'smooth' });
        } else if (e.ctrlKey && e.key === 'c') {
            e.preventDefault();
            document.querySelector('#challenges').scrollIntoView({ behavior: 'smooth' });
        } else if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            document.querySelector('#lessons').scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Implement a timer for practice sessions
    let practiceTimer;
    let practiceTime = 0;

    function startPracticeTimer() {
        practiceTimer = setInterval(() => {
            practiceTime++;
            updatePracticeTimerDisplay();
        }, 1000);
    }

    function stopPracticeTimer() {
        clearInterval(practiceTimer);
    }

    function updatePracticeTimerDisplay() {
        const minutes = Math.floor(practiceTime / 60);
        const seconds = practiceTime % 60;
        document.querySelector('.practice-timer').textContent = 
            `Practice time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    document.querySelector('.start-practice').addEventListener('click', startPracticeTimer);
    document.querySelector('.stop-practice').addEventListener('click', stopPracticeTimer);

    // Implement confetti animation for completed lessons
    function showConfetti() {
        const confettiCount = 200;
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
            confetti.style.opacity = Math.random();
            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 5000);
        }
    }

    // Show confetti when a lesson is completed
    document.addEventListener('lessonCompleted', showConfetti);

    // Implement audio mute toggle
    const muteButton = document.querySelector('.mute-audio');
    let isMuted = false;

    muteButton.addEventListener('click', () => {
        isMuted = !isMuted;
        muteButton.textContent = isMuted ? 'Unmute Audio' : 'Mute Audio';
        // Update all audio elements or Web Audio API contexts
    });

    // Lazy load images
    document.addEventListener("DOMContentLoaded", function() {
        var lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));

        if ("IntersectionObserver" in window) {
            let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        let lazyImage = entry.target;
                        lazyImage.src = lazyImage.dataset.src;
                        lazyImage.classList.remove("lazy");
                        lazyImageObserver.unobserve(lazyImage);
                    }
                });
            });

            lazyImages.forEach(function(lazyImage) {
                lazyImageObserver.observe(lazyImage);
            });
        }
    });

    // Initialize the application
    loadProgress();
    generateLessonCards();
    initializePractice();
    initializeChallenge();
    updateProgress();
    checkDailyStreak();
});
