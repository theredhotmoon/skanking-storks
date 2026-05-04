<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { Concert, ConcertPayload } from '@/types/concert'
import type { Venue } from '@/types/venue'
import type { Band } from '@/types/band'

const props = defineProps<{
  initial?: Concert | null
  venues: Venue[]
  bands: Band[]
  loading?: boolean
  errors?: Record<string, string[]>
}>()

const emit = defineEmits<{ submit: [ConcertPayload]; cancel: [] }>()

const form = reactive({ venue_id: 0, date: '', time: '', description: '', band_ids: [] as number[] })

watch(() => props.initial, (val) => {
  form.venue_id = val?.venue?.id ?? 0
  form.date = val?.date ?? ''
  form.time = val?.time ?? ''
  form.description = val?.description ?? ''
  form.band_ids = val?.bands?.map(b => b.id) ?? []
}, { immediate: true })

function toggleBand(id: number) {
  const idx = form.band_ids.indexOf(id)
  if (idx === -1) form.band_ids.push(id)
  else form.band_ids.splice(idx, 1)
}

function submit() {
  emit('submit', {
    venue_id: form.venue_id,
    date: form.date,
    time: form.time || null,
    description: form.description || null,
    band_ids: form.band_ids,
  })
}
</script>

<template>
  <form @submit.prevent="submit" class="flex flex-col gap-4">
    <div>
      <label class="field-label">Venue <span style="color:#f87171;">*</span></label>
      <select v-model="form.venue_id" required class="field-input">
        <option :value="0" disabled>Select a venue…</option>
        <option v-for="v in venues" :key="v.id" :value="v.id">{{ v.name }}</option>
      </select>
      <p v-if="errors?.venue_id" class="field-error">{{ errors.venue_id[0] }}</p>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="field-label">Date <span style="color:#f87171;">*</span></label>
        <input v-model="form.date" type="date" required class="field-input" />
        <p v-if="errors?.date" class="field-error">{{ errors.date[0] }}</p>
      </div>
      <div>
        <label class="field-label">Time</label>
        <input v-model="form.time" type="time" class="field-input" />
        <p v-if="errors?.time" class="field-error">{{ errors.time[0] }}</p>
      </div>
    </div>
    <div>
      <label class="field-label">Description</label>
      <textarea v-model="form.description" class="field-input" rows="2" placeholder="Optional description" />
      <p v-if="errors?.description" class="field-error">{{ errors.description[0] }}</p>
    </div>
    <div>
      <label class="field-label">Bands</label>
      <div class="checkbox-list">
        <label v-for="band in bands" :key="band.id" class="checkbox-item">
          <input type="checkbox" :checked="form.band_ids.includes(band.id)" @change="toggleBand(band.id)" />
          <span>{{ band.name }}</span>
        </label>
        <p v-if="!bands.length" class="text-xs" style="color:#475569;">No bands available.</p>
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
