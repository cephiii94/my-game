import { supabase } from './supabase.js';

// Simpan progres game secara umum
export async function saveGameProgress(userId, gameType, progressData) {
  try {
    // Cek apakah data progres sudah ada
    const { data: existingProgress, error: checkError } = await supabase
      .from('game_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('game_type', gameType)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError; // Error selain 'not found'
    }

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
    const { data: existingScore, error: checkError } = await supabase
      .from('high_scores')
      .select('*')
      .eq('user_id', userId)
      .eq('game_type', gameType)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError; // Error selain 'not found'
    }

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
        return { updated: true, success: true, error: null };
      }
      return { updated: false, success: true, error: null };
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
      return { created: true, success: true, error: null };
    }
  } catch (error) {
    console.error('Error saving high score:', error.message);
    return { success: false, error };
  }
}

// Mendapatkan 10 skor tertinggi untuk sebuah game
export async function getTopScores(gameType, limit = 10) {
  try {
    const { data, error } = await supabase
      .from('high_scores')
      .select(`
        id,
        score,
        created_at,
        profiles (
          username
        )
      `)
      .eq('game_type', gameType)
      .order('score', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    return { 
      scores: data.map(item => ({
        score: item.score,
        username: item.profiles.username,
        date: new Date(item.created_at)
      })),
      error: null 
    };
  } catch (error) {
    console.error('Error getting top scores:', error.message);
    return { scores: [], error };
  }
}

// Mengambil statistik game pemain
export async function getUserStats(userId) {
  try {
    // Ambil semua high scores pemain
    const { data: scoreData, error: scoreError } = await supabase
      .from('high_scores')
      .select('game_type, score')
      .eq('user_id', userId);
      
    if (scoreError) throw scoreError;
    
    // Ambil semua progress game pemain
    const { data: progressData, error: progressError } = await supabase
      .from('game_progress')
      .select('game_type, progress_data, updated_at')
      .eq('user_id', userId);
      
    if (progressError) throw progressError;
    
    // Format statistik
    const stats = {
      totalGamesPlayed: progressData.length,
      lastPlayed: progressData.length > 0 
        ? new Date(Math.max(...progressData.map(p => new Date(p.updated_at).getTime())))
        : null,
      highScores: {},
      gameProgress: {}
    };
    
    // Format high scores
    scoreData.forEach(score => {
      stats.highScores[score.game_type] = score.score;
    });
    
    // Format progress
    progressData.forEach(progress => {
      stats.gameProgress[progress.game_type] = progress.progress_data;
    });
    
    return { stats, error: null };
  } catch (error) {
    console.error('Error getting user stats:', error.message);
    return { stats: null, error };
  }
}