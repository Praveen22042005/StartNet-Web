const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Configure CORS - make it more flexible for contributors
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection with better error handling
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit process with failure
});

// Import routes
const authRoutes = require('./routes/auth');
const passwordRoutes = require('./routes/auth/passwordRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/auth/password', passwordRoutes);
app.use('/api/profile', require('./routes/entrepreneur/profileRoutes'));
app.use('/api/entrepreneur/startups', require('./routes/entrepreneur/my-startup-routes'));
app.use('/api/entrepreneur', require('./routes/entrepreneur/startupLogoRoutes'));
app.use('/api/investor/profile', require('./routes/investor/profileRoutes'));
app.use('/api/investor/startups', require('./routes/investor/startupRoutes'));
app.use('/api/investor/settings', require('./routes/investor/settingsRoutes'));

// API documentation route
app.get('/', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>StartNet API</title>
        <style>
            body {
                font-family: 'Montserrat', sans-serif;
                background-color: #f5f5f5;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
            }
            .container {
                background-color: white;
                padding: 2rem;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                text-align: center;
                max-width: 800px;
                width: 90%;
            }
            h1 {
                color: #000;
                margin-bottom: 1rem;
            }
            .status {
                color: #4a4a4a;
                font-size: 1.2rem;
            }
            .badge {
                background-color: #4CAF50;
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                display: inline-block;
                margin-top: 1rem;
            }
            .links {
                margin-top: 2rem;
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            .links a {
                color: #2196F3;
                text-decoration: none;
            }
            .links a:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>StartNet API</h1>
            <p class="status">Backend Service</p>
            <div class="badge">Running</div>
            <div class="links">
                <p>Visit our <a href="https://github.com/yourusername/StartNet-Web" target="_blank">GitHub repository</a> to contribute</p>
                <p>View <a href="/api-docs">API Documentation</a></p>
            </div>
        </div>
    </body>
    </html>
  `;
  
  res.send(html);
});

// Global error handler
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📚 API documentation available at: http://localhost:${PORT}/api-docs`);
});

// Handle unexpected errors
process.on('unhandledRejection', (err) => {
  console.error('Unhandled promise rejection:', err);
  // Don't exit in production, but log it properly
  if (process.env.NODE_ENV === 'development') {
    process.exit(1);
  }
});