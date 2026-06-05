'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toaster'
import { deleteWeightLog } from '@/actions/weight'

export function DeleteWeightButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    setIsDeleting(true)
    const result = await deleteWeightLog(id)
    if (result.error) {
      toast({ title: 'Hata', description: result.error, variant: 'destructive' })
    } else {
      toast({ title: 'Silindi', variant: 'success' })
    }
    setIsDeleting(false)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-muted-foreground hover:text-destructive"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      <Trash2 className="h-3.5 w-3.5" />
    </Button>
  )
}
