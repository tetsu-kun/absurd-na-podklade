import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex flex-wrap items-center gap-2 border-b-2 border-brand-black px-4 py-3 font-mono text-xs uppercase md:px-8">
      <Link href="/" className="font-bold text-brand-black transition-colors hover:text-brand-red">
        Главная
      </Link>
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          <span className="text-brand-blue">/</span>
          {item.href ? (
            <Link 
              href={item.href} 
              className="font-bold text-brand-black transition-colors hover:text-brand-red"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-brand-ink-muted">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}