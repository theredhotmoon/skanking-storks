export type ReleaseType = 'LP' | 'EP' | 'single' | 'compilation'
export type ReleasePlatform = 'spotify' | 'apple_music' | 'bandcamp' | 'youtube' | 'instagram'

export interface ReleaseLink {
  id: number
  platform: ReleasePlatform
  url: string
}

export interface ReleaseTrack {
  id: number
  title: string
  duration: string | null
  lyrics: string | null
  sort_order: number
}

export interface ReleaseSummary {
  id: number
  band_id: number
  band_name: string | null
  title: string
  type: ReleaseType
  release_date: string | null
  cover_image: string | null
  created_at: string
  updated_at: string
}

export interface Release extends ReleaseSummary {
  description: string | null
  tracks: ReleaseTrack[]
  links: ReleaseLink[]
}

export interface ReleaseTrackPayload {
  title: string
  duration: string | null
  lyrics: string | null
  sort_order: number
}

export interface ReleaseLinkPayload {
  platform: ReleasePlatform
  url: string
}

export interface ReleasePayload {
  band_id: number
  title: string
  type: ReleaseType
  release_date: string | null
  cover_image: string | null
  description: string | null
  links: ReleaseLinkPayload[]
  tracks: ReleaseTrackPayload[]
}
