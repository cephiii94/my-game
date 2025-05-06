// Konfigurasi koneksi Supabase
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// Fungsi untuk memeriksa status otentikasi
async function checkAuth() {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Error checking auth:', error);
    return null;
  }
  
  return user;
}

// Export supabase client dan helper functions
export { supabase, checkAuth };
export default supabase;

/* 
CATATAN:
- Untuk implementasi produksi, disarankan untuk menggunakan environment variable untuk menyimpan kredensial Supabase
- Jangan simpan kunci API langsung di dalam kode
- Ganti 'YOUR_SUPABASE_URL' dan 'YOUR_SUPABASE_ANON_KEY' dengan kredensial sebenarnya dari dashboard Supabase
*/