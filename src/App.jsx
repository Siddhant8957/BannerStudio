
import { useEffect, useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'https://bannerstudio.onrender.com'

const templates = [
  { name: 'Diwali Royal', category: 'Diwali', color: '#761b25', accent: '#ffd778', emoji: '🪔', layout: 'royal', label: 'A FESTIVAL OF LIGHTS', subtitle: 'LIGHT UP YOUR CELEBRATION', font: 'Georgia, serif' },
  { name: 'Mega Sale', category: 'General', color: '#17265c', accent: '#ffdc38', emoji: '🏷️', layout: 'sale', label: 'BIGGEST DEALS OF THE SEASON', subtitle: 'HURRY! OFFERS YOU CANNOT MISS', font: 'Impact, sans-serif' },
  { name: 'Fresh Grocery', category: 'General', color: '#155b43', accent: '#e6ff9c', emoji: '🥬', layout: 'fresh', label: 'FRESHNESS EVERY DAY', subtitle: 'QUALITY YOU CAN TRUST', font: 'Trebuchet MS, sans-serif' },
  { name: 'Fashion Boutique', category: 'General', color: '#642e50', accent: '#ffd6e9', emoji: '👗', layout: 'fashion', label: 'THE NEW COLLECTION', subtitle: 'STYLE THAT SPEAKS FOR YOU', font: 'Georgia, serif' },
  { name: 'Sweets & Bakery', category: 'General', color: '#853c1e', accent: '#ffe2a1', emoji: '🍰', layout: 'bakery', label: 'MADE WITH LOVE', subtitle: 'SWEET MOMENTS, SWEETER SAVINGS', font: 'Georgia, serif' },
  { name: 'Mobile & Tech', category: 'General', color: '#102e49', accent: '#63f3e4', emoji: '📱', layout: 'tech', label: 'UPGRADE YOUR WORLD', subtitle: 'SMART DEALS. SMART CHOICES.', font: 'Arial, sans-serif' },
  { name: 'Eid Celebration', category: 'Eid', color: '#064d40', accent: '#f2d58b', emoji: '🌙', layout: 'eid', label: 'EID MUBARAK', subtitle: 'WISHING YOU JOY AND PROSPERITY', font: 'Georgia, serif' },
  { name: 'Holi Colours', category: 'Holi', color: '#76245e', accent: '#ffdf55', emoji: '🎨', layout: 'holi', label: 'CELEBRATE EVERY COLOUR', subtitle: 'COLOUR YOUR DAY WITH SAVINGS', font: 'Impact, sans-serif' },
  { name: 'New Arrival', category: 'General', color: '#24252d', accent: '#f3b66d', emoji: '✨', layout: 'arrival', label: 'JUST ARRIVED', subtitle: 'DISCOVER SOMETHING NEW', font: 'Arial, sans-serif' },
  { name: 'Buy 1 Get 1', category: 'General', color: '#80322c', accent: '#fff0c4', emoji: '🎁', layout: 'bogo', label: 'MORE VALUE FOR YOU', subtitle: 'DOUBLE THE JOY, DOUBLE THE SAVINGS', font: 'Impact, sans-serif' },
  { name: 'Clearance Sale', category: 'General', color: '#34323a', accent: '#ffb3a7', emoji: '🔥', layout: 'clearance', label: 'FINAL MARKDOWN', subtitle: 'LAST CHANCE TO GRAB YOUR FAVOURITES', font: 'Arial Black, Arial, sans-serif' },
  { name: 'Grand Opening', category: 'General', color: '#233c70', accent: '#ffe0a1', emoji: '🎉', layout: 'opening', label: 'WE ARE OPEN!', subtitle: 'COME CELEBRATE WITH US', font: 'Georgia, serif' },

  { name: 'Diwali Golden Night', category: 'Diwali', color: '#4c1b16', accent: '#ffd166', emoji: '🪔', layout: 'diwali-gold', label: 'HAPPY DIWALI', subtitle: 'A GOLDEN CELEBRATION OF LIGHTS', font: 'Georgia, serif' },
  { name: 'Diwali Celebration', category: 'Diwali', color: '#792b16', accent: '#ffe29a', emoji: '✨', layout: 'diwali-celebration', label: 'CELEBRATE THE FESTIVAL', subtitle: 'LIGHTS, HAPPINESS AND GREAT OFFERS', font: 'Georgia, serif' },
  { name: 'Dhanteras Special', category: 'Dhanteras', color: '#67400b', accent: '#ffe08a', emoji: '🪙', layout: 'dhanteras', label: 'DHANTERAS SPECIAL', subtitle: 'PROSPERITY AND HAPPINESS FOR ALL', font: 'Georgia, serif' },
  { name: 'Choti Diwali', category: 'Choti Diwali', color: '#762b21', accent: '#ffc66d', emoji: '🪔', layout: 'choti-diwali', label: 'HAPPY CHOTI DIWALI', subtitle: 'SPREAD LIGHT AND JOY', font: 'Georgia, serif' },
  { name: 'Govardhan Puja', category: 'Govardhan Puja', color: '#28512e', accent: '#f3d28b', emoji: '🌿', layout: 'govardhan', label: 'GOVARDHAN PUJA', subtitle: 'MAY YOUR HOME BE BLESSED WITH HAPPINESS', font: 'Georgia, serif' },
  { name: 'Bhai Dooj', category: 'Bhai Dooj', color: '#67284a', accent: '#ffd3a1', emoji: '💝', layout: 'bhai-dooj', label: 'HAPPY BHAI DOOJ', subtitle: 'CELEBRATING THE BOND OF LOVE', font: 'Georgia, serif' },

  { name: 'Holi Dhamaka', category: 'Holi', color: '#a51e62', accent: '#ffe65c', emoji: '🌈', layout: 'holi-dhamaka', label: 'HOLI DHAMAKA', subtitle: 'ADD COLOURS TO YOUR CELEBRATION', font: 'Impact, sans-serif' },
  { name: 'Raksha Bandhan', category: 'Raksha Bandhan', color: '#81344e', accent: '#ffd6a1', emoji: '🎀', layout: 'raksha-bandhan', label: 'HAPPY RAKSHA BANDHAN', subtitle: 'A BOND OF LOVE FOREVER', font: 'Georgia, serif' },
  { name: 'Janmashtami', category: 'Janmashtami', color: '#183d72', accent: '#ffe08b', emoji: '🦚', layout: 'janmashtami', label: 'HAPPY JANMASHTAMI', subtitle: 'CELEBRATE THE BIRTH OF LORD KRISHNA', font: 'Georgia, serif' },
  { name: 'Ganesh Chaturthi', category: 'Ganesh Chaturthi', color: '#8b391e', accent: '#ffd58b', emoji: '🐘', layout: 'ganesh', label: 'GANPATI BAPPA MORYA', subtitle: 'MAY LORD GANESHA BLESS YOUR HOME', font: 'Georgia, serif' },
  { name: 'Navratri', category: 'Navratri', color: '#711c38', accent: '#ffcf69', emoji: '💃', layout: 'navratri', label: 'HAPPY NAVRATRI', subtitle: 'NINE NIGHTS OF JOY AND CELEBRATION', font: 'Georgia, serif' },
  { name: 'Dussehra', category: 'Dussehra', color: '#8c321d', accent: '#ffe08b', emoji: '🏹', layout: 'dussehra', label: 'HAPPY DUSSEHRA', subtitle: 'CELEBRATING THE VICTORY OF GOOD', font: 'Georgia, serif' },
  { name: 'Christmas', category: 'Christmas', color: '#15533c', accent: '#ffe3a2', emoji: '🎄', layout: 'christmas', label: 'MERRY CHRISTMAS', subtitle: 'SEASON OF JOY AND GIVING', font: 'Georgia, serif' },
  { name: 'New Year', category: 'New Year', color: '#172d55', accent: '#ffe078', emoji: '🎆', layout: 'new-year', label: 'HAPPY NEW YEAR', subtitle: 'NEW YEAR. NEW HOPES. NEW OFFERS.', font: 'Georgia, serif' },
  { name: 'Makar Sankranti', category: 'Makar Sankranti', color: '#24537b', accent: '#ffe18a', emoji: '🪁', layout: 'makar-sankranti', label: 'HAPPY MAKAR SANKRANTI', subtitle: 'LET YOUR HAPPINESS SOAR HIGH', font: 'Georgia, serif' },
  { name: 'Pongal', category: 'Pongal', color: '#7a3c1b', accent: '#ffe1a1', emoji: '🌾', layout: 'pongal', label: 'HAPPY PONGAL', subtitle: 'CELEBRATING HARVEST AND HAPPINESS', font: 'Georgia, serif' },
  { name: 'Onam', category: 'Onam', color: '#315b36', accent: '#ffe0a0', emoji: '🌼', layout: 'onam', label: 'HAPPY ONAM', subtitle: 'WISHING YOU A PROSPEROUS ONAM', font: 'Georgia, serif' },
  { name: 'Karwa Chauth', category: 'Karwa Chauth', color: '#712b43', accent: '#ffd5a1', emoji: '🌕', layout: 'karwa-chauth', label: 'HAPPY KARWA CHAUTH', subtitle: 'CELEBRATING LOVE AND TOGETHERNESS', font: 'Georgia, serif' },
  { name: 'Independence Day', category: 'Independence Day', color: '#174b37', accent: '#ffdc9b', emoji: '🇮🇳', layout: 'independence', label: 'HAPPY INDEPENDENCE DAY', subtitle: 'CELEBRATING THE SPIRIT OF FREEDOM', font: 'Georgia, serif' },
  { name: 'Republic Day', category: 'Republic Day', color: '#173d65', accent: '#ffdc9b', emoji: '🇮🇳', layout: 'republic', label: 'HAPPY REPUBLIC DAY', subtitle: 'PRIDE, UNITY AND PROGRESS', font: 'Georgia, serif' },

  { name: 'Daily Offers', category: 'General', color: '#174c50', accent: '#b9f5d5', emoji: '🛍️', layout: 'daily-offers', label: 'TODAY\'S SPECIAL', subtitle: 'GREAT DEALS EVERY SINGLE DAY', font: 'Arial, sans-serif' },
  { name: 'Grand Opening Special', category: 'General', color: '#4a286d', accent: '#ffdb91', emoji: '🎊', layout: 'grand-opening-special', label: 'GRAND OPENING SPECIAL', subtitle: 'A NEW BEGINNING. A SPECIAL OFFER.', font: 'Georgia, serif' },
  { name: 'New Collection', category: 'General', color: '#563047', accent: '#ffd4a8', emoji: '🛍️', layout: 'new-collection', label: 'INTRODUCING OUR NEW COLLECTION', subtitle: 'FRESH STYLES. FRESH LOOKS.', font: 'Georgia, serif' },
  { name: 'Special Discount', category: 'General', color: '#812b25', accent: '#ffe08a', emoji: '💥', layout: 'special-discount', label: 'SPECIAL DISCOUNT', subtitle: 'EXCLUSIVE SAVINGS JUST FOR YOU', font: 'Impact, sans-serif' },
]

const categories = [
  'All Templates', 'Diwali', 'Dhanteras', 'Choti Diwali',
  'Govardhan Puja', 'Bhai Dooj', 'Holi', 'Raksha Bandhan',
  'Janmashtami', 'Ganesh Chaturthi', 'Navratri', 'Dussehra',
  'Eid', 'Christmas', 'New Year', 'Makar Sankranti',
  'Pongal', 'Onam', 'Karwa Chauth', 'Independence Day',
  'Republic Day', 'General',
]

function App() {
  const [shopName, setShopName] = useState('YOUR SHOP NAME')
  const [offer, setOffer] = useState('FLAT 20% OFF')
  const [occasion, setOccasion] = useState('Grand Festive Sale')
  const [phone, setPhone] = useState('')
  const [selected, setSelected] = useState(0)
  const [category, setCategory] = useState('All Templates')

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

  // Selected saved banner for the View popup
  const [viewBanner, setViewBanner] = useState(null)

  const template = templates[selected]
  const filteredTemplates = category === 'All Templates'
    ? templates
    : templates.filter((item) => item.category === category)

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

    if (index >= 0) {
      setSelected(index)
      setCategory(templates[index].category || 'All Templates')
    }

    setMessage('Saved banner editor mein load ho gaya.')
    setAccountOpen(false)
    setViewBanner(null)
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
    setViewBanner(null)
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

  function changeCategory(value) {
    setCategory(value)

    const firstTemplateIndex = templates.findIndex(
      (item) => value === 'All Templates' || item.category === value
    )

    if (firstTemplateIndex >= 0) {
      setSelected(firstTemplateIndex)
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
                        <button type="button" onClick={() => setViewBanner(banner)}>
                          View
                        </button>
                        <button type="button" onClick={() => loadBanner(banner)}>
                          Load
                        </button>
                        <button type="button" onClick={() => deleteBanner(banner.id)}>
                          Delete
                        </button>
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

      {/* Saved banner View popup */}
      {viewBanner && (() => {
        const viewedTemplate =
          templates.find((item) => item.layout === viewBanner.template_key) || templates[0]

        return (
          <div
            onClick={() => setViewBanner(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(0, 0, 0, 0.88)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20px',
              overflowY: 'auto',
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#211e2a',
                border: '1px solid #494052',
                borderRadius: '14px',
                padding: '20px',
                width: '100%',
                maxWidth: '480px',
                color: '#fff',
                textAlign: 'center',
                margin: 'auto',
              }}
            >
              <h2 style={{ marginTop: 0 }}>Saved Banner Preview</h2>

              <div
                style={{
                  background: `radial-gradient(ellipse at top, ${viewedTemplate.color} 0%, #15131e 100%)`,
                  color: viewedTemplate.accent,
                  padding: '12px',
                  borderRadius: '8px',
                  aspectRatio: '3 / 4',
                  width: '100%',
                  boxSizing: 'border-box',
                  fontFamily: viewedTemplate.font,
                }}
              >
                <div
                  style={{
                    border: `3px double ${viewedTemplate.accent}`,
                    width: '100%',
                    height: '100%',
                    padding: '8%',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    textAlign: 'center',
                    overflowWrap: 'anywhere',
                  }}
                >
                  <div style={{ fontSize: '32px' }}>{viewedTemplate.emoji}</div>
                  <strong>{viewedTemplate.label}</strong>

                  <h2 style={{
                    color: '#fff',
                    fontSize: 'clamp(20px, 5vw, 32px)',
                    overflowWrap: 'anywhere',
                  }}>
                    {viewBanner.shop_name || 'YOUR SHOP NAME'}
                  </h2>

                  <div style={{
                    background: viewedTemplate.accent,
                    color: viewedTemplate.color,
                    padding: '12px',
                    fontSize: 'clamp(18px, 5vw, 30px)',
                    fontWeight: 900,
                    borderRadius: '8px',
                    maxWidth: '100%',
                    overflowWrap: 'anywhere',
                  }}>
                    {viewBanner.offer_text || 'YOUR OFFER'}
                  </div>

                  <strong>{viewBanner.occasion || 'YOUR CAMPAIGN'}</strong>
                  <p>{viewedTemplate.subtitle}</p>

                  <small>
                    {viewBanner.phone
                      ? `CALL / WHATSAPP: ${viewBanner.phone}`
                      : 'VISIT US TODAY'}
                  </small>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '10px',
                flexWrap: 'wrap',
                marginTop: '16px',
              }}>
                <button
                  type="button"
                  onClick={() => loadBanner(viewBanner)}
                >
                  Load in Editor
                </button>

                <button
                  type="button"
                  onClick={() => setViewBanner(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )
      })()}

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
              <p>{templates.length} different templates and styles.</p>
            </div>
          </div>

          <label htmlFor="template-category">Choose template category</label>
          <select
            id="template-category"
            className="category-select"
            value={category}
            onChange={(e) => changeCategory(e.target.value)}
          >
            {categories.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>

          <div className="template-list">
            {filteredTemplates.map((item) => {
              const index = templates.indexOf(item)

              return (
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
              )
            })}
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
                {template.layout === 'opening' || template.layout === 'grand-opening-special'
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
