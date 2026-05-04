<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConcerts } from '@/composables/useConcerts'
import { usePhoto, usePhotos } from '@/composables/usePhotos'
import { usePosts } from '@/composables/usePosts'
import { useTags } from '@/composables/useTags'
import { useVenues } from '@/composables/useVenues'

const route  = useRoute()
const router = useRouter()

const photoId = computed(() => {
  const id = Number(route.params.id)
  return isNaN(id) ? null : id
})
const isEdit = computed(() => photoId.value !== null)

const { create, update }          = usePhotos()
const photoQuery                  = usePhoto(photoId)
const { query: venuesQuery }      = useVenues()
const { query: concertsQuery }    = useConcerts()
const { query: tagsQuery }        = useTags()
const { query: postsQuery }       = usePosts()

// Form state
const title       = ref('')
const description = ref('')
const image       = ref<string | null>(null)
const venueId     = ref<number | null>(null)
const concertId   = ref<number | null>(null)
const takenAt     = ref('')
const publishedAt = ref('')
const tagIds      = ref<number[]>([])
const postIds     = ref<number[]>([])

const saving   = computed(() => create.isPending.value || update.isPending.value)
const apiError = computed(() => (create.error.value ?? update.error.value)?.message ?? null)

watch(photoQuery.data, (photo) => {
  if (!photo) return
  title.value       = photo.title
  description.value = photo.description ?? ''
  image.value       = photo.image
  venueId.value     = photo.venue?.id ?? null
  concertId.value   = photo.concert?.id ?? null
  takenAt.value     = photo.taken_at ? photo.taken_at.slice(0, 16) : ''
  publishedAt.value = photo.published_at ? photo.published_at.slice(0, 16) : ''
  tagIds.value      = photo.tags.map((t) => t.id)
  postIds.value     = photo.posts.map((p) => p.id)
}, { immediate: true })

function handlePaste(e: ClipboardEvent) {
  const items = e.clipboardData?.items
  if (!items) return
  for (const item of items) {
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile()
      if (!file) continue
      const reader = new FileReader()
      reader.onload = (ev) => { image.value = ev.target?.result as string }
      reader.readAsDataURL(file)
      e.preventDefault()
      break
    }
  }
}

onMounted(() => document.addEventListener('paste', handlePaste))
onUnmounted(() => document.removeEventListener('paste', handlePaste))

function toggleTag(id: number) {
  const idx = tagIds.value.indexOf(id)
  if (idx === -1) tagIds.value.push(id)
  else tagIds.value.splice(idx, 1)
}

function togglePost(id: number) {
  const idx = postIds.value.indexOf(id)
  if (idx === -1) postIds.value.push(id)
  else postIds.value.splice(idx, 1)
}

async function submit() {
  const payload = {
    title:        title.value,
    description:  description.value || null,
    image:        image.value,
    venue_id:     venueId.value,
    concert_id:   concertId.value,
    taken_at:     takenAt.value || null,
    published_at: publishedAt.value || null,
    tag_ids:      tagIds.value,
    post_ids:     postIds.value,
  }

  if (isEdit.value) {
    await update.mutateAsync({ id: photoId.value!, payload })
  } else {
    await create.mutateAsync(payload)
  }
  router.push('/photos')
}
</script>

<template>
  <div style="padding: 1.5rem; max-width: 800px; margin: 0 auto;">
    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
      <button @click="router.push('/photos')">← Back</button>
      <h1 style="margin: 0;">{{ isEdit ? 'Edit photo' : 'New photo' }}</h1>
    </div>

    <div v-if="isEdit && photoQuery.isPending.value">Loading photo…</div>

    <div v-else style="display: flex; flex-direction: column; gap: 1.25rem;">

      <label>
        Title *
        <input v-model="title" type="text" placeholder="Photo title" style="display: block; width: 100%; margin-top: 0.25rem;" />
      </label>

      <label>
        Description
        <textarea
          v-model="description"
          rows="4"
          placeholder="Optional description…"
          style="display: block; width: 100%; margin-top: 0.25rem; resize: vertical; font-family: inherit;"
        />
      </label>

      <div>
        <p style="margin-bottom: 0.4rem;">
          Image
          <span style="font-size: 0.85em; opacity: 0.6;">— paste from clipboard (Ctrl+V / Cmd+V)</span>
        </p>
        <div v-if="image" style="position: relative; display: inline-block;">
          <img :src="image" alt="Photo preview" style="max-width: 100%; max-height: 400px; display: block; border-radius: 4px;" />
          <button style="position: absolute; top: 0.4rem; right: 0.4rem; font-size: 0.8em;" type="button" @click="image = null">Remove</button>
        </div>
        <div
          v-else
          style="border: 2px dashed #444; border-radius: 6px; padding: 2rem; text-align: center; opacity: 0.5;"
        >
          No image — paste one with Ctrl+V / Cmd+V
        </div>
      </div>

      <label>
        Date taken
        <input v-model="takenAt" type="datetime-local" style="display: block; margin-top: 0.25rem;" />
      </label>

      <label>
        Publish date &amp; time
        <input v-model="publishedAt" type="datetime-local" style="display: block; margin-top: 0.25rem;" />
        <small style="opacity: 0.6;">Leave blank to save as draft.</small>
      </label>

      <label>
        Venue
        <select v-model="venueId" style="display: block; margin-top: 0.25rem; min-width: 200px;">
          <option :value="null">— none —</option>
          <option v-for="v in venuesQuery.data.value" :key="v.id" :value="v.id">{{ v.name }}</option>
        </select>
      </label>

      <label>
        Event (concert)
        <select v-model="concertId" style="display: block; margin-top: 0.25rem; min-width: 200px;">
          <option :value="null">— none —</option>
          <option v-for="c in concertsQuery.data.value" :key="c.id" :value="c.id">
            {{ c.date }}{{ c.venue?.name ? ` — ${c.venue.name}` : '' }}
          </option>
        </select>
      </label>

      <div v-if="tagsQuery.data.value?.length">
        <p style="margin-bottom: 0.4rem;">Tags</p>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          <label
            v-for="tag in tagsQuery.data.value"
            :key="tag.id"
            style="display: flex; align-items: center; gap: 0.3rem; cursor: pointer;"
          >
            <input type="checkbox" :checked="tagIds.includes(tag.id)" @change="toggleTag(tag.id)" />
            {{ tag.name }}
          </label>
        </div>
      </div>

      <div v-if="postsQuery.data.value?.length">
        <p style="margin-bottom: 0.4rem;">Related posts</p>
        <div style="display: flex; flex-direction: column; gap: 0.3rem; max-height: 200px; overflow-y: auto; padding: 0.25rem 0;">
          <label
            v-for="post in postsQuery.data.value"
            :key="post.id"
            style="display: flex; align-items: center; gap: 0.4rem; cursor: pointer;"
          >
            <input type="checkbox" :checked="postIds.includes(post.id)" @change="togglePost(post.id)" />
            {{ post.title }}
          </label>
        </div>
      </div>

      <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
        <button :disabled="saving" @click="submit">
          {{ saving ? 'Saving…' : (isEdit ? 'Save changes' : 'Add photo') }}
        </button>
        <button @click="router.push('/photos')">Cancel</button>
      </div>

      <p v-if="apiError" style="color: #f87171;">{{ apiError }}</p>
    </div>
  </div>
</template>
