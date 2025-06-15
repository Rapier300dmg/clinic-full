<template>
  <div v-if="isPatient" class="font-mont bg-gray-50 min-h-screen py-10">
    <div class="text-center text-2xl text-teal-700 font-semibold">
      Добро пожаловать в МедСистему!
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'HomePage',
  setup() {
    const userRole = localStorage.getItem('role')
    const isPatient = computed(() => userRole === 'patient')

    return {
      isPatient
    }
  }
})
</script>

<style scoped>
.home-page {
  font-family: Arial, sans-serif;
  color: #333;
}
</style>
