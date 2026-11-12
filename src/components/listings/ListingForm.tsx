import { useState, type FormEvent } from 'react'
import {
  createListingSchema,
  type CreateListingInput,
} from '../../lib/listings/schema'

type ListingFormProps = {
  isSubmitting: boolean
  serverError: string
  onSubmit: (listing: CreateListingInput) => Promise<void>
}

const fields = [
  { name: 'title', label: 'Title', required: true, type: 'text' },
  { name: 'city', label: 'City', required: true, type: 'text' },
  { name: 'country', label: 'Country', required: true, type: 'text' },
  { name: 'status', label: 'Status', required: true, type: 'text' },
  { name: 'address', label: 'Address', required: false, type: 'text' },
  { name: 'region', label: 'Region', required: false, type: 'text' },
  { name: 'postal_code', label: 'Postal code', required: false, type: 'text' },
] as const

export default function ListingForm({
  isSubmitting,
  serverError,
  onSubmit,
}: ListingFormProps) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [validationError, setValidationError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFieldErrors({})
    setValidationError('')

    const formData = new FormData(event.currentTarget)
    const values: Record<string, FormDataEntryValue | number | undefined> = {}

    for (const field of fields) {
      const value = formData.get(field.name)
      if (field.required || (typeof value === 'string' && value.trim() !== '')) {
        values[field.name] = value ?? ''
      }
    }

    const priceValue = formData.get('price')
    if (typeof priceValue === 'string' && priceValue.trim() !== '') {
      values.price = Number(priceValue)
    }

    const result = createListingSchema.safeParse(values)
    if (!result.success) {
      const errors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const fieldName = issue.path[0]
        if (typeof fieldName === 'string' && errors[fieldName] === undefined) {
          errors[fieldName] = issue.message
        }
      }
      setFieldErrors(errors)
      setValidationError('Please correct the highlighted fields.')
      return
    }

    await onSubmit(result.data)
  }

  return (
    <form
      className="island-shell space-y-5 rounded-2xl p-5 sm:p-7"
      noValidate
      onSubmit={handleSubmit}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((field) => {
          const error = fieldErrors[field.name]
          const inputId = `listing-${field.name}`

          return (
            <div className="space-y-2" key={field.name}>
              <label className="block text-sm font-semibold" htmlFor={inputId}>
                {field.label}
                {field.required ? ' (required)' : ''}
              </label>
              <input
                aria-describedby={error ? `${inputId}-error` : undefined}
                aria-invalid={Boolean(error)}
                autoComplete="off"
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 text-[var(--sea-ink)] outline-none focus:ring-2 focus:ring-[var(--lagoon)]"
                id={inputId}
                name={field.name}
                required={field.required}
                type={field.type}
              />
              {error ? (
                <p className="text-sm text-red-700" id={`${inputId}-error`}>
                  {error}
                </p>
              ) : null}
            </div>
          )
        })}

        <div className="space-y-2">
          <label className="block text-sm font-semibold" htmlFor="listing-price">
            Price
          </label>
          <input
            aria-describedby={
              fieldErrors.price ? 'listing-price-error' : undefined
            }
            aria-invalid={Boolean(fieldErrors.price)}
            className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 text-[var(--sea-ink)] outline-none focus:ring-2 focus:ring-[var(--lagoon)]"
            id="listing-price"
            min="0"
            name="price"
            step="0.01"
            type="number"
          />
          {fieldErrors.price ? (
            <p className="text-sm text-red-700" id="listing-price-error">
              {fieldErrors.price}
            </p>
          ) : null}
        </div>
      </div>

      {validationError ? (
        <p className="text-sm font-medium text-red-700" role="alert">
          {validationError}
        </p>
      ) : null}
      {serverError ? (
        <p className="text-sm font-medium text-red-700" role="alert">
          {serverError}
        </p>
      ) : null}

      <button
        className="rounded-full bg-[var(--palm)] px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? 'Saving property…' : 'Save property'}
      </button>
    </form>
  )
}
