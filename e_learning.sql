-- 1. Tabel users
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'pengajar', 'siswa') NOT NULL DEFAULT 'siswa',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel courses
CREATE TABLE courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  teacher_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Tabel modules
CREATE TABLE modules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  `order` INT DEFAULT 0,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 4. Tabel materials
CREATE TABLE materials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  module_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  content TEXT,
  video_url VARCHAR(255),
  FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);

-- 5. Tabel quizzes
CREATE TABLE quizzes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  module_id INT NOT NULL,
  question TEXT NOT NULL,
  option_a VARCHAR(255),
  option_b VARCHAR(255),
  option_c VARCHAR(255),
  option_d VARCHAR(255),
  correct_answer ENUM('A', 'B', 'C', 'D') NOT NULL,
  FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);

-- 6. Tabel enrollments
CREATE TABLE enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE (user_id, course_id)
);

-- 7. Tabel progress
CREATE TABLE progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  material_id INT NOT NULL,
  status ENUM('belum', 'selesai') DEFAULT 'belum',
  completed_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE,
  UNIQUE (user_id, material_id)
);

-- 8. Tabel quiz_results
CREATE TABLE quiz_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  quiz_id INT NOT NULL,
  selected_answer ENUM('A', 'B', 'C', 'D') NOT NULL,
  is_correct BOOLEAN,
  answered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);
