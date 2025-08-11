import { AspectRatio } from '@mac/web-ui/aspect-ratio'

type ImageUIProps = React.ComponentProps<'img'> & {
  url?: string | null
  ratio?: number
}

export default function ImageUI({ url, ratio = 16 / 9, ...props }: ImageUIProps) {
  return (
    <AspectRatio className="border border-dashed rounded" ratio={ratio}>
      <img
        alt="Preview"
        className="h-full w-full rounded object-cover dark:brightness-[0.7]"
        {...(url ? { src: url } : {})}
        {...props}
      />
    </AspectRatio>
  )
}
