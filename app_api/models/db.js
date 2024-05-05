require('dotenv').config(); 
const { Client } = require("pg");
 
// Create a new PostgreSQL client instance
const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

// Connect to the PostgreSQL database
client.connect()
  .then(() => {
    console.log("Connected to database");
    // Define the schema by executing SQL statements
    const createSchemaQuery = `
      CREATE SCHEMA IF NOT EXISTS task_management;
      CREATE TABLE IF NOT EXISTS task_management.users (
        user_id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
      CREATE TABLE IF NOT EXISTS task_management.tasks (
        task_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES task_management.users(user_id),
        task_name VARCHAR(255) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL
      );
    `;
    return client.query(createSchemaQuery);
  })
  .then(() => {
    console.log("Schema created successfully");
    // Close the connection
   })
  .catch(error => {
    console.error("Error creating schema:", error);
    // Close the connection in case of error
    client.end();
  });

module.exports = client;
