import { createRouter, createWebHistory } from 'vue-router'

import Home                   from '@/views/Home.vue'
import UserProfile            from '@/views/UserProfile.vue'
import UserRegister           from '@/views/UserRegister.vue'
import UserLoginPage          from '@/views/UserLoginPage.vue'
import DoctorsList            from '@/views/DoctorsList.vue'
import DoctorDetails          from '@/views/DoctorDetails.vue'
import DoctorRegisterPage     from '@/views/DoctorRegisterPage.vue'
import DoctorProfile          from '@/views/DoctorProfile.vue'
import AppointmentPage        from '@/views/AppointmentPage.vue'
import AppointmentButton      from '@/components/AppointmentButton.vue'
import AppointmentBookPage    from '@/views/AppointmentBookPage.vue'
import AppointmentList        from '@/components/AppointmentList.vue'
import ManagerDashboard       from '@/views/ManagerDashboard.vue'
import NotFoundPage           from '@/views/NotFound.vue'

const routes = [
  { 
    path: '/', 
    name: 'Home', 
    component: Home 
  },
  { 
    path: '/profile', 
    name: 'UserProfile', 
    component: UserProfile 
  },
  { 
    path: '/register', 
    name: 'Register', 
    component: UserRegister 
  },
  { 
    path: '/register/doctor', 
    name: 'DoctorRegister', 
    component: DoctorRegisterPage 
  },
  { 
    path: '/login', 
    name: 'Login', 
    component: UserLoginPage 
  },
  { 
    path: '/doctors', 
    name: 'DoctorsList', 
    component: DoctorsList 
  },
  { 
    path: '/doctors/:id', 
    name: 'DoctorDetails', 
    component: DoctorDetails, 
    props: true 
  },
  { 
    path: '/doctor-profile', 
    name: 'DoctorProfile', 
    component: DoctorProfile, 
    meta: { requiresAuth: true, role: 'doctor' }
  },
  { 
    path: '/appointment', 
    name: 'Appointment', 
    component: AppointmentPage 
  },
  { 
    path: '/appointment/:doctorId', 
    name: 'AppointmentButton', 
    component: AppointmentButton, 
    props: true 
  },
  {
    path: '/appointment/book',
    name: 'AppointmentBook',
    component: AppointmentBookPage,
    meta: { requiresAuth: true, role: 'patient' }
  },
  {
    path: '/appointments',
    name: 'AppointmentList',
    component: AppointmentList,
    meta: { requiresAuth: true, role: ['patient','doctor'] }
  },
  {
    path: '/manager',
    name: 'ManagerDashboard',
    component: ManagerDashboard,
    meta: { requiresAuth: true, role: 'manager' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const role  = localStorage.getItem('role')

  if (to.meta.requiresAuth && !token) {
    return next({ name: 'Login' })
  }
  
  if (to.meta.role) {
    const allowed = Array.isArray(to.meta.role)
      ? to.meta.role.includes(role)
      : to.meta.role === role
    if (!allowed) {
      if (role === 'manager') {
        return next({ name: 'ManagerDashboard' })
      }
      return next({ name: 'Home' })
    }
  }
  if (role === 'manager' && to.name === 'Home') {
    return next({ name: 'ManagerDashboard' })
  }

  next()
})

export default router
