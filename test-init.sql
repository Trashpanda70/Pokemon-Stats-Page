CREATE TABLE IF NOT EXISTS todolist (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL
);

INSERT INTO todolist (title) VALUES
  ('Software Developer'),
  ('Project Management'),
  ('DevOps Engineer');

  -- INSERT INTO todolist (thing1, thing2) VALUES
  -- ('Software Developer'),
  -- ('Project Management'),
  -- ('DevOps Engineer');

-- INSERT INTO table1 (column1,column2 ,..)
-- VALUES 
--    (value1,value2 ,...)