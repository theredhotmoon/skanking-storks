import type { Tag } from './tag'

export interface PhotoVenue {
  id: number
  name: string
}

export interface PhotoConcert {
  id: number
  date: string
  description: string | null
}

export interface PhotoPost {
  id: number
  title: string
  slug: string
}

export interface PhotoSummary {
  id: number
  title: string
  slug: string
  description: string | null
  taken_at: string | null
  published_at: string | null
  venue: PhotoVenue | null
  concert: PhotoConcert | null
  tags: Tag[]
  posts: PhotoPost[]
  created_at: string
  updated_at: string
}

export interface Photo extends PhotoSummary {
  image: string | null
}

export interface PhotoPayload {
  title: string
  description?: string | null
  image?: string | null
  venue_id?: number | null
  concert_id?: number | null
  taken_at?: string | null
  published_at?: string | null
  tag_ids?: number[]
  post_ids?: number[]
}
