<template>
  <div class="doctor-details">
    <h1>Профиль врача</h1>
    <div v-if="doctor">
      <p><strong>Имя:</strong> {{ doctor.doctorName }}</p>
      <p><strong>Email:</strong> {{ doctor.email }}</p>
      <p><strong>Специализация:</strong> {{ doctor.speciality.speciality }}</p>
      <p><strong>Стаж:</strong> {{ doctor.speciality.experience }} лет</p>
    </div>
    <div v-else>
      <p>Загрузка профиля врача...</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'DoctorDetails',
  data() {
    return {
      doctor: null,
      error: ''
    }
  },
  async created() {
    const doctorId = this.$route.params.id
    const token = localStorage.getItem('token')
    try {
      const res = await axios.get(`${process.env.VUE_APP_API_URL}/doctor/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      this.doctor = res.data
    } catch (err) {
      console.error('Ошибка загрузки деталей врача:', err)
      this.error = err.response?.data?.message || 'Ошибка загрузки профиля врача'
    }
  }
}
</script>

<style scoped>
.doctor-details {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}
</style>
