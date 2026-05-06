<script setup lang="ts">
import { reactive, watch } from 'vue'
import RichEditor from '@/components/admin/RichEditor.vue'
import type { BandMember, BandMemberPayload } from '@/types/bandMember'
import { SOCIAL_PLATFORMS } from '@/types/socialLink'
import type { SocialPlatform } from '@/types/socialLink'

const props = defineProps<{
  initial?: BandMember | null
  loading?: boolean
  errors?: Record<string, string[]>
}>()

const emit = defineEmits<{ submit: [BandMemberPayload]; cancel: [] }>()

const form = reactive({
  first_name: '',
  last_name: '',
  role: '',
  photo: '',
  bio: '',
  is_current: true,
  joined_at: '',
  quit_at: '',
  sort_order: 0,
})

const linkUrls = reactive<Record<SocialPlatform, string>>({
  spotify: '', instagram: '', facebook: '', youtube: '',
  tiktok: '', bandcamp: '', soundcloud: '', twitter: '', website: '',
})

watch(
  () => props.initial,
  (val) => {
    form.first_name = val?.first_name ?? ''
    form.last_name  = val?.last_name ?? ''
    form.role       = val?.role ?? ''
    form.photo      = val?.photo ?? ''
    form.bio        = val?.bio ?? ''
    form.is_current = val?.is_current ?? true
    form.joined_at  = val?.joined_at ?? ''
    form.quit_at    = val?.quit_at ?? ''
    form.sort_order = val?.sort_order ?? 0

    for (const p of SOCIAL_PLATFORMS) linkUrls[p.key] = ''
    for (const l of val?.social_links ?? []) linkUrls[l.platform] = l.url
  },
  { immediate: true },
)

function submit() {
  emit('submit', {
    first_name: form.first_name,
    last_name:  form.last_name,
    role:       form.role || null,
    photo:      form.photo || null,
    bio:        form.bio || null,
    is_current: form.is_current,
    joined_at:    form.joined_at || null,
    quit_at:      form.is_current ? null : (form.quit_at || null),
    sort_order:   form.sort_order,
    social_links: SOCIAL_PLATFORMS
      .filter((p) => linkUrls[p.key].trim())
      .map((p) => ({ platform: p.key, url: linkUrls[p.key].trim() })),
  })
}
</script>

<template>
  <form @submit.prevent="submit" class="flex flex-col gap-4">
    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="field-label">First name <span style="color:#f87171;">*</span></label>
        <input v-model="form.first_name" required class="field-input" placeholder="Jane" />
        <p v-if="errors?.first_name" class="field-error">{{ errors.first_name[0] }}</p>
      </div>
      <div>
        <label class="field-label">Last name <span style="color:#f87171;">*</span></label>
        <input v-model="form.last_name" required class="field-input" placeholder="Smith" />
        <p v-if="errors?.last_name" class="field-error">{{ errors.last_name[0] }}</p>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="field-label">Role / Instrument</label>
        <input v-model="form.role" class="field-input" placeholder="Lead guitar, Vocals…" />
        <p v-if="errors?.role" class="field-error">{{ errors.role[0] }}</p>
      </div>
      <div>
        <label class="field-label">Sort order</label>
        <input v-model.number="form.sort_order" type="number" min="0" class="field-input" />
      </div>
    </div>

    <div>
      <label class="field-label">Photo URL</label>
      <input v-model="form.photo" class="field-input" placeholder="https://…" />
      <p v-if="errors?.photo" class="field-error">{{ errors.photo[0] }}</p>
    </div>

    <div>
      <label class="field-label">Bio</label>
      <RichEditor v-model="form.bio" placeholder="Short biography…" />
      <p v-if="errors?.bio" class="field-error">{{ errors.bio[0] }}</p>
    </div>

    <!-- Status -->
    <div class="status-row">
      <span class="field-label mb-0">Status</span>
      <label class="toggle-label">
        <button
          type="button"
          class="toggle"
          :class="{ 'toggle--on': form.is_current }"
          @click="form.is_current = !form.is_current"
          :aria-pressed="form.is_current"
        >
          <span class="toggle-thumb" />
        </button>
        <span class="text-sm" :style="form.is_current ? 'color:#34d399;' : 'color:#94a3b8;'">
          {{ form.is_current ? 'Current member' : 'Ex-member' }}
        </span>
      </label>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="field-label">Joined band at</label>
        <input v-model="form.joined_at" type="date" class="field-input" />
        <p v-if="errors?.joined_at" class="field-error">{{ errors.joined_at[0] }}</p>
      </div>
      <div>
        <label class="field-label" :style="form.is_current ? 'opacity:0.35;' : ''">Quit band at</label>
        <input v-model="form.quit_at" type="date" class="field-input" :disabled="form.is_current" />
        <p v-if="errors?.quit_at" class="field-error">{{ errors.quit_at[0] }}</p>
      </div>
    </div>

    <!-- Social links -->
    <div>
      <div class="member-links-heading">Social links</div>
      <div class="flex flex-col gap-2">
        <div v-for="p in SOCIAL_PLATFORMS" :key="p.key" class="platform-row">
          <span class="platform-dot" :style="`background:${p.color};`" />
          <span class="platform-name">{{ p.label }}</span>
          <input
            v-model="linkUrls[p.key]"
            class="field-input flex-1"
            :placeholder="`${p.label} URL…`"
          />
        </div>
      </div>
    </div>

    <div class="flex gap-2 justify-end pt-1">
      <button type="button" @click="$emit('cancel')" class="btn-ghost">Cancel</button>
      <button type="submit" :disabled="loading" class="btn-primary">
        {{ loading ? 'Saving…' : (initial ? 'Update member' : 'Add member') }}
      </button>
    </div>
  </form>
</template>

<style scoped src="../form-styles.css" />
<style scoped>
.member-links-heading {
  font-size: 0.7rem; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.06em; color: #34d399; margin-bottom: 0.5rem;
}
.platform-row { display: flex; align-items: center; gap: 0.625rem; }
.platform-dot { width: 0.5rem; height: 0.5rem; border-radius: 9999px; flex-shrink: 0; }
.platform-name {
  font-size: 0.75rem; font-weight: 500; color: #94a3b8;
  width: 7rem; flex-shrink: 0;
}
.status-row {
  display: flex; align-items: center; gap: 0.875rem;
}
.toggle-label {
  display: flex; align-items: center; gap: 0.5rem; cursor: pointer;
}
.toggle {
  position: relative; width: 2.5rem; height: 1.375rem;
  border-radius: 9999px; border: none; cursor: pointer;
  background: #1e293b; transition: background 200ms;
}
.toggle--on { background: #166534; }
.toggle-thumb {
  position: absolute; top: 0.1875rem; left: 0.1875rem;
  width: 1rem; height: 1rem; border-radius: 9999px;
  background: #475569; transition: transform 200ms, background 200ms;
}
.toggle--on .toggle-thumb {
  transform: translateX(1.125rem); background: #34d399;
}
</style>
