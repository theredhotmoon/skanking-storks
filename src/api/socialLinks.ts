import type { SocialLink, SocialLinkPayload } from '@/types/socialLink'
import { API_BASE, assertSafeId, authHeaders, handleResponse, jsonHeaders } from './client'

interface SocialLinkListResponse { data: SocialLink[] }
interface SocialLinkResponse { data: SocialLink }

export async function fetchBandSocialLinks(bandId: number): Promise<SocialLink[]> {
  assertSafeId(bandId)
  const res = await fetch(`${API_BASE}/api/bands/${bandId}/social-links`, { headers: jsonHeaders })
  return handleResponse<SocialLinkListResponse>(res).then((r) => r.data)
}

export async function createBandSocialLink(
  token: string,
  bandId: number,
  payload: SocialLinkPayload,
): Promise<SocialLink> {
  assertSafeId(bandId)
  const res = await fetch(`${API_BASE}/api/bands/${bandId}/social-links`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  })
  return handleResponse<SocialLinkResponse>(res).then((r) => r.data)
}

export async function updateBandSocialLink(
  token: string,
  bandId: number,
  linkId: number,
  payload: SocialLinkPayload,
): Promise<SocialLink> {
  assertSafeId(bandId)
  assertSafeId(linkId)
  const res = await fetch(`${API_BASE}/api/bands/${bandId}/social-links/${linkId}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  })
  return handleResponse<SocialLinkResponse>(res).then((r) => r.data)
}

export async function deleteBandSocialLink(
  token: string,
  bandId: number,
  linkId: number,
): Promise<void> {
  assertSafeId(bandId)
  assertSafeId(linkId)
  const res = await fetch(`${API_BASE}/api/bands/${bandId}/social-links/${linkId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
  return handleResponse<void>(res)
}
