<template>
  <div class="appointment-book">
    <h1>Запись к врачу</h1>

    <div v-if="loading" class="loading">Загрузка данных...</div>
    <div v-else-if="message && !doctor" class="error">{{ message }}</div>

    <div v-else-if="!isDoctor && doctor">
      <p>
        <strong>Врач:</strong>
        {{ doctor.doctorName || doctor.name }}
      </p>

      <div class="form-group">
        <label for="datetime">Дата и время приёма:</label>
        <input
          id="datetime"
          type="datetime-local"
          v-model="appointmentTime"
        />
      </div>

      <button
        class="btn-submit"
        :disabled="!appointmentTime"
        @click="submitAppointment"
      >
        Подтвердить запись
      </button>

      <p v-if="message" :class="{ success, error: !success }">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { computed } from 'vue'
import { useAuthStore } from '@/store/authStore'

const API_URL = process.env.VUE_APP_API_URL || 'https://clinic-system-amwk.onrender.com'
const api = axios.create({ baseURL: API_URL })

export default {
  name: 'AppointmentButton',
  props: {
    doctorId: { type: String, required: true }
  },
  setup() {
    const authStore = useAuthStore()
    const isDoctor = computed(() => authStore.role === 'doctor')
    return { isDoctor }
  },
  data() {
    return {
      doctor: null,
      appointmentTime: '',
      message: '',
      success: false,
      patientId: null,
      loading: false
    }
  },
  async created() {
    this.loading = true
    const token = localStorage.getItem('token')
    if (!token) {
      this.message = 'Для записи необходимо войти.'
      this.loading = false
      return
    }
    api.defaults.headers.common.Authorization = `Bearer ${token}`

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      this.patientId = payload.userId || payload.id
      if (!this.patientId) throw new Error()
    } catch {
      this.message = 'Не удалось определить пользователя.'
      this.loading = false
      return
    }

    try {
      const res = await api.get(`/doctor/${this.doctorId}`)
      this.doctor = res.data
    } catch {
      try {
        const all = (await api.get('/doctor')).data
        this.doctor = all.find(d => (d._id || d.id) === this.doctorId)
        if (!this.doctor) this.message = 'Врач не найден.'
      } catch {
        this.message = 'Не удалось загрузить данные врача.'
      }
    } finally {
      this.loading = false
    }
  },
  methods: {
    async submitAppointment() {
      this.message = ''
      this.success = false

      if (!this.appointmentTime) {
        this.message = 'Укажите дату и время приёма'
        return
      }
      if (!this.doctor || !this.patientId) {
        this.message = 'Данные не загружены'
        return
      }

      const payload = {
        doctorId: this.doctorId,
        patientId: this.patientId,
        appointmentTime: new Date(this.appointmentTime).toISOString()
      }

      try {
        const postRes = await api.post('/appointment', payload)
        const appointmentId = postRes.data._id || postRes.data.id

        this.success = true
        this.message = 'Запись успешно создана'

        if (appointmentId) {
          this.$router.push({
            name: 'AppointmentList',
            params: { appointmentId }
          })
        }
      } catch (err) {
        this.message = err.response?.data?.message || 'Не удалось записаться'
      }
    }
  }
}
</script>

<style scoped>
.appointment-book {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  text-align: center;
}
.loading {
  font-style: italic;
  color: #555;
}
.error {
  margin-top: 1rem;
  color: #dc3545;
}
.success {
  margin-top: 1rem;
  color: #28a745;
}
.form-group {
  margin: 1rem 0;
  text-align: left;
}
label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}
input[type="datetime-local"] {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.btn-submit {
  margin-top: 1rem;
  padding: 0.6rem 1.2rem;
  background: #28a745;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-submit:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
