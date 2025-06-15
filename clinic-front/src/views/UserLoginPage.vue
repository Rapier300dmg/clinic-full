<template>
  <div class="form-container">
    <h2>{{ isDoctorLogin ? 'Вход для врача' : 'Вход' }}</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Пароль" required />
      <button type="submit">Войти</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
    <p class="to-register">
      Нет аккаунта?
      <router-link :to="{ name: 'Register' }">Зарегистрироваться</router-link>
    </p>
  </div>
</template>

<script>
import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'https://clinic-system-amwk.onrender.com/api'
})

export default {
  name: 'UserLoginPage',
  data() {
    return {
      email: '',
      password: '',
      error: ''
    }
  },
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  computed: {
    isDoctorLogin() {
      return this.$route.query.role === 'doctor'
    }
  },
  methods: {
    decodeToken(token) {
      try {
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const json = decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        )
        return JSON.parse(json)
      } catch {
        return {}
      }
    },
    async handleLogin() {
      this.error = ''
      try {
        const { data } = await api.post('/auth/login', {
          email: this.email,
          password: this.password
        })
        const { token, role } = data

        this.authStore.setAuth(token, role)
        localStorage.setItem('token', token)
        localStorage.setItem('role', role)
        api.defaults.headers.common.Authorization = `Bearer ${token}`

        const payload = this.decodeToken(token)
        const realId = payload.id
        if (!realId) throw new Error('Не удалось получить ID из токена')

        if (role === 'doctor') {
          localStorage.setItem('doctorId', realId)
        } else {
          localStorage.setItem('userId', realId)
        }

        if (role === 'doctor') {
          await this.$router.push({ name: 'DoctorProfile' })
        } else {
          await this.$router.push({ name: 'Home' })
        }
        window.location.reload()
      } catch (err) {
        console.error('Ошибка логина:', err)
        this.error = err.response?.data?.message || err.message || 'Ошибка входа'
      }
    }
  }
}
</script>

<style scoped>
.form-container {
  max-width: 500px;
  margin: 3rem auto;
  padding: 4rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}
input,
button {
  width: 100%;
  margin: 1rem 0;
  padding: 0.8rem;
  font-size: 1rem;
}
.error {
  color: red;
  margin-top: 1rem;
}
.to-register {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
}
.to-register a {
  color: #007bff;
  text-decoration: underline;
}
</style>
