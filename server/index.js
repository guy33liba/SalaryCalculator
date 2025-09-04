const express = require('express');
const cors = require('cors'); // Import cors
const app = express();
const port = 3001; // Using a different port than Vite's default

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // For parsing application/json

app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
