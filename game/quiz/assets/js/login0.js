// JavaScript untuk halaman login

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    // Cek apakah user sudah login sebelumnya
// Di login.js, modifikasi pemeriksaan awal menjadi:
if (localStorage.getItem('quizActiveUser')) {
    try {
        const username = localStorage.getItem('quizActiveUser');
        const savedData = JSON.parse(localStorage.getItem('quizUserData'));
        // Verifikasi bahwa data valid
        if (savedData && savedData.username && savedData.username === username) {
            // Redirect ke halaman utama jika di halaman login
            if (window.location.pathname.includes('login.html')) {
                window.location.href = 'index.html';
            }
            return;
        }
    } catch (e) {
        localStorage.removeItem('quizActiveUser');
        console.error("Error parsing user data:", e);
    }
}
    
    // Event listener untuk form login
    // Event listener untuk form login
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const usernameInput = document.getElementById('username');
        const username = usernameInput.value.trim();
        
        if (username) {
            // Cek apakah sudah ada data user dengan username yang sama
            let existingData = null;
            try {
                const savedData = localStorage.getItem('quizUserData');
                if (savedData) {
                    const parsedData = JSON.parse(savedData);
                    if (parsedData && parsedData.username === username) {
                        existingData = parsedData;
                    }
                }
            } catch (error) {
                console.error("Error checking existing user data:", error);
            }
            
            // Jika user sudah ada, gunakan data yang sudah ada
            // Jika belum, buat data baru
            const userData = existingData || {
                username: username,
                level: 1,
                coins: 100,
                xp: 0,
                profileIcon: "fas fa-user",
                achievements: [],
                completedLevels: {
                    "science": [],
                    "history": [],
                    "geography": [],
                    "entertainment": []
                }
            };
                
            // Simpan data user ke localStorage
            localStorage.setItem('quizUserData', JSON.stringify(userData));
            
            // Redirect ke halaman utama
            window.location.href = 'index.html';
            }
        });
    }
});

const newUserData = {
    username: username,
    level: 1,
    coins: 100,
    xp: 0,
    profileIcon: "fas fa-user", // Add this
    achievements: [],
    completedLevels: {
        "science": [],
        "history": [],
        "geography": [],
        "entertainment": []
    }
};