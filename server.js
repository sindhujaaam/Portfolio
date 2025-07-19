const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "portfolio_frontend")));

// Serve the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'portfolio_frontend', 'index.html'));
});

// POST: Handle contact form
app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ msg: 'Please fill all fields' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.MY_EMAIL,
      to: process.env.MY_EMAIL,
      subject: `📬 New Portfolio Message from ${name}`,
      text: `From: ${name} (${email})\n\nMessage:\n${message}`,
    });

    res.status(200).json({ msg: '✅ Message sent successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: '❌ Failed to send message. Try again later.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
