import { LEAD_STATUSES, LEAD_STATUS_LABELS } from '@/lib/portal/status'

export function LeadFilters({ source, status, q }: { source?: string; status?: string; q?: string }) {
  return (
    <form className="flex flex-wrap items-end gap-3">
      <div>
        <label htmlFor="q" className="mb-1.5 block text-xs font-medium text-muted-foreground">
          Search
        </label>
        <input
          id="q"
          name="q"
          defaultValue={q ?? ''}
          placeholder="Name, email, phone, address"
          className="w-56 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
        />
      </div>
      <div>
        <label htmlFor="source" className="mb-1.5 block text-xs font-medium text-muted-foreground">
          Source
        </label>
        <select
          id="source"
          name="source"
          defaultValue={source ?? ''}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
        >
          <option value="">All sources</option>
          <option value="WEBSITE">Website</option>
          <option value="FACEBOOK">Facebook</option>
        </select>
      </div>
      <div>
        <label htmlFor="status" className="mb-1.5 block text-xs font-medium text-muted-foreground">
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={status ?? ''}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
        >
          <option value="">All statuses</option>
          {LEAD_STATUSES.map((value) => (
            <option key={value} value={value}>
              {LEAD_STATUS_LABELS[value]}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
      >
        Filter
      </button>
      {(source || status || q) && (
        <a href="/portal/leads" className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
          Clear
        </a>
      )}
    </form>
  )
}
