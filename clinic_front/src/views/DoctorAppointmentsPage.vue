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
              {{ apt.status === 'accepted'
                  ? 'Принят'
                  : apt.status === 'declined'
                    ? 'Отклонён'
                    : 'В ожидании' }}
            </span>
          </p>
        </div>

        <!-- Действия врача, только когда статус "pending" -->
        <div class="actions" v-if="apt.status === 'pending'">
          <form
            @submit.prevent="submitReport(apt.id)"
            class="report-form"
            enctype="multipart/form-data"
          >
            <textarea
              v-model="reportText[apt.id]"
              placeholder="Введите диагноз"
              required
            ></textarea>
            <input type="file" @change="handleFileChange($event, apt.id)" />
            <div class="button-group">
              <button type="submit" class="btn btn-accept">
                Принять
              </button>
              <button
                type="button"
                class="btn btn-toggle"
                @click="toggleRejectForm(apt.id)"
              >
                Отклонить
              </button>
            </div>
          </form>

          <transition name="fade">
            <div v-if="showRejectForm[apt.id]" class="reject-form">
              <textarea
                v-model="rejectionText[apt.id]"
                placeholder="Причина отказа"
                required
              ></textarea>
              <button
                type="button"
                class="btn btn-reject"
                @click="declineAppointment(apt.id)"
              >
                Подтвердить отказ
              </button>
            </div>
          </transition>
        </div>

        <!-- Показ диагноза после принятия -->
        <div class="report-view" v-if="apt.status === 'accepted'">
          <p><strong>Диагноз:</strong> {{ apt.resultText }}</p>
          <a
            v-if="apt.resultFile"
            :href="apt.resultFile"
            target="_blank"
            class="btn btn-download"
          >
            Скачать файл
          </a>
        </div>

        <!-- Показ причины отказа -->
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
    // Просто присваиваем новое значение — Vue 3 отследит это
    toggleRejectForm(id) {
      this.showRejectForm[id] = !this.showRejectForm[id]
    },
    async submitReport(id) {
      const form = new FormData()
      form.append('resultText', this.reportText[id])
      if (this.selectedFiles[id]) {
        form.append('file', this.selectedFiles[id])
      }
      try {
        const res = await api.post(`/appointment/${id}/report`, form)
        const idx = this.appointments.findIndex(a => a.id === id)
        if (idx !== -1) {
          this.appointments[idx].status = 'accepted'
          this.appointments[idx].resultText = res.data.resultText
          this.appointments[idx].resultFile = res.data.resultFile || res.data.fileUrl
        }
      } catch (err) {
        console.error(err)
        alert('Ошибка при отправке диагноза')
      }
    },
    async declineAppointment(id) {
      const reason = this.rejectionText[id]
      if (!reason) {
        alert('Укажите причину отказа')
        return
      }
      try {
        const { data } = await api.patch(`/appointment/${id}/reject`, {
          rejectionReason: reason
        })
        const idx = this.appointments.findIndex(a => a.id === id)
        if (idx !== -1) {
          this.appointments[idx].status = 'declined'
          this.appointments[idx].rejectionReason = data.rejectionReason
        }
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
  mounted() {
    this.loadAppointments()
  }
}
</script>

<style scoped>
.list-container {
  max-width: 700px;
  margin: 2rem auto;
  font-family: Arial, sans-serif;
}
.error {
  color: #d9534f;
  text-align: center;
  margin-bottom: 1rem;
}
.apt-card {
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(8px);
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 8px;
}
.apt-info p {
  margin: 0.4rem 0;
}

.status-label {
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: bold;
}
.status-label.pending  { background: #f6ad55; color: #000; }
.status-label.accepted { background: #48bb78; color: #fff; }
.status-label.declined { background: #f56565; color: #fff; }

.actions {
  margin-top: 1rem;
}

.report-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.report-form textarea {
  padding: 0.6rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  resize: vertical;
}
.report-form input[type="file"] {
  padding: 0.4rem 0;
}

.button-group {
  display: flex;
  gap: 0.8rem;
  margin-top: 0.5rem;
}

.reject-form {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.reject-form textarea {
  padding: 0.6rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  resize: vertical;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.7rem 1.4rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-accept {
  background: #38b2ac;
}
.btn-accept:hover {
  background: #2c7a7b;
}
.btn-reject {
  background: #e53e3e;
}
.btn-reject:hover {
  background: #c53030;
}
.btn-toggle {
  background: #4a5568;
}
.btn-toggle:hover {
  background: #2d3748;
}

.btn-download {
  display: inline-block;
  margin-top: 0.6rem;
  background: #3182ce;
  text-decoration: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  color: #fff;
  transition: background 0.2s;
}
.btn-download:hover {
  background: #2b6cb0;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
