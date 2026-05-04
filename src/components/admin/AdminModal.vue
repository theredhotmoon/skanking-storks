<script setup lang="ts">
defineProps<{ title: string; open: boolean; maxWidth?: string }>()
defineEmits<{ close: [] }>()
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto">
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="$emit('close')" />
        <div
          class="relative z-10 w-full rounded-xl shadow-2xl my-auto"
          :style="`max-width:${maxWidth ?? '34rem'}; background:#111128; border:1px solid #2d2a6e;`"
        >
          <div class="flex items-center justify-between px-6 py-4" style="border-bottom:1px solid #2d2a6e;">
            <h2 class="text-sm font-semibold" style="color:#e2e8f0;">{{ title }}</h2>
            <button @click="$emit('close')" class="p-1 rounded cursor-pointer transition-colors" style="color:#475569;">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="px-6 py-5">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 150ms ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
