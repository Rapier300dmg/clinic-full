<template>
  <nav class="navbar">
    <router-link to="/" class="nav-logo">МедСистема</router-link>
    <div class="menu-icon" @click="toggleMenu">
      <span v-if="!isMenuOpen">&#9776;</span>
      <span v-else>&times;</span>
    </div>
    <div :class="['nav-links', { open: isMenuOpen }]">
      <router-link v-if="userRole !== 'manager'" to="/">Главная</router-link>

      <router-link
        v-if="isAuthenticated && userRole === 'patient'"
        to="/appointment/book"
      >Записаться к врачу</router-link>

      <router-link
        v-if="isAuthenticated && userRole === 'manager'"
        to="/manager"
      >Панель менеджера</router-link>
      <router-link
        v-if="isAuthenticated && userRole === 'manager'"
        to="/register/doctor"
      >Регистрация врача</router-link>

      <router-link
        v-if="isAuthenticated && userRole !== 'manager'"
        :to="{ name: 'AppointmentList' }"
      >Ваши записи</router-link>

      <router-link
        v-if="isAuthenticated && userRole !== 'manager'"
        :to="userRole === 'doctor' ? '/doctor-profile' : '/profile'"
      >Профиль</router-link>

      <router-link
        v-if="!isAuthenticated"
        to="/login"
      >Войти</router-link>
      <router-link
        v-if="!isAuthenticated"
        to="/register"
      >Регистрация</router-link>

      <button
        v-if="isAuthenticated"
        @click="logout"
        class="btn-logout"
      >Выход</button>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'MainNavbar',
  data() {
    return {
      isMenuOpen: false
    }
  },
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem('token')
    },
    userRole() {
      return localStorage.getItem('role')
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
    },
    logout() {
      localStorage.clear()
      this.$router.push({ name: 'Login' }).then(() => {
        window.location.reload()
      })
    }
  }
}
</script>

<style scoped>
:root {
  --primary-color: #007bff;
  --nav-text-color: #f0f0f0;
}

.navbar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--primary-color);
  padding: 1rem 2rem;
  z-index: 10;
}

.nav-logo {
  color: var(--nav-text-color);
  font-size: 1.8rem;
  font-weight: bold;
  text-decoration: none;
}

.menu-icon {
  display: none;
  font-size: 2.2rem;
  color: var(--nav-text-color);
  cursor: pointer;
}

.nav-links {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-links a,
.nav-links button {
  color: var(--nav-text-color);
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.btn-logout {
  font-size: 1rem;
}

@media (max-width: 768px) {
  .menu-icon {
    display: block;
  }
  .nav-links {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--primary-color);
    flex-direction: column;
    align-items: center;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-out;
    width: 100%;
  }
  .nav-links.open {
    max-height: 400px;
  }
  .nav-links a,
  .nav-links button {
    width: 100%;
    padding: 0.8rem 0;
    text-align: center;
  }
}
</style>
