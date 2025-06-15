<template>
  <div class="home-page">
    <!-- Карусель -->
    <div class="carousel-wrapper">
      <Carousel
        class="carousel"
        :itemsToShow="1"
        :wrapAround="true"
        :autoplay="4000"
        :pauseAutoplayOnHover="true"
        :mouseDrag="true"
        :transition="600"
      >
        <Slide
          v-for="(s, i) in slides"
          :key="i"
          class="slide"
        >
          <img :src="s.src" class="slide-img" />
          <div class="slide-caption">
            <h3>{{ s.title }}</h3>
            <p>{{ s.text }}</p>
          </div>
        </Slide>
      </Carousel>
    </div>

    <!-- Секция о клинике -->
    <div class="clinic-block">
      <div class="clinic-photo">
        <img src="@/assets/5.jpg" alt="О клинике" />
      </div>
      <div class="clinic-info">
        <h2>О клинике</h2>
        <p>
          Nova Medical Centre – это медицинский центр экспертного уровня, где удобно проводить диагностику, лечение и профилактику заболеваний… 
        </p>
        <ul class="stats">
          <li><strong>250+</strong> Специалистов</li>
          <li><strong>1 млн+</strong> Пациентов</li>
          <li><strong>11</strong> Филиалов</li>
          <li><strong>1500+</strong> Приёмов в день</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { Carousel, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'

export default defineComponent({
  name: 'HomePage',
  components: { Carousel, Slide },
  setup() {
    const slides = ref([
      {
        src: new URL('../assets/1.jpg', import.meta.url).href,
        title: 'Отслеживайте свои приёмы',
        text: 'Удобный календарь и напоминания помогут вам не пропустить визит.'
      },
      {
        src: new URL('../assets/2.jpg', import.meta.url).href,
        title: 'Лучшие МРТ',
        text: 'Оборудование международного уровня.'
      },
      {
        src: new URL('../assets/uzi.jpg', import.meta.url).href,
        title: 'Результаты анализов',
        text: 'Скачивайте результаты в PDF.'
      }
    ])
    return { slides }
  }
})
</script>

<style scoped>
.home-page {
  background: #f7fafc;
  padding-bottom: 4rem;
  max-width: 800px; 
  margin: 0 auto;
}

.carousel-wrapper {
  max-width: 800px;
  margin: 2rem auto;
}
.carousel {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.slide {
  position: relative;
  height: 400px;
}
.slide-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.slide-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(0,0,0,0.5);
  color: #fff;
  padding: 1rem;
}
.slide-caption h3 {
  margin: 0 0 0.5rem;
}
.slide-caption p {
  margin: 0;
}

.clinic-block {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 800px;
  margin: 3rem auto;
  align-items: start;
}
.clinic-photo img {
  width: 100%;
  border-radius: 8px;
  object-fit: cover;
}
.clinic-info {
  max-width: 400px; 
  margin-left: auto;
  background: rgba(255,255,255,0.85);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.clinic-info h2 {
  margin-top: 0;
  font-size: 1.8rem;
}
.clinic-info p {
  line-height: 1.6;
  color: #4a5568;
}
.stats {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}
.stats li {
  font-size: 1rem;
  color: #2d3748;
}
.stats strong {
  display: block;
  font-size: 1.4rem;
  color: #38b2ac;
}

/* Адаптив */
@media (max-width: 768px) {
  .carousel-wrapper {
    padding: 0 1rem;
  }
  .clinic-block {
    grid-template-columns: 1fr;
  }
}
</style>
