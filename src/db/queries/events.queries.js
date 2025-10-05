// queries/events.queries.js
//Create Table
const CREATE_TABLE_EVENTS = `CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    title VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    time VARCHAR(50) NOT NULL,
    location VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;
// Insert new event
const INSERT_EVENT = `
  INSERT INTO events (date, title, type, time, location, description, isActive, createdAt, updatedAt, image_url, participants, status)
  VALUES (:date, :title, :type, :time, :location, :description, :isActive, NOW(), NOW(), :image_url, :participants, :status);
`;

// Select all active events
const SELECT_ALL_EVENTS = `
  SELECT * 
  FROM events 
  WHERE isActive = true
  ORDER BY date DESC;
`;

// Select event by ID
const SELECT_EVENT_BY_ID = `
  SELECT * 
  FROM events 
  WHERE id = :id;
`;

// Update event
const UPDATE_EVENT = `
  UPDATE events
  SET date = :date,
      title = :title,
      type = :type,
      time = :time,
      location = :location,
      description = :description,
      isActive = :isActive,
      image_url = :image_url,
      participants = :participants,
      status = :status,
      updatedAt = NOW()
  WHERE id = :id;
`;

// Soft delete event
const DELETE_EVENT = `
  UPDATE events
  SET isActive = false,
      updatedAt = NOW()
  WHERE id = :id;
`;

module.exports = {
  INSERT_EVENT,
  SELECT_ALL_EVENTS,
  SELECT_EVENT_BY_ID,
  UPDATE_EVENT,
  DELETE_EVENT,
};
