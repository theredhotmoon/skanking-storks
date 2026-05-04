import type { Band } from './band'
import type { Venue } from './venue'

export interface Concert {
  id: number
  date: string
  time: string | null
  description: string | null
  venue: Venue
  bands: Band[]
  created_at: string
  updated_at: string
}

export interface ConcertPayload {
  venue_id: number
  date: string
  time?: string | null
  description?: string | null
  band_ids?: number[]
}
