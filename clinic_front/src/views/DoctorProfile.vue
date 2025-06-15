<template>
  <div class="doctor-profile">
    <div v-if="error" class="error">{{ error }}</div>
    <div v-else-if="!doctor" class="loading">Загрузка профиля врача…</div>
    <div v-else>
      <div class="profile-header">
        <div class="avatar">{{ initials }}</div>
        <div class="info">
          <h1 class="name">{{ doctor.doctorName }}</h1>
          <p class="email">{{ doctor.email }}</p>
          <p class="speciality">
            <strong>Специализация:</strong> {{ doctor.speciality }}
          </p>
          <p class="experience">
            <strong>Стаж:</strong> {{ doctor.experience }} лет
          </p>
        </div>
      </div>

      <section class="appointments-section">
        <h2>Мои записи</h2>
        <div v-if="appointments.length" class="appointments-list">
          <div
            v-for="apt in appointments"
            :key="apt.id"
            class="appointment-card"
          >
            <p>
              <strong>Пациент:</strong>
              {{ apt.patient.firstName }} {{ apt.patient.lastName }}
            </p>
            <p>
              <strong>Дата и время:</strong>
              {{ formatDate(apt.time) }}
            </p>
            <p>
              <strong>Причина приёма:</strong> {{ apt.reason || '–' }}
            </p>
          </div>
        </div>
        <p v-else class="no-appointments">
          У вас пока нет записей.
        </p>
      </section>
    </div>
  </div>
</template>

<script>
import api  from '@/services/api'
import dayjs from 'dayjs'

export default {
  name: 'DoctorProfile',
  data() {
    return {
      doctor: null,
      appointments: [],
      error: ''
    }
  },
  computed: {
    initials() {
      if (!this.doctor) return ''
      return this.doctor.doctorName
        .split(' ')
        .map(w => w.charAt(0).toUpperCase())
        .slice(0,2)
        .join('')
    }
  },
  async mounted() {
    const token = localStorage.getItem('token')
    const doctorId = localStorage.getItem('doctorId')
    if (!token || !doctorId) {
      this.error = 'Нет доступа к профилю'
      return
    }
    api.defaults.headers.common.Authorization = `Bearer ${token}`

    try {
      const { data: doc } = await api.get(`/doctor/${doctorId}`)
      this.doctor = doc

      const { data: appts } = await api.get(`/appointment/doctor/${doctorId}`)
      this.appointments = appts
    } catch (e) {
      console.error(e)
      this.error = e.response?.data?.message || 'Не удалось загрузить данные'
    }
  },
  methods: {
    formatDate(ts) {
      return dayjs(ts).format('DD.MM.YYYY HH:mm')
    }
  }
}
</script>

<style scoped>
.doctor-profile {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: Arial, sans-serif;
}

.loading {
  text-align: center;
  color: #666;
  font-style: italic;
}
.error {
  text-align: center;
  color: #d9534f;
  margin-bottom: 1rem;
}

.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}
.avatar {
  width: 80px;
  height: 80px;
  background: #17a2b8;
  color: #fff;
  font-size: 2rem;
  font-weight: bold;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.5rem;
}
.info .name {
  margin: 0;
  font-size: 1.8rem;
  color: #333;
}
.info p {
  margin: 0.4rem 0;
  color: #555;
}
.info .email {
  font-style: italic;
  font-size: 0.95rem;
}

.appointments-section {
  margin-top: 2rem;
}
.appointments-section h2 {
  font-size: 1.5rem;
  color: #17a2b8;
  margin-bottom: 1rem;
}
.appointments-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}
.appointment-card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.appointment-card p {
  margin: 0.5rem 0;
  color: #444;
}
.no-appointments {
  text-align: center;
  color: #777;
  font-style: italic;
}
@media (max-width:600px) {
  .appointments-list {
    grid-template-columns: 1fr;
  }
}
</style>
