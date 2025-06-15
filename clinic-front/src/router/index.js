import { createRouter, createWebHistory } from 'vue-router'

import Home                   from '@/views/Home.vue'
import UserProfile            from '@/views/UserProfile.vue'
import UserRegister           from '@/views/UserRegister.vue'
import UserLoginPage          from '@/views/UserLoginPage.vue'
import DoctorDetails          from '@/views/DoctorDetails.vue'
import DoctorRegisterPage     from '@/views/DoctorRegisterPage.vue'
import DoctorProfile          from '@/views/DoctorProfile.vue'
import AppointmentButton      from '@/components/AppointmentButton.vue'
import AppointmentBookPage    from '@/views/AppointmentBookPage.vue'
import AppointmentList        from '@/components/AppointmentList.vue'
import DoctorAppointmentsPage from '@/views/DoctorAppointmentsPage.vue'
import ManagerDashboard       from '@/views/ManagerDashboard.vue'
import NotFoundPage           from '@/views/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: (to, from, next) => {
      const role = localStorage.getItem('role')
      if (role === 'doctor') return next({ name: 'DoctorAppointments' })
      if (role === 'manager') return next({ name: 'ManagerDashboard' })
      return next()
    }
  },
  
  {
    path: '/manager/reviews',
    name: 'ManagerReviewPanel',
    component: () => import('@/views/ManagerReviewPanel.vue'),
    meta: { requiresAuth: true, role: 'manager' }
  },

  { path: '/profile',             name: 'UserProfile',        component: UserProfile },
  { path: '/register',            name: 'Register',           component: UserRegister },
  { path: '/register/doctor',     name: 'DoctorRegister',     component: DoctorRegisterPage },
  { path: '/login',               name: 'Login',              component: UserLoginPage },
  { path: '/doctors/:id',         name: 'DoctorDetails',      component: DoctorDetails, props: true },
  { path: '/doctor-profile',      name: 'DoctorProfile',      component: DoctorProfile, meta: { requiresAuth: true, role: 'doctor' }},

  { path: '/appointment/:doctorId', name: 'AppointmentButton', component: AppointmentButton, props: true },
  { path: '/appointment/book',    name: 'AppointmentBook',    component: AppointmentBookPage, meta: { requiresAuth: true, role: 'patient' }},
  { path: '/appointments',        name: 'AppointmentList',    component: AppointmentList, meta: { requiresAuth: true, role: 'patient' }},
  { path: '/appointments/doctor', name: 'DoctorAppointments', component: DoctorAppointmentsPage, meta: { requiresAuth: true, role: 'doctor' }},
  { path: '/manager',             name: 'ManagerDashboard',   component: ManagerDashboard, meta: { requiresAuth: true, role: 'manager' }},
  { path: '/:pathMatch(.*)*',     name: 'NotFound',           component: NotFoundPage },
  {
    path: '/manager/reviews',
    name: 'ReviewList',
    component: () => import('@/views/ReviewList.vue'),
    meta: { requiresAuth: true, roles: ['manager'] }
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
      if (role === 'manager') return next({ name: 'ManagerDashboard' })
      if (role === 'doctor')  return next({ name: 'DoctorAppointments' })
      return next({ name: 'Home' })
    }
  }

  next()
})

export default router
