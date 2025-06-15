<template>
  <div class="manager-dashboard">
    <h2>Панель менеджера</h2>
    <div v-if="error" class="error">{{ error }}</div>

    <section class="users-section">
      <h3>Все пользователи</h3>
      <ul v-if="users.length">
        <li v-for="u in users" :key="u.id">
          {{ u.firstName }} {{ u.lastName }} ({{ u.email }}) — {{ u.role }}
          <button @click="deleteUser(u.id)">Удалить</button>
        </li>
      </ul>
      <p v-else>Нет зарегистрированных пользователей.</p>
    </section>

    <section class="doctors-section">
      <h3>Все врачи</h3>
      <ul v-if="doctors.length">
        <li v-for="d in doctors" :key="d.id">
          {{ d.doctorName }} — {{ d.speciality }} ({{ d.experience }} лет)
          <button @click="deleteDoctor(d.id)">Удалить</button>
        </li>
      </ul>
      <p v-else>Нет зарегистрированных врачей.</p>
    </section>
  </div>
</template>

<script>
import api from '@/services/api'

export default {
  name: 'ManagerDashboard',
  data() {
    return {
      users: [],
      doctors: [],
      error: ''
    }
  },
  methods: {
    async fetchData() {
      try {
        const { data } = await api.get('/users')
        this.users = data.users
        this.doctors = data.doctors
      } catch (e) {
        this.error = e.response?.data?.error || 'Не удалось загрузить данные'
      }
    },
    async deleteUser(id) {
      if (!confirm('Удалить пользователя?')) return
      try {
        await api.delete(`/users/${id}`)
        this.users = this.users.filter(u => u.id !== id)
      } catch (e) {
        alert('Ошибка удаления пользователя')
        console.error(e)
      }
    },
    async deleteDoctor(id) {
      if (!confirm('Удалить врача?')) return
      try {
        await api.delete(`/doctors/${id}`)
        this.doctors = this.doctors.filter(d => d.id !== id)
      } catch (e) {
        alert('Ошибка удаления врача')
        console.error(e)
      }
    }
  },
  async mounted() {
    const token = localStorage.getItem('token')
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`
    }
    this.fetchData()
  }
}
</script>

<style scoped>
.manager-dashboard {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
}
.users-section, .doctors-section {
  margin-bottom: 2rem;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  padding: .5rem 0;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
button {
  background: #d9534f;
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background: #c9302c;
}
.error {
  color: red;
  margin-top: 1rem;
}
</style>
