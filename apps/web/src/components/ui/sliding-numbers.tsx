import { type MotionValue, motion, useSpring, useTransform } from 'motion/react'
import { useEffect } from 'react'

type SlidingNumberProps = {
  motionValue: MotionValue<number>
  number: number
  height: number
}

function SlidingNumber({ motionValue, number, height }: SlidingNumberProps) {
  const y = useTransform(motionValue, (latest) => {
    const currentNumber = latest % 10
    const offset = (10 + number - currentNumber) % 10
    let translateY = offset * height
    if (offset > 5) {
      translateY -= 10 * height
    }
    return translateY
  })

  return (
    <motion.span
      className="absolute inset-0 flex items-center justify-center"
      data-slot="sliding-number"
      style={{ y }}
    >
      {number}
    </motion.span>
  )
}

type SlidingNumbersProps = {
  place: number
  value: number
  height: number
}

export function SlidingNumbers({ place, value, height }: SlidingNumbersProps) {
  let valueRoundedToPlace = Math.floor(value / place)
  let animatedValue = useSpring(valueRoundedToPlace)
  useEffect(() => {
    animatedValue.set(valueRoundedToPlace)
  }, [animatedValue, valueRoundedToPlace])
  return (
    <span className="relative inline-block w-[1ch] overflow-x-visible overflow-y-clip leading-none tabular-nums">
      {Array.from({ length: 10 }, (_, i) => (
        <SlidingNumber height={height} key={i} motionValue={animatedValue} number={i} />
      ))}
    </span>
  )
}
