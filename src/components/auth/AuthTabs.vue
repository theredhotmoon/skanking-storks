<script setup lang="ts">
interface Props {
  activeTab: 'signin' | 'register'
}

defineProps<Props>()

defineEmits<{
  'update:activeTab': [value: 'signin' | 'register']
}>()
</script>

<template>
  <div class="flex gap-6">
    <button
      class="pb-1 text-base font-semibold transition-all"
      :style="{
        color: activeTab === 'signin' ? '#fff' : 'rgba(255,255,255,0.5)',
        borderBottom: activeTab === 'signin' ? '2px solid #fff' : '2px solid transparent',
      }"
      @click="$emit('update:activeTab', 'signin')"
    >Sign In</button>
    <button
      class="pb-1 text-base font-semibold transition-all"
      :style="{
        color: activeTab === 'register' ? '#fff' : 'rgba(255,255,255,0.5)',
        borderBottom: activeTab === 'register' ? '2px solid #fff' : '2px solid transparent',
      }"
      @click="$emit('update:activeTab', 'register')"
    >Register</button>
  </div>
</template>
