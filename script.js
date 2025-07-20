document.addEventListener('DOMContentLoaded', () => {
    const analyzeTextBtn = document.getElementById('analyze-text-btn');
    const analyzeVideoBtn = document.getElementById('analyze-video-btn');
    const analyzeImageBtn = document.getElementById('analyze-image-btn');
    const textInput = document.getElementById('text-input');
    const videoUrlInput = document.getElementById('video-url');
    const imageInput = document.getElementById('image-input');
    const resultOutput = document.getElementById('result-output');
    const resultSection = document.getElementById('result-section');

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

    analyzeTextBtn.addEventListener('click', () => {
        const text = textInput.value;
        const loadingInterval = showLoading();
        scrollToResult();
        setTimeout(() => {
            clearInterval(loadingInterval);
            const result = analyzeText(text);
            resultOutput.textContent = result;
        }, 1500);
    });

    analyzeVideoBtn.addEventListener('click', () => {
        const url = videoUrlInput.value;
        const loadingInterval = showLoading();
        scrollToResult();
        setTimeout(() => {
            clearInterval(loadingInterval);
            const result = analyzeVideo(url);
            resultOutput.textContent = result;
        }, 1500);
    });

    analyzeImageBtn.addEventListener('click', () => {
        const file = imageInput.files[0];
        const loadingInterval = showLoading();
        scrollToResult();
        setTimeout(() => {
            clearInterval(loadingInterval);
            const result = analyzeImage(file);
            resultOutput.textContent = result;
        }, 1500);
    });
});
