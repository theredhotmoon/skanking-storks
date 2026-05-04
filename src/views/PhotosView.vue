<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { usePhotos } from '@/composables/usePhotos'
import { useConcerts } from '@/composables/useConcerts'
import { useTags } from '@/composables/useTags'
import { useVenues } from '@/composables/useVenues'
import type { PhotoFilters } from '@/api/photos'
import type { PhotoSummary } from '@/types/photo'

const router = useRouter()
const { isLoggedIn } = useAuth()

const searchInput    = ref('')
const selectedVenue  = ref<number | undefined>()
const selectedConcert = ref<number | undefined>()
const selectedTag    = ref<number | undefined>()

const filters = computed<PhotoFilters>(() => ({
  search:     searchInput.value || undefined,
  venue_id:   selectedVenue.value,
  concert_id: selectedConcert.value,
  tag_id:     selectedTag.value,
}))

const { query, remove }           = usePhotos(filters)
const { query: venuesQuery }      = useVenues()
const { query: concertsQuery }    = useConcerts()
const { query: tagsQuery }        = useTags()

function formatDate(iso: string | null) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

async function confirmDelete(photo: PhotoSummary) {
  if (!confirm(`Delete "${photo.title}"?`)) return
  await remove.mutateAsync(photo.id)
}
</script>

<template>
  <div style="padding: 1.5rem; max-width: 1000px; margin: 0 auto;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
      <h1>Photos</h1>
      <button v-if="isLoggedIn" @click="router.push('/photos/new')">+ New photo</button>
    </div>

    <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
      <input
        v-model="searchInput"
        type="search"
        placeholder="Search photos…"
        style="flex: 1; min-width: 200px;"
      />
      <select v-model="selectedVenue" style="min-width: 150px;">
        <option :value="undefined">All venues</option>
        <option v-for="v in venuesQuery.data.value" :key="v.id" :value="v.id">{{ v.name }}</option>
      </select>
      <select v-model="selectedConcert" style="min-width: 160px;">
        <option :value="undefined">All events</option>
        <option v-for="c in concertsQuery.data.value" :key="c.id" :value="c.id">
          {{ c.date }} {{ c.venue?.name ? `— ${c.venue.name}` : '' }}
        </option>
      </select>
      <select v-model="selectedTag" style="min-width: 130px;">
        <option :value="undefined">All tags</option>
        <option v-for="tag in tagsQuery.data.value" :key="tag.id" :value="tag.id">{{ tag.name }}</option>
      </select>
    </div>

    <div v-if="query.isPending.value">Loading photos…</div>
    <div v-else-if="query.isError.value">Failed to load photos.</div>
    <div v-else-if="!query.data.value?.length" style="opacity: 0.6;">
      {{ searchInput || selectedVenue || selectedConcert || selectedTag ? 'No photos match your filters.' : 'No photos yet.' }}
    </div>

    <div v-else style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">
      <article
        v-for="photo in query.data.value"
        :key="photo.id"
        style="border: 1px solid #333; border-radius: 6px; overflow: hidden; cursor: pointer;"
        @click="router.push(`/photos/${photo.id}`)"
      >
        <div style="padding: 0.75rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem;">
            <div style="flex: 1; min-width: 0;">
              <h3 style="margin: 0 0 0.25rem; font-size: 1rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                {{ photo.title }}
              </h3>
              <div style="font-size: 0.8em; opacity: 0.6;">
                <span v-if="photo.taken_at">{{ formatDate(photo.taken_at) }}</span>
                <span v-if="photo.venue"> · {{ photo.venue.name }}</span>
              </div>
            </div>
            <div v-if="isLoggedIn" style="display: flex; gap: 0.25rem; flex-shrink: 0;" @click.stop>
              <button @click="router.push(`/photos/${photo.id}/edit`)">Edit</button>
              <button @click="confirmDelete(photo)">Delete</button>
            </div>
          </div>

          <p v-if="photo.description" style="margin: 0.5rem 0 0; font-size: 0.9em; opacity: 0.7; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            {{ photo.description }}
          </p>

          <div v-if="photo.tags.length" style="display: flex; flex-wrap: wrap; gap: 0.3rem; margin-top: 0.5rem;">
            <span
              v-for="tag in photo.tags"
              :key="tag.id"
              style="font-size: 0.75em; padding: 0.1rem 0.4rem; border: 1px solid #555; border-radius: 3px; opacity: 0.7;"
            >{{ tag.name }}</span>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>
