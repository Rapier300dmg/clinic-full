<template>
  <div id="app">
    <MainNavbar />
    <main class="content">
      <router-view />
      <section class="card">
        <h2>Наша клиника, всё ради здоровья</h2>
        <p>Тех поддержка: +7-773-131-56-39</p>
        <button class="primary-btn">Подробнее</button>
      </section>
    </main>
    <footer class="site-footer">
      <p>&copy;clinic</p>
    </footer>
  </div>
</template>

<script>
import MainNavbar from '@/components/Navbar.vue'

export default {
  name: 'App',
  components: {
    MainNavbar
  }
}
</script>

<style>
:root {

  --primary-color: #4f46e5;      
  --secondary-color: #10b981;   
  --accent-color: #f59e0b;      
  --text-color: #333;
  --bg-color: #f9f9f9;
  --card-bg: #ffffff;

  --font-base: 'Inter', sans-serif;
  --font-heading: 'Poppins', sans-serif;

  --transition-speed: 0.3s;
  --border-radius: 8px;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: var(--font-base);
  color: var(--text-color);
  background-color: var(--bg-color);
  line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  color: var(--text-color);
  margin: 0.5em 0;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}



.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  background-color: var(--card-bg);
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  margin: 1rem 0;
  transition: transform var(--transition-speed), box-shadow var(--transition-speed);
  animation: fadeInUp 0.5s ease-in-out;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.primary-btn {
  background-color: var(--secondary-color);
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  margin-top: 1rem;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-speed), transform var(--transition-speed);
}

.primary-btn:hover {
  background-color: var(--accent-color);
  transform: scale(1.02);
}

.primary-btn:active {
  transform: scale(0.98);
}

.site-footer {
  background-color: var(--primary-color);
  color: #fff;
  text-align: center;
  padding: 1rem;
}

@media (max-width: 768px) {
  .site-header {
    flex-direction: column;
    text-align: center;
  }

  .nav-list {
    flex-direction: column;
    gap: 1rem;
  }

  .content {
    padding: 1rem;
  }

  .card {
    width: 90%;
  }
}
</style>
