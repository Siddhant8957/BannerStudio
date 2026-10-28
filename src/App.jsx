
import { useEffect, useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'https://bannerstudio.onrender.com'

const templates = [
  { name: 'Diwali Royal', color: '#761b25', accent: '#ffd778', emoji: '🪔', layout: 'royal', label: 'A FESTIVAL OF LIGHTS', subtitle: 'LIGHT UP YOUR CELEBRATION', font: 'Georgia, serif' },
  { name: 'Mega Sale', color: '#17265c', accent: '#ffdc38', emoji: '🏷️', layout: 'sale', label: 'BIGGEST DEALS OF THE SEASON', subtitle: 'HURRY! OFFERS YOU CANNOT MISS', font: 'Impact, sans-serif' },
  { name: 'Fresh Grocery', color: '#155b43', accent: '#e6ff9c', emoji: '🥬', layout: 'fresh', label: 'FRESHNESS EVERY DAY', subtitle: 'QUALITY YOU CAN TRUST', font: 'Trebuchet MS, sans-serif' },
  { name: 'Fashion Boutique', color: '#642e50', accent: '#ffd6e9', emoji: '👗', layout: 'fashion', label: 'THE NEW COLLECTION', subtitle: 'STYLE THAT SPEAKS FOR YOU', font: 'Georgia, serif' },
  { name: 'Sweets & Bakery', color: '#853c1e', accent: '#ffe2a1', emoji: '🍰', layout: 'bakery', label: 'MADE WITH LOVE', subtitle: 'SWEET MOMENTS, SWEETER SAVINGS', font: 'Georgia, serif' },
  { name: 'Mobile & Tech', color: '#102e49', accent: '#63f3e4', emoji: '📱', layout: 'tech', label: 'UPGRADE YOUR WORLD', subtitle: 'SMART DEALS. SMART CHOICES.', font: 'Arial, sans-serif' },
  { name: 'Eid Celebration', color: '#064d40', accent: '#f2d58b', emoji: '🌙', layout: 'eid', label: 'EID MUBARAK', subtitle: 'WISHING YOU JOY AND PROSPERITY', font: 'Georgia, serif' },
  { name: 'Holi Colours', color: '#76245e', accent: '#ffdf55', emoji: '🎨', layout: 'holi', label: 'CELEBRATE EVERY COLOUR', subtitle: 'COLOUR YOUR DAY WITH SAVINGS', font: 'Impact, sans-serif' },
  { name: 'New Arrival', color: '#24252d', accent: '#f3b66d', emoji: '✨', layout: 'arrival', label: 'JUST ARRIVED', subtitle: 'DISCOVER SOMETHING NEW', font: 'Arial, sans-serif' },
  { name: 'Buy 1 Get 1', color: '#80322c', accent: '#fff0c4', emoji: '🎁', layout: 'bogo', label: 'MORE VALUE FOR YOU', subtitle: 'DOUBLE THE JOY, DOUBLE THE SAVINGS', font: 'Impact, sans-serif' },
  { name: 'Clearance Sale', color: '#34323a', accent: '#ffb3a7', emoji: '🔥', layout: 'clearance', label: 'FINAL MARKDOWN', subtitle: 'LAST CHANCE TO GRAB YOUR FAVOURITES', font: 'Arial Black, Arial, sans-serif' },
  { name: 'Grand Opening', color: '#233c70', accent: '#ffe0a1', emoji: '🎉', layout: 'opening', label: 'WE ARE OPEN!', subtitle: 'COME CELEBRATE WITH US', font: 'Georgia, serif' },
]

function App() {
  const [shopName, setShopName] = useState('YOUR SHOP NAME')
  const [offer, setOffer] = useState('FLAT 20% OFF')
  const [occasion, setOccasion] = useState('Grand Festive Sale')
  const [phone, setPhone] = useState('')
  const [selected, setSelected] = useState(0)

  const [token, setToken] = useState(
    () => localStorage.getItem('bannerstudio_token') || ''
  )
  const [user, setUser] = useState(null)
  const [authMode, setAuthMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [history, setHistory] = useState([])
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)

  const template = templates[selected]
  const isSale = ['sale', 'holi', 'bogo', 'clearance'].includes(template.layout)
  const isElegant = ['royal', 'fashion', 'bakery', 'eid'].includes(template.layout)

  async function apiRequest(path, options = {}, authToken = token) {
    const headers = { ...(options.headers || {}) }

    if (options.body) headers['Content-Type'] = 'application/json'
    if (authToken) headers.Authorization = `Bearer ${authToken}`

    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      if (response.status === 401 && authToken) {
        localStorage.removeItem('bannerstudio_token')
        setToken('')
        setUser(null)
        setHistory([])
      }
      throw new Error(data.message || data.error || `Request failed (${response.status})`)
    }

    return data
  }

  async function loadHistory(authToken = token) {
    if (!authToken) return

    const data = await apiRequest('/api/banners', {}, authToken)
    setHistory(Array.isArray(data.banners) ? data.banners : [])
  }

  useEffect(() => {
    if (!token) return

    let cancelled = false

    async function restoreSession() {
      try {
        const [profile, data] = await Promise.all([
          apiRequest('/api/auth/me', {}, token),
          apiRequest('/api/banners', {}, token),
        ])

        if (cancelled) return

        setUser(profile.user || null)
        setHistory(Array.isArray(data.banners) ? data.banners : [])
      } catch (error) {
        if (!cancelled) setMessage(error.message)
      }
    }

    restoreSession()

    return () => {
      cancelled = true
    }
  }, [])

  async function handleAuth(e) {
    e.preventDefault()
    setBusy(true)
    setMessage('')

    try {
      const registering = authMode === 'register'

      const data = await apiRequest(
        registering ? '/api/auth/register' : '/api/auth/login',
        {
          method: 'POST',
          body: JSON.stringify(
            registering ? { name, email, password } : { email, password }
          ),
        },
        ''
      )

      if (!data.token) throw new Error('Backend ne login token nahi diya.')

      localStorage.setItem('bannerstudio_token', data.token)
      setToken(data.token)
      setUser(data.user || null)
      setHistory([])
      setPassword('')
      setMessage(data.message || 'Login successful.')

      await loadHistory(data.token)
      setAccountOpen(true)
    } catch (error) {
      setMessage(error.message)
    } finally {
      setBusy(false)
    }
  }

  async function saveBanner() {
    if (!token) {
      setAccountOpen(true)
      setMessage('Banner save karne ke liye pehle login ya signup karo.')
      return
    }

    setBusy(true)
    setMessage('')

    try {
      await apiRequest('/api/banners', {
        method: 'POST',
        body: JSON.stringify({
          shop_name: shopName,
          occasion,
          offer_text: offer,
          phone,
          template_key: template.layout,
        }),
      })

      await loadHistory()
      setMessage('Banner database mein save ho gaya!')
      setAccountOpen(true)
    } catch (error) {
      setMessage(error.message)
    } finally {
      setBusy(false)
    }
  }

  function loadBanner(banner) {
    setShopName(banner.shop_name || '')
    setOccasion(banner.occasion || '')
    setOffer(banner.offer_text || '')
    setPhone(banner.phone || '')

    const index = templates.findIndex(
      (item) => item.layout === banner.template_key
    )

    if (index >= 0) setSelected(index)

    setMessage('Saved banner editor mein load ho gaya.')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function deleteBanner(id) {
    if (!window.confirm('Kya tum ye saved banner delete karna chahte ho?')) return

    try {
      await apiRequest(`/api/banners/${id}`, { method: 'DELETE' })
      setHistory((previous) => previous.filter((item) => String(item.id) !== String(id)))
      setMessage('Banner delete ho gaya.')
    } catch (error) {
      setMessage(error.message)
    }
  }

  function logout() {
    localStorage.removeItem('bannerstudio_token')
    setToken('')
    setUser(null)
    setHistory([])
    setMessage('Logout successful.')
    setAccountOpen(false)
  }

  function downloadPoster() {
    const poster = document.getElementById('poster')
    if (!poster) return

    import('html2canvas')
      .then(({ default: html2canvas }) =>
        html2canvas(poster, {
          scale: 2,
          useCORS: true,
          backgroundColor: template.color,
        })
      )
      .then((canvas) => {
        const link = document.createElement('a')
        const fileName = (shopName || 'my-shop')
          .trim()
          .replace(/[^a-z0-9]+/gi, '-')

        link.download = `${fileName}-banner.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
      })
      .catch(() => alert('Download nahi hua. Dobara try karein.'))
  }

  function printPoster() {
    const poster = document.getElementById('poster')
    if (!poster) return

    const printWindow = window.open('', '_blank')

    if (!printWindow) {
      alert('Print window blocked. Browser mein pop-ups allow karein.')
      return
    }

    const styleTags = Array.from(document.querySelectorAll('style'))
      .map((style) => style.outerHTML)
      .join('\n')

    const stylesheetLinks = Array.from(
      document.querySelectorAll('link[rel="stylesheet"]')
    )
      .map((link) => `<link rel="stylesheet" href="${link.href}">`)
      .join('\n')

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>BannerStudio - A4 Print</title>
          ${stylesheetLinks}
          ${styleTags}
          <style>
            @page { size: A4 portrait; margin: 10mm; }
            html, body {
              margin: 0; padding: 0; width: 100%; background: #ffffff;
            }
            body {
              display: flex; justify-content: center; align-items: center;
              min-height: 277mm;
            }
            #poster {
              width: 190mm !important; height: 277mm !important;
              max-width: 190mm !important; max-height: 277mm !important;
              margin: 0 auto !important; overflow: hidden !important;
              box-sizing: border-box !important;
              print-color-adjust: exact !important;
              -webkit-print-color-adjust: exact !important;
              break-inside: avoid !important;
            }
            #poster .poster-border {
              width: 100% !important; height: 100% !important;
              box-sizing: border-box !important;
            }
            #poster * {
              print-color-adjust: exact !important;
              -webkit-print-color-adjust: exact !important;
            }
            @media print {
              html, body { width: 190mm; height: 277mm; min-height: 0; }
              #poster { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>${poster.outerHTML}</body>
      </html>
    `)

    printWindow.document.close()
    printWindow.onload = () => {
      printWindow.focus()
      printWindow.print()
    }
  }

  return (
    <main className="app">
      <header className="topbar">
        <div className="brand-mark">✦</div>
        <div>
          <h1>Banner<span>Studio</span></h1>
          <p>DESIGN YOUR SHOP. GROW YOUR BUSINESS.</p>
        </div>
        <button
          className="top-label"
          type="button"
          onClick={() => setAccountOpen(!accountOpen)}
          style={{ cursor: 'pointer', background: 'transparent', border: 0 }}
        >
          {token ? `ACCOUNT${user?.name ? `: ${user.name}` : ''}` : 'LOGIN / SIGNUP'}
        </button>
      </header>

      {accountOpen && (
        <section
          style={{
            maxWidth: '1200px',
            margin: '20px auto',
            padding: '20px',
            border: '1px solid #494052',
            borderRadius: '12px',
            background: '#211e2a',
            color: '#fff',
          }}
        >
          {token ? (
            <>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ margin: '0 0 5px' }}>My Account</h3>
                  <p style={{ margin: 0, opacity: 0.8 }}>
                    {user?.name || user?.email || 'Logged in'}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button type="button" onClick={() => loadHistory().catch((e) => setMessage(e.message))}>
                    Refresh history
                  </button>
                  <button type="button" onClick={logout}>Logout</button>
                </div>
              </div>

              <h3 style={{ marginTop: '24px' }}>My Saved Banners ({history.length})</h3>

              {history.length === 0 ? (
                <p>Abhi koi saved banner nahi hai. Apna banner banakar “Save banner” dabao.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                  {history.map((banner) => (
                    <div
                      key={banner.id}
                      style={{
                        padding: '14px',
                        border: '1px solid #494052',
                        borderRadius: '10px',
                        overflowWrap: 'anywhere',
                      }}
                    >
                      <strong>{banner.shop_name}</strong>
                      <p>{banner.occasion || 'No campaign name'}</p>
                      <p>{banner.offer_text || 'No offer entered'}</p>
                      <p style={{ fontSize: '12px', opacity: 0.7 }}>
                        Template: {templates.find((item) => item.layout === banner.template_key)?.name || banner.template_key}
                      </p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button type="button" onClick={() => loadBanner(banner)}>Load</button>
                        <button type="button" onClick={() => deleteBanner(banner.id)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <h3>{authMode === 'login' ? 'Welcome back' : 'Create your account'}</h3>
              <p>Login karke apne banners save aur manage karo.</p>

              <form onSubmit={handleAuth} style={{ display: 'grid', gap: '10px', maxWidth: '420px' }}>
                {authMode === 'register' && (
                  <>
                    <label htmlFor="account-name">Name</label>
                    <input
                      id="account-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      autoComplete="name"
                      required
                    />
                  </>
                )}

                <label htmlFor="account-email">Email</label>
                <input
                  id="account-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />

                <label htmlFor="account-password">Password</label>
                <input
                  id="account-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  autoComplete={authMode === 'register' ? 'new-password' : 'current-password'}
                  minLength={authMode === 'register' ? 8 : 1}
                  required
                />

                <button className="download-button" type="submit" disabled={busy}>
                  {busy ? 'Please wait...' : authMode === 'login' ? 'Login' : 'Create account'}
                </button>
              </form>

              <button
                type="button"
                style={{ marginTop: '12px' }}
                onClick={() => {
                  setAuthMode(authMode === 'login' ? 'register' : 'login')
                  setMessage('')
                }}
              >
                {authMode === 'login' ? 'New user? Create account' : 'Already registered? Login'}
              </button>
            </>
          )}

          {message && <p role="status" style={{ marginTop: '12px', overflowWrap: 'anywhere' }}>{message}</p>}
        </section>
      )}

      <section className="intro">
        <span className="eyebrow">YOUR BUSINESS, BEAUTIFULLY PROMOTED</span>
        <h2>Make every offer <span>unmissable.</span></h2>
        <p>Create eye-catching festival and sale banners for your shop in minutes.</p>
      </section>

      <section className="workspace">
        <div className="editor">
          <div className="section-heading">
            <span className="step">01</span>
            <div>
              <h3>Personalize your banner</h3>
              <p>Your details, your design.</p>
            </div>
          </div>

          <label>Shop name</label>
          <input value={shopName} onChange={(e) => setShopName(e.target.value)} placeholder="e.g. Sharma Garments" />

          <label>Festival or campaign</label>
          <input value={occasion} onChange={(e) => setOccasion(e.target.value)} placeholder="e.g. Diwali Sale / Clearance Sale" />

          <label>Your offer</label>
          <input value={offer} onChange={(e) => setOffer(e.target.value)} placeholder="e.g. Buy 1 Get 1 Free" />

          <label>Contact number (optional)</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Your shop phone number" />

          <div className="section-heading template-heading">
            <span className="step">02</span>
            <div>
              <h3>Choose your design</h3>
              <p>12 different layouts and styles.</p>
            </div>
          </div>

          <div className="template-list">
            {templates.map((item, index) => (
              <button
                key={item.name}
                className={`template-option ${selected === index ? 'active' : ''}`}
                onClick={() => setSelected(index)}
                type="button"
              >
                <span className="template-swatch" style={{ background: item.color, color: item.accent }}>
                  {item.emoji}
                </span>
                <span>{item.name}</span>
                <span className="radio-dot">{selected === index ? '✓' : ''}</span>
              </button>
            ))}
          </div>

          <button className="download-button" onClick={saveBanner} type="button" disabled={busy}>
            {busy ? 'Please wait...' : 'Save banner to account'} <span>▣</span>
          </button>

          <button
            className="download-button"
            onClick={() => {
              setAccountOpen(true)
              if (!token) setMessage('Pehle login ya signup karo.')
              else setMessage('')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            type="button"
          >
            My saved banners <span>▤</span>
          </button>

          <button className="download-button" onClick={downloadPoster} type="button">
            Download banner <span>↓</span>
          </button>

          <button className="download-button" onClick={printPoster} type="button">
            Print on A4 <span>⎙</span>
          </button>

          {message && !accountOpen && (
            <p role="status" style={{ overflowWrap: 'anywhere' }}>{message}</p>
          )}

          <p className="hint">Save banners to your account, download PNGs, or print on A4 paper.</p>
        </div>

        <div className="preview-area">
          <div className="preview-heading">
            <div>
              <span className="eyebrow">LIVE PREVIEW</span>
              <h3>Your design, in real time</h3>
            </div>
            <span className="live-dot">● LIVE</span>
          </div>

          <div
            id="poster"
            className={`poster poster-${template.layout}`}
            style={{
              background: `radial-gradient(ellipse at top, ${template.color} 0%, #15131e 100%)`,
              fontFamily: template.font,
              color: template.accent,
              padding: '12px',
              boxSizing: 'border-box',
            }}
          >
            <div
              className={`poster-border design-${template.layout}`}
              style={{
                width: '100%',
                height: '100%',
                boxSizing: 'border-box',
                border: `2px ${isElegant ? 'double' : 'solid'} ${template.accent}`,
                borderRadius: template.layout === 'tech' ? '4px' : template.layout === 'fashion' ? '42px 0 42px 0' : '8px',
                padding: '6% 5%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                gap: '8px',
              }}
            >
              <span className="poster-spark spark-one" style={{ color: template.accent, fontSize: 'clamp(18px, 4vw, 34px)' }}>
                {template.emoji}
              </span>

              <span className="poster-spark spark-two" style={{ color: template.accent, fontSize: 'clamp(18px, 4vw, 30px)' }}>
                {template.layout === 'tech' ? '⚡' : template.layout === 'fresh' ? '🌿' : '✦'}
              </span>

              <div className="poster-top" style={{
                color: template.accent,
                letterSpacing: template.layout === 'tech' ? '3px' : '2px',
                fontSize: 'clamp(9px, 1.5vw, 13px)',
                fontWeight: 800,
              }}>
                {template.emoji} &nbsp; {template.label} &nbsp; {template.emoji}
              </div>

              <div className="poster-divider" style={{
                background: template.accent,
                width: template.layout === 'tech' ? '35%' : '55%',
                height: template.layout === 'sale' ? '5px' : '2px',
                flexShrink: 0,
              }} />

              <p className="poster-occasion" style={{
                color: template.accent,
                fontSize: 'clamp(12px, 2.5vw, 21px)',
                fontWeight: 800,
                letterSpacing: '1px',
                margin: '4px 0',
                textTransform: 'uppercase',
              }}>
                {occasion || 'YOUR SPECIAL OFFER'}
              </p>

              <h2 className="poster-shop" style={{
                color: '#ffffff',
                fontFamily: template.font,
                fontSize: 'clamp(20px, 4.4vw, 38px)',
                fontWeight: 900,
                lineHeight: 1.15,
                overflowWrap: 'anywhere',
                margin: '4px 0',
                textTransform: 'uppercase',
                textShadow: isSale ? '3px 3px 0 rgba(0,0,0,.3)' : 'none',
              }}>
                {shopName || 'YOUR SHOP NAME'}
              </h2>

              <div className="poster-offer" style={{
                color: template.color,
                background: template.accent,
                borderRadius: template.layout === 'tech' ? '5px' : ['sale', 'bogo'].includes(template.layout) ? '2px' : '14px',
                padding: template.layout === 'sale' ? '12px 10px' : '10px 16px',
                width: 'fit-content',
                maxWidth: '95%',
                boxSizing: 'border-box',
                fontSize: 'clamp(18px, 4.3vw, 34px)',
                fontWeight: 900,
                lineHeight: 1.2,
                overflowWrap: 'anywhere',
                boxShadow: isSale ? '5px 5px 0 rgba(0,0,0,.22)' : 'none',
                transform: template.layout === 'holi' ? 'rotate(-2deg)' : 'none',
              }}>
                {offer || 'YOUR OFFER'}
              </div>

              <p className="poster-subtitle" style={{
                color: template.accent,
                fontSize: 'clamp(9px, 1.7vw, 13px)',
                fontWeight: 700,
                letterSpacing: '1px',
                lineHeight: 1.5,
                margin: '4px 0',
              }}>
                {template.subtitle}
              </p>

              <div className="poster-bottom" style={{
                width: '100%',
                boxSizing: 'border-box',
                borderTop: `1px solid ${template.accent}`,
                color: template.accent,
                paddingTop: '10px',
                fontSize: 'clamp(9px, 1.5vw, 12px)',
                fontWeight: 800,
                overflowWrap: 'anywhere',
              }}>
                {phone ? `CALL / WHATSAPP: ${phone}` : 'VISIT US TODAY'}
              </div>

              <span className="poster-footer" style={{
                color: template.accent,
                fontSize: 'clamp(8px, 1.3vw, 10px)',
                letterSpacing: '1px',
              }}>
                {template.layout === 'opening'
                  ? 'WE LOOK FORWARD TO SEEING YOU'
                  : template.layout === 'eid'
                    ? 'EID MUBARAK • WITH BEST WISHES'
                    : 'THANK YOU FOR SHOPPING WITH US'}
              </span>
            </div>
          </div>

          <p className="preview-note">
            Choose any template to change its style and layout. Your details update automatically.
          </p>
        </div>
      </section>

      <footer>
        Made for local businesses, with care. <span>✦ BannerStudio</span>
      </footer>
    </main>
  )
}

export default App
