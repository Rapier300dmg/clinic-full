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
        <p><strong>Врач:</strong> {{ apt.Doctor?.doctorName || 'Неизвестно' }}</p>
        <p><strong>Специализация:</strong> {{ apt.Doctor?.speciality || '—' }} ({{ apt.Doctor?.experience || 0 }} лет)</p>
        <p><strong>Дата и время:</strong> {{ formatDate(apt.time) }}</p>
        <p><strong>Причина приёма:</strong> {{ apt.reason || '–' }}</p>
        <p><strong>Статус:</strong> {{ apt.status }}</p>

        <!-- ✅ Диагноз -->
        <p v-if="apt.status === 'accepted' && apt.resultText"><strong>Диагноз:</strong> {{ apt.resultText }}</p>

        <!-- ✅ Файл -->
        <a
          v-if="apt.resultFile"
          :href="fileUrl(apt.resultFile)"
          class="btn-download"
          target="_blank"
        >Скачать файл</a>

        <!-- ✅ Кнопка "Оценить врача" -->
        <button
          v-if="apt.status === 'accepted' && !apt.reviewed"
          class="btn-review"
          @click="openReviewModal(apt)"
        >Оценить врача</button>
      </li>
    </ul>

    <p v-else>Записей не найдено.</p>

    <!-- Модальное окно для оценки -->
    <div class="modal" v-if="showModal">
      <div class="modal-content">
        <h3>Оцените врача</h3>
        <p>Оценка от 1 до 5:</p>
        <select v-model="reviewData.rating">
          <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
        </select>
        <p>Отзыв:</p>
        <textarea v-model="reviewData.comment" rows="4"></textarea>
        <div class="modal-actions">
          <button @click="submitReview">Отправить</button>
          <button @click="closeModal">Отмена</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import api from '@/services/api'
import dayjs from 'dayjs'
import { API_BASE } from '@/services/config'

export default {
  name: 'AppointmentList',
  data() {
    return {
      appointments: [],
      error: '',
      showModal: false,
      reviewData: {
        rating: 5,
        comment: '',
        appointmentId: null
      }
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
    },
    fileUrl(filename) {
      return `${API_BASE}/uploads/${filename}`
    },
    openReviewModal(apt) {
      this.reviewData.appointmentId = apt.id
      this.reviewData.rating = 5
      this.reviewData.comment = ''
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
    },
    async submitReview() {
      try {
        const { rating, comment, appointmentId } = this.reviewData
        await api.post('/reviews', { rating, comment, appointmentId })

        // Пометить приём как уже оценённый
        const reviewedApt = this.appointments.find(a => a.id === appointmentId)
        if (reviewedApt) reviewedApt.reviewed = true

        this.closeModal()
        alert('Спасибо за ваш отзыв!')
      } catch (err) {
        alert(err.response?.data?.message || 'Ошибка при отправке отзыва')
      }
    }
  }
}
</script>

<style scoped>
.appointments-list {
  max-width: 600px;
  margin: 2rem auto;
  font-family: Arial, sans-serif;
}
.error {
  color: #d9534f;
  text-align: center;
}
.appointment-item {
  background: #fff;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.btn-download,
.btn-review {
  margin-top: 0.5rem;
  display: inline-block;
  background: #007bff;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: white;
  padding: 1.5rem;
  border-radius: 6px;
  width: 90%;
  max-width: 400px;
}
.modal-content textarea {
  width: 100%;
  margin-top: 0.5rem;
}
.modal-actions {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
}
</style>
