/**
 * PREIshare database types, based on
 * supabase/migrations/20250321000000_property_listings.sql.
 * Regenerate from Supabase when the schema changes.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      property_listings: {
        Row: {
          id: string
          sponsor_id: string
          title: string
          address: string | null
          city: string
          region: string | null
          postal_code: string | null
          country: string
          price: number | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sponsor_id: string
          title: string
          address?: string | null
          city: string
          region?: string | null
          postal_code?: string | null
          country: string
          price?: number | null
          status: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          // App-level restriction: owner changes are forbidden by the DB trigger.
          sponsor_id?: never
          title?: string
          address?: string | null
          city?: string
          region?: string | null
          postal_code?: string | null
          country?: string
          price?: number | null
          status?: string
          // App-level restriction: audit timestamps are database-managed.
          created_at?: never
          updated_at?: never
        }
        Relationships: [
          {
            foreignKeyName: 'property_listings_sponsor_id_fkey'
            columns: ['sponsor_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

export type PropertyListing = Database['public']['Tables']['property_listings']['Row']
export type PropertyListingInsert = Database['public']['Tables']['property_listings']['Insert']
export type PropertyListingUpdate = Database['public']['Tables']['property_listings']['Update']
