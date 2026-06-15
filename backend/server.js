const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const fs = require('fs');

// Read the securely injected password file
const dbPassword = fs.readFileSync('/mnt/secrets/db-password.txt', 'utf8').trim();

const pool = new Pool({
  host: process.env.DB_HOST || 'postgres-service',
  user: process.env.DB_USER || 'postgres',
  password: dbPassword, 
  database: process.env.DB_NAME || 'mytierdb',
  port: 5432,
});
// Auto-Initialize Database Schema on startup
async function initializeDatabase() {
  try {
    // 1. Test the connection
    const res = await pool.query('SELECT NOW()');
    console.log('System: Successfully connected to PostgreSQL at:', res.rows[0].now);

    // 2. Create the table safely using "IF NOT EXISTS"
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS sample_items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );
    `;
    await pool.query(createTableQuery);
    console.log('System: Table "sample_items" verified.');

    // 3. Optional: Seed data if the table is completely empty
    const countResult = await pool.query('SELECT COUNT(*) FROM sample_items');
    if (parseInt(countResult.rows[0].count) === 0) {
      console.log('System: Table is empty. Injecting seed data...');
      await pool.query(`INSERT INTO sample_items (name) VALUES ('Auto-Seeded Cloud Node 1'), ('Auto-Seeded Cloud Node 2')`);
      console.log('System: Seed data injected successfully.');
    }
  } catch (err) {
    console.error('System: FATAL error during database initialization:', err.stack);
    // Exit the process if the DB fails, letting Kubernetes restart the pod
    process.exit(1); 
  }
}

// Run the initialization
initializeDatabase();

// API Endpoint to fetch data from the database
app.get('/api/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sample_items ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API Endpoint to add data to the database
app.post('/api/data', async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO sample_items (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Backend service listening on port ${port}`);
});