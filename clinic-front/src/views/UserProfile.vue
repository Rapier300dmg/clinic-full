<template>
  <div class="profile-container">
    <div v-if="error" class="error">{{ error }}</div>

    <div v-else-if="!user" class="loading">Загрузка профиля...</div>

    <div v-else>
      <div class="profile-header">
        <div class="avatar">{{ initials }}</div>
        <div class="user-info">
          <h1 class="user-name">{{ user.firstName }} {{ user.lastName }}</h1>
          <p class="user-email">{{ user.email }}</p>
        </div>
      </div>

      <section class="appointments-section">
        <h2 class="section-title">Ваши записи</h2>
        <div v-if="appointments.length" class="appointments-list">
          <div
            v-for="apt in appointments"
            :key="apt.id"
            class="appointment-card"
          >
            <div class="apt-header">
              <p class="apt-doctor">
                <strong>Врач:</strong> {{ apt.Doctor.doctorName }}
              </p>
              <p class="apt-speciality">
                {{ apt.Doctor.speciality }}, стаж {{ apt.Doctor.experience }} лет
              </p>
            </div>
            <div class="apt-body">
              <p>
                <strong>Дата и время:</strong> {{ formatDate(apt.time) }}
              </p>
              <p>
                <strong>Причина приёма:</strong> {{ apt.reason || '-' }}
              </p>
            </div>
          </div>
        </div>
        <p v-else class="no-appointments">У вас ещё нет записей.</p>
      </section>
    </div>
  </div>
</template>

<script>
import { fetchMe } from '@/services/authService'
import api           from '@/services/api'
import dayjs         from 'dayjs'

export default {
  name: 'UserProfile',
  data() {
    return {
      user: null,
      appointments: [],
      error: ''
    }
  },
  computed: {
    initials() {
      if (!this.user) return ''
      return (
        this.user.firstName.charAt(0).toUpperCase() +
        this.user.lastName.charAt(0).toUpperCase()
      )
    }
  },
  async created() {
    const token = localStorage.getItem('token')
    if (!token) {
      this.error = 'Пользователь не авторизован'
      return
    }
    api.defaults.headers.common.Authorization = `Bearer ${token}`

    try {
      const { data: userData } = await fetchMe()
      this.user = userData

      const { data: appts } = await api.get(`/appointment/patient/${userData.id}`)
      this.appointments = appts
    } catch (err) {
      console.error(err)
      this.error = err.response?.data?.message || 'Ошибка загрузки данных'
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
.profile-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: sans-serif;
}

.loading {
  text-align: center;
  color: #666;
  font-style: italic;
}

.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.avatar {
  width: 80px;
  height: 80px;
  background: #007bff;
  color: #fff;
  font-size: 2rem;
  font-weight: bold;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.5rem;
}

.user-info .user-name {
  margin: 0;
  font-size: 1.8rem;
  color: #333;
}

.user-email {
  margin: 0.3rem 0 0;
  color: #666;
}

.appointments-section {
  margin-top: 2rem;
}

.section-title {
  font-size: 1.5rem;
  color: #007bff;
  margin-bottom: 1rem;
}

.error {
  color: #d9534f;
  text-align: center;
  margin-bottom: 1rem;
}

.no-appointments {
  text-align: center;
  color: #666;
  font-style: italic;
}

.appointments-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}

.appointment-card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.apt-header {
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 0.8rem;
  padding-bottom: 0.5rem;
}

.apt-doctor {
  margin: 0;
  font-weight: bold;
  color: #333;
}

.apt-speciality {
  margin: 0.3rem 0 0;
  color: #555;
}

.apt-body p {
  margin: 0.5rem 0;
  color: #444;
}

@media (max-width: 600px) {
  .appointments-list {
    grid-template-columns: 1fr;
  }
}
</style>
