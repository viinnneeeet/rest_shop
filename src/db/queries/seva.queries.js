const CREATE_TABLE_EVENTS = `CREATE TABLE sevas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description VARCHAR(255) NOT NULL,
  amount VARCHAR(50) NOT NULL,
  duration VARCHAR(50) NOT NULL,
  benefits JSON NOT NULL,
  category VARCHAR(50) NOT NULL,
  availability ENUM('available', 'unavailable', 'upcoming') DEFAULT 'available',
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;

const CREATE_SEVA = `
  INSERT INTO sevas (
    title, description, amount, duration, benefits, category,
    availability, isActive, createdAt, updatedAt
  )
  VALUES (
    :title, :description, :amount, :duration, :benefits, :category,
    :availability, :isActive, NOW(), NOW()
  );
`;

const UPDATE_SEVA = `
  UPDATE sevas
  SET
    title = :title,
    description = :description,
    amount = :amount,
    duration = :duration,
    benefits = :benefits,
    category = :category,
    availability = :availability,
    isActive = :isActive,
    updatedAt = NOW()
  WHERE id = :id;
`;

const DELETE_SEVA = `
  DELETE FROM sevas WHERE id = :id;
`;

const SOFT_DELETE_SEVA = `
  UPDATE sevas
  SET isActive = false, updatedAt = NOW()
  WHERE id = :id;
`;

const GET_ALL_SEVAS = `
  SELECT *
  FROM sevas
  ORDER BY createdAt DESC;
`;

const GET_ACTIVE_SEVAS = `
  SELECT *
  FROM sevas
  WHERE isActive = true
  ORDER BY createdAt DESC;
`;

const GET_SEVAS_BY_CATEGORY = `
  SELECT *
  FROM sevas
  WHERE category = :category
  ORDER BY createdAt DESC;
`;

const GET_SEVA_BY_ID = `
  SELECT *
  FROM sevas
  WHERE id = :id
  LIMIT 1;
`;

module.exports = {
  CREATE_SEVA,
  UPDATE_SEVA,
  DELETE_SEVA,
  SOFT_DELETE_SEVA,
  GET_ALL_SEVAS,
  GET_ACTIVE_SEVAS,
  GET_SEVAS_BY_CATEGORY,
  GET_SEVA_BY_ID,
};
