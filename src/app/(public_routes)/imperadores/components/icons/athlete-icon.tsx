import type { IconProps } from '@radix-ui/react-icons/dist/types'

export const AthleteIcon = ({
  width = 24,
  height = 24,
  className,
}: IconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-3.314 0-6 1.343-6 3v2h12v-2c0-1.657-2.686-3-6-3z"
      />
    </svg>
  )
}
