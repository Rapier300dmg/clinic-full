<template>
  <div class="doctor-card">
    <h2>{{ doctor.firstName }} {{ doctor.lastName }}</h2>
    <p v-if="doctor.DoctorProfile && doctor.DoctorProfile.Speciality">
      {{ doctor.DoctorProfile.Speciality.speciality }} — {{ doctor.DoctorProfile.Speciality.experience }} лет стажа
    </p>
    <p v-else>Специализация не указана</p>
  </div>
</template>

<script>
export default {
  name: 'DoctorCard',
  props: {
    doctor: { type: Object, required: true }
  }
}
</script>

<style scoped>
.doctor-card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem;
  text-align: center;
  width: 250px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}
</style>
