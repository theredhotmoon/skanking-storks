<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import RichEditor from '@/components/admin/RichEditor.vue'
import { useBands } from '@/composables/useBands'
import type { Release, ReleasePayload, ReleasePlatform, ReleaseType } from '@/types/release'

const props = defineProps<{
  initial?: Release | null
  loading?: boolean
  errors?: Record<string, string[]>
}>()

const emit = defineEmits<{ submit: [ReleasePayload]; cancel: [] }>()

const { query: bandsQuery } = useBands()

const PLATFORMS: { key: ReleasePlatform; label: string; color: string }[] = [
  { key: 'spotify',     label: 'Spotify',     color: '#1db954' },
  { key: 'apple_music', label: 'Apple Music', color: '#fc3c44' },
  { key: 'bandcamp',    label: 'Bandcamp',    color: '#1da0c3' },
  { key: 'youtube',     label: 'YouTube',     color: '#ff0000' },
  { key: 'instagram',   label: 'Instagram',   color: '#e1306c' },
]

const TYPES: ReleaseType[] = ['LP', 'EP', 'single', 'compilation']

const form = reactive({
  band_id: 0,
  title: '',
  type: 'single' as ReleaseType,
  release_date: '',
  cover_image: '',
  description: '',
})

const linkUrls = reactive<Record<ReleasePlatform, string>>({
  spotify: '',
  apple_music: '',
  bandcamp: '',
  youtube: '',
  instagram: '',
})

interface TrackRow {
  title: string
  duration: string
  lyrics: string
  sort_order: number
  showLyrics: boolean
}

const tracks = ref<TrackRow[]>([])

watch(
  () => props.initial,
  (val) => {
    form.band_id      = val?.band_id ?? 0
    form.title        = val?.title ?? ''
    form.type         = val?.type ?? 'single'
    form.release_date = val?.release_date ?? ''
    form.cover_image  = val?.cover_image ?? ''
    form.description  = val?.description ?? ''

    for (const p of PLATFORMS) linkUrls[p.key] = ''
    for (const l of val?.links ?? []) linkUrls[l.platform] = l.url

    tracks.value = (val?.tracks ?? []).map((t) => ({
      title:      t.title,
      duration:   t.duration ?? '',
      lyrics:     t.lyrics ?? '',
      sort_order: t.sort_order,
      showLyrics: false,
    }))
  },
  { immediate: true },
)

function addTrack() {
  tracks.value.push({
    title:      '',
    duration:   '',
    lyrics:     '',
    sort_order: tracks.value.length,
    showLyrics: false,
  })
}

function removeTrack(i: number) {
  tracks.value.splice(i, 1)
  tracks.value.forEach((t, idx) => { t.sort_order = idx })
}

function moveTrack(from: number, to: number) {
  const item = tracks.value.splice(from, 1)[0]
  tracks.value.splice(to, 0, item)
  tracks.value.forEach((t, idx) => { t.sort_order = idx })
}

function submit() {
  emit('submit', {
    band_id:      form.band_id,
    title:        form.title,
    type:         form.type,
    release_date: form.release_date || null,
    cover_image:  form.cover_image || null,
    description:  form.description || null,
    links: PLATFORMS
      .filter((p) => linkUrls[p.key].trim())
      .map((p) => ({ platform: p.key, url: linkUrls[p.key].trim() })),
    tracks: tracks.value.map((t, i) => ({
      title:      t.title,
      duration:   t.duration || null,
      lyrics:     t.lyrics || null,
      sort_order: i,
    })),
  })
}
</script>

<template>
  <form @submit.prevent="submit" class="flex flex-col gap-5">

    <!-- Row: title + type -->
    <div class="grid grid-cols-3 gap-3">
      <div class="col-span-2">
        <label class="field-label">Title <span style="color:#f87171;">*</span></label>
        <input v-model="form.title" required class="field-input" placeholder="Album or single name" />
        <p v-if="errors?.title" class="field-error">{{ errors.title[0] }}</p>
      </div>
      <div>
        <label class="field-label">Type <span style="color:#f87171;">*</span></label>
        <select v-model="form.type" required class="field-input">
          <option v-for="t in TYPES" :key="t" :value="t">{{ t }}</option>
        </select>
        <p v-if="errors?.type" class="field-error">{{ errors.type[0] }}</p>
      </div>
    </div>

    <!-- Row: band + release date -->
    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="field-label">Band <span style="color:#f87171;">*</span></label>
        <select v-model.number="form.band_id" required class="field-input">
          <option :value="0" disabled>Select band…</option>
          <option v-for="b in bandsQuery.data.value" :key="b.id" :value="b.id">{{ b.name }}</option>
        </select>
        <p v-if="errors?.band_id" class="field-error">{{ errors.band_id[0] }}</p>
      </div>
      <div>
        <label class="field-label">Release date</label>
        <input v-model="form.release_date" type="date" class="field-input" />
        <p v-if="errors?.release_date" class="field-error">{{ errors.release_date[0] }}</p>
      </div>
    </div>

    <!-- Cover image -->
    <div>
      <label class="field-label">Cover image URL</label>
      <input v-model="form.cover_image" class="field-input" placeholder="https://…" />
      <p v-if="errors?.cover_image" class="field-error">{{ errors.cover_image[0] }}</p>
    </div>

    <!-- Description -->
    <div>
      <label class="field-label">Description</label>
      <RichEditor v-model="form.description" placeholder="About this release…" />
      <p v-if="errors?.description" class="field-error">{{ errors.description[0] }}</p>
    </div>

    <!-- Streaming links -->
    <div>
      <div class="section-title">Streaming &amp; store links</div>
      <div class="flex flex-col gap-2">
        <div v-for="p in PLATFORMS" :key="p.key" class="platform-row">
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

    <!-- Tracks -->
    <div>
      <div class="flex items-center justify-between mb-2">
        <div class="section-title mb-0">Tracks <span class="track-count">{{ tracks.length }}</span></div>
        <button type="button" @click="addTrack" class="btn-add-track">+ Add track</button>
      </div>

      <div v-if="!tracks.length" class="tracks-empty">No tracks yet — add the first one above.</div>

      <div class="tracks-list">
        <div v-for="(track, i) in tracks" :key="i" class="track-card">
          <!-- Track header row -->
          <div class="track-header">
            <span class="track-num">{{ i + 1 }}</span>
            <input
              v-model="track.title"
              required
              class="field-input track-title-input"
              placeholder="Track title"
            />
            <input
              v-model="track.duration"
              class="field-input track-dur-input"
              placeholder="3:45"
              title="Duration (e.g. 3:45)"
            />
            <button
              type="button"
              class="track-lyrics-btn"
              :class="{ 'track-lyrics-btn--on': track.showLyrics }"
              @click="track.showLyrics = !track.showLyrics"
              :title="track.showLyrics ? 'Hide lyrics' : 'Show lyrics'"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 19V6l12-3v13M9 19c0 1.1-1.34 2-3 2s-3-.9-3-2 1.34-2 3-2 3 .9 3 2zm12-3c0 1.1-1.34 2-3 2s-3-.9-3-2 1.34-2 3-2 3 .9 3 2zM9 10l12-3"/>
              </svg>
              Lyrics
            </button>
            <div class="track-move">
              <button type="button" class="move-btn" :disabled="i === 0" @click="moveTrack(i, i - 1)" title="Move up">↑</button>
              <button type="button" class="move-btn" :disabled="i === tracks.length - 1" @click="moveTrack(i, i + 1)" title="Move down">↓</button>
            </div>
            <button type="button" class="track-remove-btn" @click="removeTrack(i)" title="Remove track">✕</button>
          </div>

          <!-- Lyrics panel (collapsible) -->
          <div v-if="track.showLyrics" class="track-lyrics-panel">
            <label class="field-label" style="margin-bottom:0.25rem;">Lyrics</label>
            <textarea
              v-model="track.lyrics"
              class="lyrics-textarea"
              placeholder="Paste lyrics here…"
              rows="8"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-2 justify-end pt-1">
      <button type="button" @click="$emit('cancel')" class="btn-ghost">Cancel</button>
      <button type="submit" :disabled="loading" class="btn-primary">
        {{ loading ? 'Saving…' : (initial ? 'Update release' : 'Create release') }}
      </button>
    </div>

  </form>
</template>

<style scoped src="../form-styles.css" />
<style scoped>
.section-title {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #34d399;
  margin-bottom: 0.625rem;
}
.platform-row {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}
.platform-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  flex-shrink: 0;
}
.platform-name {
  font-size: 0.75rem;
  font-weight: 500;
  color: #94a3b8;
  width: 7rem;
  flex-shrink: 0;
}
.track-count {
  display: inline-block;
  min-width: 1.25rem;
  text-align: center;
  padding: 0 0.3rem;
  border-radius: 0.3rem;
  background: #1e1b4b;
  color: #818cf8;
  font-size: 0.65rem;
  font-weight: 700;
  margin-left: 0.375rem;
  text-transform: none;
  letter-spacing: 0;
}
.btn-add-track {
  padding: 0.25rem 0.625rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  background: #1e1b4b;
  border: 1px solid #312e81;
  color: #a5b4fc;
  transition: background 100ms;
}
.btn-add-track:hover { background: #2d2a6e; }
.tracks-empty {
  font-size: 0.8125rem;
  color: #475569;
  padding: 0.75rem 0;
}
.tracks-list { display: flex; flex-direction: column; gap: 0.5rem; }
.track-card {
  border: 1px solid #1a1a38;
  border-radius: 0.5rem;
  background: #0d0d22;
  overflow: hidden;
}
.track-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.625rem;
}
.track-num {
  font-size: 0.7rem;
  font-weight: 600;
  color: #334155;
  width: 1.25rem;
  text-align: right;
  flex-shrink: 0;
}
.track-title-input { flex: 1; min-width: 0; }
.track-dur-input { width: 5.5rem; flex-shrink: 0; }
.track-lyrics-btn {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.5rem;
  border-radius: 0.3rem;
  font-size: 0.7rem;
  font-weight: 500;
  cursor: pointer;
  background: transparent;
  border: 1px solid #1a1a38;
  color: #475569;
  transition: background 100ms, color 100ms, border-color 100ms;
  flex-shrink: 0;
}
.track-lyrics-btn:hover { background: #111128; color: #94a3b8; }
.track-lyrics-btn--on { border-color: #312e81; color: #818cf8; background: #1e1b4b; }
.track-move { display: flex; gap: 0.125rem; flex-shrink: 0; }
.move-btn {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.25rem;
  border: 1px solid #1a1a38;
  background: transparent;
  color: #475569;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background 100ms, color 100ms;
  display: flex;
  align-items: center;
  justify-content: center;
}
.move-btn:hover:not(:disabled) { background: #111128; color: #94a3b8; }
.move-btn:disabled { opacity: 0.25; cursor: default; }
.track-remove-btn {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.25rem;
  border: 1px solid #3a1212;
  background: transparent;
  color: #f87171;
  font-size: 0.65rem;
  cursor: pointer;
  transition: background 100ms;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.track-remove-btn:hover { background: #3f1212; }
.track-lyrics-panel {
  border-top: 1px solid #1a1a38;
  padding: 0.625rem 0.75rem;
  background: #08081a;
}
.lyrics-textarea {
  width: 100%;
  background: #0a0a1c;
  border: 1px solid #2d2a6e;
  border-radius: 0.375rem;
  color: #e2e8f0;
  font-size: 0.8125rem;
  line-height: 1.65;
  padding: 0.625rem 0.75rem;
  resize: vertical;
  font-family: inherit;
  outline: none;
}
.lyrics-textarea:focus { border-color: #6366f1; }
.lyrics-textarea::placeholder { color: #334155; }
</style>
