import type { Category } from './category'
import type { Tag } from './tag'

export type PostLinkType = 'youtube' | 'instagram' | 'facebook' | 'normal'

export interface PostLink {
  id: number
  type: PostLinkType
  url: string
  label: string | null
  sort_order: number
}

export interface PostLinkPayload {
  type: PostLinkType
  url: string
  label?: string | null
}

/** Returned in list responses — no image, content replaced by excerpt. */
export interface PostSummary {
  id: number
  title: string
  slug: string
  excerpt: string
  published_at: string | null
  categories: Category[]
  tags: Tag[]
  created_at: string
  updated_at: string
}

/** Returned in detail response — includes image, full content, and links. */
export interface Post extends PostSummary {
  content: string | null
  image: string | null
  links: PostLink[]
}

export interface PostPayload {
  title: string
  content?: string | null
  image?: string | null
  published_at?: string | null
  category_ids?: number[]
  tag_ids?: number[]
  links?: PostLinkPayload[]
}
