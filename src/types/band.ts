import type { BandMember } from './bandMember'

export interface Band {
  id: number
  name: string
  bio: string | null
  members?: BandMember[]
  created_at: string
  updated_at: string
}

export interface BandPayload {
  name: string
  bio?: string | null
}
