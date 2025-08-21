import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/',
      component: () => import('@/layouts/DashboardLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '/outgoing-calls',
          name: 'Исходящие звонки',
          component: () => import('@/views/OutgoingCalls.vue')
        },
        {
          path: '/incoming-calls',
          name: 'Входящие звонки',
          component: () => import('@/views/StatisticsView.vue')
        },
        {
          path: '/list-collections',
          name: 'Список коллекций',
          component: () => import('@/views/SmsFrames.vue')
        },
        {
          path: '/settings',
          name: 'SIP Настройки',
          component: () => import('@/views/SmsFrames.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/outgoing-calls')
  } else {
    next()
  }
})

export default router