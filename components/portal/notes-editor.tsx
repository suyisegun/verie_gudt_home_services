'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function NotesEditor({ leadId, initialNotes }: { leadId: string; initialNotes: string }) {
  const [notes, setNotes] = useState(initialNotes)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      })
      if (!res.ok) throw new Error('Save failed')
      setSaved(true)
    } catch {
      setError('Could not save notes.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <textarea
        value={notes}
        onChange={(event) => {
          setNotes(event.target.value)
          setSaved(false)
        }}
        rows={6}
        placeholder="Internal notes about this lead…"
        className="w-full rounded-lg border border-input bg-background p-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
      />
      <div className="mt-2 flex items-center gap-3">
        <Button type="button" size="sm" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save notes'}
        </Button>
        {saved && !saving && <span className="text-xs text-muted-foreground">Saved</span>}
        {error && <span className="text-xs text-destructive">{error}</span>}
      </div>
    </div>
  )
}
