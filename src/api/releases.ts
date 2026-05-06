import type { Release, ReleaseSummary, ReleasePayload } from '@/types/release'
import { API_BASE, assertSafeId, authHeaders, handleResponse, jsonHeaders } from './client'

interface ReleaseListResponse { data: ReleaseSummary[] }
interface ReleaseResponse { data: Release }

export async function fetchReleases(): Promise<ReleaseSummary[]> {
  const res = await fetch(`${API_BASE}/api/releases`, { headers: jsonHeaders })
  return handleResponse<ReleaseListResponse>(res).then((r) => r.data)
}

export async function fetchRelease(id: number): Promise<Release> {
  assertSafeId(id)
  const res = await fetch(`${API_BASE}/api/releases/${id}`, { headers: jsonHeaders })
  return handleResponse<ReleaseResponse>(res).then((r) => r.data)
}

export async function createRelease(token: string, payload: ReleasePayload): Promise<Release> {
  const res = await fetch(`${API_BASE}/api/releases`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  })
  return handleResponse<ReleaseResponse>(res).then((r) => r.data)
}

export async function updateRelease(
  token: string,
  id: number,
  payload: ReleasePayload,
): Promise<Release> {
  assertSafeId(id)
  const res = await fetch(`${API_BASE}/api/releases/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  })
  return handleResponse<ReleaseResponse>(res).then((r) => r.data)
}

export async function deleteRelease(token: string, id: number): Promise<void> {
  assertSafeId(id)
  const res = await fetch(`${API_BASE}/api/releases/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
  return handleResponse<void>(res)
}
