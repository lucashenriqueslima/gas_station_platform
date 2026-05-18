import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog'
import { Loader2 } from 'lucide-react'

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onConfirm: () => void
}) {
  const [isSubmiting, setIsSubmiting] = useState(false)

  const handleConfirmation = () => {
    setIsSubmiting(true)
    onConfirm()
    setIsSubmiting(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmiting === true}>Cancelar</AlertDialogCancel>
          <AlertDialogAction disabled={isSubmiting === true} onClick={handleConfirmation}>
            {isSubmiting == true && <Loader2 className="animate-spin" />}
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    // <Dialog open={open} onOpenChange={onOpenChange}>
    //   <DialogContent>
    //     <DialogHeader>
    //       <DialogTitle>{title}</DialogTitle>
    //       <DialogDescription>{description}</DialogDescription>
    //     </DialogHeader>
    //     <DialogFooter>
    //       <Button variant="outline" onClick={() => onOpenChange(false)}>
    //         Cancelar
    //       </Button>
    //       <Button
    //         onClick={() => {

    //           onConfirm()
    //         }}
    //       >
    //         Confirmar
    //       </Button>
    //     </DialogFooter>
    //   </DialogContent>
    // </Dialog>
  )
}
