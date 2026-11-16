export type Book = {
  id: string
  title: string
  subtitle?: string
  author: string
  language: string
  priceUsd: number | null
  cover: string | null
  coverTone: 'navy' | 'color' | 'stone'
}

// Add approved USD prices and the supplied, unaltered front-cover images here.
// A null price keeps checkout in preview mode and prevents accidental orders.
export const books: Book[] = [
  { id: 'american-muslims', title: 'American Muslims', author: 'Dr. Amin Salman', language: 'English', priceUsd: null, cover: null, coverTone: 'navy' },
  { id: 'arabic-publication', title: 'عبر و بيان في العيش وسط المسلمين الأميركان', author: 'دكتور أمين سلمان', language: 'Arabic', priceUsd: null, cover: null, coverTone: 'color' },
  { id: 'suspension-expulsion-detention', title: 'Suspension, Expulsion and Detention', subtitle: 'The Un-Islamic Way of Running Islamic Centers in Nashville', author: 'Dr. Amin Salman', language: 'English', priceUsd: null, cover: null, coverTone: 'stone' },
]
