import { useState, useEffect } from 'react';
import api from '../api/axios';
import EventCard from '../components/EventCard';
import { Search, Zap } from 'lucide-react';

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

  return (
    <div style={{ minHeight: '100vh', paddingTop: 80 }}>
      {/* Hero */}
      <div style={{ padding: '60px 40px 40px', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(124,109,255,0.1)', border: '1px solid rgba(124,109,255,0.2)',
          borderRadius: 100, padding: '6px 16px', marginBottom: 24,
          fontSize: 12, fontWeight: 700, color: '#7c6dff', letterSpacing: 1,
        }}>
          <Zap size={12} /> POWERED BY EVENTPAY
        </div>

        <h1 style={{
          fontFamily: 'Tajawal, sans-serif', fontSize: 'clamp(36px, 6vw, 64px)',
          fontWeight: 800, lineHeight: 1.1, marginBottom: 16,
        }}>
          اكتشف{' '}
          <span style={{
            background: 'linear-gradient(135deg, #7c6dff, #ff6b6b)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>أحدث الفعاليات</span>
          <br />واحجز مكانك الآن
        </h1>

        <p style={{ color: 'var(--muted)', fontSize: 16, marginBottom: 40, lineHeight: 1.8 }}>
          منصة الحجز الذكية — ادفع بأمان، واستلم تذكرتك فوراً
        </p>

        {/* Search */}
        <div style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
          <Search size={16} color="var(--muted)" style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ابحث عن فعالية أو مكان..."
            style={{
              width: '100%', padding: '14px 44px 14px 16px',
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 14, color: 'var(--text)', fontSize: 14, outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(124,109,255,0.5)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>
      </div>

      {/* Stats */}
      <div style={{
        fontSize: 32, fontWeight: 900,
        fontFamily: 'Tajawal, sans-serif',
        color: '#7c6dff'
      }}>
        {[
          { label: 'فعالية نشطة', value: events.length },
          { label: 'تذكرة محجوزة', value: events.reduce((s, e) => s + e.soldTickets, 0) },
          { label: 'تذكرة متاحة', value: events.reduce((s, e) => s + e.availableTickets, 0) },
        ].map((stat, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 900, fontFamily: 'Syne, sans-serif', color: '#7c6dff' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Events Grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px 80px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 80 }}>
            <div style={{
              width: 40, height: 40, border: '3px solid var(--border)',
              borderTopColor: '#7c6dff', borderRadius: '50%',
              animation: 'spin 0.7s linear infinite', margin: '0 auto 16px',
            }} />
            <p style={{ color: 'var(--muted)' }}>جاري التحميل...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 80, color: 'var(--muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <p>مفيش فعاليات مطابقة للبحث</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 24,
          }}>
            {filtered.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
