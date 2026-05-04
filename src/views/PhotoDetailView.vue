<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { usePhoto } from '@/composables/usePhotos'

const route  = useRoute()
const router = useRouter()
const { isLoggedIn } = useAuth()

const photoId = computed(() => {
  const id = Number(route.params.id)
  return isNaN(id) ? null : id
})

const { data: photo, isPending, isError } = usePhoto(photoId)

function formatDate(iso: string | null) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<template>
  <div style="padding: 1.5rem; max-width: 900px; margin: 0 auto;">
    <div style="margin-bottom: 1rem;">
      <button @click="router.push('/photos')">← Back to photos</button>
    </div>

    <div v-if="isPending">Loading…</div>
    <div v-else-if="isError">Photo not found.</div>

    <article v-else-if="photo">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 1rem;">
        <div>
          <h1 style="margin: 0 0 0.4rem;">{{ photo.title }}</h1>
          <div style="font-size: 0.9em; opacity: 0.6; display: flex; flex-wrap: wrap; gap: 0.4rem;">
            <span v-if="photo.taken_at">{{ formatDate(photo.taken_at) }}</span>
            <span v-if="photo.venue"> · {{ photo.venue.name }}</span>
            <span v-if="photo.concert"> · Event: {{ photo.concert.date }}</span>
          </div>
        </div>
        <button v-if="isLoggedIn" @click="router.push(`/photos/${photo.id}/edit`)">Edit</button>
      </div>

      <img
        v-if="photo.image"
        :src="photo.image"
        :alt="photo.title"
        style="width: 100%; max-height: 600px; object-fit: contain; border-radius: 6px; margin-bottom: 1.5rem; background: #111;"
      />

      <p v-if="photo.description" style="line-height: 1.7; white-space: pre-wrap; margin-bottom: 1.5rem;">{{ photo.description }}</p>

      <div v-if="photo.tags.length" style="margin-bottom: 1rem; display: flex; flex-wrap: wrap; gap: 0.4rem;">
        <span
          v-for="tag in photo.tags"
          :key="tag.id"
          style="font-size: 0.85em; padding: 0.15rem 0.5rem; border: 1px solid #555; border-radius: 3px; opacity: 0.7;"
        >{{ tag.name }}</span>
      </div>

      <div v-if="photo.posts.length" style="margin-top: 1rem;">
        <p style="margin-bottom: 0.5rem; opacity: 0.6; font-size: 0.9em;">Related posts</p>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          <a
            v-for="post in photo.posts"
            :key="post.id"
            style="font-size: 0.9em; color: inherit; text-decoration: underline; cursor: pointer;"
            @click="router.push(`/posts/${post.id}`)"
          >{{ post.title }}</a>
        </div>
      </div>
    </article>
  </div>
</template>
