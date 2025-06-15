<template>
  <div class="list-container">
    <h2>Ваши записи</h2>
    <p v-if="error" class="error">{{ error }}</p>

    <ul v-else-if="appointments.length">
      <li v-for="apt in appointments" :key="apt.id" class="apt-card">
        <div class="apt-info">
          <p><strong>Пациент:</strong> {{ apt.patient.firstName }} {{ apt.patient.lastName }}</p>
          <p><strong>Время приёма:</strong> {{ formatDate(apt.time) }}</p>
          <p><strong>Причина:</strong> {{ apt.reason || '–' }}</p>
          <p>
            <strong>Статус:</strong>
            <span :class="['status-label', apt.status]">
              {{ apt.status === 'accepted' ? 'Принят' : apt.status === 'declined' ? 'Отклонён' : 'В ожидании' }}
            </span>
          </p>
        </div>

        <div class="actions" v-if="apt.status === 'Ожидание'">
          <form @submit.prevent="submitReport(apt.id)" class="report-form" enctype="multipart/form-data">
            <textarea v-model="reportText[apt.id]" placeholder="Введите диагноз" required></textarea>
            <input type="file" @change="handleFileChange($event, apt.id)" />
            <button type="submit" class="btn btn-accept">Принять</button>
          </form>

          <button class="btn btn-reject" @click="toggleRejectForm(apt.id)">Отклонить</button>

          <div v-if="showRejectForm[apt.id]" class="reject-form">
            <textarea v-model="rejectionText[apt.id]" placeholder="Причина отказа" required></textarea>
            <button @click="declineAppointment(apt.id)" class="btn btn-reject confirm">Подтвердить отказ</button>
          </div>
        </div>

        <div class="report-view" v-if="apt.status === 'accepted'">
          <p><strong>Диагноз:</strong> {{ apt.resultText }}</p>
          <a v-if="apt.resultFile" :href="apt.resultFile" target="_blank" class="btn btn-download">Скачать файл</a>
        </div>
        <div class="report-view" v-if="apt.status === 'declined'">
          <p><strong>Запись отклонена:</strong> {{ apt.rejectionReason }}</p>
        </div>
      </li>
    </ul>

    <p v-else>У вас пока нет записей.</p>
  </div>
</template>

<script>
import api from '@/services/api'
import dayjs from 'dayjs'

export default {
  name: 'DoctorAppointmentsPage',
  data() {
    return {
      appointments: [],
      error: '',
      reportText: {},
      rejectionText: {},
      showRejectForm: {},
      selectedFiles: {}
    }
  },
  methods: {
    formatDate(dt) {
      return dayjs(dt).format('DD.MM.YYYY HH:mm')
    },
    handleFileChange(event, id) {
      this.selectedFiles[id] = event.target.files[0]
    },
    toggleRejectForm(id) {
      this.$set(this.showRejectForm, id, !this.showRejectForm[id])
    },
    async submitReport(id) {
      const form = new FormData()
      form.append('resultText', this.reportText[id])
      if (this.selectedFiles[id]) {
        form.append('file', this.selectedFiles[id])
      }

      try {
        const res = await api.post(`/appointment/${id}/report`, form)
        const index = this.appointments.findIndex(a => a.id === id)
        if (index !== -1) {
          this.appointments[index].status = 'accepted'
          this.appointments[index].resultText = res.data.resultText
          this.appointments[index].resultFile = res.data.resultFile || res.data.fileUrl
        }
        alert('Принято и файл отправлен')
      } catch (err) {
        console.error(err)
        alert('Ошибка при отправке')
      }
    },
    async declineAppointment(id) {
      const reason = this.rejectionText[id]
      if (!reason) {
        alert('Укажите причину отказа')
        return
      }

      try {
        const { data } = await api.patch(`/appointment/${id}/reject`, { rejectionReason: reason })
        const index = this.appointments.findIndex(a => a.id === id)
        if (index !== -1) {
          this.appointments[index].status = 'declined'
          this.appointments[index].rejectionReason = data.rejectionReason
        }
        alert('Запись отклонена')
      } catch (err) {
        console.error(err)
        alert('Ошибка при отклонении')
      }
    },
    async loadAppointments() {
      const doctorId = localStorage.getItem('doctorId')
      const token = localStorage.getItem('token')
      if (!token || !doctorId) {
        this.error = 'Не удалось определить вашу роль'
        return
      }

      api.defaults.headers.common.Authorization = `Bearer ${token}`

      try {
        const { data } = await api.get(`/appointment/doctor/${doctorId}`)
        this.appointments = data
      } catch {
        this.error = 'Не удалось загрузить записи'
      }
    }
  },
  async mounted() {
    await this.loadAppointments()
  }
}
</script>

<style scoped>
.list-container {
  max-width: 700px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: Arial, sans-serif;
}
.error {
  color: #d9534f;
  margin-bottom: 1rem;
  text-align: center;
}
.apt-card {
  background: rgba(255, 255, 255, 0.15); 
  backdrop-filter: blur(10px); 
  -webkit-backdrop-filter: blur(10px);
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.3); 
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
.apt-info p {
  margin: 0.4rem 0;
}
.status-label {
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: bold;
}
.status-label.pending {
  background: #ffc107;
  color: #000;
}
.status-label.accepted {
  background: #5cb85c;
  color: #fff;
}
.status-label.declined {
  background: #d9534f;
  color: #fff;
}

.actions {
  margin-top: 1rem;
}
.report-form,
.reject-form {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
}
.report-form textarea,
.reject-form textarea {
  padding: 0.5rem;
  margin-bottom: 0.6rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}
.report-form input {
  margin-bottom: 0.6rem;
}
.btn {
  padding: 0.5rem 1rem;
  border: none;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  transition: 0.3s ease;
}
.btn-accept {
  background: #28a745;
  color: white;
}
.btn-reject {
  background: #dc3545;
  color: white;
}
.btn-reject.confirm {
  margin-top: 0.4rem;
}
.btn-download {
  background: #007bff;
  color: white;
  margin-top: 0.6rem;
  text-decoration: none;
}
.report-view {
  margin-top: 1rem;
}
.report-view p {
  margin: 0.4rem 0;
}
</style>
