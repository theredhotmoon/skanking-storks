import type { Photo, PhotoPayload, PhotoSummary } from '@/types/photo'
import { API_BASE, assertSafeId, authHeaders, handleResponse, jsonHeaders } from './client'

interface PhotoListResponse { data: PhotoSummary[] }
interface PhotoResponse { data: Photo }

export interface PhotoFilters {
  search?: string
  venue_id?: number
  concert_id?: number
  tag_id?: number
  post_id?: number
}

export async function fetchPhotos(filters: PhotoFilters = {}): Promise<PhotoSummary[]> {
  const params = new URLSearchParams()
  if (filters.search)     params.set('search', filters.search)
  if (filters.venue_id)   params.set('venue_id', String(filters.venue_id))
  if (filters.concert_id) params.set('concert_id', String(filters.concert_id))
  if (filters.tag_id)     params.set('tag_id', String(filters.tag_id))
  if (filters.post_id)    params.set('post_id', String(filters.post_id))

  const qs = params.size ? `?${params}` : ''
  const res = await fetch(`${API_BASE}/api/photos${qs}`, { headers: jsonHeaders })
  return handleResponse<PhotoListResponse>(res).then((r) => r.data)
}

export async function fetchPhoto(id: number): Promise<Photo> {
  assertSafeId(id)
  const res = await fetch(`${API_BASE}/api/photos/${id}`, { headers: jsonHeaders })
  return handleResponse<PhotoResponse>(res).then((r) => r.data)
}

export async function createPhoto(token: string, payload: PhotoPayload): Promise<Photo> {
  const res = await fetch(`${API_BASE}/api/photos`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  })
  return handleResponse<PhotoResponse>(res).then((r) => r.data)
}

export async function updatePhoto(token: string, id: number, payload: Partial<PhotoPayload>): Promise<Photo> {
  assertSafeId(id)
  const res = await fetch(`${API_BASE}/api/photos/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  })
  return handleResponse<PhotoResponse>(res).then((r) => r.data)
}

export async function deletePhoto(token: string, id: number): Promise<void> {
  assertSafeId(id)
  const res = await fetch(`${API_BASE}/api/photos/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
  return handleResponse<void>(res)
}
