// Minimal R2 (S3) Signature V4 presign for PUT using crypto.subtle
// Note: Cloudflare Workers supports crypto.subtle, and we avoid large AWS SDKs.

type PresignParams = {
  accountId: string
  accessKeyId: string
  secretAccessKey: string
  bucket: string
  key: string
  contentType: string
  contentLength: number
  expiresIn: number // seconds
}

const encoder = new TextEncoder()

function toHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let hex = ''
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i]
    hex += (b ?? 0).toString(16).padStart(2, '0')
  }
  return hex
}

async function hmacSha256(key: ArrayBuffer | Uint8Array, data: string): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { hash: 'SHA-256', name: 'HMAC' },
    false,
    ['sign']
  )
  return crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(data))
}

async function sha256(data: string): Promise<string> {
  const hash = await crypto.subtle.digest('SHA-256', encoder.encode(data))
  return toHex(hash)
}

export async function generateR2PresignedPutUrl(params: PresignParams): Promise<{
  url: string
  headers: { 'content-type': string; 'content-length': string }
}> {
  const {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucket,
    key,
    contentType,
    contentLength,
    expiresIn,
  } = params
  const now = new Date()
  const amzDate = now.toISOString().replace(/[:-]|/g, '').slice(0, 15) + 'Z' // YYYYMMDDTHHMMSSZ
  const dateStamp = amzDate.slice(0, 8) // YYYYMMDD

  const region = 'auto'
  const service = 's3'
  const host = `${accountId}.r2.cloudflarestorage.com`
  const canonicalUri = `/${bucket}/${encodeURIComponent(key).replace(/%2F/g, '/')}`
  const algorithm = 'AWS4-HMAC-SHA256'

  // Query params for presigned URL
  const qs = new URLSearchParams({
    'X-Amz-Algorithm': algorithm,
    'X-Amz-Credential': `${accessKeyId}/${dateStamp}/${region}/${service}/aws4_request`,
    'X-Amz-Date': amzDate,
    'X-Amz-Expires': String(expiresIn),
    'X-Amz-SignedHeaders': 'host;content-type;content-length',
  })

  const canonicalQuerystring = qs.toString()
  const canonicalHeaders = `content-length:${contentLength}\ncontent-type:${contentType}\nhost:${host}\n`
  const signedHeaders = 'host;content-type;content-length'
  const payloadHash = 'UNSIGNED-PAYLOAD'

  const canonicalRequest = [
    'PUT',
    canonicalUri,
    canonicalQuerystring,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n')

  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`
  const stringToSign = [algorithm, amzDate, credentialScope, await sha256(canonicalRequest)].join(
    '\n'
  )

  const kDate = await hmacSha256(encoder.encode('AWS4' + secretAccessKey), dateStamp)
  const kRegion = await hmacSha256(kDate, region)
  const kService = await hmacSha256(kRegion, service)
  const kSigning = await hmacSha256(kService, 'aws4_request')
  const signature = toHex(await hmacSha256(kSigning, stringToSign))

  const url = `https://${host}${canonicalUri}?${canonicalQuerystring}&X-Amz-Signature=${signature}`
  const headers = {
    'content-length': String(contentLength),
    'content-type': contentType,
  } as const

  return { headers, url }
}
