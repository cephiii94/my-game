/**
 * INVENTORY MANAGER
 * ================
 * File ini berfungsi untuk mengelola semua fitur di halaman inventory,
 * termasuk menampilkan item, booster, dan karakter yang dimiliki pengguna.
 * 
 * Dibuat: Mei 2025
 */

// ========= INISIALISASI HALAMAN =========

/**
 * Event listener saat DOM telah dimuat sepenuhnya
 * Menginisialisasi semua fungsi utama halaman inventory
 */
document.addEventListener('DOMContentLoaded', function() {
    // Memperbarui UI dengan data pengguna
    updateUserUI();
    
    // Menyiapkan menu dropdown profil
    setupProfileDropdown();
    
    // Menyiapkan event listener untuk tab navigasi
    setupInventoryTabs();
    
    // Menyiapkan tombol kembali ke halaman utama
    setupBackButton();
    
    // Menampilkan item-item di inventory
    renderInventoryItems();
    
    // Menyiapkan event listener untuk modal detail item
    setupItemDetailModal();
});

// ========= FUNGSI NAVIGASI DAN UI =========

/**
 * Mengatur event listener untuk tab navigasi inventory
 * Berpindah antar kategori: items, boosters, characters
 */
function setupInventoryTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Menghapus kelas active dari semua tab
            tabs.forEach(t => t.classList.remove('active'));
            
            // Menambahkan kelas active ke tab yang diklik
            this.classList.add('active');
            
            // Menampilkan konten yang sesuai dengan tab
            const tabId = this.getAttribute('data-tab');
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            document.getElementById(`${tabId}-content`).classList.add('active');
        });
    });
}

/**
 * Mengatur tombol kembali ke halaman utama
 */
function setupBackButton() {
    const backButton = document.getElementById('backToHome');
    
    if (backButton) {
        backButton.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
}

// ========= RENDER INVENTORY =========

/**
 * Menampilkan semua item di inventory pengguna
 * Memastikan struktur data inventory tersedia dan valid
 */
function renderInventoryItems() {
    // Memeriksa dan memastikan userData memiliki properti inventory dengan struktur yang benar
    if (!userData.inventory) {
        userData.inventory = {
            items: [],
            boosters: [],
            characters: ['default'] // Karakter default selalu tersedia
        };
        
        // Menyimpan data baru
        saveGameData();
    }
    
    console.log("Data inventory saat ini:", userData.inventory);
    
    // Menampilkan tab Items
    renderInventoryTab('items');
    
    // Menampilkan tab Boosters
    renderInventoryTab('boosters');
    
    // Menampilkan tab Characters
    renderInventoryTab('characters');
}

/**
 * Menampilkan item-item pada tab tertentu (items, boosters, atau characters)
 * @param {string} tabType - Tipe tab ('items', 'boosters', atau 'characters')
 */
function renderInventoryTab(tabType) {
    const contentContainer = document.getElementById(`${tabType}-content`);
    const inventoryGrid = contentContainer.querySelector('.inventory-grid');
    
    // Mengosongkan konten grid sebelum menampilkan item baru
    inventoryGrid.innerHTML = '';
    
    // Mendapatkan daftar item dari inventory pengguna
    const inventoryItems = userData.inventory[tabType] || [];
    
    // Debug: Menampilkan item inventory di console
    console.log(`Menampilkan tab ${tabType} dengan item:`, inventoryItems);
    
    // Menampilkan pesan kosong jika tidak ada item di kategori ini
    // Kecuali untuk kategori characters yang selalu memiliki karakter default
    if (tabType !== 'characters' && (inventoryItems.length === 0)) {
        inventoryGrid.innerHTML = `
            <div class="inventory-message">
                <i class="fas fa-${tabType === 'items' ? 'box-open' : 'bolt'}"></i>
                <p>Belum ada ${tabType === 'items' ? 'item' : 'booster'} yang dimiliki</p>
                <p class="inventory-description">Kunjungi toko untuk membeli ${tabType === 'items' ? 'item' : 'booster'}.</p>
            </div>
        `;
        return;
    }
    
    // Logika khusus untuk tab characters
    if (tabType === 'characters') {
        renderCharactersTab(inventoryGrid);
    } else {
        // Logika untuk tab items dan boosters
        renderItemsOrBoostersTab(tabType, inventoryItems, inventoryGrid);
    }
}

/**
 * Menampilkan karakter yang dimiliki pengguna
 * @param {HTMLElement} inventoryGrid - Element grid yang akan diisi
 */
function renderCharactersTab(inventoryGrid) {
    // Karakter yang sedang aktif
    const activeCharacter = userData.activeCharacter || 'default';
    
    // Karakter default selalu ada
    inventoryGrid.innerHTML += `
        <div class="inventory-item" data-item-id="default">
            <div class="item-icon ${activeCharacter === 'default' ? 'active' : ''}">
                <img src="assets/images/char1.png" alt="Default Character">
            </div>
            <div class="item-info">
                <h3>Default</h3>
                <p>Karakter awal</p>
            </div>
            <div class="item-action">
                <button class="btn-use ${activeCharacter === 'default' ? 'active' : ''}" onclick="setActiveCharacter('default')">
                    ${activeCharacter === 'default' ? 'Digunakan' : 'Gunakan'}
                </button>
            </div>
        </div>
    `;
    
    // Menampilkan karakter tambahan jika ada
    if (userData.inventory.characters && userData.inventory.characters.length > 0) {
        userData.inventory.characters.forEach(charId => {
            if (charId !== 'default') {
                // Mendapatkan data karakter dari database
                const character = getCharacterData(charId);
                if (character) {
                    inventoryGrid.innerHTML += `
                        <div class="inventory-item" data-item-id="${charId}">
                            <div class="item-icon ${activeCharacter === charId ? 'active' : ''}">
                                <img src="${character.image}" alt="${character.name} Character">
                            </div>
                            <div class="item-info">
                                <h3>${character.name}</h3>
                                <p>${character.description}</p>
                            </div>
                            <div class="item-action">
                                <button class="btn-use ${activeCharacter === charId ? 'active' : ''}" onclick="setActiveCharacter('${charId}')">
                                    ${activeCharacter === charId ? 'Digunakan' : 'Gunakan'}
                                </button>
                            </div>
                        </div>
                    `;
                }
            }
        });
    }
}

/**
 * Menampilkan item atau booster yang dimiliki pengguna
 * @param {string} tabType - Tipe tab ('items' atau 'boosters')
 * @param {Array} inventoryItems - Daftar item yang dimiliki
 * @param {HTMLElement} inventoryGrid - Element grid yang akan diisi
 */
function renderItemsOrBoostersTab(tabType, inventoryItems, inventoryGrid) {
    if (inventoryItems.length === 0) {
        inventoryGrid.innerHTML = `
            <div class="inventory-message">
                <i class="fas fa-${tabType === 'items' ? 'box-open' : 'bolt'}"></i>
                <p>Belum ada ${tabType === 'items' ? 'item' : 'booster'} yang dimiliki</p>
                <p class="inventory-description">Kunjungi toko untuk membeli ${tabType === 'items' ? 'item' : 'booster'}.</p>
            </div>
        `;
        return;
    }
    
    // Menampilkan setiap item yang dimiliki
    inventoryItems.forEach(item => {
        // Debug setiap item
        console.log(`Memproses item:`, item);
        
        const itemData = getItemData(item.id, tabType);
        console.log(`Data untuk item ${item.id}:`, itemData);
        
        if (itemData) {
            inventoryGrid.innerHTML += `
                <div class="inventory-item" data-item-id="${item.id}" onclick="showItemDetail('${item.id}', '${tabType}')">
                    <div class="item-icon">
                        <i class="${itemData.icon}"></i>
                    </div>
                    <div class="item-info">
                        <h3>${itemData.name}</h3>
                        <p>${itemData.description}</p>
                    </div>
                    <div class="item-action">
                        <button class="btn-use">
                            Jumlah: ${item.quantity || 1}
                        </button>
                    </div>
                </div>
            `;
        } else {
            console.error(`Data tidak ditemukan untuk item: ${item.id} di kategori ${tabType}`);
        }
    });
}

// ========= DATABASE ITEM =========

/**
 * Mendapatkan data item dari database berdasarkan ID dan tipe
 * @param {string} itemId - ID item yang dicari
 * @param {string} type - Tipe item ('items' atau 'boosters')
 * @returns {Object|null} - Data item atau null jika tidak ditemukan
 */
function getItemData(itemId, type) {
    // Database items
    const itemsData = {
        'heart': {
            name: 'Extra Life',
            description: 'Tambahan nyawa saat bermain quiz',
            icon: 'fas fa-heart',
            price: 50
        },
        'clock': {
            name: 'Time Extender',
            description: 'Tambah waktu 30 detik',
            icon: 'fas fa-clock',
            price: 75
        },
        'hint': {
            name: 'Hint',
            description: 'Menghilangkan 2 pilihan jawaban salah',
            icon: 'fas fa-lightbulb',
            price: 100
        }
    };
    
    // Database boosters
    const boostersData = {
        'coin': {
            name: 'Coin Booster',
            description: 'Koin 2x lipat untuk 3 quiz berikutnya',
            icon: 'fas fa-coin',
            price: 150
        },
        'xp': {
            name: 'XP Booster',
            description: 'XP 2x lipat untuk 3 quiz berikutnya',
            icon: 'fas fa-award',
            price: 200
        }
    };
    
    // Mengembalikan data yang sesuai berdasarkan tipe
    if (type === 'items') {
        return itemsData[itemId];
    } else if (type === 'boosters') {
        return boostersData[itemId];
    }
    
    return null;
}

/**
 * Mendapatkan data karakter dari database berdasarkan ID
 * @param {string} charId - ID karakter yang dicari
 * @returns {Object|null} - Data karakter atau null jika tidak ditemukan
 */
function getCharacterData(charId) {
    // Database karakter
    const charactersData = {
        'default': {
            name: 'Default',
            description: 'Karakter awal',
            image: 'assets/images/char1.png',
            price: 0
        },
        'penguin': {
            name: 'Robot',
            description: 'Karakter robot futuristik',
            image: 'assets/images/char2.png',
            price: 300
        },
        'robot': {
            name: 'Penguin',
            description: 'Karakter robot futuristik',
            image: 'assets/images/char3.png',
            price: 300
        },
        'ninja': {
            name: 'Ninja',
            description: 'Karakter ninja misterius',
            image: 'assets/images/char4.png',
            price: 300
        }
    };
    
    return charactersData[charId];
}

// ========= FUNGSI PENGGUNAAN ITEM =========

/**
 * Mengatur karakter aktif yang digunakan
 * @param {string} charId - ID karakter yang akan diaktifkan
 */
function setActiveCharacter(charId) {
    // Memperbarui data pengguna
    userData.activeCharacter = charId;
    
    // Menyimpan perubahan
    saveGameData();
    
    // Memperbarui tampilan karakter
    renderInventoryTab('characters');
}

/**
 * Menyiapkan event listener untuk modal detail item
 */
function setupItemDetailModal() {
    const modal = document.getElementById('itemDetailModal');
    const closeButton = document.getElementById('closeItemDetail');
    const closeDetailBtn = document.getElementById('closeDetailBtn');
    const useItemBtn = document.getElementById('useItemBtn');
    
    if (!modal) return;
    
    // Menutup modal saat tombol close diklik
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            modal.classList.remove('active');
        });
    }
    
    if (closeDetailBtn) {
        closeDetailBtn.addEventListener('click', function() {
            modal.classList.remove('active');
        });
    }
    
    // Menutup modal saat klik di luar area modal
    modal.addEventListener('click', function(event) {
        if (event.target === this) {
            modal.classList.remove('active');
        }
    });
    
    // Menggunakan item saat tombol use diklik
    if (useItemBtn) {
        useItemBtn.addEventListener('click', function() {
            const itemId = this.getAttribute('data-item-id');
            const itemType = this.getAttribute('data-item-type');
            
            useItem(itemId, itemType);
            
            // Menutup modal setelah penggunaan item
            modal.classList.remove('active');
        });
    }
}

/**
 * Menampilkan detail item dalam modal
 * @param {string} itemId - ID item yang akan ditampilkan
 * @param {string} type - Tipe item ('items' atau 'boosters')
 */
function showItemDetail(itemId, type) {
    const modal = document.getElementById('itemDetailModal');
    if (!modal) return;
    
    const itemData = getItemData(itemId, type);
    
    if (!itemData) {
        console.error(`Data tidak ditemukan untuk item ${itemId} dalam kategori ${type}`);
        return;
    }
    
    // Mencari item dari inventory pengguna
    const inventory = userData.inventory[type] || [];
    const item = inventory.find(i => i.id === itemId);
    
    if (!item) {
        console.error(`Item ${itemId} tidak ditemukan dalam inventory pengguna untuk kategori ${type}`);
        return;
    }
    
    // Memperbarui judul modal
    modal.querySelector('.feature-title').textContent = `Detail ${type === 'items' ? 'Item' : 'Booster'}`;
    
    // Memperbarui ikon
    const iconElement = modal.querySelector('.item-detail-icon');
    iconElement.innerHTML = `<i class="${itemData.icon}"></i>`;
    
    // Memperbarui nama item
    modal.querySelector('.item-detail-name').textContent = itemData.name;
    
    // Memperbarui deskripsi
    modal.querySelector('.item-detail-description').textContent = itemData.description;
    
    // Memperbarui jumlah
    modal.querySelector('.item-usage-count').textContent = item.quantity || 1;
    
    // Menyiapkan tombol penggunaan
    const useButton = document.getElementById('useItemBtn');
    useButton.setAttribute('data-item-id', itemId);
    useButton.setAttribute('data-item-type', type);
    
    // Menampilkan modal
    modal.classList.add('active');
}

/**
 * Menggunakan item dari inventory
 * @param {string} itemId - ID item yang akan digunakan
 * @param {string} type - Tipe item ('items' atau 'boosters')
 */
function useItem(itemId, type) {
    // Mencari item dari inventory
    const inventory = userData.inventory[type] || [];
    const itemIndex = inventory.findIndex(i => i.id === itemId);
    
    if (itemIndex === -1) return;
    
    // Mengurangi jumlah item
    inventory[itemIndex].quantity--;
    
    // Menghapus item dari inventory jika jumlahnya habis
    if (inventory[itemIndex].quantity <= 0) {
        inventory.splice(itemIndex, 1);
    }
    
    // Menyimpan perubahan
    saveGameData();
    
    // Menerapkan efek item
    applyItemEffect(itemId, type);
    
    // Memperbarui tampilan inventory
    renderInventoryTab(type);
}

/**
 * Menerapkan efek dari item yang digunakan
 * @param {string} itemId - ID item yang digunakan
 * @param {string} type - Tipe item ('items' atau 'boosters')
 */
function applyItemEffect(itemId, type) {
    // TODO: Implementasi efek item pada gameplay
    // Untuk sementara, hanya menampilkan pesan
    
    alert(`Item ${getItemData(itemId, type).name} telah digunakan!`);
    
    // Dalam implementasi yang sebenarnya, kita akan menyimpan efek item
    // ke dalam userData.activeEffects atau struktur data serupa
}
