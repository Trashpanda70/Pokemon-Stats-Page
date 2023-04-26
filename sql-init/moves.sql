CREATE TABLE IF NOT EXISTS moves (
  m_name TEXT PRIMARY KEY,
  m_type TEXT NOT NULL,
  m_category TEXT NOT NULL,
  m_power INTEGER DEFAULT 0,
  m_accuracy INTEGER DEFAULT 100,
  m_pp INTEGER NOT NULL,
  m_description TEXT NOT NULL 
);