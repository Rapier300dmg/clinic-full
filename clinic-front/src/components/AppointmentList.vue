<template>
  <div class="appointments-list">
    <h2>Ваши записи</h2>
    <p v-if="error" class="error">{{ error }}</p>

    <ul v-else-if="appointments.length">
      <li
        v-for="apt in appointments"
        :key="apt.id"
        class="appointment-item"
      >
        <p><strong>Врач:</strong> {{ apt.Doctor.doctorName }}</p>
        <p>
          <strong>Специализация:</strong>
          {{ apt.Doctor.speciality }} ({{ apt.Doctor.experience }} лет)
        </p>
        <p>
          <strong>Дата и время:</strong>
          {{ formatDate(apt.time) }}
        </p>
        <p>
          <strong>Пациент:</strong>
          {{ apt.patient.firstName }} {{ apt.patient.lastName }}
        </p>
        <p>
          <strong>Причина приёма:</strong>
          {{ apt.reason || '–' }}
        </p>
      </li>
    </ul>

    <p v-else>Записей не найдено.</p>
  </div>
</template>

<script>
import api from '@/services/api'
import dayjs from 'dayjs'

export default {
  name: 'AppointmentList',
  data() {
    return {
      appointments: [],
      error: ''
    }
  },
  computed: {
    role() {
      return localStorage.getItem('role')
    },
    userId() {
      return this.role === 'doctor'
        ? localStorage.getItem('doctorId')
        : localStorage.getItem('userId')
    }
  },
  async mounted() {
    const token = localStorage.getItem('token')
    if (!token) {
      this.error = 'Пользователь не авторизован'
      return
    }
    api.defaults.headers.common.Authorization = `Bearer ${token}`

    const url =
      this.role === 'doctor'
        ? `/appointment/doctor/${this.userId}`
        : `/appointment/patient/${this.userId}`

    try {
      const { data } = await api.get(url)
      this.appointments = data
    } catch (err) {
      console.error(err)
      this.error = err.response?.data?.message || 'Ошибка загрузки записей'
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
.appointments-list {
  max-width: 600px;
  margin: 2rem auto;
}
.appointment-item {
  background: #fff;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 6px;
  box-shadow: 0 0 6px rgba(0,0,0,0.1);
}
.error {
  color: red;
  text-align: center;
  margin: 1rem 0;
}
</style>
