CREATE TABLE IF NOT EXISTS todolist (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL
);

INSERT INTO todolist (title) VALUES
  ('Software Developer'),
  ('Project Management'),
  ('DevOps Engineer');
