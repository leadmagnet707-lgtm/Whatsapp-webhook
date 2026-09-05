const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Your webhook verification token (create any random string)
const WEBHOOK_VERIFY_TOKEN = "your_random_token_123";

app.use(express.json());

// This endpoint is for verifying the webhook with Meta
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  // Verify the token matches
  if (mode === 'subscribe' && token === WEBHOOK_VERIFY_TOKEN) {
    console.log('✅ Webhook verified!');
    res.status(200).send(challenge);
  } else {
    console.log('❌ Webhook verification failed');
    res.sendStatus(403);
  }
});

// This endpoint receives messages from WhatsApp
app.post('/webhook', (req, res) => {
  const body = req.body;

  if (body.object) {
    if (
      body.entry &&
      body.entry[0].changes &&
      body.entry[0].changes[0].value.messages
    ) {
      const message = body.entry[0].changes[0].value.messages[0];
      console.log('📱 New message received:', message);
      // HERE: Add your message handling logic
      // For now, just log it
    }
    res.status(200).send('MESSAGE_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.send('✅ WhatsApp Webhook is running!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
