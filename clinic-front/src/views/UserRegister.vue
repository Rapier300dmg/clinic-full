<template>
  <div class="form-container">
    <h2>Регистрация</h2>
    <form @submit.prevent="handleRegister">
      <input v-model="firstName" type="text" placeholder="Имя" required />
      <input v-model="lastName" type="text" placeholder="Фамилия" required />
      <input v-model.number="age" type="number" placeholder="Возраст" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Пароль" required />
      <input
        v-model="confirmPassword"
        type="password"
        placeholder="Подтвердите пароль"
        required
      />
      <button type="submit">Зарегистрироваться</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>

    <div class="doctor-register">
      <p>
        Если вы врач, зарегистрируйтесь&nbsp;
        <router-link
          class="btn-doctor"
          :to="{ name: 'DoctorRegister' }"
        >
          здесь
        </router-link>.
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

const api = axios.create({
  baseURL:
    process.env.VUE_APP_API_URL ||
    'https://clinic-system-amwk.onrender.com'
})

export default {
  name: 'UserRegisterPage',
  data() {
    return {
      firstName: '',
      lastName: '',
      age: '',
      email: '',
      password: '',
      confirmPassword: '',
      error: ''
    }
  },
  methods: {
    async handleRegister() {
      this.error = ''
      if (this.password !== this.confirmPassword) {
        this.error = 'Пароли не совпадают'
        return
      }
      try {
        await api.post('/auth/register', {
          firstName: this.firstName,
          lastName: this.lastName,
          age: Number(this.age),
          email: this.email,
          password: this.password,
          isManager: false
        })
        await this.$router.push({ name: 'Login' })
        window.location.reload()
      } catch (err) {
        console.error('Ошибка регистрации:', err)
        if (err.response) {
          if (err.response.status === 409) {
            this.error = 'Пользователь с таким email уже зарегистрирован'
          } else {
            this.error = err.response.data.message || 'Ошибка регистрации'
          }
        } else {
          this.error = 'Не удалось подключиться к серверу'
        }
      }
    }
  }
}
</script>

<style scoped>
.form-container {
  max-width: 500px;
  margin: 3rem auto;
  padding: 3rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
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

.doctor-register {
  margin-top: 2rem;
  text-align: center;
}
.btn-doctor {
  display: inline-block;
  padding: 0.6rem 1.2rem;
  background: #17a2b8;
  color: #fff;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.9rem;
}
.btn-doctor:hover {
  background: #138496;
}
</style>
