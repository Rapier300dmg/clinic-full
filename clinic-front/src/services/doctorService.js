import api from './api'

export const getPublicDoctors = () =>
  api.get('/doctors')

export const getAllDoctors = () =>
  api.get('/doctors/all')

export const getDoctorById = id =>
  api.get(`/doctors/${id}`)

export const registerDoctor = data =>
  api.post('/doctors/register', data)
