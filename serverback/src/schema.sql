CREATE DATABASE IF NOT EXISTS user_management;

USE user_management;

CREATE TABLE `users` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `isAdmin` BOOLEAN DEFAULT false,
  `phoneNumber` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL
);

CREATE TABLE `user_pictures` (
  `user_id` INT NOT NULL,
  `image` MEDIUMBLOB
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

CREATE TABLE `base_survey` (
  `uid` INT PRIMARY KEY AUTO_INCREMENT,
  `team_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT(65535) NOT NULL,
  `category` ENUM ('Autoavaliação', 'Avaliação de líder', 'Avaliação de liderado') NOT NULL,
  `questions` JSON NOT NULL COMMENT 'Question[]: {
  Type: ''Multiple'' | ''Single'' | ''Text'', 
  Title: string,
  Category: string
  }
'
);

CREATE TABLE `survey_instance` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `uid` INT NOT NULL,
  `created` DATE NOT NULL,
  `open` BOOLEAN NOT NULL
);

CREATE TABLE `survey_answer` (
  `answer_id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `survey_id` INT NOT NULL,
  `survey_uid` INT NOT NULL,
  `created` date NOT NULL,
  `data` JSON NOT NULL,
  `target_id` INT
);

CREATE TABLE `answer_category` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL
);

ALTER TABLE `team_leader` ADD FOREIGN KEY (`team_id`) REFERENCES `team` (`id`) ON DELETE CASCADE;

ALTER TABLE `team_leader` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `user_pictures` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `team_member` ADD FOREIGN KEY (`team_id`) REFERENCES `team` (`id`) ON DELETE CASCADE;

ALTER TABLE `team_member` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `survey_instance` ADD FOREIGN KEY (`uid`) REFERENCES `base_survey` (`uid`) ON DELETE CASCADE;

ALTER TABLE `survey_answer` ADD FOREIGN KEY (`survey_id`) REFERENCES `survey_instance` (`id`) ON DELETE CASCADE;

ALTER TABLE `survey_answer` ADD FOREIGN KEY (`survey_uid`) REFERENCES `survey_instance` (`uid`) ON DELETE CASCADE;

ALTER TABLE `survey_answer` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

-- insere usuário padrão (daniel@gmail.com, 123456)
--INSERT INTO users (name, email, password, phoneNumber, isAdmin) VALUES ('daniel', 'daniel@gmail.com','$2b$10$t2USd40dO76L.tsQSOo3WO75faZlQFC.CGDJISS.LJgufLd7ru/Hm', '12912345678', 1 ) 

-- Autoavaliação:
-- Checa se em survey_answers há uma resposta com o mesmo survey_id e user_id
-- Caso não, pode ser respondido.

-- Avaliação de líder:
-- Checa se em survey_answers há uma resposta com o mesmo survey_id, user_id e data.target_id
-- Caso não, pode ser respondido.

-- Avaliação de liderado
-- Checa se em survey_answers há uma resposta com o mesmo survey_id, user_id e data.target_id
-- Caso não, pode ser respondido.

-- Título: "Avaliação de liderado $target_id$" -- TODO