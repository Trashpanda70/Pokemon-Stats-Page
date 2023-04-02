create database todos;

use todos;

CREATE TABLE todolist (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  task VARCHAR(255) NOT NULL,
  comp_status VARCHAR(255) NOT NULL
);

INSERT INTO todolist (task, comp_status) VALUES
  ('make server', 'incomplete'),
  ('study', 'very incomplete');
