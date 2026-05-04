<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { Venue, VenuePayload } from '@/types/venue'

const props = defineProps<{
  initial?: Venue | null
  loading?: boolean
  errors?: Record<string, string[]>
}>()

const emit = defineEmits<{ submit: [VenuePayload]; cancel: [] }>()

const form = reactive({ name: '', address: '', latitude: '', longitude: '' })

watch(() => props.initial, (val) => {
  form.name = val?.name ?? ''
  form.address = val?.address ?? ''
  form.latitude = val?.latitude != null ? String(val.latitude) : ''
  form.longitude = val?.longitude != null ? String(val.longitude) : ''
}, { immediate: true })

function submit() {
  emit('submit', {
    name: form.name,
    address: form.address || null,
    latitude: form.latitude !== '' ? parseFloat(form.latitude) : null,
    longitude: form.longitude !== '' ? parseFloat(form.longitude) : null,
  })
}
</script>

<template>
  <form @submit.prevent="submit" class="flex flex-col gap-4">
    <div>
      <label class="field-label">Name <span style="color:#f87171;">*</span></label>
      <input v-model="form.name" required class="field-input" placeholder="Venue name" />
      <p v-if="errors?.name" class="field-error">{{ errors.name[0] }}</p>
    </div>
    <div>
      <label class="field-label">Address</label>
      <input v-model="form.address" class="field-input" placeholder="Street address" />
      <p v-if="errors?.address" class="field-error">{{ errors.address[0] }}</p>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="field-label">Latitude</label>
        <input v-model="form.latitude" type="number" step="any" class="field-input" placeholder="52.2297" />
        <p v-if="errors?.latitude" class="field-error">{{ errors.latitude[0] }}</p>
      </div>
      <div>
        <label class="field-label">Longitude</label>
        <input v-model="form.longitude" type="number" step="any" class="field-input" placeholder="21.0122" />
        <p v-if="errors?.longitude" class="field-error">{{ errors.longitude[0] }}</p>
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
