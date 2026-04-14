import { Loader2 } from 'lucide-react'
import { Button } from './button'
import { useEffect, useState } from 'react'

type Props = {
  children: React.ReactNode
  isLoading: boolean
  type?: 'button' | 'submit' | 'reset'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive' | 'success'
  className?: string
  onClick?: () => Promise<void>
}

export function ButtonWithLoader({
  isLoading,
  children,
  type,
  size,
  variant,
  className,
  onClick,
}: Props) {
  const [loading, setLoading] = useState(isLoading)

  useEffect(() => {
    setLoading(isLoading)
  }, [isLoading])

  const handleClick = async () => {
    if (loading) return

    try {
      setLoading(true)
      await onClick?.()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      type={type}
      disabled={loading}
      size={size}
      variant={variant}
      className={className}
      onClick={handleClick}
    >
      {loading ? <Loader2 className="animate-spin" /> : children}
    </Button>
  )
}
