const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');
const admin = require('firebase-admin');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://your-firebase-url.firebaseio.com'  // Replace with your Firebase URL
});

const db = admin.database();

// Endpoint for code execution
app.post('/run-code', (req, res) => {
  const { language, code } = req.body;

  let execCommand;

  // Determine execution command based on language
  if (language === 'Python') {
    execCommand = `python3 -c "${code}"`;
  } else if (language === 'JavaScript') {
    execCommand = `node -e "${code}"`;
  } else if (language === 'C') {
    execCommand = `echo "${code}" | gcc -o temp && ./temp`; // This would need further setup
  } else {
    return res.status(400).json({ error: 'Unsupported language' });
  }

  // Execute the code
  exec(execCommand, (error, stdout, stderr) => {
    if (error) {
      res.json({ error: stderr || 'Error executing code' });
    } else {
      res.json({ output: stdout });
    }
  });
});

// Endpoint to save score to Firebase
app.post('/save-score', (req, res) => {
  const { score } = req.body;

  const scoresRef = db.ref('scores');
  scoresRef.push({
    score: score,
    timestamp: Date.now()
  });

  res.json({ success: true });
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
