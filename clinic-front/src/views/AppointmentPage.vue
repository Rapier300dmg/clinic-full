<template>
  <div class="appointment-page">
    <h1>Запись к врачу</h1>

    <div v-if="!isAuthenticated" class="not-auth">
      <p>Пожалуйста, войдите для записи.</p>
      <router-link to="/login" class="btn-login">Войти</router-link>
    </div>

    <div v-else>
      <div class="filter">
        <label>Специализация:</label>
        <select v-model="selectedSpec">
          <option value="">Все</option>
          <option v-for="s in specs" :key="s">{{ s }}</option>
        </select>
      </div>

      <div v-if="error" class="error">{{ error }}</div>

      <div class="doctors-list">
        <div v-for="d in filteredDoctors" :key="d.id" class="doctor-item">
          <DoctorCard :doctor="d" />
          <button class="btn-book" @click="book(d.id)">Записаться</button>
        </div>
        <p v-if="!filteredDoctors.length">Врачи не найдены.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllDoctors } from '@/services/doctorService'
import { createAppointment } from '@/services/appointmentService'
import DoctorCard from '@/components/DoctorCard.vue'

export default {
  name: 'AppointmentPage',
  components: { DoctorCard },
  data: () => ({
    doctors: [],
    selectedSpec: '',
    error: ''
  }),
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem('token')
    },
    specs() {
      return [...new Set(
        this.doctors.map(d => d.DoctorProfile?.Speciality.speciality).filter(Boolean)
      )]
    },
    filteredDoctors() {
      return this.selectedSpec
        ? this.doctors.filter(d => d.DoctorProfile?.Speciality.speciality === this.selectedSpec)
        : this.doctors
    }
  },
  async created() {
    if (!this.isAuthenticated) return
    try {
      const { data } = await getAllDoctors()
      this.doctors = data
    } catch (e) {
      console.error(e)
      this.error = e.response?.data?.message || 'Ошибка загрузки'
    }
  },
  methods: {
    async book(doctorId) {
      try {
        await createAppointment({
          doctorId,
          patientId: this.$store?.state?.auth?.userId || null,
          date: new Date().toISOString(),
          time: '10:00'
        })
        alert('Запись создана')
      } catch {
        alert('Ошибка при записи')
      }
    }
  }
}
</script>

<style scoped>
.appointment-page { max-width:800px; margin:2rem auto; padding:1rem; }
.filter { margin-bottom:1rem; }
.doctors-list { display:grid; grid-template-columns:repeat(auto-fill,minmax(250px,1fr)); gap:1rem; }
.doctor-item { background:#fff; padding:1rem; border-radius:6px; box-shadow:0 0 6px rgba(0,0,0,0.1); }
.btn-book { margin-top:0.5rem; padding:0.5rem; background:#28a745; color:#fff; border:none; cursor:pointer; }
.error { color:red; }
</style>
