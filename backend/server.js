// server.js
// ─────────────────────────────────────────────────────────────────────────────
// Intelligent Hybrid Plant Prediction System — Express server entry point
// Architecture: Routes → Controllers → Services → Models
// ─────────────────────────────────────────────────────────────────────────────

'use strict'

// ── 1. Load environment variables first (before any other import uses them) ──
require('dotenv').config()

const express        = require('express')
const cors           = require('cors')
const connectDB      = require('./config/db')
const requestLogger  = require('./middleware/requestLogger')
const notFound       = require('./middleware/notFound')
const errorHandler   = require('./middleware/errorHandler')

// ── Route modules ─────────────────────────────────────────────────────────────
const plantRoutes      = require('./routes/plantRoutes')
const predictionRoutes = require('./routes/predictionRoutes')
const healthRoutes     = require('./routes/healthRoutes')
const imageProxyRoute  = require('./routes/imageProxyRoute')

// ── 2. Create Express app ─────────────────────────────────────────────────────
const app = express()

// ── 3. CORS configuration ─────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:5173')
  .split(',')
  .map((o) => o.trim())

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, curl)
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true)
      }
      callback(new Error(`CORS: Origin "${origin}" is not allowed`))
    },
    methods:     ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  })
)

// ── 4. Body parsers ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

// ── 5. HTTP request logging ───────────────────────────────────────────────────
app.use(requestLogger)

// ── 6. API Routes ─────────────────────────────────────────────────────────────
const API_PREFIX = '/api'

app.use('/health',              healthRoutes)           // GET  /health
app.use(`${API_PREFIX}/plants`, plantRoutes)            // GET  /api/plants
                                                        // GET  /api/plants/:name
// app.use(`${API_PREFIX}/predict`, predictionRoutes)
app.use(`${API_PREFIX}`,        predictionRoutes)       // POST /api/predict
                                                        // GET  /api/history
                                                        // GET  /api/history/:id
                                                        
app.use(`${API_PREFIX}`,        imageProxyRoute) 

// Root endpoint — quick API info
app.get('/', (req, res) => {
  res.json({
    name:        'Hybrid Plant Prediction System API',
    version:     '1.0.0',
    status:      'running',
    docs: {
      plants:     `GET  ${API_PREFIX}/plants`,
      plant:      `GET  ${API_PREFIX}/plants/:name`,
      predict:    `POST ${API_PREFIX}/predict`,
      history:    `GET  ${API_PREFIX}/history`,
      historyById:`GET  ${API_PREFIX}/history/:id`,
      health:     'GET  /health',
    },
  })
})

// ── 7. 404 handler (must come after all routes) ───────────────────────────────
app.use(notFound)

// ── 8. Global error handler (must be LAST, 4-param signature required) ───────
app.use(errorHandler)
 
// ── 9. ML Keep-Alive Pinger ───────────────────────────────────────────────────
const ML_API_URL    = process.env.ML_API_URL || 'http://localhost:8000'
const PING_INTERVAL = 10 * 60 * 1000   // 10 minutes in milliseconds
 
function startMLKeepAlive() {
  // Only run in production (i.e. when actually deployed on Render)
  if (process.env.NODE_ENV !== 'production') {
    console.log('ℹ️  ML keep-alive pinger is OFF in development mode')
    return
  }
 
  console.log(`🏓  ML keep-alive pinger started — pinging ${ML_API_URL}/health every 10 min`)
 
  setInterval(async () => {
    try {
      const { data } = await axios.get(`${ML_API_URL}/health`, { timeout: 10000 })
      console.log(`🏓  ML ping OK — status: ${data.status}, models_trained: ${data.models_trained}`)
    } catch (err) {
      // Non-fatal: just log. The ML service may be cold-starting; next ping will confirm.
      console.warn(`⚠️  ML ping failed (will retry in 10 min): ${err.message}`)
    }
  }, PING_INTERVAL)
}

// ── 10. Connect DB and start server ───────────────────────────────────────────
const PORT = parseInt(process.env.PORT || '5000', 10)

const startServer = async () => {
  await connectDB()

  const server = app.listen(PORT, () => {
    console.log('')
    console.log('🌿  ─────────────────────────────────────────────')
    console.log(`🚀  Hybrid Plant API running on port ${PORT}`)
    console.log(`🌍  Environment : ${process.env.NODE_ENV || 'development'}`)
    console.log(`📡  Base URL    : http://localhost:${PORT}${API_PREFIX}`)
    console.log(`🤖  ML API      : ${process.env.ML_API_URL || 'http://localhost:8000'}`)
    console.log('🌿  ─────────────────────────────────────────────')
    console.log('')

    startMLKeepAlive()
    
  })

  // Handle unhandled promise rejections (outside Express middleware chain)
  process.on('unhandledRejection', (err) => {
    console.error('🔥  Unhandled Promise Rejection:', err.message)
    server.close(() => process.exit(1))
  })

  process.on('uncaughtException', (err) => {
    console.error('🔥  Uncaught Exception:', err.message)
    process.exit(1)
  })

  return server
}

startServer()

// Export app for testing
module.exports = app
