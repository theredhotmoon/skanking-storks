<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { toast } from 'vue-sonner'
import AdminModal from './AdminModal.vue'
import ConfirmDialog from './ConfirmDialog.vue'
import BandMemberForm from './forms/BandMemberForm.vue'
import { useBandMembers } from '@/composables/useBandMembers'
import { useSocialLinks } from '@/composables/useSocialLinks'
import { ApiValidationError } from '@/api/client'
import { SOCIAL_PLATFORMS } from '@/types/socialLink'
import type { SocialLink, SocialPlatform } from '@/types/socialLink'
import type { Band } from '@/types/band'
import type { BandMember, BandMemberPayload } from '@/types/bandMember'

const props = defineProps<{ band: Band }>()
defineEmits<{ close: [] }>()

const bandIdRef = computed(() => props.band.id)
const { query, create, update, remove } = useBandMembers(bandIdRef)
const { query: linksQuery, create: linkCreate, update: linkUpdate, remove: linkRemove } = useSocialLinks(bandIdRef)

const showForm = ref(false)
const editing = ref<BandMember | null>(null)
const fieldErrors = ref<Record<string, string[]>>({})
const confirmId = ref<number | null>(null)

function openCreate() { editing.value = null; fieldErrors.value = {}; showForm.value = true }
function openEdit(m: BandMember) { editing.value = m; fieldErrors.value = {}; showForm.value = true }
function closeForm() { showForm.value = false }

async function handleSubmit(payload: BandMemberPayload) {
  fieldErrors.value = {}
  try {
    if (editing.value) {
      await update.mutateAsync({ id: editing.value.id, payload })
      toast.success('Member updated')
    } else {
      await create.mutateAsync(payload)
      toast.success('Member added')
    }
    closeForm()
  } catch (e) {
    if (e instanceof ApiValidationError) fieldErrors.value = e.errors
    else toast.error('Something went wrong')
  }
}

async function confirmDelete() {
  if (confirmId.value == null) return
  try {
    await remove.mutateAsync(confirmId.value)
    toast.success('Member removed')
    confirmId.value = null
  } catch { toast.error('Failed to remove') }
}

const currentMembers = computed(() => query.data.value?.filter(m => m.is_current) ?? [])
const exMembers = computed(() => query.data.value?.filter(m => !m.is_current) ?? [])

// ── Band social links ──────────────────────────────────────────
const showLinkForm = ref(false)
const editingLink  = ref<SocialLink | null>(null)
const linkForm = reactive<{ platform: SocialPlatform; url: string }>({
  platform: 'instagram',
  url: '',
})

function openAddLink() {
  editingLink.value  = null
  linkForm.platform  = 'instagram'
  linkForm.url       = ''
  showLinkForm.value = true
}

function openEditLink(l: SocialLink) {
  editingLink.value  = l
  linkForm.platform  = l.platform
  linkForm.url       = l.url
  showLinkForm.value = true
}

function cancelLinkForm() {
  showLinkForm.value = false
  editingLink.value  = null
}

async function saveLinkForm() {
  if (!linkForm.url.trim()) return
  try {
    if (editingLink.value) {
      await linkUpdate.mutateAsync({ id: editingLink.value.id, payload: { platform: linkForm.platform, url: linkForm.url.trim() } })
      toast.success('Link updated')
    } else {
      await linkCreate.mutateAsync({ platform: linkForm.platform, url: linkForm.url.trim() })
      toast.success('Link added')
    }
    cancelLinkForm()
  } catch { toast.error('Failed to save link') }
}

async function deleteLink(id: number) {
  try {
    await linkRemove.mutateAsync(id)
    toast.success('Link removed')
  } catch { toast.error('Failed to remove') }
}

function platformMeta(key: SocialPlatform) {
  return SOCIAL_PLATFORMS.find((p) => p.key === key)!
}
</script>

<template>
  <!-- Members list panel (inline within the parent modal) -->
  <div>
    <div class="flex items-center justify-between mb-4">
      <p class="text-xs" style="color:#64748b;">
        {{ query.data.value?.length ?? 0 }} member(s) total
      </p>
      <button @click="openCreate" class="btn-add-sm">+ Add member</button>
    </div>

    <div v-if="query.isPending.value" class="py-8 text-center text-sm" style="color:#475569;">Loading…</div>
    <div v-else-if="!query.data.value?.length" class="py-8 text-center text-sm" style="color:#475569;">
      No members yet. Add the first one above.
    </div>

    <template v-else>
      <!-- Current lineup -->
      <div v-if="currentMembers.length" class="mb-5">
        <h4 class="section-heading">Current lineup</h4>
        <div class="member-list">
          <div v-for="m in currentMembers" :key="m.id" class="member-row">
            <div class="member-avatar">
              <img v-if="m.photo" :src="m.photo" :alt="`${m.first_name} ${m.last_name}`" class="avatar-img" />
              <div v-else class="avatar-placeholder">{{ m.first_name[0] }}{{ m.last_name[0] }}</div>
            </div>
            <div class="member-info">
              <div class="font-medium text-sm" style="color:#e2e8f0;">{{ m.first_name }} {{ m.last_name }}</div>
              <div class="text-xs" style="color:#6366f1;" v-if="m.role">{{ m.role }}</div>
              <div class="text-xs mt-0.5" style="color:#475569;" v-if="m.joined_at">
                Since {{ m.joined_at }}
              </div>
            </div>
            <div class="member-actions">
              <button @click="openEdit(m)" class="btn-edit-sm">Edit</button>
              <button @click="confirmId = m.id" class="btn-del-sm">Remove</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Ex-members -->
      <div v-if="exMembers.length">
        <h4 class="section-heading" style="color:#475569;">Former members</h4>
        <div class="member-list">
          <div v-for="m in exMembers" :key="m.id" class="member-row" style="opacity:0.7;">
            <div class="member-avatar">
              <img v-if="m.photo" :src="m.photo" :alt="`${m.first_name} ${m.last_name}`" class="avatar-img" />
              <div v-else class="avatar-placeholder" style="background:#1e293b; color:#64748b;">
                {{ m.first_name[0] }}{{ m.last_name[0] }}
              </div>
            </div>
            <div class="member-info">
              <div class="font-medium text-sm" style="color:#94a3b8;">{{ m.first_name }} {{ m.last_name }}</div>
              <div class="text-xs" style="color:#475569;" v-if="m.role">{{ m.role }}</div>
              <div class="text-xs mt-0.5" style="color:#334155;" v-if="m.joined_at || m.quit_at">
                {{ m.joined_at ?? '?' }} → {{ m.quit_at ?? '?' }}
              </div>
            </div>
            <div class="member-actions">
              <button @click="openEdit(m)" class="btn-edit-sm">Edit</button>
              <button @click="confirmId = m.id" class="btn-del-sm">Remove</button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>

  <!-- Band social links section -->
  <div class="band-links-section">
    <div class="flex items-center justify-between mb-3">
      <h4 class="section-heading" style="color:#f472b6;">Band social links</h4>
      <button @click="openAddLink" class="btn-add-sm">+ Add link</button>
    </div>

    <div v-if="linksQuery.isPending.value" class="py-4 text-center text-xs" style="color:#475569;">Loading…</div>
    <div v-else-if="!linksQuery.data.value?.length && !showLinkForm" class="text-xs" style="color:#475569;">
      No social links yet.
    </div>

    <div class="links-list">
      <div v-for="l in linksQuery.data.value" :key="l.id" class="link-row">
        <span class="link-dot" :style="`background:${platformMeta(l.platform).color};`" />
        <span class="link-platform">{{ platformMeta(l.platform).label }}</span>
        <a :href="l.url" target="_blank" rel="noopener" class="link-url">{{ l.url }}</a>
        <button @click="openEditLink(l)" class="btn-edit-sm">Edit</button>
        <button @click="deleteLink(l.id)" class="btn-del-sm">✕</button>
      </div>
    </div>

    <!-- Inline add/edit form -->
    <div v-if="showLinkForm" class="link-form-row">
      <select v-model="linkForm.platform" class="link-platform-select">
        <option v-for="p in SOCIAL_PLATFORMS" :key="p.key" :value="p.key">{{ p.label }}</option>
      </select>
      <input v-model="linkForm.url" class="link-url-input" placeholder="https://…" @keydown.enter.prevent="saveLinkForm" />
      <button
        @click="saveLinkForm"
        :disabled="linkCreate.isPending.value || linkUpdate.isPending.value"
        class="btn-link-save"
      >{{ editingLink ? 'Update' : 'Add' }}</button>
      <button @click="cancelLinkForm" class="btn-link-cancel">Cancel</button>
    </div>
  </div>

  <!-- Member form modal -->
  <AdminModal
    :open="showForm"
    :title="editing ? `Edit — ${editing.first_name} ${editing.last_name}` : 'Add member'"
    max-width="36rem"
    @close="closeForm"
  >
    <BandMemberForm
      :initial="editing"
      :loading="create.isPending.value || update.isPending.value"
      :errors="fieldErrors"
      @submit="handleSubmit"
      @cancel="closeForm"
    />
  </AdminModal>

  <ConfirmDialog
    :open="confirmId !== null"
    message="This member will be permanently removed from the band."
    :loading="remove.isPending.value"
    @confirm="confirmDelete"
    @cancel="confirmId = null"
  />
</template>

<style scoped>
.btn-add-sm {
  padding: 0.3rem 0.75rem; border-radius: 0.4rem; font-size: 0.75rem; font-weight: 600;
  cursor: pointer; background: #4338ca; border: none; color: #fff; transition: background 120ms;
}
.btn-add-sm:hover { background: #4f46e5; }
.section-heading {
  font-size: 0.7rem; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.06em; color: #34d399; margin-bottom: 0.5rem;
}
.member-list { display: flex; flex-direction: column; gap: 0.375rem; }
.member-row {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.625rem 0.75rem; border-radius: 0.5rem;
  background: #0d0d22; border: 1px solid #1a1a38;
  transition: border-color 120ms;
}
.member-row:hover { border-color: #2d2a6e; }
.member-avatar { flex-shrink: 0; }
.avatar-img { width: 2.25rem; height: 2.25rem; border-radius: 9999px; object-fit: cover; }
.avatar-placeholder {
  width: 2.25rem; height: 2.25rem; border-radius: 9999px;
  background: #1e1b4b; color: #818cf8;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.7rem; font-weight: 700; letter-spacing: 0.02em;
}
.member-info { flex: 1; min-width: 0; }
.member-actions { display: flex; gap: 0.375rem; flex-shrink: 0; }
.btn-edit-sm {
  padding: 0.2rem 0.5rem; border-radius: 0.3rem; font-size: 0.7rem; font-weight: 500;
  cursor: pointer; background: transparent; border: 1px solid #2d2a6e; color: #818cf8;
  transition: background 100ms;
}
.btn-edit-sm:hover { background: #1e1b4b; }
.btn-del-sm {
  padding: 0.2rem 0.5rem; border-radius: 0.3rem; font-size: 0.7rem; font-weight: 500;
  cursor: pointer; background: transparent; border: 1px solid #3a1212; color: #f87171;
  transition: background 100ms;
}
.btn-del-sm:hover { background: #3f1212; }

.band-links-section {
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid #1a1a38;
}
.links-list { display: flex; flex-direction: column; gap: 0.375rem; margin-bottom: 0.5rem; }
.link-row {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.375rem 0.625rem; border-radius: 0.375rem;
  background: #0d0d22; border: 1px solid #1a1a38;
}
.link-dot { width: 0.5rem; height: 0.5rem; border-radius: 9999px; flex-shrink: 0; }
.link-platform { font-size: 0.7rem; font-weight: 600; color: #94a3b8; width: 6.5rem; flex-shrink: 0; }
.link-url {
  flex: 1; min-width: 0; font-size: 0.75rem; color: #6366f1;
  text-decoration: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.link-url:hover { color: #818cf8; }
.link-form-row {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.5rem 0.625rem; border-radius: 0.375rem;
  background: #111128; border: 1px solid #2d2a6e; margin-top: 0.375rem;
}
.link-platform-select {
  background: #0d0d22; border: 1px solid #2d2a6e; border-radius: 0.3rem;
  color: #e2e8f0; font-size: 0.75rem; padding: 0.25rem 0.375rem;
  outline: none; cursor: pointer; flex-shrink: 0;
}
.link-platform-select:focus { border-color: #6366f1; }
.link-url-input {
  flex: 1; min-width: 0; background: #0d0d22; border: 1px solid #2d2a6e;
  border-radius: 0.3rem; color: #e2e8f0; font-size: 0.75rem;
  padding: 0.25rem 0.5rem; outline: none;
}
.link-url-input:focus { border-color: #6366f1; }
.link-url-input::placeholder { color: #334155; }
.btn-link-save {
  padding: 0.2rem 0.625rem; border-radius: 0.3rem; font-size: 0.7rem; font-weight: 600;
  cursor: pointer; background: #4338ca; border: none; color: #fff;
  transition: background 100ms; flex-shrink: 0;
}
.btn-link-save:hover:not(:disabled) { background: #4f46e5; }
.btn-link-save:disabled { opacity: 0.5; cursor: default; }
.btn-link-cancel {
  padding: 0.2rem 0.5rem; border-radius: 0.3rem; font-size: 0.7rem; font-weight: 500;
  cursor: pointer; background: transparent; border: 1px solid #2d2a6e; color: #64748b;
  transition: background 100ms; flex-shrink: 0;
}
.btn-link-cancel:hover { background: #111128; color: #94a3b8; }
</style>
