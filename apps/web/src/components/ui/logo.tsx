import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  linkHref?: string
}

export function Logo({ className = '', size = 'md', linkHref }: LogoProps) {
  const sizes = {
    sm: { image: 24, text: 'text-lg' },
    md: { image: 32, text: 'text-2xl' },
    lg: { image: 40, text: 'text-3xl' }
  }

  const logoContent = (
    <div className={`flex items-center space-x-3 ${className}`}>
      <Image 
        src="/logo.png" 
        alt="myMVP Logo" 
        width={sizes[size].image}
        height={sizes[size].image}
        className={`w-${sizes[size].image/4} h-${sizes[size].image/4}`}
      />
      <span className={`${sizes[size].text} font-bold`}>
        <span className="text-foreground">my</span>
        <span className="text-blue-600">MVP</span>
      </span>
    </div>
  )

  if (linkHref) {
    return (
      <Link href={linkHref} className="flex items-center">
        {logoContent}
      </Link>
    )
  }

  return logoContent
}