// // // controllers/PredictionController.js
// // // Orchestrates the full hybrid-prediction pipeline:
// // //   1. Validate input
// // //   2. Fetch parent plant data from MongoDB
// // //   3. Call ML API (or fall back to rule-based)
// // //   4. Store prediction in history
// // //   5. Return structured JSON response

// // 'use strict'

// // const PlantService    = require('../services/PlantService')
// // const MLService       = require('../services/MLService')
// // const HistoryService  = require('../services/HistoryService')
// // const asyncHandler    = require('../utils/asyncHandler')
// // const AppError        = require('../utils/AppError')
// // const { buildPredictionResponse, formatHistory } = require('../utils/dataTransform')

// // /**
// //  * POST /predict
// //  *
// //  * Accepts one of:
// //  *   { plant1Id, plant2Id }       — MongoDB ObjectIds  (preferred from frontend)
// //  *   { plantA, plantB }           — scientific names   (alternative)
// //  *   { plant1Name, plant2Name }   — scientific names   (alternative)
// //  *
// //  * Response:
// //  * {
// //  *   success: true,
// //  *   data: {
// //  *     plantA, plantB, predicted_hybrid, traits, prediction_date, source
// //  *   },
// //  *   history_id: "<MongoDB _id>"
// //  * }
// //  */
// // const predictHybrid = asyncHandler(async (req, res) => {
// //   const body = req.body

// //   // ── 1. Parse input ──────────────────────────────────────────────────────────
// //   const idA   = body.plant1Id || body.plantAId
// //   const idB   = body.plant2Id || body.plantBId
// //   const nameA = body.plantA   || body.plant1Name || body.plantAName
// //   const nameB = body.plantB   || body.plant2Name || body.plantBName

// //   if (!idA && !nameA) {
// //     throw new AppError(
// //       'Provide plant1Id + plant2Id (ObjectIds) or plantA + plantB (names)',
// //       400,
// //       'MISSING_PLANTS'
// //     )
// //   }

// //   // ── 2. Fetch parent plant documents ─────────────────────────────────────────
// //   let plantA, plantB

// //   if (idA && idB) {
// //     ;({ plantA, plantB } = await PlantService.getPairById(idA, idB))
// //   } else if (idA || idB) {
// //     // Mixed input — one Id, one name — resolve each independently
// //     plantA = idA ? await PlantService.getById(idA)   : await PlantService.getByName(nameA)
// //     plantB = idB ? await PlantService.getById(idB)   : await PlantService.getByName(nameB)
// //     if (plantA._id.toString() === plantB._id.toString()) {
// //       throw new AppError('Both plants must be different to predict a hybrid', 400, 'SAME_PLANT')
// //     }
// //   } else {
// //     if (!nameB) {
// //       throw new AppError('Provide both plantA and plantB names', 400, 'MISSING_PLANTS')
// //     }
// //     ;({ plantA, plantB } = await PlantService.getPairByName(nameA, nameB))
// //   }

// //   // ── 3. Invoke ML service ────────────────────────────────────────────────────
// //   const { traits, hybridName, source } = await MLService.predict(plantA, plantB)

// //   // ── 4. Persist to history ───────────────────────────────────────────────────
// //   const historyRecord = await HistoryService.save({ plantA, plantB, traits, hybridName, source })

// //   // ── 5. Build and return response ────────────────────────────────────────────
// //   const responseData = buildPredictionResponse({
// //     plantA:    plantA.plant_name,
// //     plantB:    plantB.plant_name,
// //     traits,
// //     hybridName,
// //     source,
// //   })

// //   res.status(200).json({
// //     success:    true,
// //     data:       responseData,
// //     history_id: historyRecord._id,
// //   })
// // })

// // /**
// //  * GET /history
// //  * Query params: limit, skip
// //  *
// //  * Response: { success, count, total, data: PredictionHistory[] }
// //  */
// // const getHistory = asyncHandler(async (req, res) => {
// //   const { limit, skip } = req.query
// //   const { records, total } = await HistoryService.getAll({ limit, skip })

// //   res.status(200).json({
// //     success: true,
// //     count:   records.length,
// //     total,
// //     data:    records.map(formatHistory),
// //   })
// // })

// // /**
// //  * GET /history/:id
// //  *
// //  * Response: { success, data: PredictionHistory }
// //  */
// // const getHistoryById = asyncHandler(async (req, res) => {
// //   const record = await HistoryService.getById(req.params.id)

// //   res.status(200).json({
// //     success: true,
// //     data:    formatHistory(record),
// //   })
// // })

// // module.exports = { predictHybrid, getHistory, getHistoryById }





















// // controllers/PredictionController.js
// // ML-ONLY prediction pipeline:
// //   1. Validate input
// //   2. Fetch parent plant data from MongoDB
// //   3. Call ML API (throws clean error if unavailable — no fallback)
// //   4. Store result in history
// //   5. Return structured JSON

// 'use strict'

// const PlantService   = require('../services/PlantService')
// const MLService      = require('../services/MLService')
// const HistoryService = require('../services/HistoryService')
// const asyncHandler   = require('../utils/asyncHandler')
// const AppError       = require('../utils/AppError')
// const { buildPredictionResponse, formatHistory } = require('../utils/dataTransform')

// /**
//  * POST /api/predict
//  *
//  * Body (one of):
//  *   { plant1Id, plant2Id }   — MongoDB ObjectIds  (used by React frontend)
//  *   { plantA,   plantB   }   — scientific name strings
//  */
// const predictHybrid = asyncHandler(async (req, res) => {
//   const body = req.body

//   // ── 1. Resolve plant identifiers from request body ─────────────────────────
//   const idA   = body.plant1Id || body.plantAId
//   const idB   = body.plant2Id || body.plantBId
//   const nameA = body.plantA   || body.plant1Name || body.plantAName
//   const nameB = body.plantB   || body.plant2Name || body.plantBName

//   if (!idA && !nameA) {
//     throw new AppError(
//       'Provide plant1Id + plant2Id (ObjectIds) or plantA + plantB (names)',
//       400,
//       'MISSING_PLANTS'
//     )
//   }

//   // ── 2. Fetch both plant documents from MongoDB ─────────────────────────────
//   let plantA, plantB

//   if (idA && idB) {
//     ;({ plantA, plantB } = await PlantService.getPairById(idA, idB))
//   } else if (idA || idB) {
//     plantA = idA ? await PlantService.getById(idA)    : await PlantService.getByName(nameA)
//     plantB = idB ? await PlantService.getById(idB)    : await PlantService.getByName(nameB)
//     if (plantA._id.toString() === plantB._id.toString()) {
//       throw new AppError('Both plants must be different', 400, 'SAME_PLANT')
//     }
//   } else {
//     if (!nameB) {
//       throw new AppError('Provide both plantA and plantB names', 400, 'MISSING_PLANTS')
//     }
//     ;({ plantA, plantB } = await PlantService.getPairByName(nameA, nameB))
//   }

//   // ── 3. Call ML API — throws AppError if unavailable ───────────────────────
//   // No fallback. If ML is down the error propagates to the global handler
//   // which sends a clean JSON error response to the frontend.
//   const { traits, hybridName, source, confidence } = await MLService.predict(plantA, plantB)

//   // ── 4. Persist prediction to MongoDB history ───────────────────────────────
//   const historyRecord = await HistoryService.save({
//     plantA, plantB, traits, hybridName, source,
//   })

//   // ── 5. Send response ───────────────────────────────────────────────────────
//   const responseData = buildPredictionResponse({
//     plantA:    plantA.plant_name,
//     plantB:    plantB.plant_name,
//     traits,
//     hybridName,
//     source,
//   })

//   res.status(200).json({
//     success:    true,
//     data:       { ...responseData, confidence },
//     history_id: historyRecord._id,
//   })
// })

// /**
//  * GET /api/history
//  */
// const getHistory = asyncHandler(async (req, res) => {
//   const { limit, skip } = req.query
//   const { records, total } = await HistoryService.getAll({ limit, skip })

//   res.status(200).json({
//     success: true,
//     count:   records.length,
//     total,
//     data:    records.map(formatHistory),
//   })
// })

// /**
//  * GET /api/history/:id
//  */
// const getHistoryById = asyncHandler(async (req, res) => {
//   const record = await HistoryService.getById(req.params.id)
//   res.status(200).json({ success: true, data: formatHistory(record) })
// })

// module.exports = { predictHybrid, getHistory, getHistoryById }

















// controllers/PredictionController.js
// ML-ONLY prediction pipeline:
//   1. Validate input
//   2. Fetch parent plant data from MongoDB
//   3. Call ML API (throws clean error if unavailable — no fallback)
//   4. Build response with trait descriptions
//   5. Save to history
//   6. Return structured JSON

'use strict'

const PlantService   = require('../services/PlantService')
const MLService      = require('../services/MLService')
const HistoryService = require('../services/HistoryService')
const asyncHandler   = require('../utils/asyncHandler')
const AppError       = require('../utils/AppError')
const { buildPredictionResponse, formatHistory } = require('../utils/dataTransform')

/**
 * POST /api/predict
 *
 * Body (one of):
 *   { plant1Id, plant2Id }  — MongoDB ObjectIds (used by React frontend)
 *   { plantA,   plantB   }  — scientific name strings
 */
const predictHybrid = asyncHandler(async (req, res) => {
  const body = req.body

  // ── 1. Resolve plant identifiers ──────────────────────────────────────────
  const idA   = body.plant1Id || body.plantAId
  const idB   = body.plant2Id || body.plantBId
  const nameA = body.plantA   || body.plant1Name || body.plantAName
  const nameB = body.plantB   || body.plant2Name || body.plantBName

  if (!idA && !nameA) {
    throw new AppError(
      'Provide plant1Id + plant2Id (ObjectIds) or plantA + plantB (names)',
      400,
      'MISSING_PLANTS'
    )
  }

  // ── 2. Fetch both plant documents from MongoDB ────────────────────────────
  let plantA, plantB

  if (idA && idB) {
    ;({ plantA, plantB } = await PlantService.getPairById(idA, idB))
  } else if (idA || idB) {
    plantA = idA ? await PlantService.getById(idA) : await PlantService.getByName(nameA)
    plantB = idB ? await PlantService.getById(idB) : await PlantService.getByName(nameB)
    if (plantA._id.toString() === plantB._id.toString()) {
      throw new AppError('Both plants must be different', 400, 'SAME_PLANT')
    }
  } else {
    if (!nameB) {
      throw new AppError('Provide both plantA and plantB names', 400, 'MISSING_PLANTS')
    }
    ;({ plantA, plantB } = await PlantService.getPairByName(nameA, nameB))
  }

  // ── 3. Call ML API ────────────────────────────────────────────────────────
  const { traits, hybridName, source, confidence } = await MLService.predict(plantA, plantB)

  // ── 4. Build response first — trait_descriptions are generated here ───────
  const responseData = buildPredictionResponse({
    plantA:    plantA.plant_name,
    plantB:    plantB.plant_name,
    traits,
    hybridName,
    source,
    plantADoc: plantA,
    plantBDoc: plantB,
  })

  // ── 5. Save to history (including descriptions) ───────────────────────────
  const historyRecord = await HistoryService.save({
    plantA,
    plantB,
    traits,
    hybridName,
    source,
    traitDescriptions: responseData.trait_descriptions,
  })

  // ── 6. Send response ──────────────────────────────────────────────────────
  res.status(200).json({
    success:    true,
    data:       { ...responseData, confidence },
    history_id: historyRecord._id,
  })
})

/**
 * GET /api/history
 */
const getHistory = asyncHandler(async (req, res) => {
  const { limit, skip } = req.query
  const { records, total } = await HistoryService.getAll({ limit, skip })

  res.status(200).json({
    success: true,
    count:   records.length,
    total,
    data:    records.map(formatHistory),
  })
})

/**
 * GET /api/history/:id
 */
const getHistoryById = asyncHandler(async (req, res) => {
  const record = await HistoryService.getById(req.params.id)
  res.status(200).json({ success: true, data: formatHistory(record) })
})

module.exports = { predictHybrid, getHistory, getHistoryById }