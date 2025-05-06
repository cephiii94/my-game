import supabase from './supabase.js';

// Fungsi untuk mengambil semua achievement yang tersedia
export async function getAvailableAchievements(gameType) {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('game_type', gameType);

    if (error) throw error;
    return { achievements: data || [], error: null };
  } catch (error) {
    console.error('Error getting achievements:', error.message);
    return { achievements: [], error };
  }
}

// Fungsi untuk mengambil achievement yang sudah diraih user
export async function getUserAchievements(userId, gameType = null) {
  try {
    let query = supabase
      .from('user_achievements')
      .select(`
        id,
        achieved_at,
        achievements (
          id,
          name,
          description,
          icon,
          game_type
        )
      `)
      .eq('user_id', userId);
    
    // Filter berdasarkan game type jika disediakan
    if (gameType) {
      query = query.eq('achievements.game_type', gameType);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return { userAchievements: data || [], error: null };
  } catch (error) {
    console.error('Error getting user achievements:', error.message);
    return { userAchievements: [], error };
  }
}

// Fungsi untuk mengecek dan memberikan achievement ke user
export async function checkAndUnlockAchievement(userId, achievementId) {
  try {
    // Cek apakah user sudah memiliki achievement ini
    const { data: existingAchievement } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId)
      .eq('achievement_id', achievementId)
      .single();

    // Jika belum ada, berikan achievement baru
    if (!existingAchievement) {
      const { error } = await supabase
        .from('user_achievements')
        .insert([
          {
            user_id: userId,
            achievement_id: achievementId,
            achieved_at: new Date()
          }
        ]);

      if (error) throw error;
      
      // Ambil detail achievement untuk notifikasi
      const { data: achievementDetails } = await supabase
        .from('achievements')
        .select('name, description, icon')
        .eq('id', achievementId)
        .single();
        
      return { 
        unlocked: true, 
        achievement: achievementDetails,
        error: null 
      };
    }

    return { unlocked: false, achievement: null, error: null };
  } catch (error) {
    console.error('Error unlocking achievement:', error.message);
    return { unlocked: false, achievement: null, error };
  }
}

// Fungsi untuk memeriksa achievement berdasarkan kriteria
export async function checkAchievements(userId, gameType, gameData) {
  try {
    // Ambil semua achievement untuk game type ini
    const { achievements } = await getAvailableAchievements(gameType);
    const newlyUnlocked = [];
    
    // Contoh logika untuk Clicker Game
    if (gameType === 'clicker') {
      // Achievement untuk jumlah klik
      const clickAchievements = achievements.filter(a => a.criteria_type === 'clicks');
      for (const achievement of clickAchievements) {
        if (gameData.totalClicks >= achievement.criteria_value) {
          const { unlocked, achievement: unlockedAchievement } = 
            await checkAndUnlockAchievement(userId, achievement.id);
          
          if (unlocked && unlockedAchievement) {
            newlyUnlocked.push(unlockedAchievement);
          }
        }
      }
      
      // Achievement untuk level
      const levelAchievements = achievements.filter(a => a.criteria_type === 'level');
      for (const achievement of levelAchievements) {
        if (gameData.level >= achievement.criteria_value) {
          const { unlocked, achievement: unlockedAchievement } = 
            await checkAndUnlockAchievement(userId, achievement.id);
          
          if (unlocked && unlockedAchievement) {
            newlyUnlocked.push(unlockedAchievement);
          }
        }
      }
    } 
    // Contoh logika untuk Quiz Game
    else if (gameType === 'quiz') {
      // Achievement untuk skor quiz
      const scoreAchievements = achievements.filter(a => a.criteria_type === 'quiz_score');
      for (const achievement of scoreAchievements) {
        if (gameData.score >= achievement.criteria_value) {
          const { unlocked, achievement: unlockedAchievement } = 
            await checkAndUnlockAchievement(userId, achievement.id);
          
          if (unlocked && unlockedAchievement) {
            newlyUnlocked.push(unlockedAchievement);
          }
        }
      }
      
      // Achievement untuk quizzes completed
      const completedAchievements = achievements.filter(a => a.criteria_type === 'quizzes_completed');
      for (const achievement of completedAchievements) {
        if (gameData.quizzesCompleted >= achievement.criteria_value) {
          const { unlocked, achievement: unlockedAchievement } = 
            await checkAndUnlockAchievement(userId, achievement.id);
          
          if (unlocked && unlockedAchievement) {
            newlyUnlocked.push(unlockedAchievement);
          }
        }
      }
    }
    
    return { 
      unlockedAchievements: newlyUnlocked,
      error: null 
    };
  } catch (error) {
    console.error('Error checking achievements:', error.message);
    return { unlockedAchievements: [], error };
  }
}