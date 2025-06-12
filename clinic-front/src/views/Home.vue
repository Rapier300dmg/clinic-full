<template>
  <div class="home-page">
    <section class="hero">
      <div class="hero-content">
        <h1 v-if="!isDoctor">Добро пожаловать в МедСистему</h1>
        <h1 v-else>Ваши пациенты</h1>
        <p v-if="!isDoctor">Найдите врача и запишитесь онлайн</p>
        <div class="hero-buttons" v-if="!isDoctor">
          <router-link
            v-if="isAuthenticated && userRole === 'patient'"
            to="/appointment/book"
            class="btn-primary"
          >Записаться к врачу</router-link>
          <router-link
            v-else
            to="/login"
            class="btn-primary"
          >Войти / Зарегистрироваться</router-link>
        </div>
      </div>
    </section>

    <div class="content">
      <section v-if="isDoctor" class="cards-section">
        <div class="cards-grid">
          <div v-for="p in patients" :key="p.id" class="card">
            <div class="avatar">{{ initials(p.firstName + ' ' + p.lastName) }}</div>
            <h3 class="card-title">{{ p.firstName }} {{ p.lastName }}</h3>
            <p class="card-text">{{ p.email }}</p>
          </div>
        </div>
        <p v-if="!patients.length" class="no-data">У вас пока нет пациентов.</p>
      </section>

      <section v-else class="cards-section">
        <h2 class="section-title">Наши врачи</h2>
        <div class="cards-grid">
          <div v-for="doc in doctors" :key="doc.id" class="card">
            <div class="avatar">{{ initials(doc.doctorName) }}</div>
            <h3 class="card-title">{{ doc.doctorName }}</h3>
            <p class="card-text">{{ doc.speciality }}</p>
            <p class="card-subtext">Стаж: {{ doc.experience }} лет</p>
            <router-link
              v-if="isAuthenticated && userRole === 'patient'"
              :to="{ name: 'AppointmentButton', params: { doctorId: doc.id } }"
              class="btn-secondary"
            >Записаться</router-link>
          </div>
        </div>
      </section>
    </div>

    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script>
import api from '@/services/api'
import { getAppointmentsByDoctor } from '@/services/appointmentService'

export default {
  name: 'HomePage',
  data() {
    return {
      doctors: [],
      patients: [],
      error: ''
    }
  },
  computed: {
    isDoctor() {
      return localStorage.getItem('role') === 'doctor'
    },
    isAuthenticated() {
      return !!localStorage.getItem('token')
    },
    userRole() {
      return localStorage.getItem('role')
    }
  },
  methods: {
    initials(name) {
      return name
        .split(' ')
        .map(n => n.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('')
    }
  },
  async created() {
    const token = localStorage.getItem('token')
    if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`

    try {
      if (this.isDoctor) {
        const { data } = await getAppointmentsByDoctor()
        const ids = [...new Set(data.map(a => a.patientId))].filter(Boolean)
        this.patients = await Promise.all(
          ids.map(id => api.get(`/users/${id}`).then(r => r.data))
        )
      } else {
        const { data } = await api.get('/doctor/')
        this.doctors = data
      }
    } catch (e) {
      console.error(e)
      this.error = e.response?.data?.message || 'Не удалось загрузить данные'
    }
  }
}
</script>

<style scoped>
.home-page {
  font-family: Arial, sans-serif;
  color: #333;
}

.hero {
  background: #17a2b8;
  color: #fff;
  padding: 3rem 1rem;
  text-align: center;
}
.hero-content h1 {
  margin: 0;
  font-size: 2.2rem;
}
.hero-content p {
  margin: 0.5rem 0 1.5rem;
  font-size: 1.1rem;
}
.btn-primary {
  padding: 0.8rem 1.6rem;
  background: #fff;
  color: #17a2b8;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  margin: 0 0.5rem;
}
.btn-primary:hover {
  background: #e6e6e6;
}

.content {
  padding: 2rem 1rem;
}

.cards-section {
  max-width: 1000px;
  margin: 0 auto;
}
.section-title {
  text-align: center;
  font-size: 1.8rem;
  color: #17a2b8;
  margin-bottom: 1.5rem;
}
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}
.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  padding: 1.2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.avatar {
  width: 50px;
  height: 50px;
  background: #007bff;
  color: #fff;
  border-radius: 50%;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.8rem;
}
.card-title {
  margin: 0.5rem 0;
  font-size: 1.1rem;
}
.card-text {
  font-size: 0.95rem;
  color: #555;
}
.card-subtext {
  font-size: 0.85rem;
  color: #777;
  margin-bottom: 1rem;
}
.btn-secondary {
  margin-top: auto;
  padding: 0.5rem 1rem;
  background: #28a745;
  color: #fff;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.95rem;
}
.btn-secondary:hover {
  background: #218838;
}

.no-data {
  text-align: center;
  color: #777;
  font-style: italic;
}

.error {
  text-align: center;
  color: #d9534f;
  margin-top: 1rem;
}

@media (max-width: 600px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>
