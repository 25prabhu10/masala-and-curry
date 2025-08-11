// CloudflareBindings and R2Object types are provided globally via worker-configuration.d.ts

type VariantSpec = { width: number; format: 'webp' | 'avif'; quality: number }

const VARIANTS: VariantSpec[] = [
  { format: 'webp', quality: 80, width: 256 },
  { format: 'webp', quality: 80, width: 512 },
  { format: 'webp', quality: 80, width: 1024 },
  { format: 'avif', quality: 50, width: 256 },
  { format: 'avif', quality: 50, width: 512 },
  { format: 'avif', quality: 50, width: 1024 },
]

export function parseKeysFromPublicUrl(url: string): {
  originalKey: string | null
  imageKey: string | null
  folderPrefix: string | null
} {
  try {
    // Expected: /api/v1/images/menu-items/<uuid>/image.original.<ext>
    const idx = url.indexOf('/api/v1/images/')
    if (idx === -1) {
      return { folderPrefix: null, imageKey: null, originalKey: null }
    }
    const key = url.slice(idx + '/api/v1/images/'.length)
    const originalKey = key
    const dotOriginal = key.lastIndexOf('.original.')
    if (dotOriginal === -1) {
      const lastSlash = key.lastIndexOf('/')
      return {
        folderPrefix: lastSlash !== -1 ? key.slice(0, lastSlash + 1) : null,
        imageKey: lastSlash !== -1 ? key : null,
        originalKey,
      }
    }
    const imageKey = key.slice(0, dotOriginal)
    const lastSlash = key.lastIndexOf('/')
    const folderPrefix = lastSlash !== -1 ? key.slice(0, lastSlash + 1) : null
    return { folderPrefix, imageKey, originalKey }
  } catch {
    return { folderPrefix: null, imageKey: null, originalKey: null }
  }
}

export async function generateAndPersistVariants(
  env: CloudflareBindings,
  originalKey: string,
  imageKey: string
): Promise<void> {
  const originUrl = new URL(`/api/v1/images/raw/${originalKey}`, env.URL)

  await Promise.all(
    VARIANTS.map(async ({ width, format, quality }) => {
      const res = await fetch(originUrl.toString(), {
        cf: {
          image: {
            fit: 'cover',
            format,
            quality,
            stripMetadata: true,
            width,
          },
        },
      } as RequestInit)

      if (!res.ok) {
        throw new Error(`Failed to generate variant ${width}.${format}`)
      }

      const ab = await res.arrayBuffer()
      const key = `${imageKey}.w${width}.${format}`
      await env.mac_bucket.put(key, ab, {
        httpMetadata: { contentType: `image/${format}` },
      })
    })
  )
}

export async function deleteAllUnderPrefix(
  env: CloudflareBindings,
  folderPrefix: string
): Promise<void> {
  async function step(cursor?: string): Promise<void> {
    const list = await env.mac_bucket.list({ cursor, limit: 1000, prefix: folderPrefix })
    if (list.objects.length > 0) {
      await Promise.all(list.objects.map((o: R2Object) => env.mac_bucket.delete(o.key)))
    }
    if (list.truncated) {
      await step(list.cursor)
    }
  }
  await step()
}
