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

    // ── Admin panel (requires authentication) ──────────────────────────
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/admin/AdminDashboard.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/bands',
      name: 'admin-bands',
      component: () => import('@/views/admin/BandsAdminView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/venues',
      name: 'admin-venues',
      component: () => import('@/views/admin/VenuesAdminView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/concerts',
      name: 'admin-concerts',
      component: () => import('@/views/admin/ConcertsAdminView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/posts',
      name: 'admin-posts',
      component: () => import('@/views/admin/PostsAdminView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/categories',
      name: 'admin-categories',
      component: () => import('@/views/admin/CategoriesAdminView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/tags',
      name: 'admin-tags',
      component: () => import('@/views/admin/TagsAdminView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/photos',
      name: 'admin-photos',
      component: () => import('@/views/admin/PhotosAdminView.vue'),
      meta: { requiresAuth: true },
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

  if (to.meta.requiresAuth && !localStorage.getItem('auth_token')) {
    return { name: 'login' }
  }
})

export default router
