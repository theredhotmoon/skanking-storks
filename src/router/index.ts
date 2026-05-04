import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/concerts',
      name: 'concerts',
      component: () => import('@/views/ConcertsView.vue'),
    },
    {
      path: '/venues',
      name: 'venues',
      component: () => import('@/views/VenuesView.vue'),
    },
    {
      path: '/bands',
      name: 'bands',
      component: () => import('@/views/BandsView.vue'),
    },
    {
      path: '/posts',
      name: 'posts',
      component: () => import('@/views/PostsView.vue'),
    },
    {
      path: '/posts/new',
      name: 'post-create',
      component: () => import('@/views/PostFormView.vue'),
    },
    {
      path: '/posts/:id',
      name: 'post-detail',
      component: () => import('@/views/PostDetailView.vue'),
    },
    {
      path: '/posts/:id/edit',
      name: 'post-edit',
      component: () => import('@/views/PostFormView.vue'),
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('@/views/CategoriesView.vue'),
    },
    {
      path: '/tags',
      name: 'tags',
      component: () => import('@/views/TagsView.vue'),
    },
    {
      path: '/photos',
      name: 'photos',
      component: () => import('@/views/PhotosView.vue'),
    },
    {
      path: '/photos/new',
      name: 'photo-create',
      component: () => import('@/views/PhotoFormView.vue'),
    },
    {
      path: '/photos/:id',
      name: 'photo-detail',
      component: () => import('@/views/PhotoDetailView.vue'),
    },
    {
      path: '/photos/:id/edit',
      name: 'photo-edit',
      component: () => import('@/views/PhotoFormView.vue'),
    },
  ],
})

// Block path-traversal sequences in route params
const TRAVERSAL_RE = /(\.\.|\/\/|\\|%2e%2e|%252e)/i

router.beforeEach((to) => {
  for (const [key, value] of Object.entries(to.params)) {
    const raw = Array.isArray(value) ? value.join('/') : value
    if (TRAVERSAL_RE.test(raw)) {
      console.warn(`[router] Blocked suspicious param "${key}": ${raw}`)
      return { name: 'home' }
    }
  }
})

export default router
