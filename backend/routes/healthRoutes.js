// // routes/healthRoutes.js
// // Simple health-check endpoint — useful for deployment monitors and Docker
// // health checks. Does not require auth.

// 'use strict'

// const express   = require('express')
// const router    = express.Router()
// const mongoose  = require('mongoose')
// const MLService = require('../services/MLService')

// /**
//  * GET /health
//  * Returns overall system health.
//  *
//  * Response:
//  * {
//  *   "status": "ok",
//  *   "timestamp": "2026-03-16T10:00:00.000Z",
//  *   "uptime": 3600,
//  *   "services": {
//  *     "database": "connected",
//  *     "ml_api":   "ok" | "unreachable"
//  *   }
//  * }
//  */
// router.get('/', async (req, res) => {
//   const dbState = mongoose.connection.readyState
//   const dbStatus = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' }[dbState] || 'unknown'

//   // ML health is optional — don't fail the whole check if ML is down
//   let mlStatus = 'unknown'
//   try {
//     const ml = await MLService.healthCheck()
//     mlStatus = ml.status
//   } catch {
//     mlStatus = 'unreachable'
//   }

//   const allOk = dbState === 1

//   res.status(allOk ? 200 : 503).json({
//     status:    allOk ? 'ok' : 'degraded',
//     timestamp: new Date().toISOString(),
//     uptime_s:  Math.floor(process.uptime()),
//     node_env:  process.env.NODE_ENV || 'development',
//     services: {
//       database: dbStatus,
//       ml_api:   mlStatus,
//     },
//   })
// })

// module.exports = router





















// routes/healthRoutes.js
'use strict'

const express   = require('express')
const router    = express.Router()
const mongoose  = require('mongoose')
const MLService = require('../services/MLService')

/**
 * GET /health
 * Returns system health including ML API status.
 */
router.get('/', async (req, res) => {
  const dbState  = mongoose.connection.readyState
  const dbStatus = { 0:'disconnected', 1:'connected', 2:'connecting', 3:'disconnecting' }[dbState] || 'unknown'

  const ml = await MLService.healthCheck()

  const allOk = dbState === 1 && ml.status !== 'unreachable'

  res.status(allOk ? 200 : 503).json({
    status:       allOk ? 'ok' : 'degraded',
    timestamp:    new Date().toISOString(),
    uptime_s:     Math.floor(process.uptime()),
    node_env:     process.env.NODE_ENV || 'development',
    prediction_mode: 'ml_only',
    services: {
      database:       dbStatus,
      ml_api:         ml.status,
      ml_trained:     ml.models_trained,
      ml_url:         ml.url,
    },
  })
})

module.exports = router
