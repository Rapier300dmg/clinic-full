<template>
  <div id="app">
    <MainNavbar />

    <main class="content">
      <router-view />
    </main>

    <footer class="site-footer" v-if="showFooter">
      <div class="footer-container">
        <div class="footer-block">
          <h3 class="footer-title">МедСистема</h3>
          <p class="footer-text">Всё ради вашего здоровья</p>
        </div>

        <div class="footer-block">
          <h4 class="footer-subtitle">Навигация</h4>
          <ul class="footer-list">
            <li><router-link to="/" class="footer-link">Главная</router-link></li>
            <li><router-link to="/appointment/book" class="footer-link">Запись</router-link></li>
            <li><router-link to="/about" class="footer-link">О нас</router-link></li>
          </ul>
        </div>

        <div class="footer-block">
          <h4 class="footer-subtitle">Контакты</h4>
          <p class="footer-text">Телефон: +7 773 131-56-39</p>
          <p class="footer-text">Email: support@medsystem.kz</p>
          <div class="socials">
            <a href="#" aria-label="Facebook" class="social-link">FB</a>
            <a href="#" aria-label="Instagram" class="social-link">IG</a>
            <a href="#" aria-label="Twitter" class="social-link">TW</a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; MedSystem {{ new Date().getFullYear() }}</p>
      </div>
    </footer>
  </div>
</template>

<script>
import MainNavbar from '@/components/Navbar.vue'

export default {
  name: 'App',
  components: { MainNavbar },
  computed: {
    showFooter() {
      const token = localStorage.getItem('token')
      if (!token) return true
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        return !['manager','doctor'].includes(payload.role)
      } catch {
        return true
      }
    }
  }
}
</script>

<style>
body {
  background: url('~@/assets/bg.jpg') center/cover no-repeat fixed;
  margin: 0;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

:root {
  --footer-bg: #1a202c;
  --footer-text: #e2e8f0;
  --footer-accent: #4fd1c5;
  --footer-padding: 1rem 1rem;
  --footer-gap: 1rem;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1;
  padding: 6rem 2rem 2rem;
}

.site-footer {
  background-color: var(--footer-bg);
  color: var(--footer-text);
  padding: var(--footer-padding);
  flex-shrink: 0;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--footer-gap);
}

.footer-block {
  flex: 1;
  min-width: 160px;
}

.footer-title {
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
}

.footer-subtitle {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--footer-accent);
}

.footer-text {
  font-size: 1rem;
  margin: 0.3rem 0;
}

.footer-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-link {
  display: block;
  font-size: 1rem;
  color: var(--footer-text);
  text-decoration: none;
  margin-bottom: 0.3rem;
}

.footer-link:hover {
  color: var(--footer-accent);
}

.socials {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.4rem;
}

.social-link {
  width: 30px;
  height: 30px;
  font-size: 0.9rem;
}

.footer-bottom {
  text-align: center;
  font-size: 0.85rem;
  padding: 0.5rem 0;
  border-top: 1px solid rgba(226,232,240,0.2);
}

@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
    text-align: center;
  }
  .footer-block {
    margin-bottom: 1rem;
  }
}
</style>
