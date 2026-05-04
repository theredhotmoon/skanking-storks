<script setup lang="ts">
import { ref, computed } from 'vue'
import { toast } from 'vue-sonner'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import AdminModal from '@/components/admin/AdminModal.vue'
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue'
import PhotoForm from '@/components/admin/forms/PhotoForm.vue'
import { usePhotos, usePhoto } from '@/composables/usePhotos'
import { useVenues } from '@/composables/useVenues'
import { useConcerts } from '@/composables/useConcerts'
import { useTags } from '@/composables/useTags'
import { ApiValidationError } from '@/api/client'
import type { PhotoPayload } from '@/types/photo'

const { query, create, update, remove } = usePhotos()
const { query: venuesQ } = useVenues()
const { query: concertsQ } = useConcerts()
const { query: tagsQ } = useTags()

const showModal = ref(false)
const editingId = ref<number | null>(null)
const fieldErrors = ref<Record<string, string[]>>({})
const confirmId = ref<number | null>(null)
const isCreating = ref(false)

const editQuery = usePhoto(editingId)
const formPhoto = computed(() => isCreating.value ? null : editQuery.data.value ?? null)

function openCreate() {
  isCreating.value = true
  editingId.value = null
  fieldErrors.value = {}
  showModal.value = true
}

function openEdit(id: number) {
  isCreating.value = false
  editingId.value = id
  fieldErrors.value = {}
  showModal.value = true
}

function closeModal() { showModal.value = false }

async function handleSubmit(payload: PhotoPayload) {
  fieldErrors.value = {}
  try {
    if (editingId.value && !isCreating.value) {
      await update.mutateAsync({ id: editingId.value, payload })
      toast.success('Photo updated')
    } else {
      await create.mutateAsync(payload)
      toast.success('Photo created')
    }
    closeModal()
  } catch (e) {
    if (e instanceof ApiValidationError) fieldErrors.value = e.errors
    else toast.error('Something went wrong')
  }
}

async function confirmDelete() {
  if (confirmId.value == null) return
  try {
    await remove.mutateAsync(confirmId.value)
    toast.success('Photo deleted')
    confirmId.value = null
  } catch { toast.error('Failed to delete') }
}
</script>

<template>
  <AdminLayout>
    <div class="p-8">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-lg font-semibold" style="color:#e2e8f0;">Photos</h1>
        <button @click="openCreate" class="btn-add-primary">+ Add photo</button>
      </div>

      <div class="table-card">
        <div v-if="query.isPending.value" class="py-12 text-center text-sm" style="color:#475569;">Loading…</div>
        <div v-else-if="query.isError.value" class="py-12 text-center text-sm" style="color:#f87171;">Failed to load photos.</div>
        <div v-else-if="!query.data.value?.length" class="py-12 text-center text-sm" style="color:#475569;">No photos yet.</div>
        <table v-else class="w-full">
          <thead>
            <tr style="border-bottom:1px solid #2d2a6e;">
              <th class="th">Title</th>
              <th class="th">Venue</th>
              <th class="th">Concert</th>
              <th class="th">Tags</th>
              <th class="th">Published</th>
              <th class="th text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="photo in query.data.value" :key="photo.id" class="table-row">
              <td class="td font-medium" style="color:#e2e8f0; max-width:12rem;">
                <span class="truncate block">{{ photo.title }}</span>
              </td>
              <td class="td text-sm" style="color:#94a3b8;">{{ photo.venue?.name ?? '—' }}</td>
              <td class="td text-sm" style="color:#94a3b8;">{{ photo.concert?.date ?? '—' }}</td>
              <td class="td">
                <span v-if="photo.tags?.length" class="flex flex-wrap gap-1">
                  <span v-for="t in photo.tags" :key="t.id" class="pill">{{ t.name }}</span>
                </span>
                <span v-else style="color:#475569;">—</span>
              </td>
              <td class="td text-xs" :style="photo.published_at ? 'color:#34d399;' : 'color:#475569;'">
                {{ photo.published_at ? photo.published_at.slice(0,10) : 'Draft' }}
              </td>
              <td class="td text-right">
                <button @click="openEdit(photo.id)" class="btn-edit">Edit</button>
                <button @click="confirmId = photo.id" class="btn-delete">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <AdminModal :open="showModal" :title="isCreating ? 'New photo' : 'Edit photo'" max-width="42rem" @close="closeModal">
      <div v-if="!isCreating && editQuery.isPending.value" class="py-8 text-center text-sm" style="color:#475569;">Loading photo…</div>
      <PhotoForm
        v-else
        :initial="formPhoto"
        :venues="venuesQ.data.value ?? []"
        :concerts="concertsQ.data.value ?? []"
        :tags="tagsQ.data.value ?? []"
        :loading="create.isPending.value || update.isPending.value"
        :errors="fieldErrors"
        @submit="handleSubmit"
        @cancel="closeModal"
      />
    </AdminModal>

    <ConfirmDialog :open="confirmId !== null" :loading="remove.isPending.value" @confirm="confirmDelete" @cancel="confirmId = null" />
  </AdminLayout>
</template>

<style scoped src="./admin-table.css" />
<style scoped>
.pill { font-size:0.7rem; padding:0.1rem 0.4rem; border-radius:9999px; background:#0f2a1e; color:#34d399; white-space:nowrap; }
</style>
