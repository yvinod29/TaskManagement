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
// Connect to the PostgreSQL database
client.connect()
  .then(() => {
    console.log("Connected to database");
  })
  .catch(error => {
    console.error("Error connecting to database:", error);
  });

module.exports = client;

 
