// queries/gallery.queries.js
//Create Table
const CREATE_TABLE_GALLERY = `CREATE TABLE gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  src VARCHAR(255) NOT NULL,
  title VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description VARCHAR(255),
  isActive BOOLEAN NOT NULL DEFAULT true,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

// Insert new gallery item
const INSERT_GALLERY = `
  INSERT INTO gallery (src, title, category, description, isActive, createdAt, updatedAt)
  VALUES (:image_url, :title, :category, :description, :isActive, NOW(), NOW());
`;

// Select all active gallery items
const SELECT_ALL_GALLERY = `
  SELECT * 
  FROM gallery 
  WHERE isActive = true
  ORDER BY createdAt DESC;
`;

// Select gallery by ID
const SELECT_GALLERY_BY_ID = `
  SELECT * 
  FROM gallery 
  WHERE id = :id;
`;

// Update gallery item
const UPDATE_GALLERY = `
  UPDATE gallery
  SET title = :title,
      category = :category,
      description = :description,
      isActive = :isActive,
      updatedAt = NOW()
      image_url = :image_url
  WHERE id = :id;
`;

// Soft delete gallery (deactivate)
const DELETE_GALLERY = `
  UPDATE gallery
  SET isActive = false,
      updatedAt = NOW()
  WHERE id = :id;
`;

module.exports = {
  INSERT_GALLERY,
  SELECT_ALL_GALLERY,
  SELECT_GALLERY_BY_ID,
  UPDATE_GALLERY,
  DELETE_GALLERY,
};
