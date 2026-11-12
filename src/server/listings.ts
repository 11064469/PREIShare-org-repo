import { createServerFn } from '@tanstack/react-start'
import type {
  PropertyListingInsert,
  PropertyListingUpdate,
} from '../lib/supabase/types'
import {
  createListingSchema,
  updateListingSchema,
} from '../lib/listings/schema'

export const listListings = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { createServerSupabaseClient } =
      await import('../lib/supabase/server')
    const { supabase, user } = await createServerSupabaseClient()
    if (!user) {
      throw new Error('Authentication required to view property listings.')
    }

    const { data, error } = await supabase
      .from('property_listings')
      .select('*')
      .eq('sponsor_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Unable to load property listings: ${error.message}`)
    }

    return data
  },
)

export const createListing = createServerFn({ method: 'POST' })
  .validator(createListingSchema)
  .handler(async ({ data }) => {
    const { createServerSupabaseClient } =
      await import('../lib/supabase/server')
    const { supabase, user } = await createServerSupabaseClient()
    if (!user) {
      throw new Error('Authentication required to create a property listing.')
    }

    const listing: PropertyListingInsert = {
      sponsor_id: user.id,
      title: data.title,
      city: data.city,
      country: data.country,
      status: data.status,
      ...(data.address === undefined ? {} : { address: data.address }),
      ...(data.region === undefined ? {} : { region: data.region }),
      ...(data.postal_code === undefined
        ? {}
        : { postal_code: data.postal_code }),
      ...(data.price === undefined ? {} : { price: data.price }),
    }

    const { data: createdListing, error } = await supabase
      .from('property_listings')
      .insert(listing)
      .select('*')
      .single()

    if (error) {
      throw new Error(`Unable to create property listing: ${error.message}`)
    }

    return createdListing
  })

export const updateListing = createServerFn({ method: 'POST' })
  .validator(updateListingSchema)
  .handler(async ({ data }) => {
    const { createServerSupabaseClient } =
      await import('../lib/supabase/server')
    const { supabase, user } = await createServerSupabaseClient()
    if (!user) {
      throw new Error('Authentication required to update a property listing.')
    }

    const changes: PropertyListingUpdate = {
      ...(data.title === undefined ? {} : { title: data.title }),
      ...(data.address === undefined ? {} : { address: data.address }),
      ...(data.city === undefined ? {} : { city: data.city }),
      ...(data.region === undefined ? {} : { region: data.region }),
      ...(data.postal_code === undefined
        ? {}
        : { postal_code: data.postal_code }),
      ...(data.country === undefined ? {} : { country: data.country }),
      ...(data.price === undefined ? {} : { price: data.price }),
      ...(data.status === undefined ? {} : { status: data.status }),
    }

    const { data: updatedListing, error } = await supabase
      .from('property_listings')
      .update(changes)
      .eq('id', data.id)
      .eq('sponsor_id', user.id)
      .select('*')
      .maybeSingle()

    if (error) {
      throw new Error(`Unable to update property listing: ${error.message}`)
    }
    if (!updatedListing) {
      throw new Error(
        'Property listing was not found or you do not have permission to update it.',
      )
    }

    return updatedListing
  })
