import { computed, ref } from 'vue'
import { loginApi, logoutApi, registerApi } from '@/api/auth'
import type { AuthUser, LoginPayload, RegisterPayload } from '@/types/auth'

// Module-level singletons so auth state is shared across the entire app.
const token = ref<string | null>(localStorage.getItem('auth_token'))
const user = ref<AuthUser | null>(null)

function persistToken(t: string | null): void {
  token.value = t
  if (t) {
    localStorage.setItem('auth_token', t)
  } else {
    localStorage.removeItem('auth_token')
  }
}

export function useAuth() {
  const isLoggedIn = computed(() => token.value !== null)

  async function login(payload: LoginPayload): Promise<void> {
    const data = await loginApi(payload)
    persistToken(data.token)
    user.value = data.user
  }

  async function register(payload: RegisterPayload): Promise<void> {
    const data = await registerApi(payload)
    persistToken(data.token)
    user.value = data.user
  }

  async function logout(): Promise<void> {
    if (token.value) {
      await logoutApi(token.value)
    }
    persistToken(null)
    user.value = null
  }

  return { token, user, isLoggedIn, login, register, logout }
}
