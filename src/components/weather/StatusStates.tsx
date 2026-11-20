import { WarningCircle } from "@phosphor-icons/react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export function LoadingState({ label }: { label: string }) {
  return (
    <div role="status" aria-label={label} className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pt-10 sm:px-6 lg:px-8">
      <p className="text-sm text-white/90">{label}</p>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-32 bg-white/15" />
        <Skeleton className="h-12 w-72 bg-white/15" />
        <Skeleton className="h-32 w-56 bg-white/15" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Skeleton className="h-48 bg-white/10 lg:col-span-2" />
        <Skeleton className="h-48 bg-white/10" />
        <Skeleton className="h-72 bg-white/10" />
        <Skeleton className="h-72 bg-white/10 lg:col-span-2" />
      </div>
    </div>
  )
}

export function ErrorState({ message, onRetry, busy }: { message: string; onRetry: () => void; busy: boolean }) {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4 px-4 pt-10 sm:px-6">
      <Alert variant="destructive">
        <WarningCircle aria-hidden />
        <AlertTitle>Data cuaca belum bisa dimuat</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
      <Button variant="outline" onClick={onRetry} disabled={busy} className="w-fit">
        Coba lagi
      </Button>
    </div>
  )
}
