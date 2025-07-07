document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('game-area');
    const expBarFill = document.getElementById('exp-bar-fill');
    const expText = document.getElementById('exp-text');
    const currentHpDisplay = document.getElementById('current-hp');
    const maxHpDisplay = document.getElementById('max-hp');
    const towerSlots = document.querySelectorAll('.tower-slot');
    const choicePopup = document.getElementById('choice-popup');
    const choicesContainer = document.getElementById('choices');

    // --- Konfigurasi Game ---
    const GAME_CONFIG = {
        MAX_HP_TOWER: 200,
        ENEMY_DAMAGE_TO_TOWER: 10,
        EXP_TO_LEVEL_UP: 100,
        EXP_PER_ENEMY_DESTROYED: 10, // Contoh EXP jika musuh dihancurkan menara
        EXP_PER_ENEMY_PASSED: 5,   // Contoh EXP jika musuh melewati defense (bisa 0 jika ingin hukuman)
        SPAWN_INTERVAL: 1500, // Spawn musuh setiap 1.5 detik
        ENEMY_SPEED: 1, // Kecepatan musuh (pixel per frame)
        TOWER_TYPES: {
            "Tower": { emoji: '🎯', damage: 20, range: 100, fireRate: 1000, level: 1 },
            "Tank": { emoji: '🛡️', damage: 40, range: 70, fireRate: 1500, level: 1 }, // Slow but strong
            "Mortar": { emoji: '💣', damage: 30, range: 150, fireRate: 2000, level: 1 } // AoE (belum diimplementasikan)
        },
        ENEMY_TYPES: [
            { emoji: '👾', hp: 50, speed: 1, rewardExp: 10 },
            { emoji: '👹', hp: 80, speed: 0.8, rewardExp: 15 },
            { emoji: '👻', hp: 30, speed: 1.2, rewardExp: 8 }
        ],
        UPGRADE_BONUSES: {
            damage: 1.2, // Damage x 1.2
            fireRate: 0.9 // Fire rate x 0.9 (lebih cepat)
        }
    };

    let currentHpTower = GAME_CONFIG.MAX_HP_TOWER;
    let currentExp = 0;
    let currentLevel = 1;
    let enemies = [];
    let towers = []; // Menyimpan objek menara { element: div, type: "Tower", damage: X, range: Y, ... }
    let gameRunning = false;
    let enemySpawnInterval;

    const enemyPathArea = document.getElementById('enemy-path-area');
    const enemyPathAreaOffsetTop = enemyPathArea.offsetTop;
    const gameAreaHeight = gameArea.clientHeight;

    // --- Inisialisasi Game ---
    function initializeGame() {
        currentHpTower = GAME_CONFIG.MAX_HP_TOWER;
        currentExp = 0;
        currentLevel = 1;
        maxHpDisplay.textContent = GAME_CONFIG.MAX_HP_TOWER;
        currentHpDisplay.textContent = currentHpTower;
        updateExpBar();

        enemies.forEach(enemy => enemy.remove());
        enemies = [];
        towers.forEach(tower => tower.element.remove()); // Hapus unit menara
        towers = [];
        towerSlots.forEach(slot => { // Reset slot menara
            slot.dataset.hasTower = 'false';
            slot.innerHTML = ''; // Kosongkan isi slot
            slot.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
            slot.style.border = '2px dashed #eee';
        });

        gameRunning = false; // Game belum berjalan sampai unit dipilih
        clearInterval(enemySpawnInterval);

        // Tampilkan pop-up pilihan unit awal
        showChoicePopup(true);
    }

    // --- Fungsi Update UI ---
    function updateHpTowerDisplay() {
        currentHpDisplay.textContent = currentHpTower;
        if (currentHpTower <= 0) {
            endGame();
        }
    }

    function updateExpBar() {
        const expPercentage = (currentExp / GAME_CONFIG.EXP_TO_LEVEL_UP) * 100;
        expBarFill.style.width = `${expPercentage}%`;
        expText.textContent = `EXP: ${currentExp}/${GAME_CONFIG.EXP_TO_LEVEL_UP} (Lv. ${currentLevel})`;

        if (currentExp >= GAME_CONFIG.EXP_TO_LEVEL_UP) {
            levelUp();
        }
    }

    function addExp(amount) {
        currentExp += amount;
        updateExpBar();
    }

    function levelUp() {
        currentLevel++;
        currentExp = 0; // Reset EXP
        GAME_CONFIG.EXP_TO_LEVEL_UP += 50; // Tingkatkan kebutuhan EXP untuk level berikutnya
        updateExpBar();
        alert(`Selamat! Anda naik ke Level ${currentLevel}!`);
        // Tampilkan pop-up pilihan unit/upgrade
        showChoicePopup(false);
        // Hentikan sementara spawning musuh saat pop-up muncul
        clearInterval(enemySpawnInterval);
    }

    // --- Pop-up Pilihan Unit/Upgrade ---
    function showChoicePopup(isInitialChoice) {
        choicesContainer.innerHTML = ''; // Kosongkan pilihan sebelumnya

        const availableChoices = [];
        const unitTypes = Object.keys(GAME_CONFIG.TOWER_TYPES);

        // Ambil 3 pilihan acak dari tipe menara
        const shuffledTypes = [...unitTypes].sort(() => 0.5 - Math.random());
        for (let i = 0; i < 3; i++) {
            if (shuffledTypes[i]) {
                availableChoices.push({ type: 'unit', name: shuffledTypes[i] });
            }
        }

        // Tambahkan opsi upgrade jika ada menara yang bisa di-upgrade dan bukan pilihan awal
        if (!isInitialChoice && towers.length > 0) {
            // Pilih beberapa menara yang sudah ada untuk opsi upgrade
            const upgradableTowers = towers.filter(t => t.level < 3); // Batas level upgrade
            if (upgradableTowers.length > 0) {
                const shuffledUpgrades = [...upgradableTowers].sort(() => 0.5 - Math.random());
                for (let i = 0; i < Math.min(2, shuffledUpgrades.length); i++) { // Maksimal 2 opsi upgrade
                    availableChoices.push({ type: 'upgrade', unit: shuffledUpgrades[i] });
                }
            }
        }

        availableChoices.forEach(choice => {
            const button = document.createElement('button');
            button.classList.add('choice-button');

            if (choice.type === 'unit') {
                const unitData = GAME_CONFIG.TOWER_TYPES[choice.name];
                button.textContent = `${unitData.emoji} ${choice.name}`;
                button.onclick = () => selectChoice(choice.type, choice.name);
                // Nonaktifkan jika tidak ada slot kosong
                const availableSlot = [...towerSlots].find(slot => slot.dataset.hasTower === 'false');
                if (!availableSlot) {
                    button.classList.add('disabled');
                    button.disabled = true;
                }
            } else if (choice.type === 'upgrade') {
                button.classList.add('upgrade-option');
                const unitData = GAME_CONFIG.TOWER_TYPES[choice.unit.type];
                button.textContent = `⏫ Upgrade ${unitData.emoji} ${choice.unit.type} (Lv.${choice.unit.level})`;
                button.onclick = () => selectChoice(choice.type, choice.unit);
            }
            choicesContainer.appendChild(button);
        });

        choicePopup.classList.remove('hidden');
        gameRunning = false; // Pause game saat pop-up aktif
    }

    function selectChoice(type, selectedItem) {
        choicePopup.classList.add('hidden');
        gameRunning = true; // Lanjutkan game

        if (type === 'unit') {
            const unitType = selectedItem;
            const availableSlot = [...towerSlots].find(slot => slot.dataset.hasTower === 'false');
            if (availableSlot) {
                placeTower(availableSlot, unitType);
            } else {
                alert('Tidak ada slot kosong untuk menempatkan menara!');
                // Jika tidak ada slot, game tidak seharusnya berlanjut tanpa pilihan yang valid
                // Mungkin perlu tampilkan ulang pop-up atau beri peringatan
                gameRunning = false; // Tetap pause jika tidak ada slot
                showChoicePopup(false); // Coba lagi
            }
        } else if (type === 'upgrade') {
            upgradeTower(selectedItem);
        }

        // Lanjutkan spawning musuh setelah pilihan dibuat, jika ini bukan inisialisasi awal
        if (enemySpawnInterval) {
            clearInterval(enemySpawnInterval); // Hentikan yang lama
        }
        enemySpawnInterval = setInterval(spawnEnemy, GAME_CONFIG.SPAWN_INTERVAL);
    }

    // --- Fungsi Menara & Upgrade ---
    function placeTower(slotElement, type) {
        const unitData = { ...GAME_CONFIG.TOWER_TYPES[type] }; // Salin data agar bisa dimodifikasi per instance
        if (!unitData) {
            console.error('Tipe menara tidak dikenal:', type);
            return;
        }

        slotElement.dataset.hasTower = 'true';
        slotElement.style.backgroundColor = 'transparent'; // Hapus background slot
        slotElement.style.border = 'none'; // Hapus border slot

        const towerUnitElement = document.createElement('div');
        towerUnitElement.classList.add('tower-unit');
        towerUnitElement.textContent = unitData.emoji; // Set emoji awal
        slotElement.appendChild(towerUnitElement);

        const newTower = {
            element: towerUnitElement, // Ini adalah div unitnya, bukan slotnya
            slotElement: slotElement, // Referensi ke slot aslinya
            type: type,
            damage: unitData.damage,
            range: unitData.range,
            fireRate: unitData.fireRate,
            lastFired: 0, // Kapan terakhir menembak
            level: unitData.level,
            // Posisi menara relatif terhadap game-area untuk kalkulasi serangan
            x: slotElement.offsetLeft + slotElement.offsetWidth / 2,
            y: slotElement.offsetTop + slotElement.offsetHeight / 2
        };
        towers.push(newTower);
        console.log(`Menara ${type} ditempatkan di slot ${slotElement.dataset.slotId}!`);

        // Mulai serangan menara
        startTowerAttack(newTower);
    }

    function upgradeTower(towerToUpgrade) {
        if (towerToUpgrade.level >= 3) { // Batas level
            alert(`Menara ${towerToUpgrade.type} sudah di level maksimal!`);
            return;
        }
        towerToUpgrade.level++;
        towerToUpgrade.damage = Math.round(towerToUpgrade.damage * GAME_CONFIG.UPGRADE_BONUSES.damage);
        towerToUpgrade.fireRate = Math.round(towerToUpgrade.fireRate * GAME_CONFIG.UPGRADE_BONUSES.fireRate);
        console.log(`Menara ${towerToUpgrade.type} di-upgrade ke Lv.${towerToUpgrade.level}! Damage: ${towerToUpgrade.damage}, FireRate: ${towerToUpgrade.fireRate}`);

        // Perbarui tampilan emoji jika ada perubahan visual level (opsional)
        if (towerToUpgrade.type === "Tower") towerToUpgrade.element.textContent = (towerToUpgrade.level === 2) ? '🚀' : (towerToUpgrade.level === 3 ? '🌠' : '🎯');
        if (towerToUpgrade.type === "Tank") towerToUpgrade.element.textContent = (towerToUpgrade.level === 2) ? '🪖' : (towerToUpgrade.level === 3 ? '🧱' : '🛡️');
        if (towerToUpgrade.type === "Mortar") towerToUpgrade.element.textContent = (towerToUpgrade.level === 2) ? '💥' : (towerToUpgrade.level === 3 ? '🔥' : '💣');
    }

    function startTowerAttack(tower) {
        setInterval(() => {
            if (!gameRunning) return; // Jangan menyerang jika game pause

            const now = Date.now();
            if (now - tower.lastFired < tower.fireRate) {
                return; // Belum waktunya menembak lagi
            }

            // Cari musuh terdekat dalam jangkauan
            let targetEnemy = null;
            let minDistance = tower.range + 1; // Inisialisasi dengan nilai di luar jangkauan

            // Pindahkan kalkulasi rect gameArea ke luar loop untuk efisiensi
            const gameAreaRect = gameArea.getBoundingClientRect();

            enemies.forEach(enemy => {
                const enemyRect = enemy.getBoundingClientRect();
                const enemyCenterX = enemyRect.left + enemyRect.width / 2;
                const enemyCenterY = enemyRect.top + enemyRect.height / 2;

                const towerCenterX = gameAreaRect.left + tower.x;
                const towerCenterY = gameAreaRect.top + tower.y;

                const distance = Math.sqrt(
                    Math.pow(enemyCenterX - towerCenterX, 2) +
                    Math.pow(enemyCenterY - towerCenterY, 2)
                );

                if (distance <= tower.range && distance < minDistance) {
                    minDistance = distance;
                    targetEnemy = enemy;
                }
            });

            if (targetEnemy) {
                tower.lastFired = now;
                attackEnemy(tower, targetEnemy);
            }
        }, 100); // Cek target setiap 100ms
    }

    function attackEnemy(tower, enemyElement) {
        // Logika damage dipindahkan ke showMissile saat tumbukan terjadi.
        // Fungsi ini sekarang hanya bertanggung jawab untuk meluncurkan misil.
        showMissile(tower, enemyElement);
    }

    function destroyEnemy(enemyElement) {
        const animationInterval = enemyElement.animationInterval;
        if (animationInterval) {
            clearInterval(animationInterval);
        }
        enemyElement.remove();
        enemies = enemies.filter(e => e !== enemyElement);
        console.log('Musuh dihancurkan!');
    }

    function showMissile(tower, enemyElement) {
        // Buat elemen misil
        const missile = document.createElement('div');
        missile.className = 'missile';
        missile.style.position = 'absolute';

        // Dapatkan posisi awal misil (tengah tower)
        const gameAreaRect = gameArea.getBoundingClientRect();
        const towerRect = tower.element.getBoundingClientRect();
        let startX = towerRect.left + towerRect.width / 2 - gameAreaRect.left;
        let startY = towerRect.top + towerRect.height / 2 - gameAreaRect.top;

        missile.style.left = `${startX}px`;
        missile.style.top = `${startY}px`;

        missile.style.width = '10px';
        missile.style.height = '10px';
        missile.style.background = 'yellow';
        missile.style.borderRadius = '50%';
        missile.style.zIndex = 1000;

        gameArea.appendChild(missile);

        // Animasi misil yang mengejar musuh (homing)
        const missileSpeed = 5; // pixel per frame

        function animate() {
            // Hentikan jika musuh sudah tidak ada di DOM (misal, dihancurkan misil lain)
            if (!enemyElement.parentNode) {
                missile.remove();
                return;
            }

            // Dapatkan posisi target (musuh) secara real-time di setiap frame
            const enemyRect = enemyElement.getBoundingClientRect();
            const endX = enemyRect.left + enemyRect.width / 2 - gameAreaRect.left;
            const endY = enemyRect.top + enemyRect.height / 2 - gameAreaRect.top;

            // Hitung vektor arah dan jarak ke target
            const dx = endX - startX;
            const dy = endY - startY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Cek tumbukan: jika jarak lebih kecil dari kecepatan misil, anggap sudah sampai
            if (distance < missileSpeed) {
                missile.remove();

                // Terapkan damage SAAT tumbukan
                if (enemyElement.enemyData) {
                    enemyElement.enemyData.hp -= tower.damage;
                    console.log(`Musuh ${enemyElement.enemyData.emoji} terkena ${tower.type} (${tower.damage} dmg), HP sisa: ${enemyElement.enemyData.hp}`);

                    if (enemyElement.enemyData.hp <= 0) {
                        destroyEnemy(enemyElement);
                        addExp(GAME_CONFIG.EXP_PER_ENEMY_DESTROYED);
                    }
                }
                return; // Hentikan animasi
            }

            // Gerakkan misil ke arah target
            startX += (dx / distance) * missileSpeed;
            startY += (dy / distance) * missileSpeed;
            missile.style.left = `${startX}px`;
            missile.style.top = `${startY}px`;

            // Lanjutkan ke frame berikutnya
            requestAnimationFrame(animate);
        }
        animate();
    }

    // --- Fungsi Musuh ---
    function spawnEnemy() {
        if (!gameRunning) return;

        const randomEnemyType = GAME_CONFIG.ENEMY_TYPES[Math.floor(Math.random() * GAME_CONFIG.ENEMY_TYPES.length)];
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.textContent = randomEnemyType.emoji;
        enemy.enemyData = { ...randomEnemyType }; // Salin data musuh

        const gameAreaWidth = gameArea.clientWidth;
        const enemyWidth = enemy.offsetWidth || 30; // Gunakan 30 jika belum dirender
        const randomX = Math.random() * (gameAreaWidth - enemyWidth);

        enemy.style.left = `${randomX}px`;
        enemy.style.top = `${enemyPathAreaOffsetTop}px`;
        gameArea.appendChild(enemy);
        enemies.push(enemy);

        moveEnemy(enemy);
    }

    function moveEnemy(enemy) {
        let currentTop = enemyPathAreaOffsetTop;
        const speed = enemy.enemyData.speed;
        const defenseArea = document.getElementById('defense-area');
        const defenseAreaTop = defenseArea.offsetTop;

        enemy.animationInterval = setInterval(() => {
            if (!gameRunning) {
                // Jangan clear interval, cukup skip update posisi
                return;
            }

            currentTop += speed;
            enemy.style.top = `${currentTop}px`;

            if (currentTop + enemy.offsetHeight >= defenseAreaTop) {
                clearInterval(enemy.animationInterval);
                enemy.remove();
                enemies = enemies.filter(e => e !== enemy);
                currentHpTower -= GAME_CONFIG.ENEMY_DAMAGE_TO_TOWER;
                updateHpTowerDisplay();
                addExp(GAME_CONFIG.EXP_PER_ENEMY_PASSED);

                if (currentHpTower <= 0) {
                    endGame();
                }
            }
        }, 20);
    }

    // --- Manajemen Game ---
    function endGame() {
        gameRunning = false;
        clearInterval(enemySpawnInterval);
        enemies.forEach(enemy => {
            if (enemy.animationInterval) clearInterval(enemy.animationInterval);
            enemy.remove();
        });
        enemies = [];
        towers.forEach(tower => clearInterval(tower.attackInterval));
        towers = [];

        alert(`Game Over! HP Tower habis. Anda mencapai Level ${currentLevel}.`);
        initializeGame(); // Mulai ulang permainan
    }

    // Inisialisasi game saat halaman dimuat
    initializeGame();
});