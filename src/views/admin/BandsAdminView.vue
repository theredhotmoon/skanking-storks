<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import AdminModal from '@/components/admin/AdminModal.vue'
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue'
import BandForm from '@/components/admin/forms/BandForm.vue'
import BandMembersModal from '@/components/admin/BandMembersModal.vue'
import { useBands } from '@/composables/useBands'
import { ApiValidationError } from '@/api/client'
import type { Band, BandPayload } from '@/types/band'

const { query, create, update, remove } = useBands()

const showModal = ref(false)
const editing = ref<Band | null>(null)
const fieldErrors = ref<Record<string, string[]>>({})

const confirmId = ref<number | null>(null)
const activeBand = ref<Band | null>(null)

function openCreate() { editing.value = null; fieldErrors.value = {}; showModal.value = true }
function openEdit(band: Band) { editing.value = band; fieldErrors.value = {}; showModal.value = true }
function closeModal() { showModal.value = false }

async function handleSubmit(payload: BandPayload) {
  fieldErrors.value = {}
  try {
    if (editing.value) {
      await update.mutateAsync({ id: editing.value.id, payload })
      toast.success('Band updated')
    } else {
      await create.mutateAsync(payload)
      toast.success('Band created')
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
    toast.success('Band deleted')
    confirmId.value = null
  } catch {
    toast.error('Failed to delete')
  }
}
</script>

<template>
  <AdminLayout>
    <div class="p-8">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-lg font-semibold" style="color:#e2e8f0;">Bands</h1>
        <button @click="openCreate" class="btn-add-primary">+ Add band</button>
      </div>

      <div class="table-card">
        <div v-if="query.isPending.value" class="py-12 text-center text-sm" style="color:#475569;">Loading…</div>
        <div v-else-if="query.isError.value" class="py-12 text-center text-sm" style="color:#f87171;">Failed to load bands.</div>
        <div v-else-if="!query.data.value?.length" class="py-12 text-center text-sm" style="color:#475569;">No bands yet. Add one above.</div>
        <table v-else class="w-full">
          <thead>
            <tr style="border-bottom:1px solid #2d2a6e;">
              <th class="th">ID</th>
              <th class="th">Name</th>
              <th class="th">Created</th>
              <th class="th text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="band in query.data.value" :key="band.id" class="table-row">
              <td class="td" style="color:#475569;">{{ band.id }}</td>
              <td class="td font-medium" style="color:#e2e8f0;">{{ band.name }}</td>
              <td class="td" style="color:#64748b;">{{ band.created_at.slice(0,10) }}</td>
              <td class="td text-right">
                <button @click="activeBand = band" class="btn-members">Members</button>
                <button @click="openEdit(band)" class="btn-edit">Edit</button>
                <button @click="confirmId = band.id" class="btn-delete">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <AdminModal :open="showModal" :title="editing ? 'Edit band' : 'New band'" @close="closeModal">
      <BandForm :initial="editing" :loading="create.isPending.value || update.isPending.value" :errors="fieldErrors" @submit="handleSubmit" @cancel="closeModal" />
    </AdminModal>

    <ConfirmDialog :open="confirmId !== null" :loading="remove.isPending.value" @confirm="confirmDelete" @cancel="confirmId = null" />

    <AdminModal
      :open="activeBand !== null"
      :title="activeBand ? `Members — ${activeBand.name}` : ''"
      max-width="42rem"
      @close="activeBand = null"
    >
      <BandMembersModal v-if="activeBand" :band="activeBand" @close="activeBand = null" />
    </AdminModal>
  </AdminLayout>
</template>

<style scoped src="./admin-table.css" />
<style scoped>
.btn-members {
  padding: 0.25rem 0.6rem; border-radius: 0.3rem; font-size: 0.75rem; font-weight: 500;
  cursor: pointer; background: transparent; border: 1px solid #166534; color: #34d399;
  transition: background 100ms; margin-right: 0.375rem;
}
.btn-members:hover { background: #14532d; }
</style>
