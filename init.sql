CREATE TABLE IF NOT EXISTS moves (
  m_name TEXT PRIMARY KEY,
  m_type TEXT NOT NULL,
  m_category TEXT NOT NULL,
  m_power INTEGER DEFAULT 0,
  m_accuracy INTEGER DEFAULT 100,
  m_pp INTEGER NOT NULL,
  m_description TEXT NOT NULL 
);

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