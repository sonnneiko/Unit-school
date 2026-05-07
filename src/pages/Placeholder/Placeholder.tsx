export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div style={{ padding: '40px 48px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{title}</h1>
      <p style={{ color: 'var(--color-text-secondary)' }}>Скоро</p>
    </div>
  )
}
