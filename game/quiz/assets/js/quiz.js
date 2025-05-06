// JavaScript untuk halaman quiz dan logika quiz

// Variabel Quiz
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let quizCategory = '';
let quizLevel = 0;

// Elements
let questionText;
let optionsContainer;
let quizProgress;
let currentScoreElement;
let resultModal;
let finalScoreElement;
let coinRewardElement;
let xpRewardElement;
let restartQuizBtn;
let homeBtn;
let nextLevelBtn;
let selectLevelBtn;
let quizCategoryLevelElement;
let quitQuizBtn;
let quitConfirmModal;
let confirmQuitBtn;
let cancelQuitBtn;

// Inisialisasi Quiz
document.addEventListener('DOMContentLoaded', function() {
    // Ambil kategori dan level dari sessionStorage
    quizCategory = sessionStorage.getItem('quizCategory');
    quizLevel = parseInt(sessionStorage.getItem('quizLevel'));
    
    // Jika tidak ada data quiz, kembali ke halaman utama
    if (!quizCategory || !quizLevel) {
        window.location.href = 'index.html';
        return;
    }
    
    // Inisialisasi element
    questionText = document.getElementById('questionText');
    optionsContainer = document.getElementById('optionsContainer');
    quizProgress = document.getElementById('quizProgress');
    currentScoreElement = document.getElementById('currentScore');
    resultModal = document.getElementById('resultModal');
    finalScoreElement = document.getElementById('finalScore');
    coinRewardElement = document.getElementById('coinReward');
    xpRewardElement = document.getElementById('xpReward');
    restartQuizBtn = document.getElementById('restartQuizBtn');
    homeBtn = document.getElementById('homeBtn');
    nextLevelBtn = document.getElementById('nextLevelBtn');
    selectLevelBtn = document.getElementById('selectLevelBtn');
    quizCategoryLevelElement = document.getElementById('quizCategoryLevel');
    
    // Inisialisasi tombol exit
    quitQuizBtn = document.getElementById('quitQuizBtn');
    quitConfirmModal = document.getElementById('quitConfirmModal');
    confirmQuitBtn = document.getElementById('confirmQuitBtn');
    cancelQuitBtn = document.getElementById('cancelQuitBtn');
    
    // Set judul kategori dan level
    const category = categoryData.find(cat => cat.id === quizCategory);
    if (category && quizCategoryLevelElement) {
        quizCategoryLevelElement.textContent = `${category.title} - Level ${quizLevel}`;
    }
    
    // Ambil pertanyaan
    currentQuestions = getQuestionsForLevel(quizCategory, quizLevel);
    
    // Acak urutan pertanyaan
    shuffleArray(currentQuestions);
    
    // Setup event listeners
    if (restartQuizBtn) {
        restartQuizBtn.addEventListener('click', function() {
            restartQuiz();
        });
    }
    
    if (homeBtn) {
        homeBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
    
    if (nextLevelBtn) {
        nextLevelBtn.addEventListener('click', function() {
            goToNextLevel();
        });
    }
    
    if (selectLevelBtn) {
        selectLevelBtn.addEventListener('click', function() {
            window.location.href = `level.html?category=${quizCategory}`;
        });
    }
    
    // Setup tombol exit
    if (quitQuizBtn) {
        quitQuizBtn.addEventListener('click', function() {
            showQuitConfirmation();
        });
    }
    
    if (confirmQuitBtn) {
        confirmQuitBtn.addEventListener('click', function() {
            // Pergi ke halaman level
            window.location.href = `level.html?category=${quizCategory}`;
        });
    }
    
    if (cancelQuitBtn) {
        cancelQuitBtn.addEventListener('click', function() {
            hideQuitConfirmation();
        });
    }
    
    // Mulai quiz
    startQuiz();
});

// Tampilkan konfirmasi keluar
function showQuitConfirmation() {
    if (quitConfirmModal) {
        quitConfirmModal.classList.add('active');
    }
}

// Sembunyikan konfirmasi keluar
function hideQuitConfirmation() {
    if (quitConfirmModal) {
        quitConfirmModal.classList.remove('active');
    }
}

// Mulai quiz
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    updateScore();
    showQuestion();
}

// Tampilkan pertanyaan saat ini
function showQuestion() {
    if (currentQuestionIndex >= currentQuestions.length) {
        endQuiz();
        return;
    }
    
    const question = currentQuestions[currentQuestionIndex];
    
    // Update progress bar
    const progressPercentage = (currentQuestionIndex / currentQuestions.length) * 100;
    quizProgress.style.width = `${progressPercentage}%`;
    
    // Tampilkan pertanyaan
    questionText.textContent = question.question;
    
    // Bersihkan container opsi
    optionsContainer.innerHTML = '';
    
    // Tambahkan opsi jawaban
    question.options.forEach((option, index) => {
        const optionItem = document.createElement('div');
        optionItem.className = 'option-item';
        optionItem.dataset.index = index;
        optionItem.textContent = option;
        
        optionItem.addEventListener('click', function() {
            selectOption(this);
        });
        
        optionsContainer.appendChild(optionItem);
    });
}

// Pilih opsi jawaban
function selectOption(selectedOption) {
    // Nonaktifkan semua opsi setelah memilih
    const allOptions = optionsContainer.querySelectorAll('.option-item');
    allOptions.forEach(option => {
        option.style.pointerEvents = 'none';
    });
    
    const selectedIndex = parseInt(selectedOption.dataset.index);
    const currentQuestion = currentQuestions[currentQuestionIndex];
    
    // Tambahkan kelas selected ke opsi yang dipilih
    selectedOption.classList.add('selected');
    
    // Cek apakah jawaban benar
    if (selectedIndex === currentQuestion.correctAnswer) {
        // Jawaban benar
        selectedOption.classList.add('correct');
        score += currentQuestion.points;
        updateScore();
    } else {
        // Jawaban salah
        selectedOption.classList.add('incorrect');
        
        // Tampilkan jawaban yang benar
        allOptions[currentQuestion.correctAnswer].classList.add('correct');
    }
    
    // Tunggu sebentar sebelum lanjut ke pertanyaan berikutnya
    setTimeout(() => {
        currentQuestionIndex++;
        showQuestion();
    }, 1500);
}

// Update skor
function updateScore() {
    currentScoreElement.textContent = score;
}

// Akhiri quiz
function endQuiz() {
    // Hitung reward
    const result = completeLevel(quizCategory, quizLevel, score);
    
    // Update UI result
    finalScoreElement.textContent = score;
    coinRewardElement.textContent = `+${result.coinsEarned}`;
    xpRewardElement.textContent = `+${result.xpEarned} XP`;
    
    // Simpan data game
    saveGameData();
    
    // Cek apakah ada level berikutnya
    updateNextLevelButton();
    
    // Tampilkan modal hasil
    resultModal.classList.add('active');
}

// Update tampilan tombol Next Level
function updateNextLevelButton() {
    const nextLevel = quizLevel + 1;
    const category = categoryData.find(cat => cat.id === quizCategory);
    
    // Sembunyikan tombol jika ini level terakhir
    if (nextLevelBtn) {
        if (category && nextLevel <= category.totalLevels) {
            // Cek apakah level berikutnya sudah terbuka
            const levels = getLevelsForCategory(quizCategory);
            const nextLevelInfo = levels.find(level => level.level === nextLevel);
            
            if (nextLevelInfo && nextLevelInfo.status !== 'locked') {
                nextLevelBtn.style.display = 'block';
            } else {
                nextLevelBtn.style.display = 'none';
            }
        } else {
            nextLevelBtn.style.display = 'none';
        }
    }
}

// Menuju level berikutnya
function goToNextLevel() {
    const nextLevel = quizLevel + 1;
    
    // Simpan level baru ke session storage
    sessionStorage.setItem('quizCategory', quizCategory);
    sessionStorage.setItem('quizLevel', nextLevel);
    
    // Reload halaman untuk mulai level baru
    window.location.reload();
}

// Restart quiz
function restartQuiz() {
    // Sembunyikan modal hasil
    resultModal.classList.remove('active');
    
    // Acak pertanyaan
    shuffleArray(currentQuestions);
    
    // Reset quiz
    startQuiz();
}

// Utility function untuk mengacak array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}