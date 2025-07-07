# TD Game Project

This project is a Tower Defense game where players can place different types of towers to defend against waves of enemies. The game features various units, enemies, and maps, along with sound effects and background music.

## Project Structure

- **assets/**: Contains all game assets including images and audio files.
  - **assets/maps/**: Background map images.
    - `grass_map.png`: Image for the grass map.
    - `snow_map.png`: Image for the snow map.
  - **assets/units/**: Images for different tower units.
    - `tower_lv1.png`: Image for level 1 Tower.
    - `tower_lv2.png`: Image for level 2 Tower.
    - `tank_lv1.png`: Image for level 1 Tank.
    - `mortar_lv1.png`: Image for level 1 Mortar.
  - **assets/enemies/**: Images for different types of enemies.
    - `goblin.png`: Image for Goblin enemy.
    - `orc.png`: Image for Orc enemy.
  - **assets/ui/**: Images for UI elements.
    - `button_bg.png`: Image for button background.
    - `popup_bg.png`: Image for pop-up background.
  - **assets/audio/**: Audio files for sound effects and background music.
    - `shoot.mp3`: Audio file for shooting sound.
    - `enemy_death.mp3`: Audio file for enemy death sound.

- **css/**: Contains styles for the game.
  - `style.css`: The main CSS styles for the entire game.

- **js/**: Contains all JavaScript files for game logic.
  - `main.js`: The main game logic (initialization, game loop, main UI).
  - `config.js`: Game configuration (HP, EXP, unit/enemy data).
  - `game.js`: The main Game class/object (manages game state, levels, etc.).
  - `ui.js`: Logic for UI interactions (pop-ups, updating EXP/HP bars).
  - `enemy.js`: Class/functions for Enemy (movement, HP, etc.).
  - `tower.js`: Base class/functions for Tower.
  - **units/**: Specific unit definitions.
    - `basicTower.js`: Specific implementation for Basic Tower.
    - `tankUnit.js`: Specific implementation for Tank Unit.
    - `mortarUnit.js`: Specific implementation for Mortar Unit.
  - `utils.js`: General helper functions (e.g., calculate distance).

- `index.html`: The main page of the game.

## How to Play

1. Open `index.html` in a web browser.
2. Use the UI to place towers and defend against incoming enemies.
3. Upgrade towers and manage resources to progress through levels.

## Future Improvements

- Add more enemy types and tower upgrades.
- Implement a scoring system and leaderboards.
- Enhance graphics and animations for a better user experience.