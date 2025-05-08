// JavaScript untuk halaman Shop

document.addEventListener('DOMContentLoaded', function() {
    // Update UI dengan data user
    updateUserUI();
    
    // Setup profile dropdown menu
    setupProfileDropdown();
    
    // Setup event listeners untuk tabs
    setupShopTabs();
    
    // Setup back button
    setupBackButton();
    
    // Render shop items
    renderShopItems();
    
    // Setup event listeners untuk modals
    setupShopModals();
});

// Setup event listeners untuk tabs
function setupShopTabs() {
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

// Render shop items
function renderShopItems() {
    // Data item toko
    const shopData = getShopData();
    
    // Render items
    renderShopTab('items', shopData.items);
    
    // Render boosters
    renderShopTab('boosters', shopData.boosters);
    
    // Render characters
    renderShopTab('characters', shopData.characters);
    
    // Tambahkan event listeners untuk tombol beli
    setupBuyButtons();
}

// Get shop data
function getShopData() {
    // Data yang sama dengan yang diharapkan oleh inventory.js
    return {
        items: [
            {
                id: 'heart',
                name: 'Extra Life',
                description: 'Tambahan nyawa saat bermain quiz',
                price: 50,
                icon: 'fas fa-heart'
            },
            {
                id: 'clock',
                name: 'Time Extender',
                description: 'Tambah waktu 30 detik',
                price: 75,
                icon: 'fas fa-clock'
            },
            {
                id: 'hint',
                name: 'Hint',
                description: 'Menghilangkan 2 pilihan jawaban salah',
                price: 100,
                icon: 'fas fa-lightbulb'
            }
        ],
        boosters: [
            {
                id: 'coin',
                name: 'Coin Booster',
                description: 'Koin 2x lipat untuk 3 quiz berikutnya',
                price: 150,
                icon: 'fas fa-coin'
            },
            
            {
                id: 'xp',
                name: 'XP Booster',
                description: 'XP 2x lipat untuk 3 quiz berikutnya',
                price: 200,
                icon: 'fas fa-award'
            }
        ],
        characters: [
            {
                id: 'robot',
                name: 'Robot',
                description: 'Karakter robot futuristik',
                price: 0,
                image: 'assets/images/char2.png'
            },
            {
                id: 'penguin',
                name: 'Penguin',
                description: 'Karakter penguin lucu',
                price: 0,
                image: 'assets/images/char3.png'
            },
            {
                id: 'ninja',
                name: 'Ninja',
                description: 'Karakter ninja misterius',
                price: 0,
                image: 'assets/images/char4.png'
            }
            
        ]
    };
}

// Render tab toko tertentu
function renderShopTab(tabType, items) {
    const contentContainer = document.getElementById(`${tabType}-content`);
    const shopGrid = contentContainer.querySelector('.shop-grid');
    
    // Reset grid content
    shopGrid.innerHTML = '';
    
    // Jika tidak ada item, tampilkan pesan kosong
    if (!items || items.length === 0) {
        shopGrid.innerHTML = `
            <div class="inventory-message">
                <i class="fas fa-store-slash"></i>
                <p>Belum ada ${tabType === 'items' ? 'item' : (tabType === 'boosters' ? 'booster' : 'karakter')} yang tersedia</p>
                <p class="inventory-description">Silakan cek kembali nanti.</p>
            </div>
        `;
        return;
    }
    
    // Pastikan struktur inventory ada
    if (!userData.inventory) {
        userData.inventory = {
            items: [],
            boosters: [],
            characters: ['default']
        };
    }
    
    // Cek item yang sudah dibeli (untuk karakter)
    const boughtCharacters = userData.inventory.characters || ['default'];
    
    // Render setiap item
    items.forEach(item => {
        // Jika ini tab karakter, cek apakah karakter sudah dibeli
        const isCharacterOwned = tabType === 'characters' && boughtCharacters.includes(item.id);
        
        shopGrid.innerHTML += `
            <div class="shop-item">
                <div class="item-icon">
                    ${item.image 
                        ? `<img src="${item.image}" alt="${item.name}">` 
                        : `<i class="${item.icon}"></i>`}
                </div>
                <div class="item-info">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                </div>
                <div class="item-price">
                    <i class="fas fa-coins"></i>
                    <span>${item.price}</span>
                </div>
                ${isCharacterOwned 
                    ? `<button class="btn-buy" style="background-color: #2ecc71;" disabled>Dimiliki</button>` 
                    : `<button class="btn-buy" data-item-id="${item.id}" data-item-type="${tabType}" data-item-price="${item.price}" data-item-name="${item.name}">Beli</button>`}
            </div>
        `;
    });
}

// Setup event listeners untuk tombol beli
function setupBuyButtons() {
    const buyButtons = document.querySelectorAll('.btn-buy:not([disabled])');
    
    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.getAttribute('data-item-id');
            const itemType = this.getAttribute('data-item-type');
            const itemPrice = parseInt(this.getAttribute('data-item-price'));
            const itemName = this.getAttribute('data-item-name');
            
            // Tampilkan konfirmasi pembelian
            showPurchaseConfirmation(itemId, itemType, itemPrice, itemName);
        });
    });
}

// Tampilkan konfirmasi pembelian
function showPurchaseConfirmation(itemId, itemType, itemPrice, itemName) {
    const modal = document.getElementById('purchaseModal');
    
    // Update data modal
    document.getElementById('purchaseItemName').textContent = itemName;
    document.getElementById('purchaseItemPrice').textContent = itemPrice;
    document.getElementById('userBalance').textContent = userData.coins;
    
    // Setup tombol cancel
    const cancelButton = document.getElementById('cancelPurchaseBtn');
    cancelButton.onclick = function() {
        modal.classList.remove('active');
    };
    
    // Setup tombol confirm
    const confirmButton = document.getElementById('confirmPurchaseBtn');
    confirmButton.onclick = function() {
        purchaseItem(itemId, itemType, itemPrice, itemName);
        modal.classList.remove('active');
    };
    
    // Setup tombol close
    const closeButton = document.getElementById('closePurchase');
    closeButton.onclick = function() {
        modal.classList.remove('active');
    };
    
    // Tutup modal saat klik di luar modal
    modal.onclick = function(event) {
        if (event.target === this) {
            modal.classList.remove('active');
        }
    };
    
    // Tampilkan modal
    modal.classList.add('active');
}

// Proses pembelian item
function purchaseItem(itemId, itemType, itemPrice, itemName) {
    console.log(`Membeli ${itemName} (${itemId}) - tipe: ${itemType}, harga: ${itemPrice}`);
    
    // Cek apakah user punya cukup koin
    if (userData.coins < itemPrice) {
        showInsufficientFundsModal();
        return;
    }
    
    // Kurangi koin
    userData.coins -= itemPrice;
    
    // Pastikan inventory sudah diinisialisasi
    if (!userData.inventory) {
        userData.inventory = {
            items: [],
            boosters: [],
            characters: ['default']
        };
    }
    
    // Update inventory berdasarkan tipe item
    if (itemType === 'characters') {
        if (!userData.inventory.characters) {
            userData.inventory.characters = ['default'];
        }
        
        if (!userData.inventory.characters.includes(itemId)) {
            userData.inventory.characters.push(itemId);
        }
    } else {
        // Pastikan array items/boosters ada
        if (!userData.inventory[itemType]) {
            userData.inventory[itemType] = [];
        }
        
        // Untuk items dan boosters, kita tambah quantity jika sudah ada
        const existingItemIndex = userData.inventory[itemType].findIndex(item => item.id === itemId);
        
        if (existingItemIndex !== -1) {
            // Item sudah ada, tambah quantity
            userData.inventory[itemType][existingItemIndex].quantity += 1;
            console.log(`Item ${itemId} sudah ada, quantity sekarang: ${userData.inventory[itemType][existingItemIndex].quantity}`);
        } else {
            // Item belum ada, tambahkan baru
            userData.inventory[itemType].push({
                id: itemId,
                quantity: 1
            });
            console.log(`Item baru ${itemId} ditambahkan ke inventory`);
        }
    }
    
    // Log inventory setelah pembelian
    console.log("Inventory setelah pembelian:", userData.inventory);
    
    // Simpan data
    saveGameData();
    
    // Update UI
    updateUserUI();
    
    // Re-render shop items untuk karakter yang sudah dibeli
    if (itemType === 'characters') {
        renderShopItems();
    }
    
    // Tampilkan pesan sukses
    showSuccessPurchaseModal(itemName);
}

// Tampilkan pesan sukses pembelian
function showSuccessPurchaseModal(itemName) {
    const modal = document.getElementById('successModal');
    
    // Update nama item
    document.getElementById('successItemName').textContent = itemName;
    
    // Setup tombol OK
    const okButton = document.getElementById('okSuccessBtn');
    okButton.onclick = function() {
        modal.classList.remove('active');
    };
    
    // Setup tombol close
    const closeButton = document.getElementById('closeSuccess');
    closeButton.onclick = function() {
        modal.classList.remove('active');
    };
    
    // Tutup modal saat klik di luar modal
    modal.onclick = function(event) {
        if (event.target === this) {
            modal.classList.remove('active');
        }
    };
    
    // Tampilkan modal
    modal.classList.add('active');
}

// Tampilkan pesan koin tidak cukup
function showInsufficientFundsModal() {
    const modal = document.getElementById('insufficientModal');
    
    // Setup tombol OK
    const okButton = document.getElementById('okInsufficientBtn');
    okButton.onclick = function() {
        modal.classList.remove('active');
    };
    
    // Setup tombol close
    const closeButton = document.getElementById('closeInsufficient');
    closeButton.onclick = function() {
        modal.classList.remove('active');
    };
    
    // Tutup modal saat klik di luar modal
    modal.onclick = function(event) {
        if (event.target === this) {
            modal.classList.remove('active');
        }
    };
    
    // Tampilkan modal
    modal.classList.add('active');
}

// Setup modals
function setupShopModals() {
    // Setup modal purchase
    setupModal('purchaseModal', 'closePurchase', 'cancelPurchaseBtn');
    
    // Setup modal success
    setupModal('successModal', 'closeSuccess', 'okSuccessBtn');
    
    // Setup modal insufficient
    setupModal('insufficientModal', 'closeInsufficient', 'okInsufficientBtn');
}

// Setup modal
function setupModal(modalId, closeButtonId, cancelButtonId) {
    const modal = document.getElementById(modalId);
    
    if (!modal) return;
    
    const closeButton = document.getElementById(closeButtonId);
    const cancelButton = document.getElementById(cancelButtonId);
    
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            modal.classList.remove('active');
        });
    }
    
    if (cancelButton) {
        cancelButton.addEventListener('click', function() {
            modal.classList.remove('active');
        });
    }
    
    // Tutup modal saat klik di luar modal
    modal.addEventListener('click', function(event) {
        if (event.target === this) {
            modal.classList.remove('active');
        }
    });
}