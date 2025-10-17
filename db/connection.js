// ===================================================
// DATABASE CONNECTION MODULE
// ===================================================
// Purpose: Create and manage connection to Supabase PostgreSQL database
// Author: Linda Miao (Group Member 2)
// Date: Oct 17, 2025

// Import the 'pg' (PostgreSQL) library for database connections
// This library lets us talk to PostgreSQL databases
const { Pool } = require('pg');

// Import dotenv to read environment variables from .env file
// This allows us to use DATABASE_URL from .env file
require('dotenv').config();

// ===================================================
// CREATE DATABASE CONNECTION POOL
// ===================================================
// A "pool" is a collection of database connections we can reuse
// instead of creating a new connection each time we need to query

const pool = new Pool({
  // connectionString: gets the database URL from .env file
  // Format: postgresql://username:password@host:port/database
  connectionString: process.env.DATABASE_URL,
  
  // ssl: required for Supabase cloud databases
  // rejectUnauthorized: false allows self-signed certificates
  // (needed for secure connection to Supabase)
  ssl: { rejectUnauthorized: false }
});

// ===================================================
// ERROR HANDLING
// ===================================================
// This code runs if an error occurs with an idle database connection
// It logs the error so we know something went wrong

pool.on('error', (err) => {
  // 'err' is the error object that contains error information
  console.error('Unexpected error on idle client', err);
  // console.error() prints the error message to the terminal
});

// ===================================================
// EXPORT THE POOL
// ===================================================
// Export the pool so other files can import and use it
// Other files will do: const pool = require('./db/connection');
// Then they can run queries using: pool.query('SELECT ...')

module.exports = pool;



// EXPLANATION FOR TEAMMATES
// module.exports = pool; 
// ```
// **Analogy:** You're telling team (other files): 
// "Here's the phone system you can use to take customer orders." 
// When Patrick needs to query the database, 
// he imports this and uses the ready-to-use connection.

// ---

// ## Simple Flow
// ```
// User wants TV show data
//    ↓
// Patrick's API route calls a query function
//    ↓
// Query function uses this connection
//    ↓
//Connection dials the Supabase database
//    ↓
//Supabase sends back the TV show data
//    ↓
//Data returns to user