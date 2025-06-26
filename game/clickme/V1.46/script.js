// ==================== LOCAL STORAGE SYSTEM ====================
const SAVE_KEY = 'idleClickerGameData';
const SAVE_VERSION = '2.0';

// Default Game State
const defaultGameState = {
    version: SAVE_VERSION,
    points: 0,
    pointsPerSecond: 0,
    clickPower: 1,
    autoClickerLevel: 0,
    clickPowerLevel: 1,
    totalClicks: 0,
    playTime: 0,
    ownedItems: [],
    equippedItems: {},
    soundEnabled: true,
    lastSaved: Date.now(),
    totalPlaytime: 0,
    
    // Achievement System
    achievements: {},
    completedAchievements: [],
    
    // Prestige System
    prestigeLevel: 0,
    prestigePoints: 0,
    prestigeMultiplier: 1,
    prestigeUpgrades: {},
    totalPrestigePoints: 0,
    
    // Daily Rewards
    lastDailyReward: 0,
    dailyStreak: 0,
    dailyRewardsClaimed: [],
    
    // Offline Earnings
    lastActiveTime: Date.now()
};

// Game State
let gameState = { ...defaultGameState };

// ==================== ACHIEVEMENTS DATA ====================
const achievements = {
    clicks: [
        { id: 'first_click', name: 'First Click', desc: 'Click 1 time', target: 1, reward: 10, icon: '🖱️' },
        { id: 'click_10', name: 'Getting Started', desc: 'Click 10 times', target: 10, reward: 25, icon: '👆' },
        { id: 'click_100', name: 'Clicking Master', desc: 'Click 100 times', target: 100, reward: 100, icon: '🏆' },
        { id: 'click_1000', name: 'Click Legend', desc: 'Click 1,000 times', target: 1000, reward: 500, icon: '⚡' },
        { id: 'click_10000', name: 'Click God', desc: 'Click 10,000 times', target: 10000, reward: 2000, icon: '👑' }
    ],
    points: [
        { id: 'points_100', name: 'First Hundred', desc: 'Earn 100 points', target: 100, reward: 50, icon: '💰' },
        { id: 'points_1000', name: 'Thousand Club', desc: 'Earn 1,000 points', target: 1000, reward: 200, icon: '💎' },
        { id: 'points_10000', name: 'Ten K Rich', desc: 'Earn 10,000 points', target: 10000, reward: 1000, icon: '💸' },
        { id: 'points_100000', name: 'Millionaire', desc: 'Earn 100,000 points', target: 100000, reward: 5000, icon: '🏦' }
    ],
    upgrades: [
        { id: 'auto_1', name: 'First Auto', desc: 'Buy first auto clicker', target: 1, reward: 100, icon: '🤖' },
        { id: 'auto_10', name: 'Auto Master', desc: 'Reach auto clicker level 10', target: 10, reward: 500, icon: '⚙️' },
        { id: 'power_10', name: 'Power Up', desc: 'Reach click power level 10', target: 10, reward: 300, icon: '💪' },
        { id: 'first_item', name: 'Shopper', desc: 'Buy your first item', target: 1, reward: 200, icon: '🛒' }
    ]
};

// ==================== PRESTIGE SHOP DATA ====================
const prestigeShop = [
    { id: 'click_multiplier', name: 'Click Multiplier', desc: 'Increase click power by 50%', cost: 1, effect: 'clickMultiplier', value: 1.5, icon: '💪' },
    { id: 'auto_multiplier', name: 'Auto Multiplier', desc: 'Increase auto income by 100%', cost: 2, effect: 'autoMultiplier', value: 2, icon: '🤖' },
    { id: 'offline_multiplier', name: 'Offline Multiplier', desc: 'Increase offline earnings by 200%', cost: 3, effect: 'offlineMultiplier', value: 3, icon: '💤' },
    { id: 'daily_bonus', name: 'Daily Bonus', desc: 'Increase daily rewards by 100%', cost: 2, effect: 'dailyMultiplier', value: 2, icon: '🎁' }
];

// ==================== SHOP ITEMS DATA ====================
const shopItems = {
    accessories: [
        { id: 'hat', name: 'Topi Keren', icon: '🎩', price: 100 },
        { id: 'glasses', name: 'Kacamata Hitam', icon: '🕶️', price: 200 },
        { id: 'motorcycle', name: 'Motor Sport', icon: '🏍️', price: 500 },
        { id: 'car', name: 'Mobil Mewah', icon: '🚗', price: 1000 }
    ],
    characters: [
        { id: 'wizard', name: 'Wizard', icon: '🧙‍♂️', price: 300 },
        { id: 'superhero', name: 'Superhero', icon: '🦸‍♂️', price: 800 }
    ],
    themes: [
        { id: 'darkTheme', name: 'Tema Malam', icon: '🌙', price: 150 },
        { id: 'rainbowTheme', name: 'Tema Pelangi', icon: '🌈', price: 250 }
    ]
};

// ==================== SAVE/LOAD FUNCTIONS ====================
function saveGame() {
    try {
        gameState.lastSaved = Date.now();
        gameState.lastActiveTime = Date.now();
        const saveData = JSON.stringify(gameState);
        localStorage.setItem(SAVE_KEY, saveData);
        showSaveStatus('💾 Game Saved!', false);
        return true;
    } catch (error) {
        console.error('Save failed:', error);
        showSaveStatus('❌ Save Failed!', true);
        return false;
    }
}

function loadGame() {
    try {
        const savedData = localStorage.getItem(SAVE_KEY);
        if (savedData) {
            const loadedState = JSON.parse(savedData);
            if (loadedState.version === SAVE_VERSION) {
                gameState = { ...defaultGameState, ...loadedState };
                console.log('Game loaded successfully!');
                showSaveStatus('📂 Game Loaded!', false);
                return true;
            } else {
                console.log('Save version mismatch, starting fresh');
                return false;
            }
        } else {
            console.log('No save data found, starting new game');
            return false;
        }
    } catch (error) {
        console.error('Load failed:', error);
        showSaveStatus('❌ Load Failed!', true);
        return false;
    }
}

function resetGame() {
    try {
        localStorage.removeItem(SAVE_KEY);
        gameState = { ...defaultGameState };
        gameState.lastActiveTime = Date.now();
        
        updateDisplay();
        updateEquipment();
        updateShop();
        updateInventory();
        updateAchievements();
        updatePrestigeDisplay();
        
        console.log('Game reset successfully!');
        showSaveStatus('🔄 Game Reset!', false);
    } catch (error) {
        console.error('Reset failed:', error);
        showSaveStatus('❌ Reset Failed!', true);
    }
}

function initAutoSave() {
    setInterval(() => {
        saveGame();
    }, 30000);

    window.addEventListener('beforeunload', () => {
        saveGame();
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            saveGame();
        } else {
            checkOfflineEarnings();
        }
    });
}

// ==================== SOUND FUNCTIONS ====================
function playSound(soundId) {
    if (!gameState.soundEnabled) return;
    
    try {
        const audio = document.getElementById(soundId);
        if (audio) {
            audio.currentTime = 0;
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log('Audio play failed:', error);
                    // No need for a fallback here, the original catch should suffice.
                });
            }
        }
    } catch (error) {
        console.log('Sound error:', error);
    }
}

function preloadAudio() {
    const audioIds = ['clickSound', 'buySound', 'openSound', 'closeSound'];
    audioIds.forEach(id => {
        const audio = document.getElementById(id);
        if (audio) {
            audio.load();
        }
    });
}

// ==================== GAME LOGIC ====================
function clickCharacter() {
    playSound('clickSound');
    
    const clickPower = getEffectiveClickPower();
    gameState.points += clickPower;
    gameState.totalClicks++;
    
    // Create click effect
    createClickEffect(clickPower);
    
    updateDisplay();
    checkAchievements();
    
    // Click animation
    const character = document.querySelector('.character');
    character.style.animation = 'none';
    setTimeout(() => {
        character.style.animation = 'idle 2s ease-in-out infinite';
    }, 100);

    if (gameState.totalClicks % 10 === 0) {
        saveGame();
    }
}

function createClickEffect(value) {
    const character = document.querySelector('.character');
    const rect = character.getBoundingClientRect();
    
    const effect = document.createElement('div');
    effect.className = 'click-effect';
    effect.textContent = `+${value}`;
    effect.style.left = (rect.left + rect.width/2) + 'px';
    effect.style.top = (rect.top + rect.height/2) + 'px';
    
    document.body.appendChild(effect);
    
    setTimeout(() => {
        effect.remove();
    }, 1000);
}

function buyUpgrade(type) {
    let purchased = false;
    
    if (type === 'autoClicker') {
        const cost = Math.floor(10 * Math.pow(1.15, gameState.autoClickerLevel));
        if (gameState.points >= cost) {
            gameState.points -= cost;
            gameState.autoClickerLevel++;
            gameState.pointsPerSecond = getEffectiveAutoClicker();
            purchased = true;
        }
    } else if (type === 'clickPower') {
        const cost = Math.floor(50 * Math.pow(1.2, gameState.clickPowerLevel - 1));
        if (gameState.points >= cost) {
            gameState.points -= cost;
            gameState.clickPowerLevel++;
            gameState.clickPower = gameState.clickPowerLevel;
            purchased = true;
        }
    }
    
    if (purchased) {
        playSound('buySound');
        checkAchievements();
        saveGame();
    }
    
    updateDisplay();
}

function buyItem(itemId, cost) {
    if (gameState.points >= cost && !gameState.ownedItems.includes(itemId)) {
        gameState.points -= cost;
        gameState.ownedItems.push(itemId);
        
        playSound('buySound');
        
        updateDisplay();
        updateShop();
        checkAchievements();
        showNotification(`Item ${getItemName(itemId)} berhasil dibeli!`);
        
        saveGame();
    }
}

function equipItem(itemId) {
    if (gameState.equippedItems[itemId]) {
        // If already equipped, unequip it
        gameState.equippedItems[itemId] = false;
    } else {
        // If not equipped, equip it
        gameState.equippedItems[itemId] = true;
    }
    updateEquipment();
    updateInventory();
    saveGame();
}

function getItemName(itemId) {
    for (let category in shopItems) {
        const item = shopItems[category].find(item => item.id === itemId);
        if (item) return item.name;
    }
    return itemId;
}

// ==================== PRESTIGE SYSTEM ====================
function getEffectiveClickPower() {
    let power = gameState.clickPower;
    if (gameState.prestigeUpgrades.click_multiplier) {
        power *= 1.5;
    }
    return Math.floor(power * gameState.prestigeMultiplier);
}

function getEffectiveAutoClicker() {
    let auto = gameState.autoClickerLevel;
    if (gameState.prestigeUpgrades.auto_multiplier) {
        auto *= 2;
    }
    return Math.floor(auto * gameState.prestigeMultiplier);
}

function calculatePrestigePoints() {
    return Math.floor(Math.sqrt(gameState.points / 1000));
}

function canPrestige() {
    return gameState.points >= 1000;
}

function doPrestige() {
    if (!canPrestige()) return;
    
    const newPrestigePoints = calculatePrestigePoints();
    gameState.prestigePoints += newPrestigePoints;
    gameState.totalPrestigePoints += newPrestigePoints;
    gameState.prestigeLevel++;
    gameState.prestigeMultiplier = 1 + (gameState.prestigeLevel * 0.1);
    
    // Reset progress
    gameState.points = 0;
    gameState.clickPower = 1;
    gameState.autoClickerLevel = 0;
    gameState.clickPowerLevel = 1;
    gameState.pointsPerSecond = 0;
    gameState.ownedItems = [];
    gameState.equippedItems = {};
    
    updateDisplay();
    updateEquipment();
    updateShop();
    updateInventory();
    updatePrestigeDisplay();
    closePrestige();
    
    showNotification(`🌟 Prestige berhasil! Kamu mendapat ${newPrestigePoints} Prestige Points!`);
    saveGame();
}

function buyPrestigeUpgrade(upgradeId) {
    const upgrade = prestigeShop.find(u => u.id === upgradeId);
    if (!upgrade || gameState.prestigeUpgrades[upgradeId]) return;
    
    if (gameState.prestigePoints >= upgrade.cost) {
        gameState.prestigePoints -= upgrade.cost;
        gameState.prestigeUpgrades[upgradeId] = true;
        
        playSound('buySound');
        updatePrestigeDisplay();
        updatePrestigeShop();
        saveGame();
        
        showNotification(`🌟 ${upgrade.name} berhasil dibeli!`);
    }
}

// ==================== ACHIEVEMENT SYSTEM ====================
function checkAchievements() {
    let newAchievements = [];
    
    // Check click achievements
    achievements.clicks.forEach(achievement => {
        if (!gameState.completedAchievements.includes(achievement.id) && 
            gameState.totalClicks >= achievement.target) {
            completeAchievement(achievement);
            newAchievements.push(achievement);
        }
    });
    
    // Check points achievements
    achievements.points.forEach(achievement => {
        if (!gameState.completedAchievements.includes(achievement.id) && 
            gameState.points >= achievement.target) {
            completeAchievement(achievement);
            newAchievements.push(achievement);
        }
    });
    
    // Check upgrade achievements
    if (!gameState.completedAchievements.includes('auto_1') && 
        gameState.autoClickerLevel >= 1) {
        const achievement = achievements.upgrades.find(a => a.id === 'auto_1');
        completeAchievement(achievement);
        newAchievements.push(achievement);
    }
    
    if (!gameState.completedAchievements.includes('auto_10') && 
        gameState.autoClickerLevel >= 10) {
        const achievement = achievements.upgrades.find(a => a.id === 'auto_10');
        completeAchievement(achievement);
        newAchievements.push(achievement);
    }
    
    if (!gameState.completedAchievements.includes('power_10') && 
        gameState.clickPowerLevel >= 10) {
        const achievement = achievements.upgrades.find(a => a.id === 'power_10');
        completeAchievement(achievement);
        newAchievements.push(achievement);
    }
    
    if (!gameState.completedAchievements.includes('first_item') && 
        gameState.ownedItems.length >= 1) {
        const achievement = achievements.upgrades.find(a => a.id === 'first_item');
        completeAchievement(achievement);
        newAchievements.push(achievement);
    }
    
    // Show notifications for new achievements
    newAchievements.forEach((achievement, index) => {
        setTimeout(() => {
            showAchievementNotification(achievement);
        }, index * 2000);
    });
}

function completeAchievement(achievement) {
    gameState.completedAchievements.push(achievement.id);
    gameState.points += achievement.reward;
    console.log(`Achievement completed: ${achievement.name}`);
}

function showAchievementNotification(achievement) {
    const notification = document.getElementById('achievementNotification');
    notification.textContent = `🏆 ${achievement.name} (+${achievement.reward} poin)`;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// ==================== DAILY REWARDS SYSTEM ====================
function checkDailyReward() {
    const now = Date.now();
    const lastReward = gameState.lastDailyReward;
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    if (now - lastReward >= oneDayMs) {
        return true;
    }
    return false;
}

function claimDailyReward() {
    if (!checkDailyReward()) {
        showNotification('🎁 Daily reward sudah diklaim hari ini!');
        return;
    }
    
    const now = Date.now();
    const baseReward = 100;
    let multiplier = gameState.prestigeUpgrades.daily_bonus ? 2 : 1;
    
    // Check streak
    const lastReward = gameState.lastDailyReward;
    const oneDayMs = 24 * 60 * 60 * 1000;
    const twoDaysMs = 48 * 60 * 60 * 1000;
    
    if (lastReward === 0 || now - lastReward > twoDaysMs) {
        // Reset streak if more than 2 days
        gameState.dailyStreak = 1;
    } else if (now - lastReward >= oneDayMs) {
        // Continue streak
        gameState.dailyStreak++;
    }
    
    const streakBonus = Math.min(gameState.dailyStreak, 7);
    const reward = Math.floor(baseReward * multiplier * streakBonus);
    
    gameState.points += reward;
    gameState.lastDailyReward = now;
    
    const today = new Date().getDate();
    // Only add if not already claimed for today to prevent duplicates on manual saves or reloads
    if (!gameState.dailyRewardsClaimed.includes(today)) {
        gameState.dailyRewardsClaimed.push(today);
    }
    
    updateDisplay();
    updateDailyCalendar();
    saveGame();
    
    showDailyRewardNotification(reward, gameState.dailyStreak);
    showNotification(`🎁 Daily reward diklaim! +${reward} poin (Streak: ${gameState.dailyStreak})`);
}

function showDailyRewardNotification(reward, streak) {
    const notification = document.getElementById('dailyRewardNotification');
    notification.textContent = `🎁 +${reward} poin (Streak: ${streak})`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function updateDailyCalendar() {
    const calendar = document.getElementById('dailyCalendar');
    if (!calendar) return;
    
    calendar.innerHTML = '';
    
    const todayDate = new Date();
    const currentDayOfMonth = todayDate.getDate(); // Get the day of the month (1-31)
    const daysInMonth = new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, 0).getDate(); // Get total days in current month

    // To ensure the calendar always shows a consistent 28 days or can be dynamic
    // For simplicity, sticking to a 28-day display as per original, but made today's highlight better.
    for (let day = 1; day <= daysInMonth; day++) { // Loop through actual days in month
        const dayDiv = document.createElement('div');
        dayDiv.className = 'daily-day';
        
        // Example reward calculation (can be more complex)
        const reward = 100 + (day * 10); 
        
        // Use a more robust check for claimed days (could store as YYYY-MM-DD for longer persistence)
        // For now, assuming dailyRewardsClaimed stores only the day of the month that was claimed for the current 'month' context
        if (gameState.dailyRewardsClaimed.includes(day)) {
            dayDiv.classList.add('claimed');
        }
        
        if (day === currentDayOfMonth) {
            dayDiv.classList.add('today');
        }
        
        dayDiv.innerHTML = `
            <div class="daily-day-number">Hari ${day}</div>
            <div class="daily-reward-amount">+${reward} poin</div>
        `;
        
        calendar.appendChild(dayDiv);
    }
    
    // Update claim button
    const claimBtn = document.getElementById('claimDailyBtn');
    if (claimBtn) {
        if (checkDailyReward()) {
            claimBtn.disabled = false;
            claimBtn.textContent = '🎁 Klaim Reward Harian';
        } else {
            claimBtn.disabled = true;
            claimBtn.textContent = '🎁 Sudah Diklaim Hari Ini';
        }
    }
}

// ==================== OFFLINE EARNINGS SYSTEM ====================
function checkOfflineEarnings() {
    const now = Date.now();
    const lastActive = gameState.lastActiveTime || now;
    const offlineTime = now - lastActive;
    const minOfflineTime = 2 * 60 * 1000; // 2 minutes minimum
    
    if (offlineTime >= minOfflineTime && gameState.pointsPerSecond > 0) {
        const maxOfflineHours = 8; // Maximum 8 hours of offline earnings
        const offlineHours = Math.min(offlineTime / (1000 * 60 * 60), maxOfflineHours);
        
        let multiplier = 1;
        if (gameState.prestigeUpgrades.offline_multiplier) {
            multiplier = 3;
        }
        
        const offlineEarnings = Math.floor(gameState.pointsPerSecond * offlineHours * 3600 * 0.5 * multiplier);
        
        if (offlineEarnings > 0) {
            showOfflineEarnings(offlineTime, offlineEarnings);
        }
    }
    
    gameState.lastActiveTime = now;
}

function showOfflineEarnings(offlineTime, earnings) {
    const hours = Math.floor(offlineTime / (1000 * 60 * 60));
    const minutes = Math.floor((offlineTime % (1000 * 60 * 60)) / (1000 * 60));
    
    let timeText = '';
    if (hours > 0) {
        timeText = `${hours} jam ${minutes} menit`;
    } else {
        timeText = `${minutes} menit`;
    }
    
    const offlineMessage = document.getElementById('offlineMessage');
    if (offlineMessage) {
        offlineMessage.textContent = `Kamu offline selama ${timeText} dan mendapat ${earnings} poin!`;
    }
    
    gameState.points += earnings;
    updateDisplay();
    
    const offlinePopup = document.getElementById('offlinePopup');
    if (offlinePopup) {
        offlinePopup.style.display = 'flex';
    }
}

function closeOfflinePopup() {
    const offlinePopup = document.getElementById('offlinePopup');
    if (offlinePopup) {
        offlinePopup.style.display = 'none';
    }
    saveGame();
}

// ==================== MOBILE FUNCTIONS ====================
        
// Toggle mobile menu
function toggleMobileMenu() {
    const overlay = document.getElementById('mobileMenuOverlay');
    const isVisible = overlay.style.display === 'flex';
    
    if (isVisible) {
        overlay.style.display = 'none';
        playSound('closeSound');
    } else {
        overlay.style.display = 'flex';
        playSound('openSound');
    }
}

// Open mobile stats modal
function openMobileStats() {
    updateMobileStats();
    document.getElementById('mobileStatsModal').style.display = 'flex';
    playSound('openSound');
}

// Close mobile stats modal
function closeMobileStats() {
    document.getElementById('mobileStatsModal').style.display = 'none';
    playSound('closeSound');
}

// Update mobile stats display
function updateMobileStats() {
    const elements = [
        'mobilePoints', 'mobilePointsPerSecond', 'mobileLevel', 'mobileTotalClicks',
        'mobilePlayTime', 'mobileOwnedItems', 'mobilePrestigeLevel', 
        'mobilePrestigePoints', 'mobilePrestigeMultiplier', 'mobileDailyStreak'
    ];
    
    // Check if elements exist before updating
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            switch(id) {
                case 'mobilePoints':
                    element.textContent = Math.floor(gameState.points);
                    break;
                case 'mobilePointsPerSecond':
                    element.textContent = gameState.pointsPerSecond;
                    break;
                case 'mobileLevel':
                    element.textContent = Math.floor(gameState.totalClicks / 10) + 1;
                    break;
                case 'mobileTotalClicks':
                    element.textContent = gameState.totalClicks;
                    break;
                case 'mobilePlayTime':
                    element.textContent = gameState.playTime;
                    break;
                case 'mobileOwnedItems':
                    element.textContent = gameState.ownedItems.length;
                    break;
                case 'mobilePrestigeLevel':
                    element.textContent = gameState.prestigeLevel;
                    break;
                case 'mobilePrestigePoints':
                    element.textContent = gameState.prestigePoints;
                    break;
                case 'mobilePrestigeMultiplier':
                    element.textContent = gameState.prestigeMultiplier.toFixed(1);
                    break;
                case 'mobileDailyStreak':
                    element.textContent = gameState.dailyStreak;
                    break;
            }
        }
    });
}

// ==================== UPDATE FUNCTIONS ====================
function updateEquipment() {
    const hat = document.getElementById('hat');
    const glasses = document.getElementById('glasses');
    const vehicle = document.getElementById('vehicle');
    
    // Ensure all elements exist before trying to manipulate their style
    if (hat) hat.style.display = gameState.equippedItems.hat ? 'block' : 'none';
    if (glasses) glasses.style.display = gameState.equippedItems.glasses ? 'block' : 'none';

    // Logic for vehicle is slightly different as it could be motorcycle or car
    if (vehicle) {
        const hasVehicleEquipped = gameState.equippedItems.motorcycle || gameState.equippedItems.car;
        vehicle.style.display = hasVehicleEquipped ? 'block' : 'none';
        // You might want to update the src of the vehicle image based on which one is equipped
        if (hasVehicleEquipped) {
            if (gameState.equippedItems.motorcycle) {
                vehicle.src = 'https://placehold.co/80x40/ff9800/ffffff?text=Motor';
                vehicle.alt = 'Motor Sport';
            } else if (gameState.equippedItems.car) {
                vehicle.src = 'https://placehold.co/80x40/ff9800/ffffff?text=Mobil';
                vehicle.alt = 'Mobil Mewah';
            }
        }
    }
}

function updateDisplay() {
    // Update main display elements
    const elements = {
        'points': Math.floor(gameState.points),
        'pointsPerSecond': gameState.pointsPerSecond,
        'totalClicks': gameState.totalClicks,
        'ownedItems': gameState.ownedItems.length,
        'level': Math.floor(gameState.totalClicks / 10) + 1,
        'playTime': gameState.playTime
    };
    
    // Update elements if they exist
    Object.keys(elements).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = elements[id];
        }
    });
    
    // Update upgrade costs and levels
    const autoClickerCost = Math.floor(10 * Math.pow(1.15, gameState.autoClickerLevel));
    const clickPowerCost = Math.floor(50 * Math.pow(1.2, gameState.clickPowerLevel - 1));
    
    const upgradeCosts = {
        'autoClickerCost': autoClickerCost,
        'clickPowerCost': clickPowerCost,
        'autoClickerLevel': gameState.autoClickerLevel,
        'clickPowerLevel': gameState.clickPowerLevel
    };
    
    Object.keys(upgradeCosts).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = upgradeCosts[id];
        }
    });
    
    // Update upgrade button states
    const autoClickerBtn = document.getElementById('autoClickerBtn');
    const clickPowerBtn = document.getElementById('clickPowerBtn');
    
    if (autoClickerBtn) {
        if (gameState.points >= autoClickerCost) {
            autoClickerBtn.classList.add('available');
            autoClickerBtn.disabled = false;
        } else {
            autoClickerBtn.classList.remove('available');
            autoClickerBtn.disabled = false; // Still enabled, just not 'available'
        }
    }
    
    if (clickPowerBtn) {
        if (gameState.points >= clickPowerCost) {
            clickPowerBtn.classList.add('available');
            clickPowerBtn.disabled = false;
        } else {
            clickPowerBtn.classList.remove('available');
            clickPowerBtn.disabled = false; // Still enabled, just not 'available'
        }
    }

    updatePrestigeDisplay();
    
    // Update mobile stats if modal is open
    const mobileStatsModal = document.getElementById('mobileStatsModal');
    if (mobileStatsModal && mobileStatsModal.style.display === 'flex') {
        updateMobileStats();
    }
}

function updatePrestigeDisplay() {
    const prestigeElements = {
        'prestigeLevel': gameState.prestigeLevel,
        'prestigePoints': gameState.prestigePoints,
        'prestigeMultiplier': gameState.prestigeMultiplier.toFixed(1),
        'dailyStreak': gameState.dailyStreak
    };
    
    Object.keys(prestigeElements).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = prestigeElements[id];
        }
    });
    
    const prestigeBtn = document.getElementById('prestigeBtn');
    const nextPrestigePoints = calculatePrestigePoints();
    
    if (prestigeBtn) {
        if (canPrestige()) {
            prestigeBtn.disabled = false;
            prestigeBtn.textContent = `🌟 Prestige (+${nextPrestigePoints} PP)`;
        } else {
            prestigeBtn.disabled = true;
            prestigeBtn.textContent = `🌟 Prestige (Need 1000 Points)`;
        }
    }
    
    const nextPrestigePointsElement = document.getElementById('nextPrestigePoints');
    const doPrestigeBtnElement = document.getElementById('doPrestigeBtn');
    
    if (nextPrestigePointsElement) {
        nextPrestigePointsElement.textContent = nextPrestigePoints;
    }
    
    if (doPrestigeBtnElement) {
        doPrestigeBtnElement.disabled = !canPrestige();
    }
}

function updateShop() {
    updateShopGrid('accessories', 'accessoriesGrid');
    updateShopGrid('characters', 'charactersGrid');
    updateShopGrid('themes', 'themesGrid');
}

function updateShopGrid(category, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    
    grid.innerHTML = '';
    
    shopItems[category].forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'shop-item';
        
        const isOwned = gameState.ownedItems.includes(item.id);
        const canAfford = gameState.points >= item.price;
        
        itemDiv.innerHTML = `
            <div class="item-icon">${item.icon}</div>
            <div class="item-name">${item.name}</div>
            <div class="item-price">💰 ${item.price} poin</div>
            <button class="buy-btn ${isOwned ? 'owned' : ''}" 
                            onclick="${isOwned ? '' : `buyItem('${item.id}', ${item.price})`}"
                            ${!canAfford && !isOwned ? 'disabled' : ''}>
                        ${isOwned ? '✓ Terbeli' : 'Beli'}
                    </button>
        `;
        
        grid.appendChild(itemDiv);
    });
}

function updateInventory() {
    const inventoryGrid = document.getElementById('inventoryGrid');
    if (!inventoryGrid) return;
    
    inventoryGrid.innerHTML = '';
    
    if (gameState.ownedItems.length === 0) {
        inventoryGrid.innerHTML = '<div style="text-align: center; color: #666; grid-column: 1 / -1; padding: 50px;">Belum ada item yang dimiliki</div>';
        return;
    }
    
    gameState.ownedItems.forEach(itemId => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'inventory-item';
        
        const icons = {
            hat: '🎩', glasses: '🕶️', motorcycle: '🏍️', car: '🚗',
            wizard: '🧙‍♂️', superhero: '🦸‍♂️', darkTheme: '🌙', rainbowTheme: '🌈'
        };
        
        const isEquipped = gameState.equippedItems[itemId];
        
        itemDiv.innerHTML = `
            <div class="item-icon">${icons[itemId] || '❓'}</div>
            <div class="item-name">${getItemName(itemId)}</div>
            <button class="equip-btn ${isEquipped ? 'equipped' : ''}" onclick="equipItem('${itemId}')">
                        ${isEquipped ? 'Lepas' : 'Pasang'}
                    </button>
        `;
        
        inventoryGrid.appendChild(itemDiv);
    });
}

function updateAchievements() {
    updateAchievementGrid('clicks', 'clicksAchievementGrid');
    updateAchievementGrid('points', 'pointsAchievementGrid');
    updateAchievementGrid('upgrades', 'upgradesAchievementGrid');
}

function updateAchievementGrid(category, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    
    grid.innerHTML = '';
    
    achievements[category].forEach(achievement => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'achievement-item';
        
        const isCompleted = gameState.completedAchievements.includes(achievement.id);
        if (isCompleted) {
            itemDiv.classList.add('completed');
        }
        
        let currentProgress = 0;
        if (category === 'clicks') {
            currentProgress = gameState.totalClicks;
        } else if (category === 'points') {
            currentProgress = gameState.points;
        } else if (category === 'upgrades') {
            if (achievement.id === 'auto_1' || achievement.id === 'auto_10') {
                currentProgress = gameState.autoClickerLevel;
            } else if (achievement.id === 'power_10') {
                currentProgress = gameState.clickPowerLevel;
            } else if (achievement.id === 'first_item') {
                currentProgress = gameState.ownedItems.length;
            }
        }
        
        const progressPercent = Math.min((currentProgress / achievement.target) * 100, 100);
        
        itemDiv.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-desc">${achievement.desc}</div>
            <div class="achievement-progress">
                <div class="achievement-progress-bar ${isCompleted ? 'completed' : ''}" 
                             style="width: ${progressPercent}%"></div>
            </div>
            <div class="achievement-reward">
                        ${isCompleted ? '✓ Completed' : `Reward: ${achievement.reward} poin`}
                    </div>
        `;
        
        grid.appendChild(itemDiv);
    });
}

function updatePrestigeShop() {
    const grid = document.getElementById('prestigeShopGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    prestigeShop.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'prestige-item';
        
        const isOwned = gameState.prestigeUpgrades[item.id];
        const canAfford = gameState.prestigePoints >= item.cost;
        
        if (isOwned) {
            itemDiv.classList.add('owned');
        }
        
        itemDiv.innerHTML = `
            <div class="item-icon">${item.icon}</div>
            <div class="item-name">${item.name}</div>
            <div class="item-price">⭐ ${item.cost} PP</div>
            <div class="achievement-desc">${item.desc}</div>
            <button class="buy-btn ${isOwned ? 'owned' : ''}" 
                            onclick="${isOwned ? '' : `buyPrestigeUpgrade('${item.id}')`}"
                            ${!canAfford && !isOwned ? 'disabled' : ''}>
                        ${isOwned ? '✓ Owned' : 'Buy'}
                    </button>
        `;
        
        grid.appendChild(itemDiv);
    });
}

// ==================== UI FUNCTIONS ====================
function openShop() {
    playSound('openSound');
    updateShop();
    const shopPopup = document.getElementById('shopPopup');
    if (shopPopup) {
        shopPopup.style.display = 'flex';
    }
}

function closeShop() {
    playSound('closeSound');
    const shopPopup = document.getElementById('shopPopup');
    if (shopPopup) {
        shopPopup.style.display = 'none';
    }
}

function openInventory() {
    playSound('openSound');
    updateInventory();
    const inventoryPopup = document.getElementById('inventoryPopup');
    if (inventoryPopup) {
        inventoryPopup.style.display = 'flex';
    }
}

function closeInventory() {
    playSound('closeSound');
    const inventoryPopup = document.getElementById('inventoryPopup');
    if (inventoryPopup) {
        inventoryPopup.style.display = 'none';
    }
}

function openAchievements() {
    playSound('openSound');
    updateAchievements();
    updateDailyCalendar();
    const achievementsPopup = document.getElementById('achievementsPopup');
    if (achievementsPopup) {
        achievementsPopup.style.display = 'flex';
    }
}

function closeAchievements() {
    playSound('closeSound');
    const achievementsPopup = document.getElementById('achievementsPopup');
    if (achievementsPopup) {
        achievementsPopup.style.display = 'none';
    }
}

function openPrestige() {
    playSound('openSound');
    updatePrestigeShop();
    updatePrestigeDisplay();
    const prestigePopup = document.getElementById('prestigePopup');
    if (prestigePopup) {
        prestigePopup.style.display = 'flex';
    }
}

function closePrestige() {
    playSound('closeSound');
    const prestigePopup = document.getElementById('prestigePopup');
    if (prestigePopup) {
        prestigePopup.style.display = 'none';
    }
}

function switchTab(tabName, clickedButton) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const targetTab = document.getElementById(tabName);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    if (clickedButton) {
        clickedButton.classList.add('active');
    }
}

function switchAchievementTab(tabName, clickedButton) {
    const popup = document.getElementById('achievementsPopup');
    if (!popup) return;
    
    popup.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    popup.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const targetTab = document.getElementById(tabName + 'Achievements');
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    if (clickedButton) {
        clickedButton.classList.add('active');
    }
}

function switchPrestigeTab(tabName, clickedButton) {
    const popup = document.getElementById('prestigePopup');
    if (!popup) return;
    
    popup.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    popup.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const targetTab = document.getElementById('prestige' + tabName.charAt(0).toUpperCase() + tabName.slice(1));
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    if (clickedButton) {
        clickedButton.classList.add('active');
    }
}

function showNotification(message) {
    const notificationMessage = document.getElementById('notificationMessage');
    const notificationPopup = document.getElementById('notificationPopup');
    
    if (notificationMessage) {
        notificationMessage.textContent = message;
    }
    if (notificationPopup) {
        notificationPopup.style.display = 'flex';
    }
}

function closeNotification() {
    playSound('closeSound');
    const notificationPopup = document.getElementById('notificationPopup');
    if (notificationPopup) {
        notificationPopup.style.display = 'none';
    }
}

function confirmReset() {
    const resetPopup = document.getElementById('resetPopup');
    if (resetPopup) {
        resetPopup.style.display = 'flex';
    }
}

function closeResetPopup() {
    const resetPopup = document.getElementById('resetPopup');
    if (resetPopup) {
        resetPopup.style.display = 'none';
    }
}

function toggleSound() {
    gameState.soundEnabled = !gameState.soundEnabled;
    const soundStatus = document.getElementById('soundStatus');
    const soundStatusMobile = document.getElementById('soundStatusMobile');
    
    if (soundStatus) {
        soundStatus.textContent = gameState.soundEnabled ? 'On' : 'Off';
    }
    if (soundStatusMobile) {
        soundStatusMobile.textContent = gameState.soundEnabled ? 'On' : 'Off';
    }
    
    if (gameState.soundEnabled) {
        playSound('clickSound');
    }
    
    saveGame();
}

function showSaveStatus(message, isError = false) {
    const saveStatus = document.getElementById('saveStatus');
    if (!saveStatus) return;
    
    saveStatus.textContent = message;
    saveStatus.classList.toggle('error', isError);
    saveStatus.classList.add('show');
    
    setTimeout(() => {
        saveStatus.classList.remove('show');
    }, 2000);
}

// ==================== EVENT LISTENERS ====================
        
// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const menuBtn = document.querySelector('.menu-btn');
    
    if (mobileMenuOverlay && mobileMenuOverlay.style.display === 'flex') {
        const mobileMenu = mobileMenuOverlay.querySelector('.mobile-menu');
        if (mobileMenu && !mobileMenu.contains(event.target) && !menuBtn.contains(event.target)) {
            toggleMobileMenu();
        }
    }
});

// Handle escape key for mobile modals
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        // Close mobile menu
        const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
        if (mobileMenuOverlay && mobileMenuOverlay.style.display === 'flex') {
            toggleMobileMenu();
        }
        // Close mobile stats
        const mobileStatsModal = document.getElementById('mobileStatsModal');
        if (mobileStatsModal && mobileStatsModal.style.display === 'flex') {
            closeMobileStats();
        }
        // Close other popups
        const popups = ['shopPopup', 'inventoryPopup', 'achievementsPopup', 'prestigePopup', 'offlinePopup', 'resetPopup', 'notificationPopup'];
        popups.forEach(popupId => {
            const popupElement = document.getElementById(popupId);
            if (popupElement && popupElement.style.display === 'flex') {
                popupElement.style.display = 'none';
                playSound('closeSound'); // Play close sound when any popup is closed via Escape
            }
        });
    }
});

// ==================== GAME LOOP ====================
setInterval(() => {
    gameState.points += gameState.pointsPerSecond;
    gameState.playTime++;
    gameState.totalPlaytime++;
    
    const playTimeElement = document.getElementById('playTime');
    if (playTimeElement) {
        playTimeElement.textContent = gameState.playTime;
    }
    
    updateDisplay();
}, 1000);

// ==================== INITIALIZE GAME ====================
document.addEventListener('DOMContentLoaded', function() {
    // Load saved game data
    const loaded = loadGame();
    
    // Check offline earnings if game was loaded
    if (loaded) {
        setTimeout(() => {
            checkOfflineEarnings();
        }, 1000);
    }
    
    // Initialize audio
    preloadAudio();
    
    // Initialize auto save system
    initAutoSave();
    
    // Update all displays
    updateDisplay();
    updateEquipment();
    updateShop();
    updateInventory();
    updateAchievements();
    updatePrestigeDisplay();
    updateDailyCalendar();
    
    // Update sound status
    const soundStatus = document.getElementById('soundStatus');
    const soundStatusMobile = document.getElementById('soundStatusMobile');
    if (soundStatus) {
        soundStatus.textContent = gameState.soundEnabled ? 'On' : 'Off';
    }
    if (soundStatusMobile) {
        soundStatusMobile.textContent = gameState.soundEnabled ? 'On' : 'Off';
    }
    
    // Check for daily rewards
    if (checkDailyReward() && gameState.totalClicks > 0) {
        setTimeout(() => {
            showNotification('🎁 Daily reward tersedia! Buka menu Prestasi untuk mengklaim.');
        }, 3000);
    }
    
    console.log('Game initialized!', loaded ? 'Saved data loaded.' : 'Starting fresh.');
});
