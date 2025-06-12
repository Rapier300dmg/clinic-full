import api from './api'

export const getAllSpecialities = () =>
  api.get('/specialities')

export const createSpeciality = data =>
  api.post('/specialities', data)

export const updateSpeciality = (id, data) =>
  api.put(`/specialities/${id}`, data)

export const deleteSpeciality = id =>
  api.delete(`/specialities/${id}`)
