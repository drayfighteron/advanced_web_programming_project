CREATE DATABASE IF NOT EXISTS eventsync_db;
USE eventsync_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    token TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    date DATE,
    location VARCHAR(255),
    description TEXT,
    budget DECIMAL(10, 2) DEFAULT 0.00,
    event_type VARCHAR(50) DEFAULT 'Other',
    guest_count INT DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('To Do', 'Doing', 'Done') DEFAULT 'To Do',
    priority VARCHAR(50) DEFAULT 'Medium Priority',
    daily_focus BOOLEAN DEFAULT FALSE,
    assignee VARCHAR(255),
    dueDate VARCHAR(255),
    task_dates TEXT,
    cost DECIMAL(10, 2) DEFAULT 0.00,
    position INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    INDEX idx_event_status (event_id, status, position)
) ENGINE=InnoDB;
