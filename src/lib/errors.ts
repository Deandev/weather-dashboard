export class ApiError extends Error {}

export function messageOf(err: unknown): string {
  if (err instanceof ApiError) return err.message
  return "Koneksi bermasalah. Coba lagi."
}
