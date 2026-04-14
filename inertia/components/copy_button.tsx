import { Copy } from 'lucide-react'
import { Button } from './ui/button'
import { useState } from 'react'

export default function CopyButton({ text }: { text: string }) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <Button variant="outline" size="sm" onClick={handleCopy}>
      <Copy className="h-4 w-4" /> {isCopied ? 'Copiado' : 'Copiar'}
    </Button>
  )
}
