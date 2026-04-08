// routes/plantRoutes.js
// All plant-related endpoints.

'use strict'

const express = require('express')
const router  = express.Router()

const { getAllPlants, getPlantByName } = require('../controllers/PlantController')
const { validateNameParam, validatePagination } = require('../middleware/validateRequest')

/**
 * GET /plants
 * Returns all plants with optional filtering & pagination.
 *
 * Query params:
 *   limit    {number}  Max records to return (default 100, max 500)
 *   skip     {number}  Records to skip for pagination (default 0)
 *   climate  {string}  Filter by climate (partial match, case-insensitive)
 *   family   {string}  Filter by plant family (partial match)
 *   search   {string}  Full-text search across plant_name, common_name, family
 *
 * Example: GET /plants?climate=Tropical&limit=10
 */
router.get('/', validatePagination, getAllPlants)

/**
 * GET /plants/:name
 * Fetch a single plant by its scientific name.
 * The name should be URL-encoded if it contains spaces.
 *
 * Example: GET /plants/Solanum%20lycopersicum
 */
router.get('/:name', validateNameParam, getPlantByName)

module.exports = router
