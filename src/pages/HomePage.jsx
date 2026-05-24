import { useState, useEffect } from 'react';
import api from '../api/axios';
import EventCard from '../components/EventCard';
import { Search, Zap, Calendar, Tag, Clock } from 'lucide-react';

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/events')
      .then(r => setEvents(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = events.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.location.toLowerCase().includes(search.toLowerCase())
  );

  // Stats مفيدة للزبون
  const upcomingCount = events.filter(e => new Date(e.date) > new Date()).length;
  const cheapestPrice = events.length ? Math.min(...events.map(e => e.ticketPrice)) : 0;
  const nearestEvent = events
    .filter(e => new Date(e.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  const nearestDate = nearestEvent
    ? new Date(nearestEvent.date).toLocaleDateString('ar-EG', { month: 'long', day: 'numeric' })
    : '—';

  return (
    <div style={{ minHeight: '100vh', paddingTop: 80 }}>

      {/* Hero */}
      <div style={{ padding: '70px 40px 50px', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(124,109,255,0.1)', border: '1px solid rgba(124,109,255,0.2)',
          borderRadius: 100, padding: '6px 18px', marginBottom: 28,
          fontSize: 11, fontWeight: 700, color: '#7c6dff', letterSpacing: 1.5,
        }}>
          <Zap size={11} fill="#7c6dff" /> POWERED BY EVENTPAY
        </div>

        <h1 style={{
          fontFamily: 'Tajawal, sans-serif',
          fontSize: 'clamp(38px, 6vw, 68px)',
          fontWeight: 900, lineHeight: 1.15, marginBottom: 20,
        }}>
          اكتشف{' '}
          <span style={{
            background: 'linear-gradient(135deg, #7c6dff, #ff6b6b)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>أحدث الفعاليات</span>
          <br />واحجز مكانك الآن
        </h1>

        <p style={{
          color: 'var(--muted)', fontSize: 16,
          lineHeight: 1.9, maxWidth: 500, margin: '0 auto 44px',
          fontFamily: 'Tajawal, sans-serif',
        }}>
          منصة الحجز الذكية — ادفع بأمان، واستلم تذكرتك فوراً على واتساب وإيميلك
        </p>

        {/* Search */}
        <div style={{ position: 'relative', maxWidth: 520, margin: '0 auto' }}>
          <Search size={16} color="var(--muted)" style={{
            position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)',
          }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ابحث عن فعالية أو مكان..."
            style={{
              width: '100%', padding: '15px 48px 15px 20px',
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 16, color: 'var(--text)', fontSize: 14, outline: 'none',
              transition: 'all 0.2s', fontFamily: 'Tajawal, sans-serif',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            }}
            onFocus={e => {
              e.target.style.borderColor = 'rgba(124,109,255,0.5)';
              e.target.style.boxShadow = '0 4px 20px rgba(124,109,255,0.1)';
            }}
            onBlur={e => {
              e.target.style.borderColor = 'var(--border)';
              e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
            }}
          />
        </div>
      </div>

      {/* Stats للزبون */}
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 40px 56px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            {
              icon: <Calendar size={18} color="#7c6dff" />,
              label: 'فعالية قادمة',
              value: loading ? '—' : upcomingCount,
              color: '#7c6dff',
              sub: 'لا تفوتها',
            },
            {
              icon: <Clock size={18} color="#ff6b6b" />,
              label: 'أقرب فعالية',
              value: loading ? '—' : nearestDate,
              color: '#ff6b6b',
              sub: nearestEvent?.title?.slice(0, 15) + '...' || '—',
              small: true,
            },
            {
              icon: <Tag size={18} color="#00d9a6" />,
              label: 'أرخص تذكرة',
              value: loading ? '—' : `${cheapestPrice} EGP`,
              color: '#00d9a6',
              sub: 'ابدأ من كده',
              small: true,
            },
          ].map((stat, i) => (
            <div key={i} style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 16, padding: '20px 16px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
              transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${stat.color}40`}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: `${stat.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{stat.icon}</div>

              <div style={{
                fontSize: stat.small ? 18 : 28,
                fontWeight: 900,
                fontFamily: 'Tajawal, sans-serif',
                color: stat.color,
                textAlign: 'center',
                lineHeight: 1.2,
              }}>
                {stat.value}
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: 'var(--text)', fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'Tajawal, sans-serif', marginTop: 2 }}>
                  {stat.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section Title */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
              {search ? `نتائج البحث عن "${search}"` : 'الفعاليات المتاحة'}
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: 13, fontFamily: 'Tajawal, sans-serif' }}>
              {filtered.length} فعالية
            </p>
          </div>

          {search && (
            <button onClick={() => setSearch('')} style={{
              padding: '8px 16px', borderRadius: 8, fontSize: 13,
              background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)',
              color: '#ff6b6b', fontFamily: 'Tajawal, sans-serif', cursor: 'pointer', fontWeight: 600,
            }}>
              مسح البحث ✕
            </button>
          )}
        </div>
      </div>

      {/* Events Grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px 80px' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: 20, padding: 28, height: 320,
              }}>
                {[80, 40, 60, 40, 40].map((w, j) => (
                  <div key={j} style={{
                    height: j === 0 ? 20 : 12, borderRadius: 6, marginBottom: 16,
                    width: `${w}%`,
                    background: 'linear-gradient(90deg, var(--border) 25%, var(--surface) 50%, var(--border) 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s infinite',
                  }} />
                ))}
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--muted)' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
            <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: 16, marginBottom: 8 }}>
              مفيش فعاليات مطابقة للبحث
            </p>
            <p style={{ fontSize: 13, fontFamily: 'Tajawal, sans-serif' }}>جرب تبحث بكلمة تانية</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {filtered.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
