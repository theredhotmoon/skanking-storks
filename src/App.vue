<script setup lang="ts">
import { Toaster } from 'vue-sonner'
</script>

<template>
  <RouterView />
  <Toaster position="bottom-right" :duration="4000" richColors />
</template>
