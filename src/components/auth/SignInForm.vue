<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { useAuth } from '@/composables/useAuth'
import { ApiError, ApiValidationError } from '@/api/auth'

const emit = defineEmits<{
  success: []
}>()

const { login } = useAuth()

const email = ref('')
const password = ref('')
const loading = ref(false)
const generalError = ref<string | null>(null)
const fieldErrors = ref<Record<string, string>>({})

async function handleSubmit() {
  generalError.value = null
  fieldErrors.value = {}
  loading.value = true

  try {
    await login({ email: email.value, password: password.value })
    toast.success('Welcome back! Great to see you again.')
    emit('success')
  } catch (err) {
    if (err instanceof ApiValidationError) {
      const flat: Record<string, string> = {}
      for (const [key, msgs] of Object.entries(err.errors)) {
        flat[key] = msgs[0]
      }
      fieldErrors.value = flat
    } else if (err instanceof ApiError) {
      generalError.value = err.message
    } else {
      generalError.value = 'An unexpected error occurred. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form class="space-y-5" @submit.prevent="handleSubmit">
    <h3 class="mb-1 text-3xl font-bold tracking-widest" style="color: #fff;">Sign In</h3>

    <!-- General error (e.g. 401 wrong credentials) -->
    <p v-if="generalError" class="rounded-[8px] px-4 py-3 text-sm" style="background: rgba(224,85,85,0.15); color: #E05555;">
      {{ generalError }}
    </p>

    <!-- Email -->
    <div>
      <label class="mb-2 block text-xs font-semibold" style="color: #c4c4c4;">Email</label>
      <div
        class="flex items-center overflow-hidden rounded-[10px] transition-colors"
        :style="{ border: fieldErrors.email ? '2px solid #E05555' : '2px solid #888' }"
      >
        <div class="flex shrink-0 items-center justify-center px-4 py-4">
          <svg class="h-5 w-5" style="color: #c4c4c4;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>
        <div class="h-8 w-px shrink-0" style="background: rgba(136,136,136,0.5);" />
        <input
          v-model="email"
          type="email"
          required
          autocomplete="email"
          class="flex-1 bg-transparent px-4 py-4 text-sm outline-none"
          style="color: #F0EDE8;"
          placeholder="your@email.com"
        />
      </div>
      <p v-if="fieldErrors.email" class="mt-1 text-xs" style="color: #E05555;">{{ fieldErrors.email }}</p>
    </div>

    <!-- Password -->
    <div>
      <label class="mb-2 block text-xs font-semibold" style="color: #c4c4c4;">Password</label>
      <div
        class="flex items-center overflow-hidden rounded-[10px] transition-colors"
        :style="{ border: fieldErrors.password ? '2px solid #E05555' : '2px solid #888' }"
      >
        <div class="flex shrink-0 items-center justify-center px-4 py-4">
          <svg class="h-5 w-5" style="color: #c4c4c4;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <div class="h-8 w-px shrink-0" style="background: rgba(136,136,136,0.5);" />
        <input
          v-model="password"
          type="password"
          required
          autocomplete="current-password"
          class="flex-1 bg-transparent px-4 py-4 text-sm outline-none"
          style="color: #F0EDE8;"
          placeholder="••••••••"
        />
      </div>
      <p v-if="fieldErrors.password" class="mt-1 text-xs" style="color: #E05555;">{{ fieldErrors.password }}</p>
    </div>

    <p>
      <a href="#" class="text-sm hover:underline" style="color: #c1c1c1;">Forgot password?</a>
    </p>

    <button
      type="submit"
      :disabled="loading"
      class="w-full rounded-[10px] py-[15px] text-sm font-bold uppercase tracking-widest transition-all hover:brightness-110 disabled:opacity-60"
      style="background: #d1893e; color: #fff;"
    >
      {{ loading ? 'Signing in…' : 'Sign In' }}
    </button>

  </form>
</template>
