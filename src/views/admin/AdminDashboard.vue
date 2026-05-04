<script setup lang="ts">
import { computed } from 'vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import { useBands } from '@/composables/useBands'
import { useVenues } from '@/composables/useVenues'
import { useConcerts } from '@/composables/useConcerts'
import { useCategories } from '@/composables/useCategories'
import { useTags } from '@/composables/useTags'
import { useAuth } from '@/composables/useAuth'

const { user } = useAuth()
const { query: bandsQ } = useBands()
const { query: venuesQ } = useVenues()
const { query: concertsQ } = useConcerts()
const { query: categoriesQ } = useCategories()
const { query: tagsQ } = useTags()

const stats = computed(() => [
  { label: 'Bands', count: bandsQ.data.value?.length, link: '/admin/bands', color: '#818cf8' },
  { label: 'Venues', count: venuesQ.data.value?.length, link: '/admin/venues', color: '#34d399' },
  { label: 'Concerts', count: concertsQ.data.value?.length, link: '/admin/concerts', color: '#fb923c' },
  { label: 'Categories', count: categoriesQ.data.value?.length, link: '/admin/categories', color: '#a78bfa' },
  { label: 'Tags', count: tagsQ.data.value?.length, link: '/admin/tags', color: '#22d3ee' },
])
</script>

<template>
  <AdminLayout>
    <div class="p-8 max-w-4xl">
      <div class="mb-8">
        <h1 class="text-xl font-bold mb-1" style="color:#e2e8f0;">
          Welcome back<span v-if="user">, {{ user.first_name }}</span>
        </h1>
        <p class="text-sm" style="color:#64748b;">BandMS Admin Panel — manage all your content below.</p>
      </div>

      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <RouterLink
          v-for="s in stats"
          :key="s.label"
          :to="s.link"
          class="stat-card"
        >
          <div class="text-2xl font-bold tabular-nums mb-1" :style="`color:${s.color};`">
            {{ s.count ?? '—' }}
          </div>
          <div class="text-xs font-medium" style="color:#94a3b8;">{{ s.label }}</div>
        </RouterLink>
      </div>

      <div class="mt-10">
        <h2 class="text-xs font-semibold uppercase tracking-wider mb-3" style="color:#475569;">Quick actions</h2>
        <div class="flex flex-wrap gap-2">
          <RouterLink to="/admin/bands" class="quick-btn">+ Band</RouterLink>
          <RouterLink to="/admin/venues" class="quick-btn">+ Venue</RouterLink>
          <RouterLink to="/admin/concerts" class="quick-btn">+ Concert</RouterLink>
          <RouterLink to="/admin/posts" class="quick-btn">+ Post</RouterLink>
          <RouterLink to="/admin/photos" class="quick-btn">+ Photo</RouterLink>
          <RouterLink to="/admin/categories" class="quick-btn">+ Category</RouterLink>
          <RouterLink to="/admin/tags" class="quick-btn">+ Tag</RouterLink>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>
.stat-card {
  display: flex; flex-direction: column; justify-content: center;
  padding: 1.25rem; border-radius: 0.75rem; text-decoration: none;
  background: #111128; border: 1px solid #2d2a6e;
  transition: border-color 150ms, background 150ms;
}
.stat-card:hover { background: #151535; border-color: #4338ca; }
.quick-btn {
  padding: 0.375rem 0.875rem; border-radius: 0.5rem; font-size: 0.8125rem;
  font-weight: 500; text-decoration: none; color: #a5b4fc;
  background: #1e1b4b; border: 1px solid #312e81;
  transition: background 120ms;
}
.quick-btn:hover { background: #2d2a6e; }
</style>
