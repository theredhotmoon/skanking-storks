<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import AdminModal from '@/components/admin/AdminModal.vue'
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue'
import TagForm from '@/components/admin/forms/TagForm.vue'
import { useTags } from '@/composables/useTags'
import { ApiValidationError } from '@/api/client'
import type { Tag, TagPayload } from '@/types/tag'

const { query, create, update, remove } = useTags()

const showModal = ref(false)
const editing = ref<Tag | null>(null)
const fieldErrors = ref<Record<string, string[]>>({})
const confirmId = ref<number | null>(null)

function openCreate() { editing.value = null; fieldErrors.value = {}; showModal.value = true }
function openEdit(t: Tag) { editing.value = t; fieldErrors.value = {}; showModal.value = true }
function closeModal() { showModal.value = false }

async function handleSubmit(payload: TagPayload) {
  fieldErrors.value = {}
  try {
    if (editing.value) {
      await update.mutateAsync({ id: editing.value.id, payload })
      toast.success('Tag updated')
    } else {
      await create.mutateAsync(payload)
      toast.success('Tag created')
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
    toast.success('Tag deleted')
    confirmId.value = null
  } catch { toast.error('Failed to delete') }
}
</script>

<template>
  <AdminLayout>
    <div class="p-8">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-lg font-semibold" style="color:#e2e8f0;">Tags</h1>
        <button @click="openCreate" class="btn-add-primary">+ Add tag</button>
      </div>

      <div class="table-card">
        <div v-if="query.isPending.value" class="py-12 text-center text-sm" style="color:#475569;">Loading…</div>
        <div v-else-if="query.isError.value" class="py-12 text-center text-sm" style="color:#f87171;">Failed to load tags.</div>
        <div v-else-if="!query.data.value?.length" class="py-12 text-center text-sm" style="color:#475569;">No tags yet.</div>
        <table v-else class="w-full">
          <thead>
            <tr style="border-bottom:1px solid #2d2a6e;">
              <th class="th">ID</th>
              <th class="th">Name</th>
              <th class="th">Slug</th>
              <th class="th text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tag in query.data.value" :key="tag.id" class="table-row">
              <td class="td" style="color:#475569;">{{ tag.id }}</td>
              <td class="td font-medium" style="color:#e2e8f0;">{{ tag.name }}</td>
              <td class="td text-xs font-mono" style="color:#64748b;">{{ tag.slug }}</td>
              <td class="td text-right">
                <button @click="openEdit(tag)" class="btn-edit">Edit</button>
                <button @click="confirmId = tag.id" class="btn-delete">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <AdminModal :open="showModal" :title="editing ? 'Edit tag' : 'New tag'" @close="closeModal">
      <TagForm :initial="editing" :loading="create.isPending.value || update.isPending.value" :errors="fieldErrors" @submit="handleSubmit" @cancel="closeModal" />
    </AdminModal>

    <ConfirmDialog :open="confirmId !== null" :loading="remove.isPending.value" @confirm="confirmDelete" @cancel="confirmId = null" />
  </AdminLayout>
</template>

<style scoped src="./admin-table.css" />
