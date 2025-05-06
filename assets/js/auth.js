import { supabase } from './supabase.js';

// Fungsi untuk registrasi user baru (hanya dengan username)
export async function registerUserWithUsername(username) {
  try {
    // Cek apakah username sudah digunakan
    const { data: existingUser, error: checkError } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single();

    if (existingUser) {
      return { user: null, error: { message: 'Username sudah digunakan' } };
    }

    // Buat UUID untuk user baru
    const userId = self.crypto.randomUUID();

    // Tambahkan data user ke tabel profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: userId,
          username,
          created_at: new Date()
        }
      ]);

    if (profileError) throw profileError;

    // Set user ID ke session storage untuk tracking
    sessionStorage.setItem('gameUserId', userId);
    sessionStorage.setItem('gameUsername', username);

    return { 
      user: { id: userId, username }, 
      error: null 
    };
  } catch (error) {
    console.error('Error registering user:', error.message);
    return { user: null, error };
  }
}

// Fungsi untuk login user dengan username
export async function loginWithUsername(username) {
  try {
    // Cari user berdasarkan username
    const { data: user, error } = await supabase
      .from('profiles')
      .select('id, username')
      .eq('username', username)
      .single();

    if (error) throw error;
    
    if (!user) {
      return { user: null, error: { message: 'Username tidak ditemukan' } };
    }

    // Set user ID ke session storage untuk tracking
    sessionStorage.setItem('gameUserId', user.id);
    sessionStorage.setItem('gameUsername', user.username);

    return { user, error: null };
  } catch (error) {
    console.error('Error logging in:', error.message);
    return { user: null, error };
  }
}

/* 
CATATAN PENTING:
- Sistem login dengan hanya username TIDAK AMAN untuk produksi
- Untuk sistem yang lebih aman, gunakan email dan password seperti di bawah ini
*/

// Fungsi untuk registrasi user baru dengan email dan password (REKOMENDASI)
export async function registerUser(email, password, username) {
  try {
    // Register user menggunakan email dan password
    const { data: { user }, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    // Jika registrasi berhasil, tambahkan data user ke tabel profiles
    if (user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id,
            username,
            created_at: new Date()
          }
        ]);

      if (profileError) throw profileError;
    }

    return { user, error: null };
  } catch (error) {
    console.error('Error registering user:', error.message);
    return { user: null, error };
  }
}

// Fungsi untuk login user dengan email dan password (REKOMENDASI)
export async function loginUser(email, password) {
  try {
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { user, error: null };
  } catch (error) {
    console.error('Error logging in:', error.message);
    return { user: null, error };
  }
}

// Fungsi untuk logout user
export async function logoutUser() {
  try {
    // Untuk login dengan username saja
    sessionStorage.removeItem('gameUserId');
    sessionStorage.removeItem('gameUsername');
    
    // Untuk login dengan Supabase Auth
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Redirect ke halaman login setelah logout
    window.location.href = '/login.html';
  } catch (error) {
    console.error('Error logging out:', error.message);
  }
}

// Fungsi untuk memeriksa status login
export async function checkAuthStatus() {
  try {
    // Cek apakah ada user ID di session storage (untuk login username)
    const userId = sessionStorage.getItem('gameUserId');
    if (userId) {
      const username = sessionStorage.getItem('gameUsername');
      return { id: userId, username };
    }
    
    // Cek dengan Supabase Auth (untuk login email/password)
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error checking auth status:', error.message);
    return null;
  }
}

// Pelindung halaman - redirect jika belum login
export async function protectPage() {
  const user = await checkAuthStatus();
  if (!user) {
    window.location.href = '/login.html';
  }
  return user;
}