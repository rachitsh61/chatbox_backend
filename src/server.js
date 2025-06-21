// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

// ================== CONFIG ===================
const ALLOWED_ORIGIN = 'https://pureviahealth.blogspot.com/'; // <-- YOUR BLOG URL
const AUTH_TOKEN = process.env.AUTH_TOKEN; // <-- Set this in .env
// ============================================

// Enable CORS for your specific domain
app.use(
  cors({
    origin: ALLOWED_ORIGIN,
  })
);

app.use(express.json());

// Authorization check
app.use((req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${AUTH_TOKEN}`) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
});

app.post('/chat', async (req, res) => {
  const messages = req.body.messages;

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-R1-0528',
      {
        inputs: messages[messages.length - 1].content,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json(response.data); // return full response
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});

