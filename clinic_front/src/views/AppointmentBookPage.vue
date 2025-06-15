<template>
  <div class="book-container">
    <h1 class="title">Записаться к врачу</h1>
    <form @submit.prevent="handleBook" class="book-form">
      <div class="form-group">
        <label for="doctor">Врач</label>
        <select id="doctor" v-model="doctorId" required>
          <option disabled value="">— выберите врача —</option>
          <option
            v-for="doc in doctors"
            :key="doc.id"
            :value="doc.id"
          >
            {{ doc.doctorName }} ({{ doc.speciality }})
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="datetime">Дата и время</label>
        <input
          id="datetime"
          v-model="dateTime"
          type="datetime-local"
          required
        />
      </div>

      <div class="form-group">
        <label for="reason">Причина приёма</label>
        <textarea
          id="reason"
          v-model="reason"
          rows="3"
          placeholder="Опишите, зачем..."
        ></textarea>
      </div>

      <button type="submit" class="btn-submit">Записаться</button>

      <p v-if="error" class="message error">{{ error }}</p>
      <p v-if="success" class="message success">Запись успешно создана!</p>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:5000/api'
})

export default {
  name: 'AppointmentBookPage',
  data() {
    return {
      doctors: [],
      doctorId: '',
      dateTime: '',
      reason: '',
      error: '',
      success: false
    }
  },
  async mounted() {
    const token = localStorage.getItem('token')
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`
    }
    try {
      const res = await api.get('/doctor/')
      this.doctors = res.data
    } catch {
      this.error = 'Не удалось загрузить список врачей'
    }
  },
  methods: {
    async handleBook() {
      this.error = ''
      this.success = false
      try {
        await api.post('/appointment/create', {
          doctorId: Number(this.doctorId),
          time:     new Date(this.dateTime).toISOString(),
          reason:   this.reason
        })
        this.success = true
        this.doctorId = ''
        this.dateTime = ''
        this.reason   = ''
      } catch (e) {
        this.error = e.response?.data?.message || 'Ошибка при создании записи'
      }
    }
  }
}
</script>

<style scoped>
.book-container {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  font-family: Arial, sans-serif;
}

.title {
  margin: 0 0 1.5rem;
  font-size: 1.75rem;
  color: #333;
  text-align: center;
}

.book-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.25rem;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #444;
}

.form-group select,
.form-group input,
.form-group textarea {
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.2s;
}

.form-group select:focus,
.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
}

.btn-submit {
  align-self: flex-end;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-submit:hover {
  background-color: #0056b3;
}

.message {
  margin-top: 1rem;
  font-size: 0.95rem;
  text-align: center;
}

.error {
  color: #d9534f;
}

.success {
  color: #28a745;
}
</style>
