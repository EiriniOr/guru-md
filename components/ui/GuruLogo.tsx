interface Props {
  size?: number
  className?: string
}

export function GuruLogo({ size = 44, className }: Props) {
  return (
    <img
      src="/guru-logo-transparent.png"
      alt="Guru M.D. — virus professor mascot"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  )
}
