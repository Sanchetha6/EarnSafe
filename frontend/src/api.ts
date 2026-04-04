import axios from 'axios'

const api = axios.create({ 
  baseURL: 'https://earnsafe-backend-7pms.onrender.com'
})

export const registerWorker = (data: object) => api.post('/workers/register', data)
export const getWorker = (id: number) => api.get(`/workers/${id}`)
export const createPolicy = (data: object) => api.post('/policies/create', data)
export const getPolicy = (workerId: number) => api.get(`/policies/${workerId}`)
export const simulateTrigger = (data: object) => api.post('/claims/simulate-trigger', data)
export const getClaims = (workerId: number) => api.get(`/claims/${workerId}`)