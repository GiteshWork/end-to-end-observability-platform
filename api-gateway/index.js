const express = require('express');
const fetch = require('node-fetch');
const client = require('prom-client'); // prom-client
const app = express();
const PORT = 3000;

const USER_SERVICE_URL = 'http://user-service:5001';

// Enable collection of default metrics
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

// Create a new Counter metric
const requestCounter = new client.Counter({
  name: 'api_gateway_requests_total',
  help: 'Total requests to the API Gateway',
});

// Create a metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.get('/gateway/user/:id', async (req, res) => {
  requestCounter.inc(); // Increment the counter
  try {
    const response = await fetch(`${USER_SERVICE_URL}/users/${req.params.id}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

app.listen(PORT, () => {
  console.log(`API Gateway listening on port ${PORT}`);
});