import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Response interceptor — normalise error messages
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Something went wrong. Please try again.'
    return Promise.reject(new Error(message))
  }
)

export const fetchPlants = async () => {
  const response = await apiClient.get('/plants')
  // Backend shape: { success, count, total, data: Plant[] }
  return response.data.data ?? response.data
}

/**
 * POST /predict
 * @param {string} plant1Id  MongoDB _id of parent plant 1
 * @param {string} plant2Id  MongoDB _id of parent plant 2
 * Returns the prediction object directly.
 */
export const predictHybrid = async (plant1Id, plant2Id) => {
  const response = await apiClient.post('/predict', {
    plant1Id,
    plant2Id,
  })
  // Backend shape: { success, data: { plantA, plantB, traits, ... }, history_id }
  return response.data
}

/**
 * GET /history
 * Returns the array of prediction history records directly.
 */
export const fetchHistory = async () => {
  const response = await apiClient.get('/history')
  // Backend shape: { success, count, total, data: PredictionHistory[] }
  return response.data.data ?? response.data
}

export default apiClient
