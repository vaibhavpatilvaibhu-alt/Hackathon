const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api', apiRoutes);

// Serve static client build if present
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));

// Root API overview if accessed directly as API
app.get('/api', (req, res) => {
  res.json({
    name: 'CampusGuardian AI API',
    tagline: 'A Safer. Smarter. More Accessible Campus.',
    version: '1.0.0',
    status: 'online',
    endpoints: [
      'POST /api/analyze - AI Issue classification & triage',
      'POST /api/chat - AI Campus Assistant with knowledge base',
      'GET  /api/reports - Fetch all reports',
      'POST /api/reports - Create new report',
      'PATCH /api/reports/:id - Admin update report status/department',
      'GET  /api/emergency - Emergency contacts & safety protocols',
      'GET  /api/accessibility - Accessible facilities & services',
      'GET  /api/health - System health & AI engine status'
    ]
  });
});

// Single Page Application catch-all route (serves index.html for frontend routes)
app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) return next();
  res.sendFile(path.join(clientDist, 'index.html'), (err) => {
    if (err) next();
  });
});

// 404 Handler for undefined API routes
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Unhandled Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🛡️  CampusGuardian AI Server running on port ${PORT}`);
  console.log(`📡 API Base: http://localhost:${PORT}/api`);
  console.log(`🤖 AI Engine: ${process.env.GEMINI_API_KEY ? 'Gemini API Enabled' : 'Local Fallback Engine Active'}`);
  console.log('====================================================');
});
