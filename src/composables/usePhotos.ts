import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { fetchPhoto, fetchPhotos, createPhoto, updatePhoto, deletePhoto } from '@/api/photos'
import type { PhotoFilters } from '@/api/photos'
import type { PhotoPayload } from '@/types/photo'
import { useAuth } from './useAuth'

export function usePhotos(filters: Ref<PhotoFilters> = { value: {} } as Ref<PhotoFilters>) {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['photos', filters],
    queryFn: () => fetchPhotos(filters.value),
  })

  const create = useMutation({
    mutationFn: (payload: PhotoPayload) => createPhoto(token.value!, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['photos'] }),
  })

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<PhotoPayload> }) =>
      updatePhoto(token.value!, id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['photos'] }),
  })

  const remove = useMutation({
    mutationFn: (id: number) => deletePhoto(token.value!, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['photos'] }),
  })

  return { query, create, update, remove }
}

export function usePhoto(id: Ref<number | null>) {
  return useQuery({
    queryKey: ['photos', id],
    queryFn: () => fetchPhoto(id.value!),
    enabled: () => id.value !== null,
  })
}
