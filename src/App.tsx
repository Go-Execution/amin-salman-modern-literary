import { useEffect, useState, type FormEvent } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight, Menu, Minus, Plus, ShoppingBag, X } from 'lucide-react'
import { books, type Book } from './data/books'

type CartLine = { id: string; quantity: number }
type AddBook = (id: string, quantity: number) => void

function Cover({ book, size = '' }: { book: Book; size?: string }) {
  return <div className={`cover cover-${book.coverTone} ${size}`} aria-label={`${book.title} cover placeholder`}>
    {book.cover ? <img src={book.cover} alt={`${book.title} book cover`} loading="lazy" /> : <>
      <div className="cover-rule" />
      <div className="cover-center"><span className="cover-kicker">COVER ARTWORK</span><span className="cover-title">{book.title}</span><span className="cover-author">{book.author}</span></div>
      <span className="cover-placeholder">Temporary cover placeholder</span>
    </>}
  </div>
}

function Price({ book }: { book: Book }) {
  return <span>{book.priceUsd === null ? 'Price to be confirmed' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(book.priceUsd)}</span>
}

function AddControl({ book, onAdd, variant = '' }: { book: Book; onAdd: AddBook; variant?: string }) {
  const [quantity, setQuantity] = useState(1)
  return <div className={`add-control ${variant}`}>
    <div className="qty" aria-label={`Quantity for ${book.title}`}><button aria-label="Decrease quantity" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={14} /></button><span aria-live="polite">{quantity}</span><button aria-label="Increase quantity" onClick={() => setQuantity(Math.min(99, quantity + 1))}><Plus size={14} /></button></div>
    <button className="add-button" onClick={() => onAdd(book.id, quantity)}>Add to bag <ArrowUpRight size={16} /></button>
  </div>
}

function CartDrawer({ open, onClose, lines, onUpdate }: { open: boolean; onClose: () => void; lines: CartLine[]; onUpdate: (id: string, quantity: number) => void }) {
  const [checkout, setCheckout] = useState(false)
  const items = lines.map(line => ({ book: books.find(book => book.id === line.id)!, quantity: line.quantity })).filter(item => item.book)
  const hasUnsetPrice = items.some(item => item.book.priceUsd === null)
  const subtotal = items.reduce((sum, item) => sum + (item.book.priceUsd ?? 0) * item.quantity, 0)
  useEffect(() => { if (!open) setCheckout(false) }, [open])
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open) return null
  return <div className="drawer-layer"><button className="drawer-scrim" aria-label="Close shopping bag" onClick={onClose} /><aside className="drawer" role="dialog" aria-modal="true" aria-label={checkout ? 'Demo checkout' : 'Shopping bag'}>
    <div className="drawer-head"><div><span className="eyebrow">DR. AMIN SALMAN</span><h2>{checkout ? 'Checkout preview' : 'Your bag'}</h2></div><button className="icon-button" aria-label="Close" onClick={onClose}><X size={22} /></button></div>
    {checkout ? <div className="drawer-body checkout-body"><button className="text-link" onClick={() => setCheckout(false)}><ArrowLeft size={16} /> Back to bag</button><p className="preview-note">Demo interface. No payment provider is connected and no order can be placed.</p><h3>Contact & shipping</h3><form className="checkout-form" onSubmit={event => event.preventDefault()}><label>Email<input type="email" autoComplete="email" placeholder="you@example.com" /></label><div className="form-row"><label>First name<input autoComplete="given-name" /></label><label>Last name<input autoComplete="family-name" /></label></div><label>Address<input autoComplete="street-address" /></label><div className="form-row"><label>City<input autoComplete="address-level2" /></label><label>State / region<input autoComplete="address-level1" /></label></div><div className="form-row"><label>Postal code<input autoComplete="postal-code" /></label><label>Country<input autoComplete="country-name" /></label></div></form><h3>Order summary</h3>{items.map(({ book, quantity }) => <div className="summary-line" key={book.id}><span>{book.title} × {quantity}</span><Price book={book} /></div>)}<div className="summary-total"><strong>Subtotal</strong><strong>{hasUnsetPrice ? 'Pending prices' : `$${subtotal.toFixed(2)}`}</strong></div><p className="checkout-help">Shipping and tax are calculated after a provider and shipping rules are configured.</p><button className="disabled-checkout" disabled>Payment setup required</button></div> : <div className="drawer-body">{items.length ? items.map(({ book, quantity }) => <div className="cart-item" key={book.id}><Cover book={book} size="cover-mini" /><div className="cart-item-info"><h3>{book.title}</h3><Price book={book} /><div className="cart-qty"><button aria-label={`Remove one ${book.title}`} onClick={() => onUpdate(book.id, quantity - 1)}><Minus size={13} /></button><span>{quantity}</span><button aria-label={`Add one ${book.title}`} onClick={() => onUpdate(book.id, quantity + 1)}><Plus size={13} /></button></div></div></div>) : <div className="empty-bag"><ShoppingBag size={36} strokeWidth={1} /><p>Your bag is empty.</p><button onClick={onClose}>Continue exploring <ArrowRight size={16} /></button></div>}</div>}
    {!checkout && items.length > 0 && <div className="drawer-foot"><div className="summary-total"><span>Subtotal</span><strong>{hasUnsetPrice ? 'Pending prices' : `$${subtotal.toFixed(2)}`}</strong></div><p>Prices and checkout are pending client setup.</p><button className="checkout-button" onClick={() => setCheckout(true)}>View checkout interface <ArrowRight size={16} /></button></div>}
  </aside></div>
}

function VideoBlock({ light = false }: { light?: boolean }) {
  return <div className={`video-block ${light ? 'video-light' : ''}`} role="img" aria-label="Placeholder for author video"><div className="video-play">▶</div><div><span className="eyebrow">COMING SOON</span><h3>Stories, in the author's own words.</h3><p>Video content will appear here when supplied.</p></div><span className="video-corner">01 / FILM</span></div>
}

function Newsletter({ mode }: { mode: 'heritage' | 'modern' }) {
  const [submitted, setSubmitted] = useState(false)
  return <form className={`newsletter-form ${mode}`} onSubmit={(event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubmitted(true) }}><label htmlFor={`newsletter-${mode}`} className="sr-only">Email address</label><input id={`newsletter-${mode}`} type="email" required placeholder="Your email address" autoComplete="email" /><button type="submit" aria-label="Preview newsletter signup"><ArrowRight size={20} /></button><small>{submitted ? 'Preview only — newsletter service is not yet connected.' : 'Preview form. Newsletter service to be connected.'}</small></form>
}

function ContactForm({ mode }: { mode: 'heritage' | 'modern' }) {
  const [submitted, setSubmitted] = useState(false)
  return <form className={`contact-form ${mode}`} onSubmit={(event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubmitted(true) }}><div className="form-row"><label>Name<input required name="name" autoComplete="name" placeholder="Your name" /></label><label>Email<input required type="email" name="email" autoComplete="email" placeholder="Your email" /></label></div><label>Message<textarea required name="message" rows={4} placeholder="Tell us what you're writing about" /></label><button type="submit">Preview enquiry <ArrowUpRight size={17} /></button><small aria-live="polite">{submitted ? 'Preview only — message delivery is not yet connected.' : 'Preview form. Contact delivery to be connected.'}</small></form>
}

function Modern({ onAdd, count, onCart }: { onAdd: AddBook; count: number; onCart: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const newest = books[2]
  return <div className="modern page" id="home"><header className="modern-header"><a href="#home" className="modern-brand">Amin Salman<span>WRITER & AUTHOR</span></a><nav className={menuOpen ? 'open' : ''} aria-label="Main navigation">{[['Home', 'home'], ['About', 'about'], ['Books', 'books'], ['Video', 'video'], ['Contact', 'contact']].map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>)}</nav><div className="header-actions"><button className="modern-bag" onClick={onCart}>Bag ({count}) <ShoppingBag size={16} /></button><button className="mobile-menu" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Menu size={23} /></button></div></header>
    <main><section className="modern-hero"><div className="modern-hero-left"><p className="modern-eyebrow">AN AUTHOR'S COLLECTION <span>—</span> 2026</p><h1>Words for a<br />more considered<br /><em>conversation.</em></h1><p>Discover the publications of Dr. Amin Salman, from Muslim life in America to questions of community and belonging.</p><a href="#books" className="dark-button">Browse the collection <ArrowUpRight size={18} /></a><div className="hero-footnote"><span>01 / 03</span><span>THREE BOOKS, ONE AUTHOR</span></div></div><div className="modern-hero-right"><span className="vertical-label">THE FEATURED PUBLICATION</span><Cover book={newest} size="modern-hero-cover" /><div className="modern-hero-caption"><span>NEW TITLE</span><strong>{newest.title}</strong><a href="#featured" aria-label="Explore featured book"><ArrowUpRight size={21} /></a></div></div></section>
    <section className="modern-intro" id="about"><span className="modern-section-number">01 — INTRODUCTION</span><p>“A place for books that ask us to pause, read closely, and see community from another angle.”</p><div><span>DR. AMIN SALMAN</span><a href="#author-story">Meet the author <ArrowUpRight size={16} /></a></div></section>
    <section className="modern-feature" id="featured"><div className="modern-feature-copy"><span className="modern-section-number">02 — IN FOCUS</span><h2>A closer look at<br /><em>the latest work.</em></h2><span className="feature-line" /><h3>{newest.title}</h3><p>{newest.subtitle}</p><a href="#books" className="plain-arrow">See the publication <ArrowUpRight size={17} /></a></div><div className="modern-feature-art"><Cover book={newest} size="feature-cover" /><span>THE NEW PUBLICATION</span></div></section>
    <section className="modern-collection" id="books"><div className="modern-collection-head"><div><span className="modern-section-number">03 — THE BOOKS</span><h2>The collection<span className="period">.</span></h2></div><p>Three works by Dr. Amin Salman.<br />Explore each publication.</p></div><div className="modern-books">{books.map((book, index) => <article key={book.id} className={`modern-book modern-book-${index + 1}`}><div className="modern-book-art"><Cover book={book} /></div><div className="modern-book-details"><span className="modern-book-index">0{index + 1} / {book.language.toUpperCase()}</span><h3 dir={book.language === 'Arabic' ? 'rtl' : undefined}>{book.title}</h3>{book.subtitle && <p>{book.subtitle}</p>}<div className="modern-book-bottom"><Price book={book} /><AddControl book={book} onAdd={onAdd} variant="modern-add" /></div></div></article>)}</div></section>
    <section className="modern-bio" id="author-story"><div className="modern-portrait"><span>AUTHOR PORTRAIT<br />TO BE SUPPLIED</span></div><div className="modern-bio-copy"><span className="modern-section-number">04 — THE AUTHOR</span><h2>Behind the<br />written word.</h2><p>Dr. Amin Salman is the author of the three publications in this collection. His work explores experiences and questions connected to Muslim life and community.</p><p className="small-muted">Approved biography and photography will complete this section.</p><a href="#contact" className="plain-arrow">Contact the author <ArrowUpRight size={17} /></a></div></section>
    <section className="modern-video" id="video"><div className="modern-video-heading"><span className="modern-section-number">05 — VIDEO</span><h2>On the record.</h2><p>Conversations and reflections from Dr. Amin Salman will live here.</p></div><VideoBlock light /></section>
    <section className="modern-news"><div><span className="modern-section-number">06 — LETTERS</span><h2>Stay with the story.</h2><p>News about books, writing and future video releases.</p></div><Newsletter mode="modern" /></section>
    <section className="modern-contact" id="contact"><div><span className="modern-section-number">07 — CONTACT</span><h2>Get in touch<span className="period">.</span></h2><p>For book and author enquiries, use the form to reach out.</p></div><ContactForm mode="modern" /></section></main>
    <footer className="modern-footer"><div className="modern-footer-top"><div><h2>Amin Salman.</h2><p>Writer & author</p></div><a href="#home">Back to top ↑</a></div><div className="modern-footer-links"><div><span>EXPLORE</span><a href="#about">About</a><a href="#books">Books</a><a href="#video">Video</a><a href="#contact">Contact</a></div><div><span>THE COLLECTION</span>{books.map(book => <a href="#books" key={book.id}>{book.title}</a>)}</div><div><span>INFORMATION</span><a href="#contact">Contact details pending</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></div></div><div className="modern-footer-bottom"><span>© {new Date().getFullYear()} Dr. Amin Salman. Concept preview.</span><a href="#home">Back to top <ArrowUpRight size={14} /></a></div></footer>
  </div>
}

function Policy({ title }: { title: string }) {
  return <main className="policy-page"><Link to="/" className="text-link"><ArrowLeft size={17} /> Back to home</Link><span className="eyebrow">CLIENT REVIEW DRAFT</span><h1>{title}</h1><p>The final {title.toLowerCase()} will be supplied and approved before this website accepts orders or personal information.</p><Link to="/">Return to the website <ArrowRight size={17} /></Link></main>
}

export default function App() {
  const [cart, setCart] = useState<CartLine[]>(() => { try { return JSON.parse(localStorage.getItem('amin-cart') ?? '[]') } catch { return [] } })
  const [cartOpen, setCartOpen] = useState(false)
  const location = useLocation()
  useEffect(() => { localStorage.setItem('amin-cart', JSON.stringify(cart)) }, [cart])
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [location.pathname])
  const add: AddBook = (id, quantity) => { setCart(current => { const found = current.find(item => item.id === id); return found ? current.map(item => item.id === id ? { ...item, quantity: Math.min(99, item.quantity + quantity) } : item) : [...current, { id, quantity }] }); setCartOpen(true) }
  const update = (id: string, quantity: number) => setCart(current => quantity <= 0 ? current.filter(item => item.id !== id) : current.map(item => item.id === id ? { ...item, quantity: Math.min(99, quantity) } : item))
  const count = cart.reduce((sum, item) => sum + item.quantity, 0)
  return <><Routes><Route path="/" element={<Modern onAdd={add} count={count} onCart={() => setCartOpen(true)} />} /><Route path="/privacy" element={<Policy title="Privacy policy" />} /><Route path="/terms" element={<Policy title="Terms of service" />} /><Route path="*" element={<Modern onAdd={add} count={count} onCart={() => setCartOpen(true)} />} /></Routes><CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} lines={cart} onUpdate={update} /></>
}
