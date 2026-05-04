<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import AdminModal from '@/components/admin/AdminModal.vue'
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue'
import ConcertForm from '@/components/admin/forms/ConcertForm.vue'
import { useConcerts } from '@/composables/useConcerts'
import { useVenues } from '@/composables/useVenues'
import { useBands } from '@/composables/useBands'
import { ApiValidationError } from '@/api/client'
import type { Concert, ConcertPayload } from '@/types/concert'

const { query, create, update, remove } = useConcerts()
const { query: venuesQ } = useVenues()
const { query: bandsQ } = useBands()

const showModal = ref(false)
const editing = ref<Concert | null>(null)
const fieldErrors = ref<Record<string, string[]>>({})
const confirmId = ref<number | null>(null)

function openCreate() { editing.value = null; fieldErrors.value = {}; showModal.value = true }
function openEdit(c: Concert) { editing.value = c; fieldErrors.value = {}; showModal.value = true }
function closeModal() { showModal.value = false }

async function handleSubmit(payload: ConcertPayload) {
  fieldErrors.value = {}
  try {
    if (editing.value) {
      await update.mutateAsync({ id: editing.value.id, payload })
      toast.success('Concert updated')
    } else {
      await create.mutateAsync(payload)
      toast.success('Concert created')
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
    toast.success('Concert deleted')
    confirmId.value = null
  } catch { toast.error('Failed to delete') }
}
</script>

<template>
  <AdminLayout>
    <div class="p-8">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-lg font-semibold" style="color:#e2e8f0;">Concerts</h1>
        <button @click="openCreate" class="btn-add-primary">+ Add concert</button>
      </div>

      <div class="table-card">
        <div v-if="query.isPending.value" class="py-12 text-center text-sm" style="color:#475569;">Loading…</div>
        <div v-else-if="query.isError.value" class="py-12 text-center text-sm" style="color:#f87171;">Failed to load concerts.</div>
        <div v-else-if="!query.data.value?.length" class="py-12 text-center text-sm" style="color:#475569;">No concerts yet.</div>
        <table v-else class="w-full">
          <thead>
            <tr style="border-bottom:1px solid #2d2a6e;">
              <th class="th">Date</th>
              <th class="th">Time</th>
              <th class="th">Venue</th>
              <th class="th">Bands</th>
              <th class="th text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="concert in query.data.value" :key="concert.id" class="table-row">
              <td class="td font-medium" style="color:#e2e8f0;">{{ concert.date }}</td>
              <td class="td" style="color:#94a3b8;">{{ concert.time ?? '—' }}</td>
              <td class="td" style="color:#94a3b8;">{{ concert.venue?.name ?? '—' }}</td>
              <td class="td">
                <span v-if="concert.bands?.length" class="text-xs" style="color:#a5b4fc;">
                  {{ concert.bands.map(b => b.name).join(', ') }}
                </span>
                <span v-else style="color:#475569;">—</span>
              </td>
              <td class="td text-right">
                <button @click="openEdit(concert)" class="btn-edit">Edit</button>
                <button @click="confirmId = concert.id" class="btn-delete">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <AdminModal :open="showModal" :title="editing ? 'Edit concert' : 'New concert'" @close="closeModal">
      <ConcertForm
        :initial="editing"
        :venues="venuesQ.data.value ?? []"
        :bands="bandsQ.data.value ?? []"
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
