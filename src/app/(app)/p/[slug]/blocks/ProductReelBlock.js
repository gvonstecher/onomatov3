// Presentational renderer for the Product Reel block. Consumes the field shape
// from src/blocks/ProductReel.ts. In manual mode it renders the selected books;
// in automatic mode it just describes the criteria (the real query would run
// server-side).
export function ProductReelBlock({
  heading,
  subheading,
  description,
  viewAllButton,
  selectedBooks = [],
  automaticSelection,
  selectionType,
  productsToShow,
}) {
  const Tag = heading?.tag || 'h2'
  return (
    <section style={{ padding: '3rem 1.5rem', maxWidth: 1100, margin: '0 auto' }}>
      {subheading && (
        <p style={{ textTransform: 'uppercase', letterSpacing: '0.12em', color: '#9a7c2e', margin: 0, fontSize: '0.8rem', fontWeight: 600 }}>
          {subheading}
        </p>
      )}
      {heading?.text && <Tag style={{ fontSize: '2rem', margin: '0.3rem 0' }}>{heading.text}</Tag>}
      {description && <p style={{ color: '#555', whiteSpace: 'pre-line' }}>{description}</p>}

      {automaticSelection ? (
        <p style={{ color: '#999', fontStyle: 'italic', marginTop: '1rem' }}>
          Automatic selection: {selectionType} (top {productsToShow})
        </p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '1rem',
            marginTop: '1.5rem',
          }}
        >
          {selectedBooks.map((book) => (
            <article key={book.id} style={{ border: '1px solid #eee', borderRadius: 6, padding: '0.8rem' }}>
              {book.cover?.url && (
                <img
                  src={book.cover.url}
                  alt={book.cover.alt || book.title || ''}
                  style={{ width: '100%', borderRadius: 4, display: 'block' }}
                />
              )}
              <h3 style={{ fontSize: '0.95rem', margin: '0.5rem 0 0' }}>{book.title}</h3>
            </article>
          ))}
        </div>
      )}

      {viewAllButton?.url && (
        <a href={viewAllButton.url} style={{ display: 'inline-block', marginTop: '1.5rem', fontWeight: 600 }}>
          {viewAllButton.label} →
        </a>
      )}
    </section>
  )
}
