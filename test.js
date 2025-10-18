const pool = require('./src/db/connection');

console.log('Testing database connection...');

pool.query('SELECT * FROM tv_shows LIMIT 1')
  .then(result => {
    console.log('✅ Connection works!');
    console.log('First show:', result.rows[0]);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  });