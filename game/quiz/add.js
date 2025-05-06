// Tambahkan kode ini di file utama game Quiz (misalnya di quiz/script.js)

import { checkAuthStatus } from '../assets/js/auth.js';
import { saveGameProgress, getGameProgress, saveHighScore } from '../assets/js/progress.js';
import { checkAchievements } from '../assets/js/achievements.js';

// Variabel untuk menyimpan data user
let currentUser = null;

// Variabel untuk statistik quiz
let quizStats = {
    completedQuizzes: 0,
    totalQuizzes: 0,
    correctAnswers: 0,
    totalQuestions: 0,
    highestScore: 0
};

// Fungsi untuk memuat data user
async function loadUserData() {
    currentUser = await checkAuthStatus();
    if (currentUser) {
        console.log('User logged in:', currentUser.username);
        await loadGameProgress();
    } else {
        console.log('No user logged in, progress will not be saved');
        // Tampilkan pesan opsional untuk login
        showLoginMessage();
    }
}

// Fungsi untuk menampilkan pesan login (opsional)
function showLoginMessage() {
    // Buat elemen untuk menampilkan pesan login
    const loginMessage = document.createElement('div');
    loginMessage.className = 'login-message';
    loginMessage.innerHTML = `
        <p>Login untuk menyimpan progres dan buka achievements!</p>
        <a href="/login.html" class="login-btn">Login</a>
    `;
    
    // Tambahkan CSS
    const style = document.createElement('style');
    style.textContent = `
        .login-message {
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: rgba(255, 255, 255, 0.9);
            padding: 10px 15px;
            border-radius: 5px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            z-index: 1000;
            font-family: 'Segoe UI', Tahoma, sans-serif;
        }
        .login-message p {
            margin: 0 0 8px 0;
            font-size: 14px;
        }
        .login-btn {
            display: inline-block;
            background-color: #4a6fa5;
            color: white;
            padding: 5px 10px;
            border-radius: 3px;
            text-decoration: none;
            font-size: 12px;
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(loginMessage);
}

// Fungsi untuk memuat game progress
async function loadGameProgress() {
    if (!currentUser) return;
    
    try {
        const { progress } = await getGameProgress(currentUser.id, 'quiz');
        
        if (progress) {
            // Muat statistik quiz
            quizStats = progress.stats || quizStats;
            
            // Muat quiz yang sudah diselesaikan
            const completedQuizIds = progress.completedQuizIds || [];
            
            // Tandai quiz yang sudah diselesaikan di UI
            markCompletedQuizzes(completedQuizIds);
            
            // Update total quiz
            quizStats.totalQuizzes = getTotalQuizCount();
            
            console.log('Quiz progress loaded:', progress);
        } else {
            // Inisialisasi total quiz jika belum ada progress
            quizStats.totalQuizzes = getTotalQuizCount();
        }
        
        // Update UI statistik
        updateStatsDisplay();
    } catch (error) {
        console.error('Error loading quiz progress:', error);
    }
}

// Fungsi untuk mendapatkan total jumlah quiz
function getTotalQuizCount() {
    // Sesuaikan dengan cara Anda menyimpan quiz di game
    return quizzes.length || 10; // Contoh: 10 quiz
}

// Fungsi untuk menandai quiz yang sudah diselesaikan
function markCompletedQuizzes(completedQuizIds) {
    // Sesuaikan dengan struktur UI Anda
    completedQuizIds.forEach(quizId => {
        const quizElement = document.querySelector(`[data-quiz-id="${quizId}"]`);
        if (quizElement) {
            quizElement.classList.add('completed');
            quizElement.querySelector('.quiz-status').textContent = 'Selesai';
        }
    });
}

// Fungsi untuk update tampilan statistik
function updateStatsDisplay() {
    // Sesuaikan dengan UI Anda
    const statsContainer = document.getElementById('quiz-stats');
    if (statsContainer) {
        statsContainer.innerHTML = `
            <div class="stat-item">
                <span class="stat-label">Quiz Selesai:</span>
                <span class="stat-value">${quizStats.completedQuizzes}/${quizStats.totalQuizzes}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Jawaban Benar:</span>
                <span class="stat-value">${quizStats.correctAnswers}/${quizStats.totalQuestions}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Skor Tertinggi:</span>
                <span class="stat-value">${quizStats.highestScore}</span>
            </div>
        `;
    }
}

// Fungsi untuk menyimpan progress quiz
async function saveQuizProgress(quizId, score, correctCount, totalQuestions) {
    if (!currentUser) return;
    
    try {
        // Update statistik
        quizStats.totalQuestions += totalQuestions;
        quizStats.correctAnswers += correctCount;
        
        // Cek apakah quiz baru diselesaikan
        const { progress } = await getGameProgress(currentUser.id, 'quiz');
        const completedQuizIds = progress?.completedQuizIds || [];
        
        if (!completedQuizIds.includes(quizId)) {
            completedQuizIds.push(quizId);
            quizStats.completedQuizzes++;
        }
        
        // Update skor tertinggi
        if (score > quizStats.highestScore) {
            quizStats.highestScore = score;
        }
        
        // Siapkan data untuk disimpan
        const progressData = {
            stats: quizStats,
            completedQuizIds: completedQuizIds,
            lastPlayed: new Date(),
            completedQuizzes: quizStats.completedQuizzes,
            totalQuizzes: quizStats.totalQuizzes
        };
        
        // Simpan progress
        await saveGameProgress(currentUser.id, 'quiz', progressData);
        
        // Simpan skor tertinggi
        await saveHighScore(currentUser.id, 'quiz', quizStats.highestScore);
        
        // Cek achievements
        await checkAchievements(currentUser.id, 'quiz', {
            score: score,
            quizzesCompleted: quizStats.completedQuizzes,
            correctAnswers: quizStats.correctAnswers,
            totalQuestions: quizStats.totalQuestions
        });
        
        // Update UI
        updateStatsDisplay();
        console.log('Quiz progress saved');
    } catch (error) {
        console.error('Error saving quiz progress:', error);
    }
}

// Fungsi untuk menyelesaikan quiz
function completeQuiz(quizId, score, correctCount, totalQuestions) {
    // Logika setelah menyelesaikan quiz
    
    // Tandai quiz sebagai selesai di UI
    const quizElement = document.querySelector(`[data-quiz-id="${quizId}"]`);
    if (quizElement) {
        quizElement.classList.add('completed');
        quizElement.querySelector('.quiz-status').textContent = 'Selesai';
    }
    
    // Simpan progress
    saveQuizProgress(quizId, score, correctCount, totalQuestions);
    
    // Tampilkan skor
    showQuizResult(score, correctCount, totalQuestions);
}

// Fungsi untuk menampilkan hasil quiz
function showQuizResult(score, correctCount, totalQuestions) {
    // Sesuaikan dengan UI Anda
    const resultElement = document.getElementById('quiz-result');
    if (resultElement) {
        resultElement.innerHTML = `
            <h2>Hasil Quiz</h2>
            <p>Skor: ${score}</p>
            <p>Jawaban Benar: ${correctCount} dari ${totalQuestions}</p>
            <button id="back-to-list">Kembali ke Daftar Quiz</button>
        `;
        resultElement.style.display = 'block';
        
        // Tambahkan event listener untuk tombol kembali
        document.getElementById('back-to-list').addEventListener('click', function() {
            resultElement.style.display = 'none';
            document.getElementById('quiz-list').style.display = 'block';
        });
    }
}

// Saat memulai quiz
function startQuiz(quizId) {
    // Logika untuk memulai quiz
    console.log(`Starting quiz ${quizId}`);
    
    // Setelah quiz selesai, panggil completeQuiz()
    // Contoh: completeQuiz(quizId, 85, 8, 10);
}

// Saat halaman dimuat, load user data dan progress
document.addEventListener('DOMContentLoaded', async function() {
    await loadUserData();
    
    // Setup event listener untuk memulai quiz
    document.querySelectorAll('.start-quiz-btn').forEach(button => {
        button.addEventListener('click', function() {
            const quizId = this.getAttribute('data-quiz-id');
            startQuiz(quizId);
        });
    });
});

/* 
CATATAN INTEGRASI:
1. Impor file-file yang diperlukan dari folder assets/js
2. Panggil loadUserData() saat game dimulai untuk memuat progress
3. Sesuaikan fungsi completeQuiz() untuk dipanggil saat pengguna menyelesaikan quiz
4. Sesuaikan fungsi getTotalQuizCount() dengan cara Anda menyimpan quiz
5. Sesuaikan fungsi updateStatsDisplay() dengan UI Anda
6. Sesuaikan fungsi markCompletedQuizzes() dengan struktur UI Anda
7. Panggil startQuiz() saat pengguna memilih untuk memulai quiz
8. Pastikan setiap quiz memiliki ID unik untuk pelacakan
*/