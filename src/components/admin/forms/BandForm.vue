<script setup lang="ts">
import { reactive, watch } from 'vue'
import RichEditor from '@/components/admin/RichEditor.vue'
import type { Band, BandPayload } from '@/types/band'

const props = defineProps<{
  initial?: Band | null
  loading?: boolean
  errors?: Record<string, string[]>
}>()

const emit = defineEmits<{ submit: [BandPayload]; cancel: [] }>()

const form = reactive<{ name: string; bio: string }>({ name: '', bio: '' })

watch(
  () => props.initial,
  (val) => {
    form.name = val?.name ?? ''
    form.bio  = val?.bio ?? ''
  },
  { immediate: true },
)

function submit() {
  emit('submit', { name: form.name, bio: form.bio || null })
}
</script>

<template>
  <form @submit.prevent="submit" class="flex flex-col gap-4">
    <div>
      <label class="field-label">Name <span style="color:#f87171;">*</span></label>
      <input v-model="form.name" required class="field-input" placeholder="Band name" />
      <p v-if="errors?.name" class="field-error">{{ errors.name[0] }}</p>
    </div>
    <div>
      <label class="field-label">Bio</label>
      <RichEditor v-model="form.bio" placeholder="Write the band's story…" />
      <p v-if="errors?.bio" class="field-error">{{ errors.bio[0] }}</p>
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
