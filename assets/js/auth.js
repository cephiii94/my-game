import supabase from './supabase.js';

// Fungsi untuk registrasi user baru
export async function registerUser(email, password, username) {
  try {
    // Register user menggunakan email dan password
    const { user, error } = await supabase.auth.signUp({
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
            created_at: new Date(),
          },
        ]);

      if (profileError) throw profileError;
    }

    return { user, error: null };
  } catch (error) {
    console.error('Error registering user:', error.message);
    return { user: null, error };
  }
}

// Fungsi untuk login user
export async function loginUser(email, password) {
  try {
    const { user, error } = await supabase.auth.signInWithPassword({
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