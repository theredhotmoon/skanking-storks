<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { useAuth } from '@/composables/useAuth'
import { ApiError, ApiValidationError } from '@/api/auth'

const emit = defineEmits<{
  success: []
}>()

const { register } = useAuth()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const accepted = ref(false)
const loading = ref(false)
const generalError = ref<string | null>(null)
const fieldErrors = ref<Record<string, string>>({})

async function handleSubmit() {
  generalError.value = null
  fieldErrors.value = {}
  loading.value = true

  try {
    await register({
      first_name: firstName.value,
      last_name: lastName.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    })
    toast.success('Account created. Welcome!')
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
  <form class="space-y-3" @submit.prevent="handleSubmit">
    <h3 class="mb-2 text-3xl font-bold tracking-widest" style="color: #fff;">Register</h3>

    <!-- General error -->
    <p v-if="generalError" class="rounded-[8px] px-4 py-3 text-sm" style="background: rgba(224,85,85,0.15); color: #E05555;">
      {{ generalError }}
    </p>

    <!-- First / Last name -->
    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="mb-1 block text-xs font-semibold" style="color: #c4c4c4;">First name</label>
        <input
          v-model="firstName"
          type="text"
          required
          autocomplete="given-name"
          class="w-full rounded-[10px] px-4 py-3 text-sm outline-none transition-colors"
          :style="{ border: fieldErrors.first_name ? '2px solid #E05555' : '2px solid #888', background: 'transparent', color: '#F0EDE8' }"
          placeholder="John"
        />
        <p v-if="fieldErrors.first_name" class="mt-1 text-xs" style="color: #E05555;">{{ fieldErrors.first_name }}</p>
      </div>
      <div>
        <label class="mb-1 block text-xs font-semibold" style="color: #c4c4c4;">Last name</label>
        <input
          v-model="lastName"
          type="text"
          required
          autocomplete="family-name"
          class="w-full rounded-[10px] px-4 py-3 text-sm outline-none transition-colors"
          :style="{ border: fieldErrors.last_name ? '2px solid #E05555' : '2px solid #888', background: 'transparent', color: '#F0EDE8' }"
          placeholder="Doe"
        />
        <p v-if="fieldErrors.last_name" class="mt-1 text-xs" style="color: #E05555;">{{ fieldErrors.last_name }}</p>
      </div>
    </div>

    <!-- Email -->
    <div>
      <label class="mb-1 block text-xs font-semibold" style="color: #c4c4c4;">Email</label>
      <input
        v-model="email"
        type="email"
        required
        autocomplete="email"
        class="w-full rounded-[10px] px-4 py-3 text-sm outline-none transition-colors"
        :style="{ border: fieldErrors.email ? '2px solid #E05555' : '2px solid #888', background: 'transparent', color: '#F0EDE8' }"
        placeholder="your@email.com"
      />
      <p v-if="fieldErrors.email" class="mt-1 text-xs" style="color: #E05555;">{{ fieldErrors.email }}</p>
    </div>

    <!-- Password -->
    <div>
      <label class="mb-1 block text-xs font-semibold" style="color: #c4c4c4;">Password</label>
      <input
        v-model="password"
        type="password"
        required
        autocomplete="new-password"
        class="w-full rounded-[10px] px-4 py-3 text-sm outline-none transition-colors"
        :style="{ border: fieldErrors.password ? '2px solid #E05555' : '2px solid #888', background: 'transparent', color: '#F0EDE8' }"
        placeholder="Min 8 chars, letters + numbers"
      />
      <p v-if="fieldErrors.password" class="mt-1 text-xs" style="color: #E05555;">{{ fieldErrors.password }}</p>
    </div>

    <!-- Confirm password -->
    <div>
      <label class="mb-1 block text-xs font-semibold" style="color: #c4c4c4;">Confirm password</label>
      <input
        v-model="passwordConfirmation"
        type="password"
        required
        autocomplete="new-password"
        class="w-full rounded-[10px] px-4 py-3 text-sm outline-none transition-colors"
        :style="{ border: fieldErrors.password_confirmation ? '2px solid #E05555' : '2px solid #888', background: 'transparent', color: '#F0EDE8' }"
        placeholder="••••••••"
      />
      <p v-if="fieldErrors.password_confirmation" class="mt-1 text-xs" style="color: #E05555;">{{ fieldErrors.password_confirmation }}</p>
    </div>

    <!-- Terms -->
    <label class="flex cursor-pointer items-start gap-2 pt-1 text-xs" style="color: #9A9488;">
      <input v-model="accepted" type="checkbox" required class="mt-0.5 accent-[#d1893e]" />
      <span>
        I accept the
        <a href="#" class="hover:underline" style="color: #d1893e;">Terms of Service</a>
        and
        <a href="#" class="hover:underline" style="color: #d1893e;">Privacy Policy</a>
      </span>
    </label>

    <button
      type="submit"
      :disabled="loading"
      class="w-full rounded-[10px] py-[15px] text-sm font-bold uppercase tracking-widest transition-all hover:brightness-110 disabled:opacity-60"
      style="background: #d1893e; color: #fff;"
    >
      {{ loading ? 'Registering…' : 'Create Account' }}
    </button>
  </form>
</template>
