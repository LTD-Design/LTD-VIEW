import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Editor',
    component: () => import('@/views/Editor.vue')
  },
  {
    path: '/preview',
    name: 'Preview',
    component: () => import('@/views/Preview.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
