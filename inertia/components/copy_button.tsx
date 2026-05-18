import { Copy } from 'lucide-react'
import { Button } from './ui/button'
import { useState } from 'react'
import { cn } from '~/lib/utils'

export default function CopyButton({ text, className }: { text: string; className?: string }) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <Button variant="outline" size="sm" className={cn(className)} onClick={handleCopy}>
      <Copy className="h-4 w-4" /> {isCopied ? 'Copiado' : 'Copiar'}
    </Button>
  )
}
