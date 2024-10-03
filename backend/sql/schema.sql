CREATE DATABASE IF NOT EXISTS user_management;

USE user_management;

CREATE TABLE `users` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `isAdmin` BOOLEAN DEFAULT false,
  `isLeader` BOOLEAN DEFAULT false,
  `password` VARCHAR(255) NOT NULL
);

CREATE TABLE `team` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL
);

CREATE TABLE `team_leader` (
  `team_id` INT NOT NULL,
  `user_id` INT NOT NULL
);

CREATE TABLE `team_member` (
  `team_id` INT NOT NULL,
  `user_id` INT NOT NULL
);

CREATE TABLE `survey` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `team_id` INT NOT NULL,
  `questions` JSON NOT NULL COMMENT 'Question[]: {
  Type: ''Multiple'' | ''Single'' | ''Text'', 
  Title: string,
  Category: string
  }
'
);

CREATE TABLE `survey_answer` (
  `answer_id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `survey_id` INT NOT NULL,
  `data` JSON NOT NULL
);

ALTER TABLE `team` ADD FOREIGN KEY (`id`) REFERENCES `team_leader` (`team_id`) ON DELETE CASCADE;

ALTER TABLE `users` ADD FOREIGN KEY (`id`) REFERENCES `team_leader` (`user_id`) ON DELETE CASCADE;

ALTER TABLE `team` ADD FOREIGN KEY (`id`) REFERENCES `team_member` (`team_id`) ON DELETE CASCADE;

ALTER TABLE `users` ADD FOREIGN KEY (`id`) REFERENCES `team_member` (`user_id`) ON DELETE CASCADE;

ALTER TABLE `survey` ADD FOREIGN KEY (`id`) REFERENCES `survey_answer` (`survey_id`) ON DELETE CASCADE;

ALTER TABLE `survey_answer` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;