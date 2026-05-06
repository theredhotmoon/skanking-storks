import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import {
  createBandSocialLink,
  deleteBandSocialLink,
  fetchBandSocialLinks,
  updateBandSocialLink,
} from '@/api/socialLinks'
import type { SocialLinkPayload } from '@/types/socialLink'
import { useAuth } from './useAuth'

export function useSocialLinks(bandId: Ref<number | null>) {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  const qk = ['social-links', bandId]

  const query = useQuery({
    queryKey: qk,
    queryFn: () => fetchBandSocialLinks(bandId.value!),
    enabled: () => bandId.value !== null,
  })

  const create = useMutation({
    mutationFn: (payload: SocialLinkPayload) =>
      createBandSocialLink(token.value!, bandId.value!, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qk }),
  })

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: SocialLinkPayload }) =>
      updateBandSocialLink(token.value!, bandId.value!, id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qk }),
  })

  const remove = useMutation({
    mutationFn: (id: number) => deleteBandSocialLink(token.value!, bandId.value!, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qk }),
  })

  return { query, create, update, remove }
}
