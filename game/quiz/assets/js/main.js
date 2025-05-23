/**
 * main.js - File untuk navigasi dan fungsi umum aplikasi
 * 
 * File ini berisi fungsi-fungsi utama untuk:
 * - Pengelolaan UI berdasarkan data pengguna
 * - Manajemen navigasi antar halaman
 * - Pengaturan dropdown profil dan modal
 * - Penanganan fitur-fitur umum aplikasi
 */

// ===============================================
// VARIABEL GLOBAL
// ===============================================
let currentCategory = ""; // Kategori yang sedang dipilih
let currentLevel = 0;     // Level yang sedang aktif

// ===============================================
// INISIALISASI APLIKASI
// ===============================================

/**
 * Event listener untuk inisialisasi ketika DOM sudah dimuat
 * Menjalankan semua fungsi setup awal yang dibutuhkan aplikasi
 */
document.addEventListener('DOMContentLoaded', function() {
    // Update UI dengan data user
    updateUserUI();
    
    // Setup event listeners sesuai halaman yang aktif
    setupPageEventListeners();
    
    // Setup menu dropdown profil
    setupProfileDropdown();

    // Setup modal untuk Inventory dan Shop
    setupFeatureModals();

    // Update ikon profil dari data yang tersimpan (jika di homepage)
    updateHomepageProfileIcon();
});

// ===============================================
// FUNGSI PENGELOLAAN USER INTERFACE
// ===============================================

/**
 * Memperbarui semua elemen UI yang terkait data pengguna
 * - Username
 * - Level
 * - Koin
 */
function updateUserUI() {
    // Mencari semua elemen yang perlu diperbarui
    const usernameElements = document.querySelectorAll('.username');
    const levelElements = document.querySelectorAll('.level');
    const coinElements = document.querySelectorAll('.coin-count');
    
    // Update username di semua elemen terkait
    usernameElements.forEach(element => {
        element.textContent = userData.username;
    });
    
    // Update level di semua elemen terkait
    levelElements.forEach(element => {
        element.textContent = `Level ${userData.level}`;
    });
    
    // Update jumlah koin di semua elemen terkait
    coinElements.forEach(element => {
        element.textContent = userData.coins;
    });
}

/**
 * Memperbarui ikon profil di halaman utama
 * Mengambil data ikon dari userData
 */
function updateHomepageProfileIcon() {
    const profileIconElement = document.getElementById('userProfileIcon');
    if (profileIconElement && userData && userData.profileIcon) {
        // Hapus class icon sebelumnya
        profileIconElement.className = '';
        // Tambahkan class icon yang tersimpan
        profileIconElement.className = userData.profileIcon;
    }
}

// ===============================================
// MENU PROFIL DAN DROPDOWN
// ===============================================

/**
 * Mengatur menu dropdown profil
 * - Toggle tampilan dropdown
 * - Posisi dropdown
 * - Event handlers untuk item menu
 */
function setupProfileDropdown() {
    const profileContainers = document.querySelectorAll('.profile-container');
    
    profileContainers.forEach(container => {
        container.addEventListener('click', function(e) {
            // Jika dropdown sudah ada dan terlihat, sembunyikan
            const existingDropdown = document.querySelector('.profile-dropdown');
            if (existingDropdown) {
                existingDropdown.remove();
                return;
            }
            
            // Buat dropdown menu
            const dropdown = document.createElement('div');
            dropdown.className = 'profile-dropdown';
            
            dropdown.innerHTML = `
                <div class="dropdown-item" id="profileMenuItem">
                    <i class="fas fa-user"></i> Profil Saya
                </div>
                <div class="dropdown-item" id="logoutMenuItem">
                    <i class="fas fa-sign-out-alt"></i> Keluar
                </div>
                <div class="dropdown-item" id="resetMenuItem">
                    <i class="fas fa-trash"></i> Hapus Data
                </div>
            `;
            
            // Tambahkan ke body
            document.body.appendChild(dropdown);
            
            // Posisikan dropdown di bawah profile container
            const rect = container.getBoundingClientRect();
            dropdown.style.top = (rect.bottom + window.scrollY) + 'px';
            dropdown.style.left = (rect.left + window.scrollX) + 'px';
            
            // Tambahkan event listeners untuk menu items
            document.getElementById('profileMenuItem').addEventListener('click', function() {
                window.location.href = 'profile.html';
            });
            
            document.getElementById('logoutMenuItem').addEventListener('click', function() {
                showLogoutModal();
            });
            
            document.getElementById('resetMenuItem').addEventListener('click', function() {
                showResetDataModal();
            });
            
            // Tutup dropdown jika user klik di luar dropdown
            document.addEventListener('click', function closeDropdown(event) {
                if (!dropdown.contains(event.target) && !container.contains(event.target)) {
                    dropdown.remove();
                    document.removeEventListener('click', closeDropdown);
                }
            });
        });
    });
}

// ===============================================
// FUNGSI MODAL LOGOUT
// ===============================================

/**
 * Menampilkan modal konfirmasi logout
 * Menyiapkan semua event handlers terkait
 */
function showLogoutModal() {
    const logoutModal = document.getElementById('logoutModal');
    
    if (logoutModal) {
        logoutModal.classList.add('active');
        
        // Pastikan event listener terpasang dengan benar
        const closeLogout = document.getElementById('closeLogout');
        const cancelLogoutBtn = document.getElementById('cancelLogoutBtn');
        const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');
        
        if (closeLogout) {
            // Hapus event listener lama jika ada untuk menghindari duplikasi
            closeLogout.removeEventListener('click', hideLogoutModal);
            closeLogout.addEventListener('click', hideLogoutModal);
        }
        
        if (cancelLogoutBtn) {
            cancelLogoutBtn.removeEventListener('click', hideLogoutModal);
            cancelLogoutBtn.addEventListener('click', hideLogoutModal);
        }
        
        if (confirmLogoutBtn) {
            confirmLogoutBtn.removeEventListener('click', confirmLogout);
            confirmLogoutBtn.addEventListener('click', confirmLogout);
        }
        
        // Event listener untuk klik di luar modal
        logoutModal.removeEventListener('click', handleOutsideClick);
        logoutModal.addEventListener('click', handleOutsideClick);
    }
}

/**
 * Menyembunyikan modal logout
 */
function hideLogoutModal() {
    const logoutModal = document.getElementById('logoutModal');
    if (logoutModal) {
        logoutModal.classList.remove('active');
    }
}

/**
 * Menangani proses logout setelah konfirmasi
 */
function confirmLogout() {
    logoutUser();
    hideLogoutModal();
}

/**
 * Menangani klik di luar modal logout
 * Menutup modal jika klik di area luar
 */
function handleOutsideClick(event) {
    if (event.target === this) {
        hideLogoutModal();
    }
}

// ===============================================
// FUNGSI MODAL RESET DATA
// ===============================================

/**
 * Menampilkan modal konfirmasi reset data
 * Menyiapkan semua event handlers terkait
 */
function showResetDataModal() {
    const resetModal = document.getElementById('resetModal');
    
    if (resetModal) {
        resetModal.classList.add('active');
        
        // Pasang event listeners dengan benar
        const closeReset = document.getElementById('closeReset');
        const cancelResetBtn = document.getElementById('cancelResetBtn');
        const confirmResetBtn = document.getElementById('confirmResetBtn');
        
        if (closeReset) {
            // Hapus event listener lama jika ada untuk menghindari duplikasi
            closeReset.removeEventListener('click', hideResetModal);
            closeReset.addEventListener('click', hideResetModal);
        }
        
        if (cancelResetBtn) {
            cancelResetBtn.removeEventListener('click', hideResetModal);
            cancelResetBtn.addEventListener('click', hideResetModal);
        }
        
        if (confirmResetBtn) {
            confirmResetBtn.removeEventListener('click', confirmReset);
            confirmResetBtn.addEventListener('click', confirmReset);
        }
        
        // Event listener untuk klik di luar modal
        resetModal.removeEventListener('click', handleResetOutsideClick);
        resetModal.addEventListener('click', handleResetOutsideClick);
    }
}

/**
 * Menyembunyikan modal reset data
 */
function hideResetModal() {
    const resetModal = document.getElementById('resetModal');
    if (resetModal) {
        resetModal.classList.remove('active');
    }
}

/**
 * Menangani proses reset data setelah konfirmasi
 * Muat ulang halaman setelah reset
 */
function confirmReset() {
    resetUserData();
    hideResetModal();
    window.location.reload();
}

/**
 * Menangani klik di luar modal reset
 * Menutup modal jika klik di area luar
 */
function handleResetOutsideClick(event) {
    if (event.target === this) {
        hideResetModal();
    }
}

// ===============================================
// SETUP HALAMAN DAN EVENT LISTENERS
// ===============================================

/**
 * Setup event listeners berdasarkan halaman yang sedang aktif
 * Mendeteksi halaman dari URL dan memanggil fungsi setup yang sesuai
 */
function setupPageEventListeners() {
    // Cek halaman mana yang sedang dibuka
    const pathname = window.location.pathname;
    const filename = pathname.split('/').pop();
    
    // Setup listeners berdasarkan halaman aktif
    if (filename === '' || filename === 'index.html') {
        // Halaman utama
        setupHomePageListeners();
    } else if (filename === 'play.html') {
        // Halaman daftar kategori (play)
        setupPlayPageListeners();
    } else if (filename === 'level.html') {
        // Halaman daftar level
        setupLevelPageListeners();
    } else if (filename === 'quiz.html') {
        // Quiz listeners akan diatur di quiz.js
    } else if (filename === 'profile.html') {
        // Halaman profil
        setupProfilePageListeners();
    }
    
    // Setup navigasi untuk semua halaman
    setupNavBarListeners();
}

/**
 * Setup event listeners untuk halaman utama (index.html)
 */
function setupHomePageListeners() {
    const playButton = document.getElementById('playButton');
    
    if (playButton) {
        playButton.addEventListener('click', function() {
            window.location.href = 'play.html';
        });
    }
}

/**
 * Setup event listeners untuk halaman play (kategori)
 * Termasuk render daftar kategori
 */
function setupPlayPageListeners() {
    const backButton = document.getElementById('backToHome');
    const categoriesContainer = document.getElementById('categoriesContainer');
    
    if (backButton) {
        backButton.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
    
    if (categoriesContainer) {
        // Render daftar kategori
        renderCategories(categoriesContainer);
    }
}

/**
 * Setup event listeners untuk halaman level
 * Mengambil data kategori dari URL parameter
 */
function setupLevelPageListeners() {
    const backButton = document.getElementById('backToCategories');
    const levelsContainer = document.getElementById('levelsContainer');
    const categoryTitle = document.getElementById('categoryTitle');
    
    // Ambil kategori dari URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    currentCategory = urlParams.get('category');
    
    if (backButton) {
        backButton.addEventListener('click', function() {
            window.location.href = 'play.html';
        });
    }
    
    if (levelsContainer && currentCategory) {
        // Set judul kategori
        if (categoryTitle) {
            const category = categoryData.find(cat => cat.id === currentCategory);
            if (category) {
                categoryTitle.textContent = category.title;
            }
        }
        
        // Render daftar level
        const levels = getLevelsForCategory(currentCategory);
        renderLevels(levelsContainer, levels);
    }
}

/**
 * Setup event listeners untuk halaman profil
 * Menampilkan XP dan achievements
 */
function setupProfilePageListeners() {
    const backButton = document.getElementById('backToHome');
    
    if (backButton) {
        backButton.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
    
    // Update tampilan XP
    const xpCountElement = document.getElementById('xpCount');
    if (xpCountElement) {
        xpCountElement.textContent = userData.xp;
    }
    
    // Render daftar achievements
    renderAchievements();
}

/**
 * Setup event listeners untuk navigation bar
 * Navigasi antar halaman utama
 */
function setupNavBarListeners() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const text = this.querySelector('span').textContent.toLowerCase();
            
            // Hapus kelas active dari semua item
            navItems.forEach(i => i.classList.remove('active'));
            
            // Tambah kelas active ke item yang diklik
            this.classList.add('active');
            
            // Navigasi berdasarkan teks
            switch (text) {
                case 'home':
                    window.location.href = 'index.html';
                    break;
                case 'inventaris':
                case 'inventory':
                    window.location.href = 'inventory.html';
                    break;
                case 'toko':
                case 'shop':
                    window.location.href = 'shop.html';
                    break;
                case 'prestasi':
                case 'achievement':
                    window.location.href = 'profile.html';
                    break;
            }
        });
    });
}

// ===============================================
// RENDER KATEGORI DAN LEVEL
// ===============================================

/**
 * Render daftar kategori ke dalam container
 * @param {HTMLElement} container - Element container untuk menampilkan kategori
 */
function renderCategories(container) {
    container.innerHTML = '';
    
    categoryData.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        categoryCard.dataset.categoryId = category.id;
        
        categoryCard.innerHTML = `
            <img src="${category.image}" alt="${category.title}" class="category-image">
            <div class="category-info">
                <h3 class="category-title">${category.title}</h3>
                <p class="category-description">${category.description}</p>
            </div>
        `;
        
        categoryCard.addEventListener('click', function() {
            const categoryId = this.dataset.categoryId;
            window.location.href = `level.html?category=${categoryId}`;
        });
        
        container.appendChild(categoryCard);
    });
}

/**
 * Render daftar level ke dalam container
 * @param {HTMLElement} container - Element container untuk menampilkan level
 * @param {Array} levels - Array data level yang akan ditampilkan
 */
function renderLevels(container, levels) {
    container.innerHTML = '';
    
    levels.forEach(level => {
        const levelCard = document.createElement('div');
        levelCard.className = `level-card ${level.status}`;
        levelCard.dataset.level = level.level;
        
        levelCard.innerHTML = `
            <div class="level-number">${level.level}</div>
            <div class="level-status">${level.status === 'completed' ? 'Selesai' : (level.status === 'unlocked' ? 'Buka' : 'Terkunci')}</div>
        `;
        
        if (level.status !== 'locked') {
            levelCard.addEventListener('click', function() {
                const levelNumber = parseInt(this.dataset.level);
                startQuiz(currentCategory, levelNumber);
            });
        }
        
        container.appendChild(levelCard);
    });
}

/**
 * Memulai quiz dengan kategori dan level tertentu
 * Menyimpan data ke sessionStorage dan navigasi ke halaman quiz
 * @param {string} categoryId - ID kategori yang dipilih
 * @param {number} level - Nomor level yang dipilih
 */
function startQuiz(categoryId, level) {
    // Simpan kategori dan level yang dipilih ke sessionStorage
    sessionStorage.setItem('quizCategory', categoryId);
    sessionStorage.setItem('quizLevel', level);
    
    // Navigasi ke halaman quiz
    window.location.href = 'quiz.html';
}

// ===============================================
// RENDER ACHIEVEMENTS
// ===============================================

/**
 * Render data achievements ke halaman profil
 * Menampilkan achievements khusus dan level yang sudah diselesaikan
 */
function renderAchievements() {
    const achievementsContainer = document.getElementById('achievementsContainer');
    
    if (!achievementsContainer) return;
    
    // Tampilkan achievements yang telah diraih jika ada
    if (userData.achievements && userData.achievements.length > 0) {
        let achievementsHTML = `
            <div class="achievement-category">
                <h3>Penghargaan Khusus</h3>
                <div class="achievement-levels">
        `;
        
        userData.achievements.forEach(achievement => {
            const icon = achievement.icon || 'fas fa-award';
            achievementsHTML += `
                <div class="achievement-badge">
                    <div class="badge-icon">
                        <i class="${icon}"></i>
                    </div>
                    <div class="badge-info">
                        <p class="badge-title">${achievement.title}</p>
                        <p class="badge-points">${achievement.description}</p>
                    </div>
                </div>
            `;
        });
        
        achievementsHTML += `
                </div>
            </div>
        `;
        
        // Tampilkan progress level setelah penghargaan khusus
        const completedCategories = Object.keys(userData.completedLevels).filter(
            cat => userData.completedLevels[cat].length > 0
        );
        
        if (completedCategories.length > 0) {
            completedCategories.forEach(categoryId => {
                const category = categoryData.find(cat => cat.id === categoryId);
                const completedLevels = userData.completedLevels[categoryId];
                
                if (category && completedLevels.length > 0) {
                    achievementsHTML += `
                        <div class="achievement-category">
                            <h3>${category.title}</h3>
                            <div class="achievement-levels">
                    `;
                    
                    completedLevels.forEach(level => {
                        achievementsHTML += `
                            <div class="achievement-badge">
                                <div class="badge-icon">
                                    <i class="fas fa-star"></i>
                                </div>
                                <div class="badge-info">
                                    <p class="badge-title">Level ${level} Selesai</p>
                                    <p class="badge-points">+${level * 10} Poin</p>
                                </div>
                            </div>
                        `;
                    });
                    
                    achievementsHTML += `
                            </div>
                        </div>
                    `;
                }
            });
        }
        
        achievementsContainer.innerHTML = achievementsHTML;
    } else {
        // Tampilkan level yang diselesaikan jika tidak ada achievement khusus
        const completedCategories = Object.keys(userData.completedLevels).filter(
            cat => userData.completedLevels[cat].length > 0
        );
        
        if (completedCategories.length === 0) {
            achievementsContainer.innerHTML = `
                <div class="no-achievements">
                    <i class="fas fa-trophy"></i>
                    <p>Anda belum memiliki pencapaian. Mulailah bermain quiz untuk mendapatkan pencapaian!</p>
                </div>
            `;
            return;
        }
        
        let achievementsHTML = '';
        
        completedCategories.forEach(categoryId => {
            const category = categoryData.find(cat => cat.id === categoryId);
            const completedLevels = userData.completedLevels[categoryId];
            
            if (category && completedLevels.length > 0) {
                achievementsHTML += `
                    <div class="achievement-category">
                        <h3>${category.title}</h3>
                        <div class="achievement-levels">
                `;
                
                completedLevels.forEach(level => {
                    achievementsHTML += `
                        <div class="achievement-badge">
                            <div class="badge-icon">
                                <i class="fas fa-star"></i>
                            </div>
                            <div class="badge-info">
                                <p class="badge-title">Level ${level} Selesai</p>
                                <p class="badge-points">+${level * 10} Poin</p>
                            </div>
                        </div>
                    `;
                });
                
                achievementsHTML += `
                        </div>
                    </div>
                `;
            }
        });
        
        achievementsContainer.innerHTML = achievementsHTML;
    }
}

// ===============================================
// SETUP MODAL FITUR
// ===============================================

/**
 * Setup modal untuk fitur Inventory dan Shop
 * Menambahkan event listeners untuk tombol dan interaksi
 */
function setupFeatureModals() {
    // Elements
    const inventoryModal = document.getElementById('inventoryModal');
    const shopModal = document.getElementById('shopModal');
    const closeInventory = document.getElementById('closeInventory');
    const closeShop = document.getElementById('closeShop');
    const okInventoryBtn = document.getElementById('okInventoryBtn');
    const okShopBtn = document.getElementById('okShopBtn');
    
    // Close button handlers
    if (closeInventory) {
        closeInventory.addEventListener('click', function() {
            inventoryModal.classList.remove('active');
            resetNavActiveStatus();
            document.getElementById('navHome').classList.add('active');
        });
    }
    
    if (closeShop) {
        closeShop.addEventListener('click', function() {
            shopModal.classList.remove('active');
            resetNavActiveStatus();
            document.getElementById('navHome').classList.add('active');
        });
    }
    
    // OK button handlers
    if (okInventoryBtn) {
        okInventoryBtn.addEventListener('click', function() {
            inventoryModal.classList.remove('active');
            resetNavActiveStatus();
            document.getElementById('navHome').classList.add('active');
        });
    }
    
    if (okShopBtn) {
        okShopBtn.addEventListener('click', function() {
            shopModal.classList.remove('active');
            resetNavActiveStatus();
            document.getElementById('navHome').classList.add('active');
        });
    }
    
    // Tutup modal jika klik di luar modal
    window.addEventListener('click', function(event) {
        if (event.target === inventoryModal) {
            inventoryModal.classList.remove('active');
            resetNavActiveStatus();
            document.getElementById('navHome').classList.add('active');
        }
        if (event.target === shopModal) {
            shopModal.classList.remove('active');
            resetNavActiveStatus();
            document.getElementById('navHome').classList.add('active');
        }
    });
}

/**
 * Reset status active pada bottom navigation
 * Menghapus kelas 'active' dari semua item navigasi
 */
function resetNavActiveStatus() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
}
