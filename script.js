document.addEventListener('DOMContentLoaded', () => {
    const analyzeTextBtn = document.getElementById('analyze-text-btn');
    const analyzeVideoBtn = document.getElementById('analyze-video-btn');
    const analyzeImageBtn = document.getElementById('analyze-image-btn');
    const textInput = document.getElementById('text-input');
    const videoUrlInput = document.getElementById('video-url');
    const imageInput = document.getElementById('image-input');
    const resultOutput = document.getElementById('result-output');
    const resultSection = document.getElementById('result-section');
    const heroSection = document.getElementById('hero-section');
    const tabsSection = document.getElementById('tabs');
    const startBtn = document.getElementById('start-btn');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    function getRandomConfidence() {
        const levels = ['Low', 'Medium', 'High'];
        return levels[Math.floor(Math.random() * levels.length)];
    }

    function getRandomProbability() {
        return Math.floor(Math.random() * 101); // 0 to 100%
    }

    function analyzeText(text) {
        if (!text.trim()) {
            return "Please enter some text to analyze.";
        }
        const probability = getRandomProbability();
        const confidence = getRandomConfidence();
        return `Analysis Result for Text:\n- Fake News Probability: ${probability}%\n- Confidence: ${confidence}\n\n(Note: Backend integration pending)`;
    }

    function analyzeVideo(url) {
        if (!url.trim()) {
            return "Please enter a video URL to analyze.";
        }
        const probability = getRandomProbability();
        const confidence = getRandomConfidence();
        return `Analysis Result for Video URL:\n- Deepfake Probability: ${probability}%\n- Confidence: ${confidence}\n\n(Note: Backend integration pending)`;
    }

    function analyzeImage(file) {
        if (!file) {
            return "Please select an image file to analyze.";
        }
        const probability = getRandomProbability();
        const confidence = getRandomConfidence();
        return `Analysis Result for Image:\n- Deepfake Probability: ${probability}%\n- Confidence: ${confidence}\n\n(Note: Backend integration pending)`;
    }

    function showLoading() {
        resultOutput.textContent = "Analyzing";
        let dots = 0;
        const interval = setInterval(() => {
            dots = (dots + 1) % 4;
            resultOutput.textContent = "Analyzing" + ".".repeat(dots);
        }, 500);
        return interval;
    }

    function scrollToResult() {
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }

    startBtn.addEventListener('click', () => {
        heroSection.style.display = 'none';
        tabsSection.style.display = 'block';
    });

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            tabContents.forEach(content => {
                if (content.id === targetTab) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });

            // Hide result section on tab switch
            resultSection.style.display = 'none';
        });
    });

    analyzeTextBtn.addEventListener('click', () => {
        const text = textInput.value;
        const spinner = analyzeTextBtn.querySelector('.loading-spinner');
        spinner.style.display = 'inline-block';
        const loadingInterval = showLoading();
        // Hide result section before analysis
        resultSection.style.display = 'none';
        setTimeout(() => {
            clearInterval(loadingInterval);
            spinner.style.display = 'none';
            const result = analyzeText(text);
            resultOutput.innerHTML = addEmojiToResult(result);
            resultSection.style.display = 'block';
            scrollToResult(); // Scroll after showing result
        }, 1500);
    });
    analyzeVideoBtn.addEventListener('click', () => {
        const url = videoUrlInput.value;
        const spinner = analyzeVideoBtn.querySelector('.loading-spinner');
        spinner.style.display = 'inline-block';
        const loadingInterval = showLoading();
        scrollToResult();
        // Show result section only after analysis
        resultSection.style.display = 'none';
        setTimeout(() => {
            clearInterval(loadingInterval);
            spinner.style.display = 'none';
            const result = analyzeVideo(url);
            resultOutput.innerHTML = addEmojiToResult(result);
            resultSection.style.display = 'block';
        }, 1500);
    });

    analyzeImageBtn.addEventListener('click', () => {
        const file = imageInput.files[0];
        const spinner = analyzeImageBtn.querySelector('.loading-spinner');
        spinner.style.display = 'inline-block';
        const loadingInterval = showLoading();
        scrollToResult();
        // Show result section only after analysis
        resultSection.style.display = 'none';
        setTimeout(() => {
            clearInterval(loadingInterval);
            spinner.style.display = 'none';
            const result = analyzeImage(file);
            resultOutput.innerHTML = addEmojiToResult(result);
            resultSection.style.display = 'block';
        }, 1500);
    });

    function addEmojiToResult(resultText) {
        // Simple logic to add emoji based on confidence or probability keywords
        let emoji = '❓';
        if (resultText.includes('High')) {
            emoji = '🔥';
        } else if (resultText.includes('Medium')) {
            emoji = '⚠️';
        } else if (resultText.includes('Low')) {
            emoji = '✅';
        }
        return `<span class="result-emoji">${emoji}</span>${resultText.replace(/\n/g, '<br>')}`;
    }
});