<template>
    <div class="review-panel">
      <h2>Отзывы пациентов</h2>
  
      <div v-if="error" class="error">{{ error }}</div>
  
      <ul v-else-if="reviews.length" class="review-list">
        <li v-for="r in reviews" :key="r.id" class="review-item">
          <p><strong>Пациент:</strong>
            {{ r.patient?.firstName || '—' }} {{ r.patient?.lastName || '' }}
          </p>
          <p><strong>Врач:</strong> {{ r.Doctor?.doctorName || '—' }}</p>
          <p><strong>Оценка:</strong> {{ r.rating }}/5</p>
          <p><strong>Комментарий:</strong> {{ r.comment }}</p>
        </li>
      </ul>
  
      <p v-else>Отзывов пока нет.</p>
    </div>
  </template>
  
  <script>
  import api from '@/services/api';
  
  export default {
    name: 'ManagerReviewPanel',
    data() {
      return {
        reviews: [],
        error: ''
      };
    },
    async mounted() {
      try {
        // const token = localStorage.getItem('token');
        // if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  
        const { data } = await api.get('/reviews');
        this.reviews = data;
      } catch (err) {
        console.error('Ошибка загрузки отзывов:', err);
        this.error = err.response?.data?.message || 'Ошибка при получении отзывов.';
      }
    }
  };
  </script>
  
  <style scoped>
  .review-panel {
    max-width: 800px;
    margin: 2rem auto;
    padding: 1rem;
  }
  
  .review-list {
    list-style: none;
    padding: 0;
  }
  
  .review-item {
    background: #f8f8f8;
    margin-bottom: 1rem;
    padding: 1rem;
    border-radius: 5px;
    border-left: 4px solid #4fd1c5;
  }
  
  .error {
    color: red;
    margin-bottom: 1rem;
  }
  </style>
  