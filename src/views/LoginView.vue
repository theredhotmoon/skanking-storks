<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AuthTabs from '@/components/auth/AuthTabs.vue'
import SignInForm from '@/components/auth/SignInForm.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'

const router = useRouter()
const route = useRoute()
const activeTab = ref<'signin' | 'register'>(route.name === 'register' ? 'register' : 'signin')

function onAuthSuccess() {
  router.push('/')
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center px-4 py-12">
    <div
      class="w-full max-w-md overflow-hidden rounded-2xl px-8 py-8"
      style="background: #23252b; box-shadow: 0 2px 4px rgba(0,0,0,0.4);"
    >
      <div class="mb-8">
        <AuthTabs v-model:active-tab="activeTab" />
      </div>
      <SignInForm v-if="activeTab === 'signin'" @success="onAuthSuccess" />
      <RegisterForm v-else @success="onAuthSuccess" />
    </div>
  </div>
</template>
