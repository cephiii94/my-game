// Flag untuk mencegah redirect loops
let redirectingToLogin = false;

// Data untuk aplikasi Quiz

// Data User (Default, akan dioverride dari localStorage jika ada)
let userData = {
  username: "Guest",
  level: 1,
  coins: 100,
  xp: 0,
  profileIcon: "fas fa-user",
  // Menambahkan properti inventory untuk menyimpan item yang dibeli
  inventory: {
    items: [],
    boosters: [],
    characters: ['default']
  },
  // Menambahkan properti achievements untuk track pencapaian
  achievements: [],
  completedLevels: {
      "science": [],
      "history": [],
      "geography": [],
      "entertainment": []
  }
};

// Fungsi Tambahan untuk memastikan struktur data inventory
function ensureInventoryStructure() {
  // Pastikan properti inventory ada
  if (!userData.inventory) {
    userData.inventory = {
      items: [],
      boosters: [],
      characters: ['default']
    };
  }
  
  // Pastikan setiap property dalam inventory ada
  if (!userData.inventory.items) userData.inventory.items = [];
  if (!userData.inventory.boosters) userData.inventory.boosters = [];
  if (!userData.inventory.characters) userData.inventory.characters = ['default'];
}

// Modifikasi loadGameData untuk memastikan struktur inventory valid
function loadGameData() {
  // Mencegah redirect loop
  if (redirectingToLogin) return;
  
  const savedData = localStorage.getItem('quizUserData');
  if (savedData) {
    try {
      const parsedData = JSON.parse(savedData);
      // Pastikan data valid sebelum digunakan
      if (parsedData && parsedData.username && parsedData.username.trim() !== '') {
        userData.username = parsedData.username;
        userData.level = parsedData.level || 1;
        userData.coins = parsedData.coins || 100;
        userData.xp = parsedData.xp || 0;
        userData.profileIcon = parsedData.profileIcon || "fas fa-user";
        userData.completedLevels = parsedData.completedLevels || {
          "science": [],
          "history": [],
          "geography": [],
          "entertainment": []
        };
        userData.achievements = parsedData.achievements || [];
        
        // Pastikan struktur inventory sudah benar
        userData.inventory = parsedData.inventory || {
          items: [],
          boosters: [],
          characters: ['default']
        };
        
        // Pastikan semua bagian inventory ada
        ensureInventoryStructure();
        
        // Pastikan achievements dalam format yang benar
        if (!Array.isArray(userData.achievements)) {
          userData.achievements = [];
        }
      } else {
        redirectToLogin();
      }
    } catch (error) {
      console.error("Error parsing game data:", error);
      redirectToLogin();
    }
  } else {
    // Hanya redirect jika kita TIDAK berada di halaman login
    if (!window.location.pathname.includes('login.html')) {
      redirectToLogin();
    }
  }
}

// Data Kategori
const categoryData = [
  {
      id: "science",
      title: "Ilmu Pengetahuan",
      description: "Pertanyaan seputar sains, teknologi, dan penemuan",
      image: "/api/placeholder/400/200",
      totalLevels: 5
  },
  {
      id: "history",
      title: "Sejarah",
      description: "Pertanyaan tentang kejadian penting, tokoh, dan era bersejarah",
      image: "/api/placeholder/400/200",
      totalLevels: 5
  },
  {
      id: "geography",
      title: "Geografi",
      description: "Pertanyaan tentang negara, ibukota, dan fakta geografis",
      image: "/api/placeholder/400/200",
      totalLevels: 5
  },
  {
      id: "entertainment",
      title: "Hiburan",
      description: "Pertanyaan tentang film, musik, buku, dan karya seni populer",
      image: "/api/placeholder/400/200",
      totalLevels: 5
  }
];

// Data Achievement yang mungkin diraih
const achievementsData = [
    {
        id: "first_quiz",
        title: "Quiz Pertama",
        description: "Menyelesaikan quiz pertama",
        icon: "fas fa-star"
    },
    {
        id: "level_master",
        title: "Master Level",
        description: "Menyelesaikan seluruh level pada satu kategori",
        icon: "fas fa-crown"
    },
    {
        id: "coin_collector",
        title: "Kolektor Koin",
        description: "Mengumpulkan 500 koin",
        icon: "fas fa-coins"
    },
    {
        id: "perfect_score",
        title: "Nilai Sempurna",
        description: "Mendapatkan nilai sempurna pada satu quiz",
        icon: "fas fa-award"
    }
];

// Tambahkan Opsi Ikon
const profileIcons = [
  { id: "user", icon: "fas fa-user" },
  { id: "robot", icon: "fas fa-robot" },
  { id: "cat", icon: "fas fa-cat" },
  { id: "dog", icon: "fas fa-dog" },
  { id: "gamepad", icon: "fas fa-gamepad" },
  { id: "graduation-cap", icon: "fas fa-graduation-cap" },
  { id: "rocket", icon: "fas fa-rocket" },
  { id: "crown", icon: "fas fa-crown" }
];

// Data Level dan Pertanyaan
const quizData = {
  "science": {
      1: [
          {
              question: "Planet manakah yang terdekat dengan matahari?",
              options: ["Venus", "Merkurius", "Bumi", "Mars"],
              correctAnswer: 1,
              points: 10
          },
          {
              question: "Unsur kimia apa yang memiliki simbol 'O'?",
              options: ["Osmium", "Oksigen", "Oranium", "Oganesson"],
              correctAnswer: 1,
              points: 10
          },
          {
              question: "Siapa yang merumuskan Teori Relativitas?",
              options: ["Isaac Newton", "Nikola Tesla", "Albert Einstein", "Stephen Hawking"],
              correctAnswer: 2,
              points: 10
          },
          {
              question: "Apa nama senyawa kimia H2O?",
              options: ["Hidrogen Peroksida", "Air", "Asam Klorida", "Karbon Dioksida"],
              correctAnswer: 1,
              points: 10
          },
          {
              question: "Alat apa yang digunakan untuk melihat mikroorganisme?",
              options: ["Teleskop", "Mikroskop", "Stetoskop", "Periskop"],
              correctAnswer: 1,
              points: 10
          }
      ],
      2: [
          {
              question: "Apa satuan dasar untuk temperatur dalam sistem SI?",
              options: ["Fahrenheit", "Celsius", "Kelvin", "Rankine"],
              correctAnswer: 2,
              points: 15
          },
          {
              question: "Molekul DNA terdiri dari struktur apa?",
              options: ["Double Helix", "Single Strand", "Triple Bond", "Quadruple Layer"],
              correctAnswer: 0,
              points: 15
          },
          {
              question: "Gaya apa yang menyebabkan benda jatuh ke bumi?",
              options: ["Gaya Elektromagnetik", "Gaya Nuklir Kuat", "Gaya Gravitasi", "Gaya Gesekan"],
              correctAnswer: 2,
              points: 15
          },
          {
              question: "Apa nama unsur dengan nomor atom 79?",
              options: ["Perak", "Emas", "Platinum", "Merkuri"],
              correctAnswer: 1,
              points: 15
          },
          {
              question: "Berapa kecepatan cahaya di ruang hampa?",
              options: ["300.000 km/jam", "300.000 km/s", "300.000 m/s", "3.000.000 km/s"],
              correctAnswer: 1,
              points: 15
          }
      ]
  },
  "history": {
      1: [
          {
              question: "Siapa presiden pertama Indonesia?",
              options: ["Soekarno", "Mohammad Hatta", "Soeharto", "Megawati"],
              correctAnswer: 0,
              points: 10
          },
          {
              question: "Kapan Indonesia merdeka?",
              options: ["17 Agustus 1945", "17 Agustus 1944", "17 Agustus 1946", "17 Agustus 1949"],
              correctAnswer: 0,
              points: 10
          },
          {
              question: "Perang Dunia II berakhir pada tahun?",
              options: ["1943", "1944", "1945", "1946"],
              correctAnswer: 2,
              points: 10
          },
          {
              question: "Siapa penemu benua Amerika?",
              options: ["Ferdinand Magellan", "Christopher Columbus", "Vasco da Gama", "Marco Polo"],
              correctAnswer: 1,
              points: 10
          },
          {
              question: "Peristiwa Rengasdengklok terjadi pada tanggal?",
              options: ["16 Agustus 1945", "17 Agustus 1945", "18 Agustus 1945", "15 Agustus 1945"],
              correctAnswer: 0,
              points: 10
          }
      ]
  },
  "geography": {
      1: [
          {
              question: "Apa ibukota Indonesia?",
              options: ["Jakarta", "Bandung", "Surabaya", "Yogyakarta"],
              correctAnswer: 0,
              points: 10
          },
          {
              question: "Gunung tertinggi di dunia adalah?",
              options: ["K2", "Kilimanjaro", "Mount Everest", "Mont Blanc"],
              correctAnswer: 2,
              points: 10
          },
          {
              question: "Sungai terpanjang di dunia adalah?",
              options: ["Sungai Amazon", "Sungai Nil", "Sungai Mississippi", "Sungai Yangtze"],
              correctAnswer: 1,
              points: 10
          },
          {
              question: "Negara terluas di dunia adalah?",
              options: ["China", "Amerika Serikat", "Kanada", "Rusia"],
              correctAnswer: 3,
              points: 10
          },
          {
              question: "Benua terkecil di dunia adalah?",
              options: ["Eropa", "Australia", "Antartika", "Amerika Selatan"],
              correctAnswer: 1,
              points: 10
          }
      ]
  },
  "entertainment": {
      1: [
          {
              question: "Siapa pencipta lagu 'Indonesia Raya'?",
              options: ["W.R. Supratman", "Ismail Marzuki", "Kusbini", "C. Simanjuntak"],
              correctAnswer: 0,
              points: 10
          },
          {
              question: "Film 'Avatar' disutradarai oleh?",
              options: ["Steven Spielberg", "James Cameron", "Christopher Nolan", "Peter Jackson"],
              correctAnswer: 1,
              points: 10
          },
          {
              question: "Novel 'Harry Potter' ditulis oleh?",
              options: ["Stephen King", "J.R.R. Tolkien", "J.K. Rowling", "George R.R. Martin"],
              correctAnswer: 2,
              points: 10
          },
          {
              question: "Band legendaris dari Inggris yang beranggotakan John Lennon adalah?",
              options: ["The Rolling Stones", "The Beatles", "Queen", "Led Zeppelin"],
              correctAnswer: 1,
              points: 10
          },
          {
              question: "Siapa pemeran utama dalam film 'Iron Man'?",
              options: ["Chris Evans", "Chris Hemsworth", "Robert Downey Jr.", "Mark Ruffalo"],
              correctAnswer: 2,
              points: 10
          }
      ]
  }
};

// Fungsi untuk mendapatkan data level berdasarkan kategori
function getLevelsForCategory(categoryId) {
  const category = categoryData.find(cat => cat.id === categoryId);
  if (!category) return [];
  
  const levels = [];
  const completedLevels = userData.completedLevels[categoryId] || [];
  
  for (let i = 1; i <= category.totalLevels; i++) {
      let status = "locked";
      
      // Level 1 selalu terbuka
      if (i === 1) {
          status = "unlocked";
      }
      
      // Jika level sebelumnya sudah selesai, level ini terbuka
      if (i > 1 && completedLevels.includes(i-1)) {
          status = "unlocked";
      }
      
      // Jika level ini sudah selesai
      if (completedLevels.includes(i)) {
          status = "completed";
      }
      
      levels.push({
          level: i,
          status: status
      });
  }
  
  return levels;
}

// Fungsi untuk mendapatkan pertanyaan berdasarkan kategori dan level
function getQuestionsForLevel(categoryId, level) {
  if (quizData[categoryId] && quizData[categoryId][level]) {
      return quizData[categoryId][level];
  }
  return [];
}

// Fungsi untuk cek dan menambahkan achievement
function checkAchievements() {
  // Jika properti achievements belum ada, inisialisasi
  if (!userData.achievements) {
    userData.achievements = [];
  }
  
  // Achievement: Quiz Pertama
  const totalCompletedLevels = Object.values(userData.completedLevels)
    .reduce((total, levels) => total + levels.length, 0);
    
  if (totalCompletedLevels > 0 && !hasAchievement('first_quiz')) {
    addAchievement('first_quiz');
  }
  
  // Achievement: Master Level (menyelesaikan semua level dalam satu kategori)
  Object.keys(userData.completedLevels).forEach(categoryId => {
    const category = categoryData.find(cat => cat.id === categoryId);
    if (category && userData.completedLevels[categoryId].length >= category.totalLevels) {
      if (!hasAchievement('level_master_' + categoryId)) {
        addAchievement('level_master_' + categoryId, { categoryId: categoryId });
      }
    }
  });
  
  // Achievement: Kolektor Koin
  if (userData.coins >= 500 && !hasAchievement('coin_collector')) {
    addAchievement('coin_collector');
  }
}

// Fungsi untuk cek apakah user sudah memiliki achievement tertentu
function hasAchievement(achievementId) {
  return userData.achievements.some(achievement => achievement.id === achievementId);
}

// Fungsi untuk menambahkan achievement
function addAchievement(achievementId, extraData = {}) {
  const achievement = achievementsData.find(a => a.id === achievementId);
  if (achievement) {
    userData.achievements.push({
      id: achievementId,
      title: achievement.title,
      description: achievement.description,
      icon: achievement.icon,
      dateEarned: new Date().toISOString(),
      ...extraData
    });
  }
}

// Fungsi untuk menyimpan level yang sudah diselesaikan
function completeLevel(categoryId, level, score) {
  if (!userData.completedLevels[categoryId]) {
      userData.completedLevels[categoryId] = [];
  }
  
  if (!userData.completedLevels[categoryId].includes(level)) {
      userData.completedLevels[categoryId].push(level);
  }
  
  // Tambah koin berdasarkan skor
  const coinsEarned = Math.floor(score / 10) * 5;
  userData.coins += coinsEarned;
  
  // Tambah XP
  const xpEarned = score * 2;
  userData.xp += xpEarned;
  
  // Cek level up
  checkLevelUp();
  
  // Cek perfect score achievement
  const questions = getQuestionsForLevel(categoryId, level);
  const maxScore = questions.reduce((total, q) => total + q.points, 0);
  if (score === maxScore) {
    if (!hasAchievement('perfect_score')) {
      addAchievement('perfect_score');
    }
  }
  
  // Cek achievement lainnya
  checkAchievements();
  
  return {
      coinsEarned,
      xpEarned
  };
}

// Fungsi untuk cek apakah user naik level
function checkLevelUp() {
  const nextLevelXP = userData.level * 500;
  
  if (userData.xp >= nextLevelXP) {
      userData.level++;
      // Bisa tambahkan reward lain untuk level up di sini
  }
}

// Simpan data ke localStorage
function saveGameData() {
  localStorage.setItem(`quizUserData`, JSON.stringify(userData));
  
  // Simpan juga daftar username yang pernah login
  let userList = JSON.parse(localStorage.getItem('quizUserList') || '[]');
  if (!userList.includes(userData.username)) {
      userList.push(userData.username);
      localStorage.setItem('quizUserList', JSON.stringify(userList));
  }
  
  // Simpan username yang sedang aktif
  localStorage.setItem('quizActiveUser', userData.username);
}

// Ambil data dari localStorage
function loadGameData() {
  // Mencegah redirect loop
  if (redirectingToLogin) return;
  
  const savedData = localStorage.getItem('quizUserData');
  if (savedData) {
    try {
      const parsedData = JSON.parse(savedData);
      // Pastikan data valid sebelum digunakan
      if (parsedData && parsedData.username && parsedData.username.trim() !== '') {
        userData.username = parsedData.username;
        userData.level = parsedData.level || 1;
        userData.coins = parsedData.coins || 100;
        userData.xp = parsedData.xp || 0;
        userData.profileIcon = parsedData.profileIcon || "fas fa-user"; // Tambahkan ini
        userData.completedLevels = parsedData.completedLevels || {
          "science": [],
          "history": [],
          "geography": [],
          "entertainment": []
        };
        userData.achievements = parsedData.achievements || [];
        
        // Pastikan achievements dalam format yang benar
        if (!Array.isArray(userData.achievements)) {
          userData.achievements = [];
        }
      } else {
        redirectToLogin();
      }
    } catch (error) {
      console.error("Error parsing game data:", error);
      redirectToLogin();
    }
  } else {
    // Hanya redirect jika kita TIDAK berada di halaman login
    if (!window.location.pathname.includes('login.html')) {
      redirectToLogin();
    }
  }
}

// Fungsi untuk logout
function logoutUser() {
  // Simpan data pengguna saat ini sebelum logout
  saveGameData();
  
  // Hapus hanya indikator pengguna aktif
  localStorage.removeItem('quizActiveUser');
  
  // Redirect ke login
  redirectToLogin();
}

// Fungsi helper untuk redirect ke login
function redirectToLogin() {
  // Tandai bahwa kita sedang redirect ke login untuk mencegah loop
  redirectingToLogin = true;
  
  // Hindari redirect jika sudah di halaman login
  if (!window.location.pathname.includes('login.html')) {
    window.location.href = 'login.html';
  }
}

// Fungsi untuk reset data user dan semua user
function resetUserData() {
  // Hapus data pengguna aktif
  localStorage.removeItem('quizActiveUser');
  
  // Hapus daftar pengguna
  localStorage.removeItem('quizUserList');
  
  // Hapus data spesifik pengguna saat ini
  localStorage.removeItem('quizUserData');
  
  // Reset userData ke nilai default
  userData = {
    username: "Guest",
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
  
  // Redirect ke halaman login
  redirectToLogin();
}

// Coba load data dengan penanganan error yang lebih baik
try {
  loadGameData();
} catch (error) {
  console.error("Error loading game data:", error);
  // Jangan redirect di sini, biarkan loadGameData yang menangani 
}