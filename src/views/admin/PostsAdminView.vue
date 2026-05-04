<script setup lang="ts">
import { ref, computed } from 'vue'
import { toast } from 'vue-sonner'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import AdminModal from '@/components/admin/AdminModal.vue'
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue'
import PostForm from '@/components/admin/forms/PostForm.vue'
import { usePosts, usePost } from '@/composables/usePosts'
import { useCategories } from '@/composables/useCategories'
import { useTags } from '@/composables/useTags'
import { ApiValidationError } from '@/api/client'
import type { PostPayload } from '@/types/post'

const { query, create, update, remove } = usePosts()
const { query: categoriesQ } = useCategories()
const { query: tagsQ } = useTags()

const showModal = ref(false)
const editingId = ref<number | null>(null)
const fieldErrors = ref<Record<string, string[]>>({})
const confirmId = ref<number | null>(null)
const isCreating = ref(false)

const editQuery = usePost(editingId)
const formPost = computed(() => isCreating.value ? null : editQuery.data.value ?? null)

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

async function handleSubmit(payload: PostPayload) {
  fieldErrors.value = {}
  try {
    if (editingId.value && !isCreating.value) {
      await update.mutateAsync({ id: editingId.value, payload })
      toast.success('Post updated')
    } else {
      await create.mutateAsync(payload)
      toast.success('Post created')
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
    toast.success('Post deleted')
    confirmId.value = null
  } catch { toast.error('Failed to delete') }
}
</script>

<template>
  <AdminLayout>
    <div class="p-8">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-lg font-semibold" style="color:#e2e8f0;">Posts</h1>
        <button @click="openCreate" class="btn-add-primary">+ Add post</button>
      </div>

      <div class="table-card">
        <div v-if="query.isPending.value" class="py-12 text-center text-sm" style="color:#475569;">Loading…</div>
        <div v-else-if="query.isError.value" class="py-12 text-center text-sm" style="color:#f87171;">Failed to load posts.</div>
        <div v-else-if="!query.data.value?.length" class="py-12 text-center text-sm" style="color:#475569;">No posts yet.</div>
        <table v-else class="w-full">
          <thead>
            <tr style="border-bottom:1px solid #2d2a6e;">
              <th class="th">Title</th>
              <th class="th">Categories</th>
              <th class="th">Tags</th>
              <th class="th">Published</th>
              <th class="th text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in query.data.value" :key="post.id" class="table-row">
              <td class="td font-medium" style="color:#e2e8f0; max-width:16rem;">
                <span class="truncate block">{{ post.title }}</span>
              </td>
              <td class="td">
                <span v-if="post.categories?.length" class="pill-list">
                  <span v-for="c in post.categories" :key="c.id" class="pill">{{ c.name }}</span>
                </span>
                <span v-else style="color:#475569;">—</span>
              </td>
              <td class="td">
                <span v-if="post.tags?.length" class="pill-list">
                  <span v-for="t in post.tags" :key="t.id" class="pill pill--tag">{{ t.name }}</span>
                </span>
                <span v-else style="color:#475569;">—</span>
              </td>
              <td class="td text-xs" :style="post.published_at ? 'color:#34d399;' : 'color:#475569;'">
                {{ post.published_at ? post.published_at.slice(0,10) : 'Draft' }}
              </td>
              <td class="td text-right">
                <button @click="openEdit(post.id)" class="btn-edit">Edit</button>
                <button @click="confirmId = post.id" class="btn-delete">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <AdminModal :open="showModal" :title="isCreating ? 'New post' : 'Edit post'" max-width="44rem" @close="closeModal">
      <div v-if="!isCreating && editQuery.isPending.value" class="py-8 text-center text-sm" style="color:#475569;">Loading post…</div>
      <PostForm
        v-else
        :initial="formPost"
        :categories="categoriesQ.data.value ?? []"
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
.pill-list { display: flex; flex-wrap: wrap; gap: 0.25rem; }
.pill { font-size:0.7rem; padding:0.1rem 0.4rem; border-radius:9999px; background:#1e1b4b; color:#a5b4fc; white-space:nowrap; }
.pill--tag { background:#0f2a1e; color:#34d399; }
</style>
