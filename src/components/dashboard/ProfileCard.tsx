export interface InvestorProfile {
  displayName: string
  email: string
  membershipTier: string
  preferredContact: string
  notes: string
}

export const MOCK_PROFILE: InvestorProfile = {
  displayName: 'Sample Investor',
  email: 'sample.investor@example.com',
  membershipTier: 'Growth Member',
  preferredContact: 'Email',
  notes: 'Interested in diversified, long-term property investments.',
}

interface ProfileCardProps {
  profile?: InvestorProfile
}

const profileFields = [
  { label: 'Display Name', key: 'displayName' },
  { label: 'Email', key: 'email' },
  { label: 'Membership Tier', key: 'membershipTier' },
  { label: 'Preferred Contact', key: 'preferredContact' },
  { label: 'Notes', key: 'notes' },
] as const satisfies ReadonlyArray<{
  label: string
  key: keyof InvestorProfile
}>

export default function ProfileCard({
  profile = MOCK_PROFILE,
}: ProfileCardProps) {
  return (
    <section
      aria-labelledby="profile-card-title"
      className="feature-card rounded-lg border border-[var(--line)] p-5"
    >
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2
          id="profile-card-title"
          className="m-0 text-lg font-bold text-[var(--sea-ink)]"
        >
          Profile Details
        </h2>
        <p className="m-0 text-xs font-semibold text-[var(--sea-ink-soft)]">
          Sample data
        </p>
      </div>
      <dl className="m-0 grid gap-x-6 gap-y-5 sm:grid-cols-2">
        {profileFields.map(({ label, key }) => (
          <div
            key={key}
            className={key === 'notes' ? 'sm:col-span-2' : undefined}
          >
            <dt className="text-xs font-semibold text-[var(--sea-ink-soft)]">
              {label}
            </dt>
            <dd className="mb-0 mt-1 break-words text-sm font-medium text-[var(--sea-ink)]">
              {profile[key]}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}