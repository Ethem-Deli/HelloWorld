const express = require('express');
const oracledb = require('oracledb');

const app = express();
const port = 5500;

// Oracle DB configuration
const config = {
  user: 'SYSTEM', // Replace with your Oracle username
  password: '241995270604', // Replace with your Oracle password
  connectString: 'localhost:1521/XEPDB1' // Replace with your Oracle connect string
};

// SQL Query
const query = `SELECT message FROM greetings WHERE id = 1`;

app.get('/', async (req, res) => {
  let connection;

  try {
    console.log('Connecting to Oracle Database...');
    connection = await oracledb.getConnection(config);
    console.log('Connected to Oracle Database');

    // Execute the query
    const result = await connection.execute(query);
    console.log('Query result:', result.rows);

    // Send the first result's message to the client
    if (result.rows.length > 0) {
      res.send(result.rows[0][0]);
    } else {
      res.send('No message found');
    }
  } catch (err) {
    console.error('Error connecting to Oracle DB:', err);
    res.status(500).send('Error fetching message from database');
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error('Error closing Oracle DB connection:', closeErr);
      }
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
