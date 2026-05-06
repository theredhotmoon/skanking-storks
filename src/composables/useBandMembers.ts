import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import {
  createBandMember,
  deleteBandMember,
  fetchBandMembers,
  updateBandMember,
} from '@/api/bandMembers'
import type { BandMemberPayload } from '@/types/bandMember'
import { useAuth } from './useAuth'

export function useBandMembers(bandId: Ref<number | null>) {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['band-members', bandId],
    queryFn: () => fetchBandMembers(bandId.value!),
    enabled: () => bandId.value !== null,
  })

  const create = useMutation({
    mutationFn: (payload: BandMemberPayload) =>
      createBandMember(token.value!, bandId.value!, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['band-members', bandId] }),
  })

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<BandMemberPayload> }) =>
      updateBandMember(token.value!, bandId.value!, id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['band-members', bandId] }),
  })

  const remove = useMutation({
    mutationFn: (id: number) => deleteBandMember(token.value!, bandId.value!, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['band-members', bandId] }),
  })

  return { query, create, update, remove }
}
