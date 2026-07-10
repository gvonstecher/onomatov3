// Presentational renderer for the Hero V2 block. Consumes exactly the field
// shape defined in src/blocks/HeroV2.ts.
export function HeroV2Block({ slides = [] }) {
  return (
    <>
      {slides.map((slide, i) => {
        const Tag = slide.title?.tag || 'h2'
        const bg = slide.backgroundImage?.url
        const overlay = (slide.backgroundOverlayOpacity ?? 50) / 100
        return (
          <section
            key={i}
            style={{
              position: 'relative',
              minHeight: '60vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundImage: bg ? `url(${bg})` : undefined,
              backgroundColor: '#1a2230',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              color: '#fff',
              textAlign: 'center',
              padding: '4rem 1.5rem',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${overlay})` }} />
            <div style={{ position: 'relative', maxWidth: 640 }}>
              <Tag style={{ fontSize: '2.75rem', lineHeight: 1.1, margin: 0 }}>{slide.title?.text}</Tag>
              {slide.description && (
                <p style={{ marginTop: '1rem', fontSize: '1.1rem', whiteSpace: 'pre-line', opacity: 0.9 }}>
                  {slide.description}
                </p>
              )}
              <div style={{ marginTop: '1.75rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                {slide.primaryButton?.url && (
                  <a
                    href={slide.primaryButton.url}
                    target={slide.primaryButton.newTab ? '_blank' : undefined}
                    style={{ background: '#fff', color: '#111', padding: '0.7rem 1.4rem', borderRadius: 4, textDecoration: 'none', fontWeight: 600 }}
                  >
                    {slide.primaryButton.label}
                  </a>
                )}
                {slide.secondaryButton?.url && (
                  <a
                    href={slide.secondaryButton.url}
                    target={slide.secondaryButton.newTab ? '_blank' : undefined}
                    style={{ border: '1px solid #fff', color: '#fff', padding: '0.7rem 1.4rem', borderRadius: 4, textDecoration: 'none', fontWeight: 600 }}
                  >
                    {slide.secondaryButton.label}
                  </a>
                )}
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}
