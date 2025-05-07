// JavaScript untuk halaman Inventory

document.addEventListener('DOMContentLoaded', function() {
    // Update UI dengan data user
    updateUserUI();
    
    // Setup profile dropdown menu
    setupProfileDropdown();
    
    // Setup event listeners untuk tabs
    setupInventoryTabs();
    
    // Setup back button
    setupBackButton();
    
    // Render inventory items
    renderInventoryItems();
    
    // Setup event listeners untuk modal
    setupItemDetailModal();
});

// Setup event listeners untuk tabs
function setupInventoryTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Hapus kelas active dari semua tab
            tabs.forEach(t => t.classList.remove('active'));
            
            // Tambah kelas active ke tab yang diklik
            this.classList.add('active');
            
            // Tampilkan content yang sesuai
            const tabId = this.getAttribute('data-tab');
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            document.getElementById(`${tabId}-content`).classList.add('active');
        });
    });
}

// Setup back button
function setupBackButton() {
    const backButton = document.getElementById('backToHome');
    
    if (backButton) {
        backButton.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
}

// Render inventory items
function renderInventoryItems() {
    // Untuk tujuan demo, kita akan menggunakan data dari userData.inventory
    // Jika tidak ada data inventory, kita tampilkan pesan "inventory kosong"
    
    // Jika userData belum memiliki properti inventory, kita inisialisasi
    if (!userData.inventory) {
        userData.inventory = {
            items: [],
            boosters: [],
            characters: ['default'] // Karakter default selalu ada
        };
        
        // Simpan data baru
        saveGameData();
    }
    
    // Render Items tab
    renderInventoryTab('items');
    
    // Render Boosters tab
    renderInventoryTab('boosters');
    
    // Render Characters tab
    renderInventoryTab('characters');
}

// Render tab inventory tertentu
function renderInventoryTab(tabType) {
    const contentContainer = document.getElementById(`${tabType}-content`);
    const inventoryGrid = contentContainer.querySelector('.inventory-grid');
    
    // Reset grid content
    inventoryGrid.innerHTML = '';
    
    // Jika tidak ada item di kategori ini, tampilkan pesan kosong
    if (!userData.inventory[tabType] || userData.inventory[tabType].length === 0) {
        if (tabType !== 'characters') { // Karakter selalu ada yang default
            inventoryGrid.innerHTML = `
                <div class="inventory-message">
                    <i class="fas fa-${tabType === 'items' ? 'box-open' : (tabType === 'boosters' ? 'bolt' : 'user-astronaut')}"></i>
                    <p>Belum ada ${tabType === 'items' ? 'item' : (tabType === 'boosters' ? 'booster' : 'karakter')} yang dimiliki</p>
                    <p class="inventory-description">Kunjungi toko untuk membeli ${tabType === 'items' ? 'item' : (tabType === 'boosters' ? 'booster' : 'karakter')}.</p>
                </div>
            `;
            return;
        }
    }
    
    // Khusus untuk tab characters, minimal ada karakter default
    if (tabType === 'characters') {
        // Karakter yang sedang aktif
        const activeCharacter = userData.activeCharacter || 'default';
        
        // Karakter default
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
        
        // Karakter tambahan jika ada
        if (userData.inventory.characters && userData.inventory.characters.length > 0) {
            userData.inventory.characters.forEach(charId => {
                if (charId !== 'default') {
                    // Dapatkan data karakter dari shopItems
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
    } else {
        // Untuk tab items dan boosters
        // Data inventory untuk tab ini
        const inventoryItems = userData.inventory[tabType] || [];
        
        // Jika tidak ada item, tampilkan pesan kosong
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
        
        // Render setiap item
        inventoryItems.forEach(item => {
            const itemData = getItemData(item.id, tabType);
            
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
            }
        });
    }
}

// Mendapatkan data item dari shopItems
function getItemData(itemId, type) {
    // Seharusnya kita mengambil dari data toko, tapi untuk sementara kita hardcode
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
    
    if (type === 'items') {
        return itemsData[itemId];
    } else if (type === 'boosters') {
        return boostersData[itemId];
    }
    
    return null;
}

// Mendapatkan data karakter
function getCharacterData(charId) {
    // Seharusnya kita mengambil dari data toko, tapi untuk sementara kita hardcode
    const charactersData = {
        'default': {
            name: 'Default',
            description: 'Karakter awal',
            image: 'assets/images/char1.png',
            price: 0
        },
        'robot': {
            name: 'Robot',
            description: 'Karakter robot futuristik',
            image: 'assets/images/char2.png',
            price: 300
        },
        'ninja': {
            name: 'Ninja',
            description: 'Karakter ninja misterius',
            image: 'assets/images/char3.png',
            price: 300
        }
    };
    
    return charactersData[charId];
}

// Set karakter aktif
function setActiveCharacter(charId) {
    // Update data user
    userData.activeCharacter = charId;
    
    // Simpan perubahan
    saveGameData();
    
    // Re-render karakter
    renderInventoryTab('characters');
}

// Setup event listeners untuk item detail modal
function setupItemDetailModal() {
    const modal = document.getElementById('itemDetailModal');
    const closeButton = document.getElementById('closeItemDetail');
    const closeDetailBtn = document.getElementById('closeDetailBtn');
    const useItemBtn = document.getElementById('useItemBtn');
    
    // Tutup modal saat tombol close diklik
    closeButton.addEventListener('click', function() {
        modal.classList.remove('active');
    });
    
    closeDetailBtn.addEventListener('click', function() {
        modal.classList.remove('active');
    });
    
    // Tutup modal saat klik di luar modal
    modal.addEventListener('click', function(event) {
        if (event.target === this) {
            modal.classList.remove('active');
        }
    });
    
    // Gunakan item saat tombol use diklik
    useItemBtn.addEventListener('click', function() {
        const itemId = this.getAttribute('data-item-id');
        const itemType = this.getAttribute('data-item-type');
        
        useItem(itemId, itemType);
        
        // Tutup modal
        modal.classList.remove('active');
    });
}

// Tampilkan detail item
function showItemDetail(itemId, type) {
    const modal = document.getElementById('itemDetailModal');
    const itemData = getItemData(itemId, type);
    
    if (!itemData) return;
    
    // Cari item dari inventory
    const inventory = userData.inventory[type] || [];
    const item = inventory.find(i => i.id === itemId);
    
    if (!item) return;
    
    // Update judul modal
    modal.querySelector('.feature-title').textContent = `Detail ${type === 'items' ? 'Item' : 'Booster'}`;
    
    // Update icon
    const iconElement = modal.querySelector('.item-detail-icon');
    iconElement.innerHTML = `<i class="${itemData.icon}"></i>`;
    
    // Update nama item
    modal.querySelector('.item-detail-name').textContent = itemData.name;
    
    // Update deskripsi
    modal.querySelector('.item-detail-description').textContent = itemData.description;
    
    // Update jumlah
    modal.querySelector('.item-usage-count').textContent = item.quantity || 1;
    
    // Setup tombol use
    const useButton = document.getElementById('useItemBtn');
    useButton.setAttribute('data-item-id', itemId);
    useButton.setAttribute('data-item-type', type);
    
    // Tampilkan modal
    modal.classList.add('active');
}

// Gunakan item
function useItem(itemId, type) {
    // Cari item dari inventory
    const inventory = userData.inventory[type] || [];
    const itemIndex = inventory.findIndex(i => i.id === itemId);
    
    if (itemIndex === -1) return;
    
    // Kurangi jumlah item
    inventory[itemIndex].quantity--;
    
    // Jika habis, hapus dari inventory
    if (inventory[itemIndex].quantity <= 0) {
        inventory.splice(itemIndex, 1);
    }
    
    // Simpan perubahan
    saveGameData();
    
    // Terapkan efek item
    applyItemEffect(itemId, type);
    
    // Re-render inventory
    renderInventoryTab(type);
}

// Terapkan efek item
function applyItemEffect(itemId, type) {
    // Seharusnya kita menerapkan efek item ke game
    // Tapi untuk sementara, kita hanya tampilkan pesan
    
    alert(`Item ${getItemData(itemId, type).name} telah digunakan!`);
    
    // Dalam implementasi yang sebenarnya, kita akan menyimpan efek item
    // ke dalam userData.activeEffects atau sejenisnya
}