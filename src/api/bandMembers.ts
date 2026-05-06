import type { BandMember, BandMemberPayload } from '@/types/bandMember'
import { API_BASE, assertSafeId, authHeaders, handleResponse, jsonHeaders } from './client'

interface BandMemberListResponse { data: BandMember[] }
interface BandMemberResponse { data: BandMember }

export async function fetchBandMembers(bandId: number): Promise<BandMember[]> {
  assertSafeId(bandId)
  const res = await fetch(`${API_BASE}/api/bands/${bandId}/members`, { headers: jsonHeaders })
  return handleResponse<BandMemberListResponse>(res).then((r) => r.data)
}

export async function createBandMember(
  token: string,
  bandId: number,
  payload: BandMemberPayload,
): Promise<BandMember> {
  assertSafeId(bandId)
  const res = await fetch(`${API_BASE}/api/bands/${bandId}/members`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  })
  return handleResponse<BandMemberResponse>(res).then((r) => r.data)
}

export async function updateBandMember(
  token: string,
  bandId: number,
  memberId: number,
  payload: Partial<BandMemberPayload>,
): Promise<BandMember> {
  assertSafeId(bandId)
  assertSafeId(memberId)
  const res = await fetch(`${API_BASE}/api/bands/${bandId}/members/${memberId}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  })
  return handleResponse<BandMemberResponse>(res).then((r) => r.data)
}

export async function deleteBandMember(
  token: string,
  bandId: number,
  memberId: number,
): Promise<void> {
  assertSafeId(bandId)
  assertSafeId(memberId)
  const res = await fetch(`${API_BASE}/api/bands/${bandId}/members/${memberId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
  return handleResponse<void>(res)
}
