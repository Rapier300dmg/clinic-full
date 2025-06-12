<template>
    <div class="list-container">
      <h2>Ваши записи</h2>
      <ul v-if="appointments.length">
        <li v-for="apt in appointments" :key="apt.id" class="item">
          <p><strong>Пациент ID:</strong> {{ apt.patientId }}</p>
          <p><strong>Время приёма:</strong> {{ formatDate(apt.time) }}</p>
          <p><strong>Причина:</strong> {{ apt.reason || '—' }}</p>
        </li>
      </ul>
      <p v-else>У вас пока нет записей.</p>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  import dayjs from 'dayjs'

  const api = axios.create({
    baseURL: process.env.VUE_APP_API_URL || 'http://localhost:5000/api'
  })
  
  export default {
    name: 'DoctorAppointmentsPage',
    data() {
      return {
        appointments: [],
        error: ''
      }
    },
    async mounted() {
      const token    = localStorage.getItem('token')
      const doctorId = localStorage.getItem('doctorId')
      if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`
  
      if (!doctorId) {
        this.error = 'Не удалось определить вашу роль'
        return
      }
  
      try {
        const res = await api.get(`/appointment/doctor/${doctorId}`)
        this.appointments = res.data
      } catch (e) {
        this.error = 'Не удалось загрузить записи'
      }
    },
    methods: {
      formatDate(dt) {
        return dayjs(dt).format('DD.MM.YYYY HH:mm')
      }
    }
  }
  </script>
  
  <style scoped>
  .list-container { max-width:600px; margin:2rem auto; padding:1rem; background:#fff; border-radius:8px; }
  .item { border-bottom:1px solid #ddd; padding:1rem 0; }
  .item:last-child { border-bottom:none; }
  .error { color:red; }
  </style>
  