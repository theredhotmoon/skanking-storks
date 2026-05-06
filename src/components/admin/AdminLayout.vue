<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const { logout, user } = useAuth()
const router = useRouter()

async function handleLogout() {
  await logout()
  router.push('/login')
}
</script>

<template>
  <div class="flex min-h-screen" style="background:#08081a; color:#e2e8f0;">
    <!-- Sidebar -->
    <aside class="w-56 shrink-0 flex flex-col" style="background:#0d0d22; border-right:1px solid #2d2a6e;">
      <div class="px-5 py-4" style="border-bottom:1px solid #2d2a6e;">
        <div class="font-bold text-base leading-none">
          <span style="color:#e2e8f0;">Band</span><span style="color:#6366f1;">MS</span>
        </div>
        <div class="text-xs mt-1" style="color:#475569;">Admin Panel</div>
      </div>

      <nav class="flex-1 px-2 py-3 flex flex-col gap-0.5">
        <RouterLink to="/admin" class="nav-item" exact-active-class="nav-item--active">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          Dashboard
        </RouterLink>
        <RouterLink to="/admin/bands" class="nav-item" active-class="nav-item--active">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/></svg>
          Bands
        </RouterLink>
        <RouterLink to="/admin/venues" class="nav-item" active-class="nav-item--active">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          Venues
        </RouterLink>
        <RouterLink to="/admin/concerts" class="nav-item" active-class="nav-item--active">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Concerts
        </RouterLink>
        <RouterLink to="/admin/posts" class="nav-item" active-class="nav-item--active">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          Posts
        </RouterLink>
        <RouterLink to="/admin/categories" class="nav-item" active-class="nav-item--active">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>
          Categories
        </RouterLink>
        <RouterLink to="/admin/tags" class="nav-item" active-class="nav-item--active">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
          Tags
        </RouterLink>
        <RouterLink to="/admin/photos" class="nav-item" active-class="nav-item--active">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          Photos
        </RouterLink>
        <RouterLink to="/admin/releases" class="nav-item" active-class="nav-item--active">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
          Releases
        </RouterLink>
        <RouterLink to="/admin/tours" class="nav-item" active-class="nav-item--active">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Tours
        </RouterLink>
      </nav>

      <div class="px-2 py-3" style="border-top:1px solid #2d2a6e;">
        <div v-if="user" class="px-3 py-2 rounded-lg mb-1" style="background:#111128;">
          <div class="text-xs font-medium truncate" style="color:#e2e8f0;">{{ user.first_name }} {{ user.last_name }}</div>
          <div class="text-xs truncate" style="color:#475569;">{{ user.email }}</div>
        </div>
        <button @click="handleLogout" class="nav-item w-full" style="color:#f87171;">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          Sign out
        </button>
      </div>
    </aside>

    <main class="flex-1 min-w-0 overflow-auto">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.nav-icon { width: 1rem; height: 1rem; flex-shrink: 0; }
.nav-item {
  display: flex; align-items: center; gap: 0.625rem;
  width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.5rem;
  font-size: 0.875rem; font-weight: 500; color: #94a3b8;
  text-decoration: none; cursor: pointer; border: none;
  background: transparent; transition: background 120ms, color 120ms;
}
.nav-item:hover { background: #161630; color: #c7d2fe; }
.nav-item--active { background: #1e1b4b !important; color: #a5b4fc !important; }
</style>
