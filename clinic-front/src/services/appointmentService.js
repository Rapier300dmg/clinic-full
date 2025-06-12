import api from './api'

export const createAppointment = data =>
  api.post('/appointments', data)

export const getAppointmentsByPatient = () =>
  api.get('/appointments/patient')

export const getAppointmentsByDoctor = () =>
  api.get('/appointments/doctor')

export const deleteAppointment = id =>
  api.delete(`/appointments/${id}`)
