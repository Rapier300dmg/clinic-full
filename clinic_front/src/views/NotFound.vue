<template>
  <div class="not-found">
    <h1>404 - Страница не найдена</h1>
    <p>Упс! Такой страницы не существует.</p>
    <router-link to="/">Вернуться на главную</router-link>
  </div>
</template>

<script>
export default {
  name: 'NotFoundPage'
}
</script>

<style scoped>
.not-found {
  text-align: center;
  margin-top: 5rem;
}
button {
  padding: 0.7rem 1.4rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
}
</style>
