<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { Photo, PhotoPayload } from '@/types/photo'
import type { Venue } from '@/types/venue'
import type { Concert } from '@/types/concert'
import type { Tag } from '@/types/tag'

const props = defineProps<{
  initial?: Photo | null
  venues: Venue[]
  concerts: Concert[]
  tags: Tag[]
  loading?: boolean
  errors?: Record<string, string[]>
}>()

const emit = defineEmits<{ submit: [PhotoPayload]; cancel: [] }>()

const form = reactive({
  title: '',
  description: '',
  image: '',
  venue_id: '' as string | '',
  concert_id: '' as string | '',
  taken_at: '',
  published_at: '',
  tag_ids: [] as number[],
})

watch(() => props.initial, (val) => {
  form.title = val?.title ?? ''
  form.description = val?.description ?? ''
  form.image = val?.image ?? ''
  form.venue_id = val?.venue?.id != null ? String(val.venue.id) : ''
  form.concert_id = val?.concert?.id != null ? String(val.concert.id) : ''
  form.taken_at = val?.taken_at ? val.taken_at.slice(0, 16) : ''
  form.published_at = val?.published_at ? val.published_at.slice(0, 16) : ''
  form.tag_ids = val?.tags?.map(t => t.id) ?? []
}, { immediate: true })

function toggleTag(id: number) {
  const idx = form.tag_ids.indexOf(id)
  if (idx === -1) form.tag_ids.push(id)
  else form.tag_ids.splice(idx, 1)
}

function submit() {
  emit('submit', {
    title: form.title,
    description: form.description || null,
    image: form.image || null,
    venue_id: form.venue_id ? parseInt(form.venue_id) : null,
    concert_id: form.concert_id ? parseInt(form.concert_id) : null,
    taken_at: form.taken_at || null,
    published_at: form.published_at || null,
    tag_ids: form.tag_ids,
  })
}
</script>

<template>
  <form @submit.prevent="submit" class="flex flex-col gap-4">
    <div>
      <label class="field-label">Title <span style="color:#f87171;">*</span></label>
      <input v-model="form.title" required class="field-input" placeholder="Photo title" />
      <p v-if="errors?.title" class="field-error">{{ errors.title[0] }}</p>
    </div>
    <div>
      <label class="field-label">Description</label>
      <textarea v-model="form.description" class="field-input" rows="2" placeholder="Optional description" />
      <p v-if="errors?.description" class="field-error">{{ errors.description[0] }}</p>
    </div>
    <div>
      <label class="field-label">Image URL</label>
      <input v-model="form.image" class="field-input" placeholder="https://…" />
      <p v-if="errors?.image" class="field-error">{{ errors.image[0] }}</p>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="field-label">Venue</label>
        <select v-model="form.venue_id" class="field-input">
          <option value="">— none —</option>
          <option v-for="v in venues" :key="v.id" :value="String(v.id)">{{ v.name }}</option>
        </select>
      </div>
      <div>
        <label class="field-label">Concert</label>
        <select v-model="form.concert_id" class="field-input">
          <option value="">— none —</option>
          <option v-for="c in concerts" :key="c.id" :value="String(c.id)">{{ c.date }} — {{ c.venue?.name }}</option>
        </select>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="field-label">Taken at</label>
        <input v-model="form.taken_at" type="datetime-local" class="field-input" />
      </div>
      <div>
        <label class="field-label">Publish at</label>
        <input v-model="form.published_at" type="datetime-local" class="field-input" />
      </div>
    </div>
    <div>
      <label class="field-label">Tags</label>
      <div class="checkbox-list">
        <label v-for="t in tags" :key="t.id" class="checkbox-item">
          <input type="checkbox" :checked="form.tag_ids.includes(t.id)" @change="toggleTag(t.id)" />
          <span>{{ t.name }}</span>
        </label>
        <p v-if="!tags.length" class="text-xs" style="color:#475569;">None.</p>
      </div>
    </div>
    <div class="flex gap-2 justify-end pt-1">
      <button type="button" @click="$emit('cancel')" class="btn-ghost">Cancel</button>
      <button type="submit" :disabled="loading" class="btn-primary">
        {{ loading ? 'Saving…' : (initial ? 'Update' : 'Create') }}
      </button>
    </div>
  </form>
</template>

<style scoped src="../form-styles.css" />
