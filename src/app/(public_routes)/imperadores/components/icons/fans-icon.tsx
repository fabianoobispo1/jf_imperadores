import type { IconProps } from '@radix-ui/react-icons/dist/types'

export const FansIcon = ({ width = 24, height = 24, className }: IconProps) => {
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
        d="M12 2v1m0 18v1M4.22 4.22l.707.707m14.15 14.15l.707.707M2 12h1m18 0h1M6.343 17.657l-.707.707M18.364 5.636l-.707.707M12 6a6 6 0 0 0-6 6c0 3.314 2.686 6 6 6s6-2.686 6-6-2.686-6-6-6Z"
      />
    </svg>
  )
}
