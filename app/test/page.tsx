import { getProducts } from '@/services/products'

export const dynamic = 'force-dynamic'

export default async function TestPage() {
  let data: any = null
  let error: any = null

  try {
    data = await getProducts({ includeDisabled: true })
  } catch (err: any) {
    error = err?.message || String(err)
  }

  return (
    <div style={{ padding: 20, fontFamily: 'monospace' }}>
      <h1>Backend Health Check (Firebase Firestore)</h1>

      <h2>Error</h2>
      <pre>{JSON.stringify(error, null, 2)}</pre>

      <h2>Data ({Array.isArray(data) ? data.length : 0} items)</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}