// // routes/predictionRoutes.js
// // Prediction and prediction-history endpoints.

// 'use strict'

// const express = require('express')
// const router  = express.Router()

// const {
//   predictHybrid,
//   getHistory,
//   getHistoryById,
// } = require('../controllers/PredictionController')

// const {
//   validatePredictBody,
//   validateObjectIdParam,
//   validatePagination,
// } = require('../middleware/validateRequest')

// /**
//  * POST /predict
//  * Submit two parent plants and receive a hybrid prediction.
//  *
//  * Body (one of):
//  *   { "plant1Id": "<ObjectId>", "plant2Id": "<ObjectId>" }   ← preferred
//  *   { "plantA": "Petunia axillaris", "plantB": "Petunia integrifolia" }
//  *
//  * Response:
//  * {
//  *   "success": true,
//  *   "data": {
//  *     "plantA": "Petunia axillaris",
//  *     "plantB": "Petunia integrifolia",
//  *     "predicted_hybrid": "Petunia × hybrid",
//  *     "traits": { "height": 40, "leaf_shape": "Ovate", ... },
//  *     "prediction_date": "2026-03-16",
//  *     "source": "ml_api" | "rule_based"
//  *   },
//  *   "history_id": "<ObjectId>"
//  * }
//  */
// router.post('/predict', validatePredictBody, predictHybrid)

// /**
//  * GET /history
//  * Retrieve all past predictions, newest first.
//  *
//  * Query params: limit, skip
//  */
// router.get('/history', validatePagination, getHistory)

// /**
//  * GET /history/:id
//  * Retrieve a single prediction history record by its MongoDB _id.
//  */
// router.get('/history/:id', validateObjectIdParam('id'), getHistoryById)

// module.exports = router


'use strict'

const express = require('express')
const router  = express.Router()

const {
  predictHybrid,
  getHistory,
  getHistoryById,
} = require('../controllers/PredictionController')

const {
  validatePredictBody,
  validateObjectIdParam,
  validatePagination,
} = require('../middleware/validateRequest')

// POST /api/predict
router.post('/predict', validatePredictBody, predictHybrid)

// GET /api/history
router.get('/history', validatePagination, getHistory)

// GET /api/history/:id  
router.get('/history/:id', validateObjectIdParam('id'), getHistoryById)

module.exports = router
