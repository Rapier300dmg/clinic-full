<template>
  <div class="doctor-list">
    <h1>Список врачей</h1>

    <div class="filter">
      <label for="spec-select">Фильтр по специализации:</label>
      <select id="spec-select" v-model="selectedSpec">
        <option value="">Все</option>
        <option v-for="opt in specializations" :key="opt" :value="opt">
          {{ opt }}
        </option>
      </select>
    </div>

    <ul v-if="filteredDoctors.length">
      <li v-for="doctor in filteredDoctors" :key="doctor.id">
        <strong>{{ doctor.name }}</strong> — {{ doctor.specialization }}
        <router-link :to="`/doctors/${doctor.id}`" class="more-link">
          Подробнее
        </router-link>
      </li>
    </ul>

    <p v-else>Нет врачей для отображения.</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'DoctorsListPage',
  data() {
    return {
      doctors: [],
      selectedSpec: ''
    }
  },
  computed: {
    specializations() {
      const specs = this.doctors.map(d => d.specialization)
      return Array.from(new Set(specs))
    },
    filteredDoctors() {
      if (!this.selectedSpec) return this.doctors
      return this.doctors.filter(d => d.specialization === this.selectedSpec)
    }
  },
  async mounted() {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('https://clinic-system-amwk.onrender.com/doctor', {
        headers: { Authorization: `Bearer ${token}` }
      })
      this.doctors = res.data
    } catch (err) {
      console.error('Ошибка загрузки врачей:', err)
    }
  }
}
</script>

<style scoped>
.doctor-list {
  max-width: 600px;
  margin: 2rem auto;
  background: white;
  padding: 2rem;
  border-radius: 10px;
}

.filter {
  margin-bottom: 1rem;
  text-align: left;
}

.filter label {
  margin-right: 0.5rem;
}

.more-link {
  margin-left: 1rem;
  color: #007bff;
  text-decoration: underline;
}
</style>
