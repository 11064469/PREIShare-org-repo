import { z } from 'zod'

const requiredText = z.string().trim().min(1, 'This field cannot be blank.')
const optionalText = z.string().trim().nullable().optional()

const price = z
  .number()
  .finite()
  .min(0, 'Price must be zero or greater.')
  .max(999_999_999_999.99, 'Price exceeds the database column limit.')
  .refine((value) => {
    const [whole, fraction = ''] = value.toString().split('.')
    return (
      whole !== undefined &&
      /^\d+$/.test(whole) &&
      whole.length <= 12 &&
      /^\d*$/.test(fraction) &&
      fraction.length <= 2
    )
  }, 'Price must fit the database numeric(14,2) column.')
  .nullable()
  .optional()

export const createListingSchema = z
  .object({
    title: requiredText,
    address: optionalText,
    city: requiredText,
    region: optionalText,
    postal_code: optionalText,
    country: requiredText,
    price,
    status: requiredText,
  })
  .strict()

export const updateListingSchema = z
  .object({
    id: z.string().uuid('Listing ID must be a valid UUID.'),
    title: requiredText.optional(),
    address: optionalText,
    city: requiredText.optional(),
    region: optionalText,
    postal_code: optionalText,
    country: requiredText.optional(),
    price,
    status: requiredText.optional(),
  })
  .strict()
  .refine(
    (input) =>
      Object.entries(input).some(
        ([key, value]) => key !== 'id' && value !== undefined,
      ),
    'Provide at least one listing field to update.',
  )

export type CreateListingInput = z.infer<typeof createListingSchema>
export type UpdateListingInput = z.infer<typeof updateListingSchema>
