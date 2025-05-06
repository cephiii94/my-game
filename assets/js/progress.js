import supabase from './supabase.js';

// Simpan progres game secara umum
export async function saveGameProgress(userId, gameType, progressData) {
  try {
    // Cek apakah data progres sudah ada
    const { data: existingProgress } = await supabase
      .from('game_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('game_type', gameType)
      .single();

    if (existingProgress) {
      // Update progres yang sudah ada
      const { error } = await supabase
        .from('game_progress')
        .update({
          progress_data: progressData,
          updated_at: new Date()
        })
        .eq('id', existingProgress.id);

      if (error) throw error;
      return { success: true, error: null };
    } else {
      // Buat data progres baru
      const { error } = await supabase
        .from('game_progress')
        .insert([
          {
            user_id: userId,
            game_type: gameType,
            progress_data: progressData,
            created_at: new Date(),
            updated_at: new Date()
          }
        ]);

      if (error) throw error;
      return { success: true, error: null };
    }
  } catch (error) {
    console.error('Error saving game progress:', error.message);
    return { success: false, error };
  }
}

// Ambil progres game
export async function getGameProgress(userId, gameType) {
  try {
    const { data, error } = await supabase
      .from('game_progress')
      .select('progress_data')
      .eq('user_id', userId)
      .eq('game_type', gameType)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found

    return { 
      progress: data?.progress_data || null,
      error: null
    };
  } catch (error) {
    console.error('Error getting game progress:', error.message);
    return { progress: null, error };
  }
}

// Simpan skor tertinggi
export async function saveHighScore(userId, gameType, score) {
  try {
    // Cek skor tertinggi yang ada
    const { data: existingScore } = await supabase
      .from('high_scores')
      .select('*')
      .eq('user_id', userId)
      .eq('game_type', gameType)
      .single();

    if (existingScore) {
      // Update jika skor baru lebih tinggi
      if (score > existingScore.score) {
        const { error } = await supabase
          .from('high_scores')
          .update({
            score: score,
            updated_at: new Date()
          })
          .eq('id', existingScore.id);

        if (error) throw error;
      }
    } else {
      // Buat entry skor baru
      const { error } = await supabase
        .from('high_scores')
        .insert([
          {
            user_id: userId,
            game_type: gameType,
            score: score,
            created_at: new Date(),
            updated_at: new Date()
          }
        ]);

      if (error) throw error;
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error saving high score:', error.message);
    return { success: false, error };
  }
}