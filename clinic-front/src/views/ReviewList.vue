<template>
    <div class="review-list">
      <h2>Отзывы пациентов</h2>
      <p v-if="error" class="error">{{ error }}</p>
  
      <ul v-if="reviews.length">
        <li v-for="r in reviews" :key="r.id" class="review-item">
          <p><strong>Врач:</strong> {{ r.Doctor?.doctorName || '—' }}</p>
          <p><strong>Пациент:</strong> {{ r.Patient?.firstName }} {{ r.Patient?.lastName }}</p>
          <p><strong>Оценка:</strong> {{ r.rating }} / 5</p>
          <p><strong>Комментарий:</strong> {{ r.comment }}</p>
          <p><strong>Дата:</strong> {{ formatDate(r.createdAt) }}</p>
          <button @click="deleteReview(r.id)">Удалить</button>
        </li>
      </ul>
  
      <p v-else>Отзывы отсутствуют.</p>
    </div>
  </template>
  
  <script>
  import api from '@/services/api'
  import dayjs from 'dayjs'
  
  export default {
    name: 'ReviewList',
    data() {
      return {
        reviews: [],
        error: ''
      }
    },
    methods: {
      async fetchReviews() {
        try {
          const { data } = await api.get('/review/all')
          this.reviews = data
        } catch (err) {
          this.error = err.response?.data?.message || 'Не удалось загрузить отзывы'
        }
      },
      async deleteReview(id) {
        if (!confirm('Удалить отзыв?')) return
        try {
          await api.delete(`/review/${id}`)
          this.reviews = this.reviews.filter(r => r.id !== id)
        } catch (err) {
          alert('Ошибка при удалении отзыва')
          console.error(err)
        }
      },
      formatDate(dateStr) {
        return dayjs(dateStr).format('DD.MM.YYYY HH:mm')
      }
    },
    mounted() {
      const token = localStorage.getItem('token')
      if (token) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`
      }
      this.fetchReviews()
    }
  }
  </script>
  
  <style scoped>
  .review-list {
    max-width: 800px;
    margin: 2rem auto;
  }
  .review-item {
    background: #f9f9f9;
    border: 1px solid #ddd;
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 6px;
  }
  .review-item p {
    margin: 0.3rem 0;
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
  }
  </style>
  