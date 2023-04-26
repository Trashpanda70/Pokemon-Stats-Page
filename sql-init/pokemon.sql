CREATE TABLE IF NOT EXISTS pokemon (
  p_name TEXT PRIMARY KEY,
  p_types TEXT NOT NULL,
  p_base_stats TEXT NOT NULL,
  p_evs TEXT NOT NULL,
  p_abilities TEXT NOT NULL,
  p_hidden_abilities TEXT DEFAULT 'none',
  p_move_levels TEXT,
  p_moves TEXT,
  p_tutor_moves TEXT,
  p_egg_moves TEXT,
  p_egg_groups TEXT DEFAULT 'Undiscovered'
)