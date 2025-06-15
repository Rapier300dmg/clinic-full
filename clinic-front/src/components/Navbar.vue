<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="nav-logo-wrapper">
        <router-link to="/" class="nav-logo">МедСистема</router-link>
      </div>

      <div class="menu-icon" @click="toggleMenu">
        <span v-if="!isMenuOpen">&#9776;</span>
        <span v-else>&times;</span>
      </div>

      <div :class="['nav-links', { open: isMenuOpen }]">
        <router-link v-if="!isAuthenticated || userRole === 'patient'" to="/">Главная</router-link>
        <router-link v-if="isAuthenticated && userRole === 'patient'" to="/appointment/book">Записаться к врачу</router-link>
        <router-link v-if="isAuthenticated && userRole === 'patient'" :to="{ name: 'AppointmentList' }">Мои записи</router-link>
        <router-link v-if="isAuthenticated && userRole === 'doctor'" :to="{ name: 'DoctorAppointments' }">Мои приёмы</router-link>
        <router-link v-if="isAuthenticated && userRole === 'manager'" to="/manager/reviews">Отзывы</router-link>
        <router-link v-if="isAuthenticated && userRole === 'manager'" to="/manager">Панель менеджера</router-link>
        <router-link v-if="isAuthenticated && userRole === 'manager'" to="/register/doctor">Регистрация врача</router-link>
        <router-link
          v-if="isAuthenticated && userRole !== 'manager'"
          :to="userRole === 'doctor' ? '/doctor-profile' : '/profile'"
        >
          Профиль
        </router-link>
        <router-link v-if="!isAuthenticated" to="/login">Войти</router-link>
        <router-link v-if="!isAuthenticated" to="/register">Регистрация</router-link>
        <button v-if="isAuthenticated" @click="logout" class="btn-logout">Выход</button>
      </div>
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
      this.isMenuOpen = false
      this.$router.push({ name: 'Login' }).then(() => {
        window.location.reload()
      })
    }
  }
}
</script>

<style scoped>
:root {
  --primary-color: rgba(0, 0, 0, 0.8);
  --nav-text-color: #ffffff;
  --active-link-border: #4fd1c5;
}

.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  background-color: var(--primary-color);
  backdrop-filter: blur(8px);
  padding: 1.2rem 0;
  z-index: 100;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between; /* логотип слева, ссылки — справа */
}

.nav-logo-wrapper {
  position: static;    /* логотип в потоке */
  transform: none;
  /* margin-right не нужен */
}

.nav-logo {
  color: var(--nav-text-color);
  font-size: 2.4rem;
  font-weight: bold;
  text-decoration: none;
}

.menu-icon {
  display: none;
  font-size: 2.8rem;
  color: var(--nav-text-color);
  cursor: pointer;
}

.nav-links {
  display: flex;
  gap: 1.2rem;
  align-items: center;
  flex-wrap: wrap;
  /* margin-left: auto не нужен */
}

.nav-links a,
.nav-links button {
  color: var(--nav-text-color);
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.4rem 0.6rem;
  transition: color 0.2s;
}

.router-link-active {
  border-bottom: 2px solid var(--active-link-border);
  font-weight: bold;
}

.btn-logout {
  margin-left: 0.5rem;
}

@media (max-width: 768px) {
  .menu-icon {
    display: block;
  }
  .nav-links {
    position: absolute;
    top: 100%;
    right: 0;
    left: 0;
    background-color: var(--primary-color);
    backdrop-filter: blur(8px);
    flex-direction: column;
    align-items: center;
    max-height: 0;
    overflow-y: auto;
    transition: max-height 0.3s ease-out;
  }
  .nav-links.open {
    max-height: 100vh;
  }
  .nav-links a,
  .nav-links button {
    width: 100%;
    padding: 1rem 0;
    text-align: center;
  }
}
</style>
