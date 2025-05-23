/**
 * level.js
 * 
 * Deskripsi: File ini berisi data untuk aplikasi kuis edukasi
 * Berisi berbagai kategori pertanyaan dengan level kesulitan yang berbeda
 * Setiap pertanyaan memiliki opsi jawaban, jawaban benar, dan poin
 */

// Data Kuis - Dikelompokkan berdasarkan kategori dan level
const quizData = {
    /**
     * Kategori: Sains
     * Berisi pertanyaan-pertanyaan terkait ilmu pengetahuan alam
     */
    "science": {
        // Level 1 - Tingkat kesulitan dasar (10 poin per soal)
        1: [
            {
                question: "Planet manakah yang terdekat dengan matahari?",
                options: ["Venus", "Merkurius", "Bumi", "Mars"],
                correctAnswer: 1, // Merkurius
                points: 10
            },
            {
                question: "Unsur kimia apa yang memiliki simbol 'O'?",
                options: ["Osmium", "Oksigen", "Oranium", "Oganesson"],
                correctAnswer: 1, // Oksigen
                points: 10
            },
            {
                question: "Siapa yang merumuskan Teori Relativitas?",
                options: ["Isaac Newton", "Nikola Tesla", "Albert Einstein", "Stephen Hawking"],
                correctAnswer: 2, // Albert Einstein
                points: 10
            },
            {
                question: "Apa nama senyawa kimia H2O?",
                options: ["Hidrogen Peroksida", "Air", "Asam Klorida", "Karbon Dioksida"],
                correctAnswer: 1, // Air
                points: 10
            },
            {
                question: "Alat apa yang digunakan untuk melihat mikroorganisme?",
                options: ["Teleskop", "Mikroskop", "Stetoskop", "Periskop"],
                correctAnswer: 1, // Mikroskop
                points: 10
            }
        ],
        
        // Level 2 - Tingkat kesulitan menengah (15 poin per soal)
        2: [
            {
                question: "Apa satuan dasar untuk temperatur dalam sistem SI?",
                options: ["Fahrenheit", "Celsius", "Kelvin", "Rankine"],
                correctAnswer: 2, // Kelvin
                points: 15
            },
            {
                question: "Molekul DNA terdiri dari struktur apa?",
                options: ["Double Helix", "Single Strand", "Triple Bond", "Quadruple Layer"],
                correctAnswer: 0, // Double Helix
                points: 15
            },
            {
                question: "Gaya apa yang menyebabkan benda jatuh ke bumi?",
                options: ["Gaya Elektromagnetik", "Gaya Nuklir Kuat", "Gaya Gravitasi", "Gaya Gesekan"],
                correctAnswer: 2, // Gaya Gravitasi
                points: 15
            },
            {
                question: "Apa nama unsur dengan nomor atom 79?",
                options: ["Perak", "Emas", "Platinum", "Merkuri"],
                correctAnswer: 1, // Emas
                points: 15
            },
            {
                question: "Berapa kecepatan cahaya di ruang hampa?",
                options: ["300.000 km/jam", "300.000 km/s", "300.000 m/s", "3.000.000 km/s"],
                correctAnswer: 1, // 300.000 km/s
                points: 15
            }
        ]
    },

    /**
     * Kategori: Sejarah
     * Berisi pertanyaan-pertanyaan terkait peristiwa sejarah
     */
    "history": {
        // Level 1 - Tingkat kesulitan dasar (10 poin per soal)
        1: [
            {
                question: "Siapa presiden pertama Indonesia?",
                options: ["Soekarno", "Mohammad Hatta", "Soeharto", "Megawati"],
                correctAnswer: 0, // Soekarno
                points: 10
            },
            {
                question: "Kapan Indonesia merdeka?",
                options: ["17 Agustus 1945", "17 Agustus 1944", "17 Agustus 1946", "17 Agustus 1949"],
                correctAnswer: 0, // 17 Agustus 1945
                points: 10
            },
            {
                question: "Perang Dunia II berakhir pada tahun?",
                options: ["1943", "1944", "1945", "1946"],
                correctAnswer: 2, // 1945
                points: 10
            },
            {
                question: "Siapa penemu benua Amerika?",
                options: ["Ferdinand Magellan", "Christopher Columbus", "Vasco da Gama", "Marco Polo"],
                correctAnswer: 1, // Christopher Columbus
                points: 10
            },
            {
                question: "Peristiwa Rengasdengklok terjadi pada tanggal?",
                options: ["16 Agustus 1945", "17 Agustus 1945", "18 Agustus 1945", "15 Agustus 1945"],
                correctAnswer: 0, // 16 Agustus 1945
                points: 10
            }
        ]
    },

    /**
     * Kategori: Geografi
     * Berisi pertanyaan-pertanyaan terkait wilayah dan bumi
     */
    "geography": {
        // Level 1 - Tingkat kesulitan dasar (10 poin per soal)
        1: [
            {
                question: "Apa ibukota Indonesia?",
                options: ["Jakarta", "Bandung", "Surabaya", "Yogyakarta"],
                correctAnswer: 0, // Jakarta
                points: 10
            },
            {
                question: "Gunung tertinggi di dunia adalah?",
                options: ["K2", "Kilimanjaro", "Mount Everest", "Mont Blanc"],
                correctAnswer: 2, // Mount Everest
                points: 10
            },
            {
                question: "Sungai terpanjang di dunia adalah?",
                options: ["Sungai Amazon", "Sungai Nil", "Sungai Mississippi", "Sungai Yangtze"],
                correctAnswer: 1, // Sungai Nil
                points: 10
            },
            {
                question: "Negara terluas di dunia adalah?",
                options: ["China", "Amerika Serikat", "Kanada", "Rusia"],
                correctAnswer: 3, // Rusia
                points: 10
            },
            {
                question: "Benua terkecil di dunia adalah?",
                options: ["Eropa", "Australia", "Antartika", "Amerika Selatan"],
                correctAnswer: 1, // Australia
                points: 10
            }
        ]
    },

    /**
     * Kategori: Hiburan
     * Berisi pertanyaan-pertanyaan terkait film, musik, dan budaya pop
     */
    "entertainment": {
        // Level 1 - Tingkat kesulitan dasar (10 poin per soal)
        1: [
            {
                question: "Siapa pencipta lagu 'Indonesia Raya'?",
                options: ["W.R. Supratman", "Ismail Marzuki", "Kusbini", "C. Simanjuntak"],
                correctAnswer: 0, // W.R. Supratman
                points: 10
            },
            {
                question: "Film 'Avatar' disutradarai oleh?",
                options: ["Steven Spielberg", "James Cameron", "Christopher Nolan", "Peter Jackson"],
                correctAnswer: 1, // James Cameron
                points: 10
            },
            {
                question: "Novel 'Harry Potter' ditulis oleh?",
                options: ["Stephen King", "J.R.R. Tolkien", "J.K. Rowling", "George R.R. Martin"],
                correctAnswer: 2, // J.K. Rowling
                points: 10
            },
            {
                question: "Band legendaris dari Inggris yang beranggotakan John Lennon adalah?",
                options: ["The Rolling Stones", "The Beatles", "Queen", "Led Zeppelin"],
                correctAnswer: 1, // The Beatles
                points: 10
            },
            {
                question: "Siapa pemeran utama dalam film 'Iron Man'?",
                options: ["Chris Evans", "Chris Hemsworth", "Robert Downey Jr.", "Mark Ruffalo"],
                correctAnswer: 2, // Robert Downey Jr.
                points: 10
            }
        ]
    }
};